import React from "react";
export default function SectionHeader({ title, sub, action }) {
  return (
    <div className="flex items-start justify-between gap-3 mb-4">
      <div>
        <h2 className="font-bold text-base text-ink">{title}</h2>
        {sub && <p className="text-xs text-muted mt-1">{sub}</p>}
      </div>
      {action}
    </div>
  );
}
