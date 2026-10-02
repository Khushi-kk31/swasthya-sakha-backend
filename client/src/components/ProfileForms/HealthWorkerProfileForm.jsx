import React from "react";
import { Loader2 } from "lucide-react";

export default function HealthWorkerProfileForm({
  loggedInUser,
  form,
  onChange,
  onSubmit,
  saving,
  onSkip,
  onCancel,
  isEditing = false,
}) {
  return (
    <div className="max-w-xl mx-auto my-10 bg-white p-8 rounded-2xl border border-gray-200/60 shadow-sm space-y-6">

      <div>
        <h2 className="text-2xl font-black text-[#0b2239]">
          {isEditing ? "Edit Profile" : "Complete Initial Profile Details"}
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          {isEditing
            ? "Update your professional and healthcare information."
            : "Please provide these basic healthcare parameters to finish setting up your account tracker access."}
        </p>
      </div>

      {/* Read-only verification blocks */}
      <div className="bg-[#eef3f8] p-4 rounded-xl space-y-2 text-sm text-[#0b2239]">

        <div>
          <strong>Full Name:</strong>
          <span className="ml-2 font-medium">
            {loggedInUser?.name || "Not Found"}
          </span>
        </div>

        <div>
          <strong>Health Worker Email:</strong>
          <span className="ml-2 font-mono text-teal-700">
            {loggedInUser?.email || "Not Found"}
          </span>
        </div>

        <div>
          <strong>Username:</strong>
          <span className="ml-2 font-medium">
            {loggedInUser?.username || "Not Found"}
          </span>
        </div>

      </div>

      <form onSubmit={onSubmit} className="space-y-4">

        {/* Phone */}
        <div>
          <label className="block text-sm font-semibold text-[#0b2239] mb-1">
            Phone Number
          </label>

          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={onChange}
            required
            className="w-full px-4 py-2.5 bg-[#eef3f8] border border-transparent rounded-xl focus:bg-white focus:border-teal-500 outline-none text-sm transition-all"
            placeholder="e.g. +91 9876543210"
          />
        </div>

        {/* Qualification */}
        <div>
          <label className="block text-sm font-semibold text-[#0b2239] mb-1">
            Qualification
          </label>

          <textarea
            name="qualification"
            value={form.qualification}
            onChange={onChange}
            required
            rows="2"
            className="w-full px-4 py-2.5 bg-[#eef3f8] border border-transparent rounded-xl focus:bg-white focus:border-teal-500 outline-none text-sm transition-all"
            placeholder="Your qualification..."
          />
        </div>

        {/* Village */}
        <div>
          <label className="block text-sm font-semibold text-[#0b2239] mb-1">
            Village
          </label>

          <textarea
            name="village"
            value={form.village}
            onChange={onChange}
            required
            rows="2"
            className="w-full px-4 py-2.5 bg-[#eef3f8] border border-transparent rounded-xl focus:bg-white focus:border-teal-500 outline-none text-sm transition-all"
            placeholder="Your village..."
          />
        </div>

        {/* District */}
        <div>
          <label className="block text-sm font-semibold text-[#0b2239] mb-1">
            District
          </label>

          <textarea
            name="district"
            value={form.district}
            onChange={onChange}
            required
            rows="2"
            className="w-full px-4 py-2.5 bg-[#eef3f8] border border-transparent rounded-xl focus:bg-white focus:border-teal-500 outline-none text-sm transition-all"
            placeholder="Your district..."
          />
        </div>

        {/* Buttons */}
       <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">

  <button
    type="submit"
    disabled={saving}
    className="bg-[#0b2239] text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-[#153554] transition-colors disabled:bg-gray-400 text-sm shadow-sm"
  >
    {saving ? (
      <Loader2 className="animate-spin" size={16} />
    ) : (
      isEditing ? "Save Changes" : "Save Metrics"
    )}
  </button>

  {isEditing ? (
    <button
      type="button"
      onClick={onCancel}
      className="border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 py-3 rounded-xl font-semibold text-sm transition-colors shadow-2xs"
    >
      Close
    </button>
  ) : (
    <button
      type="button"
      onClick={onSkip}
      className="border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 py-3 rounded-xl font-semibold text-sm transition-colors shadow-2xs"
    >
      Skip for Now
    </button>
  )}

</div>

      </form>
    </div>
  );
}