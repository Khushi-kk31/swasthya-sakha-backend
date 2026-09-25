import mongoose from "mongoose";

const healthWorkerSchema = new mongoose.Schema(
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

    // HEALTH SYSTEM DEPLOYMENT INFO
    healthWorkerId: { 
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    facility: { // Maps directly to frontend hospitalName
      type: String,
      required: true,
      trim: true,
    },
    qualification: {
      type: String,
      default: "",
      trim: true,
    },

    phone: {
      type: String,
      default: "",
      trim: true,
    },
    village: {
      type: String,
      default: "",
      trim: true,
    },
    district: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { timestamps: true }
);

const HealthWorker =
  mongoose.models.HealthWorker ||
  mongoose.model("HealthWorker", healthWorkerSchema);

export default HealthWorker;
