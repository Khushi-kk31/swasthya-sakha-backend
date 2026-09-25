import mongoose from "mongoose";

const PatientSchema = new mongoose.Schema(
  {
    // MANDATORY IDENTIFIERS
    abhaId: { 
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    abhaNumber: { // e.g. 61-5230-2840-0239
      type: String,
      required: true,
      unique: true,
      trim: true,
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

    name: {
      type: String,
      required: true,
      trim: true,
    },
    dateOfBirth: {
      type: Date,
      required: true, // Crucial for healthcare tracking age validation
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },
    phone: {
      type: String,
      default: "",
      trim: true,
    },
    address: {
      type: String,
      default: "",
      trim: true,
    },

    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", ""],
      default: "",
    },
    heightCm: {
        type: Number,
        default: null,
    },
    weightKg: {
        type: Number,
        default: null,
    },
    qrVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Patient = mongoose.models.Patient || mongoose.model("Patient", PatientSchema);
export default Patient;
