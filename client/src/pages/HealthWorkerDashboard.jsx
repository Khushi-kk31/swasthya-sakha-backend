import React from "react";
import { useState } from "react";
import {
  MapPinned,
  Ambulance,
  Video,
  Users,
  AlertTriangle,
  Phone,
  Navigation,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import StatCard from "../components/StatCard";
import SectionHeader from "../components/SectionHeader";
import FacilityMap from "../components/FacilityMap";
import Modal from "../components/Modal";
import Badge from "../components/Badge";
import { facilities } from "../data";
import DoctorTriageQueue from "../components/DoctorTriageQueue";
export default function HealthWorkerDashboard({ subpage }) {
  const nav = useNavigate();
  const [em, setEm] = useState(false);
  const [tele, setTele] = useState(false);
  const title =
    subpage === "facilities"
      ? "Find Facility"
      : subpage === "emergency"
        ? "Emergency Ambulance"
        : subpage === "teleconsult"
          ? "Teleconsultation"
          : "Health Worker Dashboard";
  if (subpage === "emergency") return <Emergency />;
  return (
    <div>
      <div className="grid md:grid-cols-4 gap-4">
        <StatCard
          label="Patients today"
          value="48"
          sub="+12% vs yesterday"
          icon={Users}
        />
        <StatCard
          label="High-risk alerts"
          value="3"
          sub="Needs action"
          icon={AlertTriangle}
          tone="rose"
        />
        <StatCard
          label="Nearby beds"
          value="327"
          sub="Across 5 facilities"
          icon={MapPinned}
          tone="blue"
        />
        <StatCard
          label="Ambulances"
          value="7"
          sub="2 currently dispatched"
          icon={Ambulance}
          tone="amber"
        />
      </div>
      {!subpage && (
        <div className="mt-5">
            <DoctorTriageQueue />
        </div>
        )}
      {subpage === "facilities" ? (
        <div className="card p-5 mt-5">
          <SectionHeader
            title="Facility finder"
            sub="Beds, ICU, specialists, diagnostics and ambulance capacity."
          />
          <FacilityMap height="500px" />
          <div className="grid md:grid-cols-3 gap-3 mt-4">
            {facilities.slice(0, 3).map((f) => (
              <div className="border rounded-xl p-4">
                <b>{f.name}</b>
                <p className="text-xs text-muted mt-1">{f.type}</p>
                <div className="grid grid-cols-3 gap-2 mt-3 text-xs">
                  <span>
                    <b>{f.beds}</b> beds
                  </span>
                  <span>
                    <b>{f.specialists}</b> specialists
                  </span>
                  <span>
                    <b>{f.diagnostics}</b> diagnostics
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : subpage === "teleconsult" ? (
        <Tele />
      ) : (
        <>
          <div className="grid lg:grid-cols-[1.2fr_.8fr] gap-5 mt-5">
            <div className="card p-5">
              <SectionHeader
                title="Today’s field queue"
                sub="Prioritize visits using triage and referral status."
              />
              <div className="space-y-3">
                {[
                  ["Asha Patil", "Fever + weakness", "YELLOW"],
                  ["Vijay Joshi", "Breathing difficulty", "RED"],
                  ["Sana Khan", "Routine follow-up", "GREEN"],
                ].map(([n, r, t]) => (
                  <div className="flex items-center justify-between border rounded-xl p-4">
                    <div>
                      <b className="text-sm">{n}</b>
                      <p className="text-xs text-muted mt-1">{r}</p>
                    </div>
                    <Badge
                      tone={
                        t === "RED" ? "red" : t === "YELLOW" ? "amber" : "green"
                      }
                    >
                      {t}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
            <div className="card p-5">
              <SectionHeader title="Quick actions" />
              <button
                onClick={() => nav("/dashboard/facilities")}
                className="w-full p-4 border rounded-xl text-left hover:bg-slate-50 flex gap-3"
              >
                <MapPinned className="text-teal-700" />
                <span>
                  <b className="text-sm">Find facility</b>
                  <small className="block text-xs text-muted">
                    View beds & services on GIS
                  </small>
                </span>
              </button>
              <button
                onClick={() => setEm(true)}
                className="w-full p-4 border rounded-xl text-left hover:bg-slate-50 flex gap-3 mt-2"
              >
                <Ambulance className="text-rose-600" />
                <span>
                  <b className="text-sm">Emergency ambulance</b>
                  <small className="block text-xs text-muted">
                    Request nearest available unit
                  </small>
                </span>
              </button>
              <button
                onClick={() => setTele(true)}
                className="w-full p-4 border rounded-xl text-left hover:bg-slate-50 flex gap-3 mt-2"
              >
                <Video className="text-blue-600" />
                <span>
                  <b className="text-sm">Start teleconsultation</b>
                  <small className="block text-xs text-muted">
                    Connect patient with doctor
                  </small>
                </span>
              </button>
            </div>
          </div>
          <div className="mt-5">
            <div className="card p-5">
              <SectionHeader
                title="Referral tracker"
                sub="Track every referral from creation to follow-up."
              />
              <div className="grid md:grid-cols-5 gap-2">
                {[
                  "Created",
                  "Accepted",
                  "Appointment",
                  "Consultation",
                  "Follow-up",
                ].map((x, i) => (
                  <div className="bg-slate-50 rounded-xl p-3">
                    <div className="text-xs text-muted">Step {i + 1}</div>
                    <b className="text-sm">{x}</b>
                    <div className="h-1.5 bg-slate-200 rounded-full mt-3">
                      <div
                        className="h-1.5 bg-teal-600 rounded-full"
                        style={{ width: `${[100, 80, 65, 45, 25][i]}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
      <Modal
        open={em}
        onClose={() => setEm(false)}
        title="Emergency ambulance request"
      >
        <div className="space-y-3">
          <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 text-sm">
            <b>Priority RED</b>
            <p className="text-xs text-rose-700 mt-1">
              Vijay Joshi · Breathing difficulty · Location shared from field
              device
            </p>
          </div>
          <label className="block text-sm font-semibold">
            Destination
            <select className="mt-1 w-full border rounded-xl p-3">
              <option>District Hospital — 24 ICU beds</option>
              <option>CHC Kurla — 8 ICU beds</option>
            </select>
          </label>
          <button
            onClick={() => setEm(false)}
            className="w-full bg-rose-600 text-white rounded-xl py-3 font-semibold"
          >
            Request nearest ambulance
          </button>
        </div>
      </Modal>
      <Modal
        open={tele}
        onClose={() => setTele(false)}
        title="Teleconsultation"
      >
        <Tele />
      </Modal>
    </div>
  );
}
function Tele() {
  return (
    <div className="space-y-4">
      <div className="bg-[#0b2239] rounded-2xl h-64 grid place-items-center text-white">
        <div className="text-center">
          <Video size={38} className="mx-auto text-teal-300" />
          <b className="block mt-2">Waiting room</b>
          <p className="text-xs text-slate-300 mt-1">
            Video → audio-only fallback for poor connectivity
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <button className="flex-1 border rounded-xl py-3 font-semibold flex justify-center gap-2">
          <Phone size={17} /> Audio
        </button>
        <button className="flex-1 bg-teal-700 text-white rounded-xl py-3 font-semibold flex justify-center gap-2">
          <Navigation size={17} /> Join call
        </button>
      </div>
    </div>
  );
}

function Emergency() {
  return (
    <div>
      <SectionHeader
        title="Emergency ambulance"
        sub="Create, dispatch and track a priority ambulance request."
      />
      <div className="grid lg:grid-cols-[.8fr_1.2fr] gap-5">
        <div className="card p-5">
          <div className="bg-rose-50 border border-rose-100 rounded-2xl p-5">
            <AlertTriangle className="text-rose-600" />
            <h3 className="font-bold mt-3">RED priority patient</h3>
            <p className="text-sm mt-1">Vijay Joshi · Breathing difficulty</p>
            <p className="text-xs text-muted mt-2">
              Nearest suitable destination: District Hospital
            </p>
          </div>
          <button className="w-full mt-4 bg-rose-600 text-white rounded-xl py-3 font-semibold flex items-center justify-center gap-2">
            <Ambulance size={18} /> Dispatch nearest ambulance
          </button>
        </div>
        <div className="card p-5">
          <SectionHeader title="Live ambulance status" />
          <div className="space-y-3">
            {[
              ["MH-01-A-221", "En route", "7 min ETA"],
              ["MH-01-B-118", "Available", "At CHC Kurla"],
              ["MH-01-C-402", "On trip", "District Hospital"],
            ].map((x) => (
              <div className="border rounded-xl p-4 flex items-center justify-between">
                <div>
                  <b className="text-sm">{x[0]}</b>
                  <p className="text-xs text-muted mt-1">{x[2]}</p>
                </div>
                <Badge
                  tone={
                    x[1] === "Available"
                      ? "green"
                      : x[1] === "En route"
                        ? "amber"
                        : "blue"
                  }
                >
                  {x[1]}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
