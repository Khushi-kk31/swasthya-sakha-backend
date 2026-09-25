import bcrypt from "bcryptjs/dist/bcrypt.js";
import jwt from "jsonwebtoken";
import Patient from "../models/Patient.js";
import HealthWorker from "../models/HealthWorker.js";
import Doctor from "../models/Doctor.js";

// Helper function to return the correct Mongoose Model class dynamically
const getModelByRole = (role) => {
  switch (role) {
    case "patient": return Patient;
    case "healthWorker": return HealthWorker;
    case "doctor": return Doctor;
    default: return null;
  }
};

// =========================================================================
// 1. UNIFIED REGISTER CONTROLLER
// =========================================================================
export const register = async (req, res) => {
  try {
    const { role, password, name, username, email } = req.body;
    
    if (!role || !password || !name) {
      return res.status(400).json({ message: "Mandatory structural parameters are missing." });
    }

    const TargetModel = getModelByRole(role);
    if (!TargetModel) {
      return res.status(400).json({ message: "The provided deployment role scope is invalid." });
    }

    // Securely hash user credentials
    const hashedPassword = await bcrypt.hash(password, 10);

    // Dynamic checks & model creation based on specific user roles
    if (role === "doctor") {
      const { registrationNo, specialization } = req.body;
      const existingDoc = await Doctor.findOne({ $or: [{ email }, { registrationNo }, { username }] });
      if (existingDoc) return res.status(400).json({ message: "License number or Email already registered." });

      const newDoc = new Doctor({ name, email, username, password: hashedPassword, registrationNo, specialization });
      await newDoc.save();
      
    } else if (role === "healthWorker") {
      const { healthWorkerId, facility } = req.body;
      const existingWorker = await HealthWorker.findOne({ $or: [{ email }, { healthWorkerId }, { username }] });
      if (existingWorker) return res.status(400).json({ message: "Worker ID or Email already registered." });

      const newWorker = new HealthWorker({ name, email, username, password: hashedPassword, healthWorkerId, facility });
      await newWorker.save();

    } else if (role === "patient") {
      const { abhaId, abhaNumber, gender, dateOfBirth, qrVerified } = req.body;
      const existingPatient = await Patient.findOne({ $or: [{ abhaId }, { username }] });
      if (existingPatient) return res.status(400).json({ message: "ABHA Identity record already exists." });

      const newPatient = new Patient({ name, username, password: hashedPassword, abhaId, abhaNumber, gender, dateOfBirth, qrVerified });
      await newPatient.save();
    }

    return res.status(201).json({ message: "Registration successful! You can now log in." });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// =========================================================================
// 2. UNIFIED LOGIN CONTROLLER
// =========================================================================
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

    // Query dynamically by either username or abhaId (for patients logging in with ABHA text values)
    const user = await TargetModel.findOne({
      $or: [{ username: username }, { abhaId: username }, { email: username }]
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials or role selection." });
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
      { expiresIn: "1d" }
    );

    // Strip password out of user object before returning to client side state management layers
    const userResponse = user.toObject();
    delete userResponse.password;

    return res.status(200).json({
      token,
      user: {
        ...userResponse,
        role // explicitly send back the matched system role
      }
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
    if (!TargetModel) return res.status(400).json({ message: "Invalid role mapping." });

    // Finds the live user by MongoDB ID and strips the password string out
    const profileData = await TargetModel.findById(req.user.id).select("-password");
    if (!profileData) {
      return res.status(404).json({ message: "User account records missing." });
    }

    return res.status(200).json({ ...profileData.toObject(), role: req.user.role });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

