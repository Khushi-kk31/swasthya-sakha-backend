import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../store/authSlice"; // Adjust path if auth slice has a different name
import { api } from "../api";
import { ShieldCheck, User, Save, RefreshCw } from "lucide-react";

export default function ProfilePage({ loggedInUser }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Check if routed here automatically right after login redirect intercept
  const isOnboarding = searchParams.get("onboarding") === "true";

  const [formData, setFormData] = useState({
    phone: loggedInUser.phone || "",
    address: loggedInUser.address || "",
    bloodGroup: loggedInUser.bloodGroup || "",
    heightCm: loggedInUser.heightCm || "",
    weightKg: loggedInUser.weightKg || "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const res = await api("/profile/update", {
        method: "PUT",
        body: JSON.stringify({
          username: loggedInUser.username,
          role: loggedInUser.role,
          ...formData,
        }),
      });

      // Update Redux state and cache token structure locally
      const cachedAuth = JSON.parse(localStorage.getItem("ss_auth") || "{}");
      localStorage.setItem("ss_auth", JSON.stringify({ ...cachedAuth, user: res.user }));
      dispatch(loginSuccess({ ...cachedAuth, user: res.user }));

      setSuccess(true);

      // Send onboarding patients directly back to workspace home
      if (isOnboarding) {
        navigate("/dashboard");
      }
    } catch (err) {
      alert(err.message || "Failed to save profile changes.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      {isOnboarding && (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 p-4 rounded-xl flex gap-3 text-sm">
          <ShieldCheck className="text-amber-600 shrink-0 mt-0.5" size={18} />
          <div>
            <span className="font-bold">Initial Account Verification Setup Required:</span> Please complete your medical properties inputs to access your health status panel tracking metrics layout.
          </div>
        </div>
      )}

      {/* READ ONLY STRUCTURAL ACCOUNT IDENTIFIERS */}
      <div className="card p-6 bg-white border border-gray-100 rounded-2xl shadow-sm space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-teal-600 flex items-center gap-2">
          <User size={16} /> Verified National Health Identity Registry
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-[#0b2239]">
          <div><span className="text-gray-400 block text-xs">Full Legal Name</span> <b className="font-semibold">{loggedInUser.name}</b></div>
          <div><span className="text-gray-400 block text-xs">ABHA Health Address</span> <b className="font-semibold font-mono text-teal-700">{loggedInUser.abhaId}</b></div>
          <div><span className="text-gray-400 block text-xs">Gender Designation</span> <b className="font-semibold">{loggedInUser.gender || "Not specified"}</b></div>
          <div><span className="text-gray-400 block text-xs">Username Identifier</span> <b className="font-semibold">{loggedInUser.username}</b></div>
        </div>
      </div>

      {/* ADJUSTABLE DATA SCHEMAS FORM SELECTION GRID */}
      <div className="card p-6 bg-white border border-gray-100 rounded-2xl shadow-sm">
        <h3 className="text-lg font-black text-[#0b2239] mb-4">Adjustable Medical Parameters</h3>
        
        {success && !isOnboarding && (
          <div className="p-3 mb-4 bg-green-50 border border-green-200 text-green-700 font-medium rounded-xl text-sm">
            ✓ Your vital information changes have been successfully modified!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-[#0b2239] mb-1">Phone Number</label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="w-full px-4 py-2.5 bg-[#eef3f8] border border-transparent rounded-xl focus:bg-white focus:border-teal-500 outline-none transition-all text-sm" placeholder="e.g. +91 9876543210" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#0b2239] mb-1">Residential Address</label>
            <textarea name="address" value={formData.address} onChange={handleChange} required rows="2" className="w-full px-4 py-2.5 bg-[#eef3f8] border border-transparent rounded-xl focus:bg-white focus:border-teal-500 outline-none transition-all text-sm" placeholder="Full residential physical block address location details..." />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#0b2239] mb-1">Blood Group</label>
              <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className="w-full px-3 py-2.5 bg-[#eef3f8] border border-transparent rounded-xl focus:bg-white focus:border-teal-500 outline-none bg-white text-sm">
                <option value="">Select</option>
                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0b2239] mb-1">Height (cm)</label>
              <input type="number" name="heightCm" value={formData.heightCm} onChange={handleChange} className="w-full px-3 py-2.5 bg-[#eef3f8] border border-transparent rounded-xl focus:bg-white focus:border-teal-500 outline-none text-sm" placeholder="172" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0b2239] mb-1">Weight (kg)</label>
              <input type="number" name="weightKg" value={formData.weightKg} onChange={handleChange} className="w-full px-3 py-2.5 bg-[#eef3f8] border border-transparent rounded-xl focus:bg-white focus:border-teal-500 outline-none text-sm" placeholder="68" />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-[#0b2239] text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-[#153452] transition-colors disabled:bg-gray-400 mt-2 text-sm shadow-sm">
            {loading ? <RefreshCw className="animate-spin" size={16} /> : <Save size={16} />}
            {loading ? "Syncing with Registry..." : isOnboarding ? "Finish Onboarding Setup" : "Update Profile Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
