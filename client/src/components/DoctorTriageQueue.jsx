import React, { useEffect, useState } from "react";
import { Clock, RefreshCw } from "lucide-react";

const VITE_API_URL = import.meta.env.VITE_API_URL;

export default function DoctorTriageQueue({ onQueueUpdate }) {
  const [triageList, setTriageList] = useState([]);
  const [loading, setLoading] = useState(false);

  // Helper function to rank urgency: RED = 1, YELLOW = 2, GREEN = 3
  const getPriorityWeight = (level) => {
    const l = String(level || "").toUpperCase();
    if (l.includes("RED")) return 1;
    if (l.includes("YELLOW") || l.includes("AMBER")) return 2;
    if (l.includes("GREEN")) return 3;
    return 4;
  };

  const fetchTriageData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${VITE_API_URL}/triage/all`);
      if (!res.ok) return;
      const json = await res.json();

      const rawList = Array.isArray(json)
        ? json
        : json?.success && Array.isArray(json?.data)
          ? json.data
          : [];

      // Sort Order: 1. Priority (RED > YELLOW > GREEN) 2. FIFO (Earliest submission first)
      const sorted = [...rawList].sort((a, b) => {
        const wA = getPriorityWeight(a?.triageLevel);
        const wB = getPriorityWeight(b?.triageLevel);

        if (wA !== wB) return wA - wB;

        const timeA = new Date(a?.createdAt || 0).getTime();
        const timeB = new Date(b?.createdAt || 0).getTime();
        return timeA - timeB; // FIFO order
      });

      setTriageList(sorted);

      // Pass updated list back to parent dashboard for top stat cards
      if (typeof onQueueUpdate === "function") {
        onQueueUpdate(sorted);
      }
    } catch (err) {
      console.error("Failed to load triage queue:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTriageData();
    const interval = setInterval(fetchTriageData, 4000); // Live poll every 4s
    return () => clearInterval(interval);
  }, []);

  const getBadgeStyle = (level) => {
    const l = String(level || "").toUpperCase();
    if (l.includes("RED")) return "bg-rose-100 text-rose-700 border-rose-300";
    if (l.includes("YELLOW") || l.includes("AMBER"))
      return "bg-amber-100 text-amber-700 border-amber-300";
    return "bg-emerald-100 text-emerald-700 border-emerald-300";
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return "Just now";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return "Just now";
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "Just now";
    }
  };

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <b className="text-base text-slate-800">Emergency Triage Queue</b>
          <p className="text-xs text-slate-500">
            Real-time incoming MEWS score assessments (RED → YELLOW → GREEN)
          </p>
        </div>
        <button
          onClick={fetchTriageData}
          className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {!triageList || triageList.length === 0 ? (
        <p className="text-xs text-slate-500 text-center py-6">
          No triage records found.
        </p>
      ) : (
        <div className="space-y-3">
          {triageList.map((item, idx) => (
            <div
              key={item?._id || item?.id || idx}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-center gap-4">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getBadgeStyle(item?.triageLevel)}`}
                  >
                    {item?.triageLevel || "GREEN"} (MEWS: {item?.mewsScore ?? 0}
                    )
                  </span>

                  <div className="flex gap-3">
                    <p className="text-xs font-semibold">
                      {new Date(item.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>

                    <p className="text-xs text-slate-500">
                      {new Date(item.createdAt).toLocaleTimeString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-700 font-medium">
                  {item?.symptomsText ||
                    item?.parsedText ||
                    "No voice transcript provided."}
                </p>

                {Array.isArray(item?.selectedSymptoms) &&
                  item.selectedSymptoms.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {item.selectedSymptoms.map((sym, sIdx) => (
                        <span
                          key={sIdx}
                          className="bg-slate-200 text-slate-700 text-[10px] px-2 py-0.5 rounded"
                        >
                          {sym}
                        </span>
                      ))}
                    </div>
                  )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
