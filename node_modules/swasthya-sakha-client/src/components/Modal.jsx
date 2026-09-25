import React from 'react';
import {X} from 'lucide-react';
export default function Modal({open,onClose,title,children}){if(!open)return null;return <div className="fixed inset-0 z-50 bg-slate-900/45 p-4 grid place-items-center"><div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-auto"><div className="flex items-center justify-between p-5 border-b border-slate-100"><h3 className="font-bold">{title}</h3><button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100"><X size={18}/></button></div><div className="p-5">{children}</div></div></div>}
