import React, { useState } from 'react';
import { CalendarDays, MapPinned, Video, FilePlus2, UserRound, Clock, Save , Loader2} from 'lucide-react';
import StatCard from '../components/StatCard';
import SectionHeader from '../components/SectionHeader';
import FacilityMap from '../components/FacilityMap';
import Badge from '../components/Badge';
import { appointments } from '../data';
import { useDispatch } from 'react-redux';
import { api } from '../api';
import { setToast } from '../store/uiSlice';


export default function DoctorDashboard({ subpage , loggedInUser}) {
  const safeAppointments = Array.isArray(appointments) ? appointments : [];
  const [selected, setSelected] = useState(safeAppointments[0] || null);
  const [rx, setRx] = useState('');

  const dispatch = useDispatch();

   const [onboardingForm, setOnboardingForm] = useState({
      hospital: loggedInUser?.hospital || "",
      phone: loggedInUser?.phone || "",
      facilityId: loggedInUser?.facilityId || "",
    });
    const [savingProfile, setSavingProfile] = useState(false);
    const [isSkipped, setIsSkipped] = useState(false);
  
    const isProfileIncomplete =
      (loggedInUser?.isProfileComplete === false ||
        loggedInUser?.isProfileComplete === undefined) &&
      !isSkipped;
  
    const handleFormInputChange = (e) => {
      setOnboardingForm({ ...onboardingForm, [e.target.name]: e.target.value });
    };
  
    const handleOnboardingSubmit = async (e) => {
      e.preventDefault();
      setSavingProfile(true);
  
      try {
        const data = await api("/profile/update", {
          method: "PUT",
          body: JSON.stringify({
            username: loggedInUser.username,
            role: loggedInUser.role,
            ...onboardingForm,
          }),
        });
  
        const updatedUser = data.user || data;
  
        const oldSession = JSON.parse(localStorage.getItem("ss_auth") || "{}");
  
        const session = {
          token: oldSession.token,
          user: {
            ...updatedUser,
            role: loggedInUser.role,
          },
        };
  
        localStorage.setItem("ss_auth", JSON.stringify(session));
  
        dispatch(
          setToast({
            type: "success",
            message: "Doctor profile activated successfully!",
          }),
        );
  
        window.location.reload();
      } catch (err) {
        console.error(err);
        dispatch(
          setToast({
            type: "error",
            message: err.message || "Profile sync failed.",
          }),
        );
      } finally {
        setSavingProfile(false);
      }
    };
  

    if (isProfileIncomplete && !subpage) {
    return (
      <div className="max-w-xl mx-auto my-10 bg-white p-8 rounded-2xl border border-gray-200/60 shadow-sm space-y-6">
        <div>
          <h2 className="text-2xl font-black text-[#0b2239]">
            Complete Initial Profile Details
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Please provide these basic healthcare parameters to finish setting
            up your account tracker access.
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
          <div>
            <strong>Specialization:</strong>
            <span className="ml-2 font-medium">
              {loggedInUser?.specialization || "Not Found"}
            </span>
          </div>
          <div>
            <strong>Registration Number:</strong>
            <span className="ml-2 font-medium">
              {loggedInUser?.registrationNo || "Not Found"}
            </span>
          </div>
        </div>

        <form onSubmit={handleOnboardingSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-[#0b2239] mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={onboardingForm.phone}
              onChange={handleFormInputChange}
              required
              className="w-full px-4 py-2.5 bg-[#eef3f8] border border-transparent rounded-xl focus:bg-white focus:border-teal-500 outline-none text-sm transition-all"
              placeholder="e.g. +91 9876543210"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#0b2239] mb-1">
              Hospital
            </label>
            <textarea
              name="hospital"
              value={onboardingForm.hospital}
              onChange={handleFormInputChange}
              required
              rows="2"
              className="w-full px-4 py-2.5 bg-[#eef3f8] border border-transparent rounded-xl focus:bg-white focus:border-teal-500 outline-none text-sm transition-all"
              placeholder="Your full home address..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#0b2239] mb-1">
              Facility Id
            </label>
            <textarea
              name="facilityId"
              value={onboardingForm.facilityId}
              onChange={handleFormInputChange}
              required
              rows="2"
              className="w-full px-4 py-2.5 bg-[#eef3f8] border border-transparent rounded-xl focus:bg-white focus:border-teal-500 outline-none text-sm transition-all"
              placeholder="Your full home address..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
            <button
              type="submit"
              disabled={savingProfile}
              className="bg-[#0b2239] text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-[#153554] transition-colors disabled:bg-gray-400 text-sm shadow-sm"
            >
              {savingProfile ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                "Save Metrics"
              )}
            </button>

            <button
              type="button"
              onClick={() => setIsSkipped(true)}
              className="border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 py-3 rounded-xl font-semibold text-sm transition-colors shadow-2xs"
            >
              Skip for Now
            </button>
          </div>
        </form>
      </div>
    );
  }


  if (subpage === 'facilities') {
    return (
      <div>
        <SectionHeader title="Facility GIS" sub="See nearby hospitals, PHCs, beds, specialists and diagnostics." />
        <FacilityMap height="620px" />
      </div>
    );
  }

  if (subpage === 'teleconsult') {
    return (
      <div className="grid lg:grid-cols-[.9fr_1.1fr] gap-5">
        <div className="card p-5">
          <SectionHeader title="Teleconsultation" sub="Current patient waiting room" />
          <div className="bg-[#0b2239] rounded-2xl h-72 grid place-items-center text-white">
            <Video size={42} className="text-teal-300" />
            <p className="text-sm mt-2">Secure consultation room</p>
          </div>
          <button className="w-full mt-3 bg-teal-700 text-white rounded-xl py-3 font-semibold">
            Join consultation
          </button>
        </div>
        <Prescription />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Stat Cards with Dynamic MongoDB Queue Counter */}
      <div className="grid md:grid-cols-4 gap-4">
        <StatCard
          label="Queue"
          value="18"
          sub="Today"
          icon={UserRound}
        />
        <StatCard label="Appointments" value="18" sub="Today" icon={CalendarDays} tone="blue" />
        <StatCard label="Follow-ups" value="7" sub="Due this week" icon={Clock} tone="amber" />
        <StatCard label="ePrescriptions" value="26" sub="This month" icon={FilePlus2} />
      </div>

      {/* Patient Queue & Details */}
      <div className="grid lg:grid-cols-[1.35fr_.65fr] gap-5">
        <div className="card p-5">
          <SectionHeader title="Patient queue" sub="Open a patient to view details before consultation." />
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-xs text-muted border-b">
                  <th className="pb-3">Patient</th>
                  <th className="pb-3">Reason</th>
                  <th className="pb-3">Time</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {safeAppointments.map((a) => (
                  <tr
                    key={a.id}
                    onClick={() => setSelected(a)}
                    className={`border-b last:border-0 cursor-pointer ${
                      selected?.id === a.id ? 'bg-teal-50/60' : ''
                    }`}
                  >
                    <td className="py-4">
                      <b>{a.patient}</b>
                      <span className="block text-xs text-muted">
                        {a.age} yrs · {a.id}
                      </span>
                    </td>
                    <td>{a.reason}</td>
                    <td>{a.time}</td>
                    <td>
                      <Badge
                        tone={a.status === 'Priority' ? 'red' : a.status === 'Waiting' ? 'amber' : 'green'}
                      >
                        {a.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card p-5">
          <SectionHeader title="Patient details" />
          {selected ? (
            <>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                <div className="w-11 h-11 rounded-full bg-teal-100 grid place-items-center text-teal-800 font-bold">
                  {selected.patient ? selected.patient[0] : 'P'}
                </div>
                <div>
                  <b>{selected.patient}</b>
                  <p className="text-xs text-muted">
                    {selected.age} years · {selected.id}
                  </p>
                </div>
              </div>

              <div className="space-y-3 mt-4 text-sm">
                <div>
                  <span className="text-muted">Reason</span>
                  <p className="font-semibold">{selected.reason}</p>
                </div>
                <div>
                  <span className="text-muted">Appointment</span>
                  <p className="font-semibold">{selected.time}</p>
                </div>
                <div>
                  <span className="text-muted">Available slots</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {['11:30 AM', '12:00 PM', '02:30 PM'].map((x) => (
                      <button key={x} className="px-2.5 py-1.5 border rounded-lg text-xs hover:border-teal-500">
                        {x}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <p className="text-xs text-slate-500 py-4">No patient selected.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function Prescription() {
  const [medicine, setMedicine] = useState('');
  const [dose, setDose] = useState('');

  return (
    <div className="card p-5">
      <SectionHeader title="ePrescription builder" sub="Draft a prescription for the current consultation." />
      <div className="space-y-3">
        <label className="text-sm font-semibold block">
          Medicine
          <input
            value={medicine}
            onChange={(e) => setMedicine(e.target.value)}
            className="mt-1 w-full border rounded-xl p-3"
            placeholder="Medicine name"
          />
        </label>
        <label className="text-sm font-semibold block">
          Dose & frequency
          <input
            value={dose}
            onChange={(e) => setDose(e.target.value)}
            className="mt-1 w-full border rounded-xl p-3"
            placeholder="e.g. 1 tablet twice daily"
          />
        </label>
        <textarea
          className="w-full border rounded-xl p-3 min-h-28 text-sm"
          placeholder="Instructions / clinical notes"
        />
        <button className="w-full bg-teal-700 text-white rounded-xl py-3 font-semibold flex items-center justify-center gap-2">
          <Save size={17} /> Save draft
        </button>
      </div>
    </div>
  );
}