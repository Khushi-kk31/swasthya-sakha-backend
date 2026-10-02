import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { api } from "../api";
import { setToast } from "../store/uiSlice";
import { useDispatch } from "react-redux";
import PatientProfileForm from "../components/ProfileForms/PatientProfileForm";
import DoctorProfileForm from "../components/ProfileForms/DoctorProfileForm";
import HealthWorkerProfileForm from "../components/ProfileForms/HealthWorkerProfileForm";

const ProfilePage = ({ loggedInUser }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);

  const [editForm, setEditForm] = useState({
    phone: loggedInUser?.phone || "",
    address: loggedInUser?.address || "",
    bloodGroup: loggedInUser?.bloodGroup || "",
    heightCm: loggedInUser?.heightCm || "",
    weightKg: loggedInUser?.weightKg || "",
    qualification: loggedInUser?.qualification || "",
    village: loggedInUser?.village || "",
    district: loggedInUser?.district || "",
    hospital: loggedInUser?.hospital || "",
    facilityId: loggedInUser?.facilityId || "",
  });

  const [savingProfile, setSavingProfile] = useState(false);

  const handleEditChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value,
    });
  };

  if (!loggedInUser) {
    return (
      <div className="card p-6">
        <p className="text-sm text-slate-500">User profile not found.</p>
      </div>
    );
  }

  const roleLabels = {
    patient: "Patient",
    healthWorker: "Health Worker",
    doctor: "Doctor",
    facilityAdmin: "Facility Administrator",
    districtAdmin: "District Administrator",
  };

  const roleLabel =
    roleLabels[loggedInUser.role] || loggedInUser.role || "User";

  const editHandle = () => {
    setIsEditing(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);

    try {
      const data = await api("/profile/update", {
        method: "PUT",
        body: JSON.stringify({
          username: loggedInUser.username,
          role: loggedInUser.role,
          ...editForm,
        }),
      });

      const updatedUser = data.user || data;

      const oldSession = JSON.parse(localStorage.getItem("ss_auth") || "{}");
      const session = {
        token: oldSession.token,
        user: {
          ...loggedInUser,
          ...updatedUser,
          role: loggedInUser.role,
        },
      };

      localStorage.setItem("ss_auth", JSON.stringify(session));
      dispatch(
        setToast({
          type: "success",
          message: "Profile updated successfully!",
        }),
      );

      // Exit edit mode
      setIsEditing(false);
    } catch (err) {
      console.error("Profile update error:", err);

      dispatch(
        setToast({
          type: "error",
          message: err.message || "Profile update failed.",
        }),
      );
    } finally {
      setSavingProfile(false);
    }
  };

  return (
    <>
      {isEditing ? (
        <>
          {loggedInUser?.role === "patient" && (
            <PatientProfileForm
              loggedInUser={loggedInUser}
              form={editForm}
              onChange={handleEditChange}
              onSubmit={handleEditSubmit}
              saving={savingProfile}
              onCancel={() => {
                console.log("ProfilePage cancel fired");
                navigate("/dashboard");
              }}
              isEditing={true}
            />
          )}

          {loggedInUser?.role === "healthWorker" && (
            <HealthWorkerProfileForm
              loggedInUser={loggedInUser}
              form={editForm}
              onChange={handleEditChange}
              onSubmit={handleEditSubmit}
              saving={savingProfile}
              onCancel={() => {
                console.log("ProfilePage cancel fired");
                navigate("/dashboard");
              }}
              isEditing={true}
            />
          )}

          {loggedInUser?.role === "doctor" && (
            <DoctorProfileForm
              loggedInUser={loggedInUser}
              form={editForm}
              onChange={handleEditChange}
              onSubmit={handleEditSubmit}
              saving={savingProfile}
              onCancel={() => {
                console.log("ProfilePage cancel fired");
                navigate("/dashboard");
              }}
              isEditing={true}
            />
          )}
        </>
      ) : (
        <div className="max-w-4xl mx-auto space-y-5">
          {/* Top section */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-[#0b2239]">My Profile</h2>
              <p className="text-sm text-slate-500 mt-1">
                View your account information
              </p>
            </div>

            {/* Close Button */}
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200
                     text-slate-600 transition-colors
                     hover:shadow-lg"
            >
              <ArrowLeft size={18} />
              Back to Dashboard
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-5">
              <div
                className="w-20 h-20 rounded-full bg-emerald-600 text-white
                          flex items-center justify-center text-3xl font-bold shadow-sm"
              >
                {(loggedInUser.name || "U").slice(0, 1).toUpperCase()}
              </div>

              <div>
                <h3 className="text-2xl font-bold text-[#0b2239]">
                  {loggedInUser.name || "Name not available"}
                </h3>

                <p className="text-sm text-slate-500 mt-1">{roleLabel}</p>

                {loggedInUser.email && (
                  <p className="text-sm text-slate-500 mt-1">
                    {loggedInUser.email}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-lg font-bold text-[#0b2239] mb-5">
              Personal Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <ProfileField label="Full Name" value={loggedInUser.name} />

              <ProfileField label="Username" value={loggedInUser.username} />

              <ProfileField label="Email" value={loggedInUser.email} />

              <ProfileField label="Phone" value={loggedInUser.phone} />

              <ProfileField label="Role" value={roleLabel} />

              <ProfileField label="Address" value={loggedInUser.address} />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-lg font-bold text-[#0b2239] mb-5">
              Professional / Additional Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {loggedInUser.role === "doctor" && (
                <>
                  <ProfileField
                    label="Specialization"
                    value={loggedInUser.specialization}
                  />

                  <ProfileField
                    label="Registration Number"
                    value={loggedInUser.registrationNo}
                  />

                  <ProfileField
                    label="Hospital"
                    value={loggedInUser.hospital}
                  />

                  <ProfileField
                    label="Facility ID"
                    value={loggedInUser.facilityId}
                  />
                </>
              )}

              {loggedInUser.role === "healthWorker" && (
                <>
                  <ProfileField label="Village" value={loggedInUser.village} />

                  <ProfileField
                    label="District"
                    value={loggedInUser.district}
                  />

                  <ProfileField
                    label="Facility ID"
                    value={loggedInUser.facilityId}
                  />
                </>
              )}

              {loggedInUser.role === "patient" && (
                <>
                  <ProfileField
                    label="Blood Group"
                    value={loggedInUser.bloodGroup}
                  />

                  <ProfileField
                    label="Height"
                    value={
                      loggedInUser.heightCm
                        ? `${loggedInUser.heightCm} cm`
                        : null
                    }
                  />

                  <ProfileField
                    label="Weight"
                    value={
                      loggedInUser.weightKg
                        ? `${loggedInUser.weightKg} kg`
                        : null
                    }
                  />
                </>
              )}

              {loggedInUser.role === "facilityAdmin" && (
                <>
                  <ProfileField
                    label="Facility ID"
                    value={loggedInUser.facilityId}
                  />

                  <ProfileField
                    label="Hospital / Facility"
                    value={loggedInUser.hospital}
                  />

                  <ProfileField
                    label="District"
                    value={loggedInUser.district}
                  />
                </>
              )}

              {loggedInUser.role === "districtAdmin" && (
                <ProfileField label="District" value={loggedInUser.district} />
              )}
            </div>
          </div>

          {/* Edit Button */}
          <div onClick={editHandle} className="flex justify-end">
            <button
              className="px-6 py-3 bg-[#0b2239] text-white rounded-xl
                     font-semibold hover:bg-[#153554] transition-colors"
            >
              Edit Profile
            </button>
          </div>
        </div>
      )}
    </>
  );
};

function ProfileField({ label, value }) {
  return (
    <div>
      <p className="text-xs font-medium text-slate-500 mb-1">{label}</p>

      <p className="text-sm font-semibold text-slate-800">
        {value || "Not provided"}
      </p>
    </div>
  );
}

export default ProfilePage;
