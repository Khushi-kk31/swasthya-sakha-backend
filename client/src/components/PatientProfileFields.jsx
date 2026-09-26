import React, { useState } from "react";

export default function PatientProfileFields({ initialData = {}, onSubmit, loading }) {
  const [formData, setFormData] = useState({
    phone: initialData.phone || "",
    address: initialData.address || "",
    bloodGroup: initialData.bloodGroup || "",
    heightCm: initialData.heightCm || "",
    weightKg: initialData.weightKg || "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-left">
      <div>
        <label className="block text-sm font-semibold text-[#0b2239] mb-1">Phone Number</label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 bg-[#eef3f8] border border-transparent rounded-xl focus:bg-white focus:border-teal-500 outline-none"
          placeholder="e.g. +91 9876543210"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-[#0b2239] mb-1">Residential Address</label>
        <textarea
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
          rows="2"
          className="w-full px-4 py-2 bg-[#eef3f8] border border-transparent rounded-xl focus:bg-white focus:border-teal-500 outline-none"
          placeholder="Your full address..."
        />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-semibold text-[#0b2239] mb-1">Blood Group</label>
          <select
            name="bloodGroup"
            value={formData.bloodGroup}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-[#eef3f8] border border-transparent rounded-xl focus:bg-white focus:border-teal-500 outline-none"
          >
            <option value="">Select</option>
            {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
              <option key={bg} value={bg}>{bg}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#0b2239] mb-1">Height (cm)</label>
          <input
            type="number"
            name="heightCm"
            value={formData.heightCm}
            onChange={handleChange}
            placeholder="170"
            className="w-full px-3 py-2 bg-[#eef3f8] border border-transparent rounded-xl focus:bg-white focus:border-teal-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#0b2239] mb-1">Weight (kg)</label>
          <input
            type="number"
            name="weightKg"
            value={formData.weightKg}
            onChange={handleChange}
            placeholder="60"
            className="w-full px-3 py-2 bg-[#eef3f8] border border-transparent rounded-xl focus:bg-white focus:border-teal-500 outline-none"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full mt-2 bg-teal-600 text-white py-2.5 rounded-xl font-semibold hover:bg-teal-700 transition-colors disabled:bg-gray-400"
      >
        {loading ? "Saving Records..." : "Save Details"}
      </button>
    </form>
  );
}
