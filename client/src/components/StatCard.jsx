import React from "react";
export default function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  tone = "teal",
  
}) {
  const tones = {
    teal: "bg-teal-50 text-teal-700",
    blue: "bg-blue-50 text-blue-700",
    amber: "bg-amber-50 text-amber-700",
    rose: "bg-rose-50 text-rose-700",
    slate: "bg-slate-100 text-slate-700",
  };
  return (
    <div className="card p-5">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-muted">{label}</p>
          <p className="text-2xl font-bold mt-1 text-ink">{value}</p>
          {sub && <p className="text-xs text-muted mt-1">{sub}</p>}
        </div>
        {Icon && (
          <div
            className={`w-10 h-10 rounded-xl grid place-items-center ${tones[tone] || tones.teal}`}
          >
            <Icon size={19} />
          </div>
        )}
      </div>
    </div>
  );
}
