import React from 'react';
export default function Badge({children,tone='slate'}){const m={green:'bg-emerald-50 text-emerald-700',red:'bg-rose-50 text-rose-700',amber:'bg-amber-50 text-amber-700',blue:'bg-blue-50 text-blue-700',slate:'bg-slate-100 text-slate-600'};return <span className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold ${m[tone]||m.slate}`}>{children}</span>}
