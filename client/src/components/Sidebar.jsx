import React from "react";
import { NavLink } from "react-router-dom";
import {
  Activity,
  LayoutDashboard,
  Users,
  MapPinned,
  Ambulance,
  Video,
  CalendarDays,
  FileText,
  PackageSearch,
  Stethoscope,
  Building2,
  LogOut,
  ChevronLeft,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/authSlice";

const menu = {
  patient: [
    ["/dashboard", "Overview", LayoutDashboard],
    ["/dashboard/history", "Medical History", FileText],
    ["/dashboard/appointments", "Appointments", CalendarDays],
  ],
  healthWorker: [
    ["/dashboard", "Overview", LayoutDashboard],
    ["/dashboard/facilities", "Find Facility", MapPinned],
    ["/dashboard/emergency", "Emergency", Ambulance],
    ["/dashboard/teleconsult", "Teleconsultation", Video],
  ],
  doctor: [
    ["/dashboard", "Queue & Appointments", Users],
    ["/dashboard/facilities", "Facility GIS", MapPinned],
    ["/dashboard/teleconsult", "Teleconsult + Rx", Video],
  ],
  facilityAdmin: [
    ["/dashboard", "Command Centre", LayoutDashboard],
    ["/dashboard/network", "District Network", Building2],
    ["/dashboard/medicines", "Medical Stores", PackageSearch],
    ["/dashboard/diagnostics", "Diagnostics", Stethoscope],
  ],
  districtAdmin: [
    ["/dashboard", "District Overview", LayoutDashboard],
    ["/dashboard/network", "Facility Network", Building2],
    ["/dashboard/insights", "Analytics & Alerts", Activity],
  ],
};
export default function Sidebar() {
  const { user } = useSelector((s) => s.auth);
  const open = useSelector((s) => s.ui.sidebarOpen);
  const dispatch = useDispatch();
  const items = menu[user?.role] || [];
  return (
    <aside
      className={`${open ? "w-64" : "w-20"} shrink-0 bg-[#0b2239] text-white min-h-screen transition-all duration-200 hidden md:flex flex-col`}
    >
      <div className="h-20 flex items-center gap-3 px-5 border-b border-white/10">
        <div className="w-10 h-10 rounded-xl bg-teal-400 text-[#0b2239] grid place-items-center font-black">
          स्व
        </div>
        {open && (
          <div>
            <div className="font-bold">Swasthya Sakha</div>
            <div className="text-[11px] text-slate-300">
              Digital Care Network
            </div>
          </div>
        )}
      </div>
      <nav className="p-3 space-y-1 flex-1">
        {items.map(([to, label, Icon]) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-3 rounded-xl text-sm ${isActive ? "bg-white/12 text-teal-200" : "text-slate-300 hover:bg-white/5 hover:text-white"}`
            }
          >
            <Icon size={19} />
            {open && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>
      <div className="p-3 border-t border-white/10 space-y-1">
        <button
          onClick={() => dispatch(logout())}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-slate-300 hover:bg-white/5"
        >
          <LogOut size={19} />
          {open && "Logout"}
        </button>
        <div className="text-[10px] text-slate-500 px-3 pt-2">
          v2.0 • Prototype
        </div>
      </div>
    </aside>
  );
}
