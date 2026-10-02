import React from "react";
import { Menu, Bell, Search } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toggleSidebar } from "../store/uiSlice";
import OfflineBadge from "./OfflineBadge";
import { useNavigate } from "react-router-dom";

export default function Topbar({ title = "Dashboard" }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
          aria-label="Toggle Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-lg font-semibold text-slate-800">{title}</h1>
          <p className="text-xs text-slate-500">
            {user?.role === "districtAdmin"
              ? "District command centre"
              : "Connected care workspace"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <OfflineBadge />

        <button
          className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 relative transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
        </button>

        <div
          onClick={() => navigate("/dashboard/profile")}
          className="relative group flex items-center gap-2 pl-2 border-l border-slate-200 cursor-pointer"
        >
          <div className="w-9 h-9 rounded-full bg-emerald-600 text-white font-semibold flex items-center justify-center text-sm shadow-sm">
            {(user?.name || "U").slice(0, 1).toUpperCase()}
          </div>

          <span
            className="absolute right-0 top-12 whitespace-nowrap
               bg-slate-800 text-white text-xs px-3 py-1.5 rounded-lg
               opacity-0 invisible group-hover:opacity-100 group-hover:visible
               transition-all duration-200 shadow-md z-50"
          >
            View Profile
          </span>
        </div>
      </div>
    </header>
  );
}
