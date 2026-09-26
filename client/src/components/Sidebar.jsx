import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
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
} from "lucide-react";

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
  const navigate = useNavigate();

  // 💡 1. Safely read user session state metrics directly from localStorage
  const cachedAuth = localStorage.getItem("ss_auth");
  const user = cachedAuth ? JSON.parse(cachedAuth).user : null;

  // 💡 2. Dynamic fallback for your width control flag logic (Defaults to open width panel layout)
  const open = true; 

  const handleLogoutAction = () => {
    // 💡 3. Standard clear function to trigger website logouts without Redux dependencies
    localStorage.removeItem("ss_auth");
    navigate("/login");
    window.location.reload(); // Wipes clean current cache values
  };

  const items = menu[user?.role] || [];

  return (
    <aside
      className={`${open ? "w-64" : "w-20"} shrink-0 bg-[#0b2239] text-white min-h-screen transition-all duration-200 hidden md:flex flex-col border-r border-slate-800`}
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
            end={to === "/dashboard"} // Ensures precise highlight match selection loops
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-3 rounded-xl text-sm transition-all ${
                isActive 
                  ? "bg-white/10 text-teal-300 font-bold" 
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`
            }
          >
            <Icon size={19} />
            {open && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-white/10 space-y-1">
        {/* 💡 4. Updated Logout button trigger handler linking logic */}
        <button
          onClick={handleLogoutAction}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-rose-400 hover:bg-rose-500/10 font-medium transition-all"
        >
          <LogOut size={19} className="text-rose-400" />
          {open && "Logout Account"}
        </button>

        <div className="text-[10px] text-slate-500 px-3 pt-2">
          v2.0 • Prototype
        </div>
      </div>
    </aside>
  );
}
