import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Patient from "../models/Patient.js";
import HealthWorker from "../models/HealthWorker.js";
import Doctor from "../models/Doctor.js";

// Helper function to return the correct Mongoose Model class dynamically
const getModelByRole = (role) => {
  switch (role) {
    case "patient":
      return Patient;
    case "healthWorker":
      return HealthWorker;
    case "doctor":
      return Doctor;
    default:
      return null;
  }
};

export const register = async (req, res) => {
  try {
    const { role, password, name } = req.body;

    if (!role || !password || !name) {
      return res
        .status(400)
        .json({ message: "Mandatory structural parameters are missing." });
    }

    const TargetModel = getModelByRole(role);
    if (!TargetModel) {
      return res
        .status(400)
        .json({ message: "The provided deployment role scope is invalid." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    if (role === "patient") {
      const { abhaAddress, abhaNumber, gender, dateOfBirth, qrVerified } =
        req.body;

      if (!abhaAddress || !abhaNumber || !gender || !dateOfBirth) {
        return res
          .status(400)
          .json({
            message: "Missing required patient registration parameters.",
          });
      }

      const baseUsername = name.toLowerCase().replace(/[^a-z0-9]/g, "");

      const generatedUsername = `${baseUsername}${Math.floor(100 + Math.random() * 900)}`;

      const cleanAbhaNumber = abhaNumber.trim();
      const cleanAbhaAddress = abhaAddress.trim();

      const existingPatient = await TargetModel.findOne({
        $or: [{ abhaNumber: cleanAbhaNumber }, { username: generatedUsername }],
      });

      if (existingPatient) {
        return res
          .status(400)
          .json({ message: "ABHA Number or unique username already exists." });
      }

      const newPatient = new TargetModel({
        name: name.trim(),
        username: generatedUsername,
        password: hashedPassword,
        abhaId: cleanAbhaAddress,
        abhaNumber: cleanAbhaNumber,
        gender,
        dateOfBirth,
        qrVerified: qrVerified || false,
        isProfileComplete: false,
      });

      await newPatient.save();
    } else if (role === "healthWorker") {
      const { healthWorkerId, email } = req.body;

      const facility = req.body.facility;

      if (!healthWorkerId || !facility) {
        return res
          .status(400)
          .json({
            message: "Missing required health worker facility parameters.",
          });
      }

      const cleanWorkerId = healthWorkerId.trim();
      const cleanFacility = facility.trim();
      const cleanEmail = email ? email.trim() : "";

      const existingWorker = await TargetModel.findOne({
        $or: [
          { healthWorkerId: cleanWorkerId },
          { username: generatedUsername },
          ...(cleanEmail ? [{ email: cleanEmail }] : []),
        ],
      });

      if (existingWorker) {
        return res
          .status(400)
          .json({
            message:
              "Health Worker ID, unique username, or email already registered.",
          });
      }

      const newWorker = new TargetModel({
        name: name.trim(),
        username: generatedUsername, // Saves cleanly as name + suffix (e.g. mukesh234)
        email: cleanEmail,
        password: hashedPassword,
        healthWorkerId: cleanWorkerId,
        facility: cleanFacility,
      });

      await newWorker.save();
    } else if (role === "doctor") {
      const { registrationNo, specialization, email } = req.body;

      if (!registrationNo || !specialization) {
        return res
          .status(400)
          .json({
            message: "Missing required doctor certification parameters.",
          });
      }

      const cleanRegNo = registrationNo.trim();
      const cleanSpecialization = specialization.trim();
      const cleanEmail = email ? email.trim() : "";

      // Check if doctor license details are already in use
      const existingDoc = await TargetModel.findOne({
        $or: [
          { registrationNo: cleanRegNo },
          { username: generatedUsername },
          ...(cleanEmail ? [{ email: cleanEmail }] : []),
        ],
      });

      if (existingDoc) {
        return res
          .status(400)
          .json({
            message:
              "Medical license registration number, username, or email already registered.",
          });
      }

      const newDoc = new TargetModel({
        name: name.trim(),
        username: generatedUsername, // Saves cleanly as name + suffix (e.g. mukesh234)
        email: cleanEmail,
        password: hashedPassword,
        registrationNo: cleanRegNo,
        specialization: cleanSpecialization,
      });

      await newDoc.save();
    }

    return res
      .status(201)
      .json({ message: "Registration successful! You can now log in." });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    if (!username || !password || !role) {
      return res.status(400).json({ message: "Missing login details." });
    }

    const TargetModel = getModelByRole(role);
    if (!TargetModel) {
      return res.status(400).json({ message: "Invalid workspace context." });
    }

    const user = await TargetModel.findOne({
      $or: [{ username: username }, { abhaNumber: username }],
    });

    if (user && user.isProfileComplete === undefined) {
      user.isProfileComplete = false;
      await user.save(); 
    }

    if (!user) {
      return res
        .status(401)
        .json({ message: "Invalid credentials or role selection." });
    }

    // Verify hashed password matches the db record
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // Generate JWT token containing identity metadata
    const token = jwt.sign(
      { id: user._id, role: role },
      process.env.JWT_SECRET || "fallback_local_secret_key",
      { expiresIn: "1d" },
    );

    // Strip password out before returning
    const userResponse = user.toObject();
    delete userResponse.password;

    return res.status(200).json({
      token,
      user: {
        ...userResponse,
        role,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getMe = async (req, res) => {
  try {
    if (!req.user || !req.user.id || !req.user.role) {
      return res.status(401).json({ message: "Unauthorized profile request." });
    }

    const TargetModel = getModelByRole(req.user.role);
    if (!TargetModel)
      return res.status(400).json({ message: "Invalid role mapping." });

    // Finds the live user by MongoDB ID and strips the password string out
    const profileData = await TargetModel.findById(req.user.id).select(
      "-password",
    );
    if (!profileData) {
      return res.status(404).json({ message: "User account records missing." });
    }

    return res
      .status(200)
      .json({ ...profileData.toObject(), role: req.user.role });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
