import express from "express";
import Patient from "../models/Patient.js";
// import Doctor from "../models/Doctor.js";         // Import when ready
// import HealthWorker from "../models/HealthWorker.js"; // Import when ready

const router = express.Router();

// PUT /api/profile/update
router.put("/update", async (req, res) => {
  try {
    const { username, role, phone, address, bloodGroup, heightCm, weightKg } = req.body;

    if (!username || !role) {
      return res.status(400).json({ success: false, message: "Username and role are required fields." });
    }

    let updatedUser;

    // Route database logic dynamically based on user role
    if (role === "patient") {
      updatedUser = await Patient.findOneAndUpdate(
        { username },
        {
          phone,
          address,
          bloodGroup,
          heightCm: heightCm ? Number(heightCm) : null,
          weightKg: weightKg ? Number(weightKg) : null,
          isProfileComplete: true // Mark onboarding as complete
        },
        { new: true, runValidators: true }
      );
    } 
    else if (role === "doctor") {
      updatedUser = await Doctor.findOneAndUpdate(
        { username },
        { 
          registrationNo: doctorLicense, // Maps to your schema tracking value
          specialization,
          isProfileComplete: true 
        },
        { new: true, runValidators: true }
      );
    } 
    else if (role === "healthWorker") {
      updatedUser = await HealthWorker.findOneAndUpdate(
        { username },
        { 
          healthWorkerId, 
          facility,
          isProfileComplete: true 
        },
        { new: true, runValidators: true }
      );
    }

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User account records not found." });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      user: updatedUser
    });

  } catch (error) {
    console.error("Profile Update Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
