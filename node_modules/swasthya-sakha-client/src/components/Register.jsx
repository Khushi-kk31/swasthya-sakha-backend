import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ArrowLeft, UserPlus, ShieldCheck } from "lucide-react";
import { api } from "../api";

export default function Register() {
  const [searchParams] = useSearchParams();
  const nav = useNavigate();
  const role = searchParams.get("role") || "patient";

  // State to track if patient wants to register via ABHA or Email
  const [patientRegMethod, setPatientRegMethod] = useState("abha"); // 'abha' or 'standard'

  // Initializing state with all fields present to ensure zero undefined input errors
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    // ABHA Specific Fields
    abhaNumber: "",
    abhaAddress: "",
    dateOfBirth: "",
    gender: "",
    // Health Worker Fields
    healthWorkerId: "",
    hospitalName: "",
    // Doctor Fields
    doctorLicense: "",
    specialization: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let payload = {
        role,
        password: formData.password,
      };

      if (role === "patient") {
        if (patientRegMethod === "abha") {
          payload = {
            ...payload,
            abhaId: formData.abhaAddress, // required: true
            abhaNumber: formData.abhaNumber, // unique: true
            name: formData.name, // required: true
            username: formData.abhaAddress.split("@")[0], // required & unique: strips context domain
            dateOfBirth: formData.dateOfBirth,
            gender: formData.gender,
            qrVerified: true,
          };
        } else {
          payload = {
            ...payload,
            name: formData.name,
            username: formData.email, // Standard users sign in with an email handle
            abhaId: `std_${Date.now()}@abdm`, // Auto-generated string satisfying structural unique index constraints
            abhaNumber: `STD-${Date.now()}`,
            dateOfBirth: formData.dateOfBirth || null,
            gender: formData.gender || "",
            qrVerified: false,
          };
        }
      } else if (role === "healthWorker") {
        payload = {
          ...payload,
          name: formData.name,
          email: formData.email,
          username: formData.email,
          facility: formData.hospitalName,
        };
      } else if (role === "doctor") {
        payload = {
          ...payload,
          name: formData.name,
          email: formData.email,
          username: formData.email, // Standardizing email handle login for medical staff
          registrationNo: formData.doctorLicense, // Maps input string cleanly to DB index
          specialization: formData.specialization,
        };
      }

      await api("/auth/register", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      // Navigate smoothly back to system access screen
      nav("/login");
    } catch (err) {
      setError(err.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f9fc] flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-lg w-full space-y-6">
        {/* Navigation Actions */}
        <button
          onClick={() => nav("/login")}
          className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Sign In
        </button>

        <div>
          <h2 className="text-2xl font-bold text-[#0b2239]">Create Account</h2>
          <p className="text-sm text-gray-500 mt-1">
            Registering as {" "}
            <span className="font-semibold text-teal-600 capitalize mr-1">
              {role === "healthWorker" ? "Health Worker" : role} 
            </span>
             in Swasthya Sakha
          </p>
        </div>

        {/* CONDITION-TRIGGER: PATIENT IDENTIFIER INTERACTION MODE */}
        {role === "patient" && (
          <div className="grid grid-cols-2 gap-2 bg-[#eef3f8] p-1.5 rounded-xl">
            <button
              type="button"
              onClick={() => setPatientRegMethod("abha")}
              className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                patientRegMethod === "abha"
                  ? "bg-white text-[#0b2239] shadow-sm"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              <ShieldCheck size={14} className="text-teal-500" /> Use ABHA
              Details
            </button>
            <button
              type="button"
              onClick={() => setPatientRegMethod("standard")}
              className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                patientRegMethod === "standard"
                  ? "bg-white text-[#0b2239] shadow-sm"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              Standard Registration
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* FLOW A: PATIENT REGISTRATION WITH REGULATED ABHA CREDENTIALS */}
          {role === "patient" && patientRegMethod === "abha" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#0b2239] mb-1.5">
                    14-Digit ABHA Number
                  </label>
                  <input
                    type="text"
                    name="abhaNumber"
                    required
                    placeholder="61-5230-2840-0239"
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-[#eef3f8] border border-transparent rounded-xl focus:bg-white focus:border-teal-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#0b2239] mb-1.5">
                    ABHA Address (PHR Address)
                  </label>
                  <input
                    type="text"
                    name="abhaAddress"
                    required
                    placeholder="devraj04@abdm"
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-[#eef3f8] border border-transparent rounded-xl focus:bg-white focus:border-teal-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#0b2239] mb-1.5">
                  Full Name (As per ABHA Card)
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. Devraj Kumar"
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-[#eef3f8] border border-transparent rounded-xl focus:bg-white focus:border-teal-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#0b2239] mb-1.5">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    required
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-[#eef3f8] border border-transparent rounded-xl focus:bg-white focus:border-teal-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#0b2239] mb-1.5">
                    Gender
                  </label>
                  <select
                    name="gender"
                    required
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-[#eef3f8] border border-transparent rounded-xl focus:bg-white focus:border-teal-500 outline-none text-gray-700"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {/* FLOW B: REGISTRATION CAPTURE LAYOUT FOR STANDARD USERS & ADMINISTRATIVE ROLES */}
          {(role !== "patient" || patientRegMethod === "standard") && (
            <>
              {/* Full Name Input */}
              <div>
                <label className="block text-sm font-semibold text-[#0b2239] mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="John Doe"
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-[#eef3f8] border border-transparent rounded-xl focus:bg-white focus:border-teal-500 outline-none"
                />
              </div>

              {/* Email Address Input */}
              <div>
                <label className="block text-sm font-semibold text-[#0b2239] mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="name@example.com"
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-[#eef3f8] border border-transparent rounded-xl focus:bg-white focus:border-teal-500 outline-none"
                />
              </div>

              {/* Non-ABHA Patient Demographics Grid (DOB & Gender Side by Side) */}
              {role === "patient" && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#0b2239] mb-1.5">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      required
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 bg-[#eef3f8] border border-transparent rounded-xl focus:bg-white focus:border-teal-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#0b2239] mb-1.5">
                      Gender
                    </label>
                    <select
                      name="gender"
                      required
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 bg-[#eef3f8] border border-transparent rounded-xl focus:bg-white focus:border-teal-500 outline-none text-gray-700"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Health Worker Target Parameters */}
          {role === "healthWorker" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#0b2239] mb-1.5">
                  Health Worker ID / Code
                </label>
                <input
                  type="text"
                  name="healthWorkerId"
                  required
                  placeholder="HW-10293"
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-[#eef3f8] border border-transparent rounded-xl focus:bg-white focus:border-teal-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#0b2239] mb-1.5">
                  Assigned Facility Name
                </label>
                <input
                  type="text"
                  name="hospitalName"
                  required
                  placeholder="City General Hospital"
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-[#eef3f8] border border-transparent rounded-xl focus:bg-white focus:border-teal-500 outline-none"
                />
              </div>
            </div>
          )}

          {/* Doctor Target Parameters */}
          {role === "doctor" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#0b2239] mb-1.5">
                  Medical License Number
                </label>
                <input
                  type="text"
                  name="doctorLicense"
                  required
                  placeholder="MCI-98342"
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-[#eef3f8] border border-transparent rounded-xl focus:bg-white focus:border-teal-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#0b2239] mb-1.5">
                  Specialization Area
                </label>
                <input
                  type="text"
                  name="specialization"
                  required
                  placeholder="e.g., Cardiologist"
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-[#eef3f8] border border-transparent rounded-xl focus:bg-white focus:border-teal-500 outline-none"
                />
              </div>
            </div>
          )}

          {/* Account System Authentication Security Matrix */}
          <div>
            <label className="block text-sm font-semibold text-[#0b2239] mb-1.5">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              placeholder="••••••••"
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 bg-[#eef3f8] border border-transparent rounded-xl focus:bg-white focus:border-teal-500 outline-none"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm font-medium bg-red-50 p-3 rounded-lg border border-red-100">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0b2239] hover:bg-[#12355b] text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 mt-6 active:scale-[0.99]"
          >
            <UserPlus size={18} />
            {loading ? "Processing..." : "Complete Registration"}
          </button>
        </form>
      </div>
    </div>
  );
}
