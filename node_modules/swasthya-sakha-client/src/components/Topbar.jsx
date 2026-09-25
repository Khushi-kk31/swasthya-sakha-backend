import React from 'react';
import { Menu, Bell, Search } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleSidebar } from '../store/uiSlice';
import OfflineBadge from './OfflineBadge';

export default function Topbar({ title = 'Dashboard' }) {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 flex items-center justify-between sticky top-0 z-30">
      {/* Left Section: Menu Toggle & Title */}
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
            {user?.role === 'districtAdmin' ? 'District command centre' : 'Connected care workspace'}
          </p>
        </div>
      </div>

      {/* Right Section: Offline Badge, Notifications & User Avatar */}
      <div className="flex items-center gap-3">
        <OfflineBadge />
        
        <button 
          className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 relative transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="w-9 h-9 rounded-full bg-emerald-600 text-white font-semibold flex items-center justify-center text-sm shadow-sm">
            {(user?.name || 'U').slice(0, 1).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
}