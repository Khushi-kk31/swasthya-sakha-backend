import React, { useState } from 'react';
import { CalendarDays, MapPinned, Video, FilePlus2, UserRound, Clock, Save } from 'lucide-react';
import StatCard from '../components/StatCard';
import SectionHeader from '../components/SectionHeader';
import FacilityMap from '../components/FacilityMap';
import Badge from '../components/Badge';
import { appointments } from '../data';

export default function DoctorDashboard({ subpage }) {
  const safeAppointments = Array.isArray(appointments) ? appointments : [];
  const [selected, setSelected] = useState(safeAppointments[0] || null);
  const [rx, setRx] = useState('');
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