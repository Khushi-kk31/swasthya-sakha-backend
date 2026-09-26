import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    // CORE ACCOUNT IDENTIFIERS
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },

    // CLINICAL IDENTITY & CREDENTIALS
    specialization: {
      // e.g., Cardiologist
      type: String,
      required: true,
      trim: true,
    },
    registrationNo: {
      // Maps directly to frontend doctorLicense
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    // FACILITY PLACEMENT PLUGINS (Optional during initial sign up)
    phone: {
      type: String,
      default: "",
      trim: true,
    },
    hospital: {
      type: String,
      default: "",
      trim: true,
    },
    facilityId: {
      type: String,
      default: "",
      trim: true,
    },
    isProfileComplete: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const Doctor = mongoose.models.Doctor || mongoose.model("Doctor", doctorSchema);

export default Doctor;
