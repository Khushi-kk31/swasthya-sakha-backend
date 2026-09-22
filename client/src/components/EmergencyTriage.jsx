import React from 'react';
import { 
  Flame, Wind, Activity, HeartPulse, AlertTriangle, ShieldCheck, RotateCcw 
} from 'lucide-react';
import Badge from './Badge';

export const QUICK_SYMPTOMS = [
  { id: 'fever', label: 'Fever', mr: 'ताप', score: 1, icon: Flame, color: 'hover:border-amber-400 hover:bg-amber-50 text-amber-600' },
  { id: 'cough', label: 'Cough', mr: 'खोकला', score: 1, icon: Wind, color: 'hover:border-indigo-400 hover:bg-indigo-50 text-indigo-600' },
  { id: 'breath', label: 'Shortness Breath', mr: 'श्वास त्रास', score: 3, icon: Activity, color: 'hover:border-rose-400 hover:bg-rose-50 text-rose-600' },
  { id: 'chest', label: 'Chest Pain', mr: 'दुखणे', score: 4, icon: HeartPulse, color: 'hover:border-rose-500 hover:bg-rose-100 text-rose-700' }
];

export function SymptomSelector({ selectedSymptoms, toggleSymptom, resetSymptoms }) {
  return (
    <div className="card p-5 mt-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-muted font-medium">
          Tap any symptom icon for instant emergency clinical triage calculation
        </p>
        {selectedSymptoms.length > 0 && (
          <button 
            onClick={resetSymptoms}
            className="text-xs font-semibold text-rose-600 hover:text-rose-800 flex items-center gap-1"
          >
            <RotateCcw size={13} /> Reset
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {QUICK_SYMPTOMS.map((item) => {
          const Icon = item.icon;
          const isSelected = selectedSymptoms.includes(item.id);
          return (
            <button
              key={item.id}
              onClick={() => toggleSymptom(item.id)}
              className={`p-5 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-2 text-center ${
                isSelected 
                  ? 'border-teal-600 bg-teal-50/80 shadow-md scale-[1.02]' 
                  : `border-slate-200 bg-white ${item.color}`
              }`}
            >
              <div className={`w-12 h-12 rounded-full grid place-items-center ${
                isSelected ? 'bg-teal-600 text-white' : 'bg-slate-100'
              }`}>
                <Icon size={24} />
              </div>
              <div>
                <b className="block text-sm text-slate-800">{item.label}</b>
                <span className="text-xs text-slate-500">({item.mr})</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function TriageCard({ totalScore }) {
  let triageConfig = {
    badge: 'STANDARD CARE ROUTE',
    title: 'STABLE / NORMAL TRIAGE',
    desc: 'Reported symptoms are within normal clinical thresholds. Standard appointment scheduled.',
    containerStyle: 'border-emerald-300 bg-emerald-50/40 text-emerald-900',
    badgeTone: 'green',
    icon: ShieldCheck,
    iconColor: 'text-emerald-600'
  };

  if (totalScore >= 4) {
    triageConfig = {
      badge: 'CRITICAL EMERGENCY',
      title: 'HIGH-RISK EMERGENCY TRIAGE',
      desc: 'Critical severity threshold reached! High-risk alert triggered and emergency dispatch notified.',
      containerStyle: 'border-rose-400 bg-rose-50 text-rose-950 animate-pulse',
      badgeTone: 'red',
      icon: AlertTriangle,
      iconColor: 'text-rose-600'
    };
  } else if (totalScore >= 2) {
    triageConfig = {
      badge: 'PRIORITY CARE ROUTE',
      title: 'MODERATE / URGENT TRIAGE',
      desc: 'Elevated symptom score detected. Health Worker priority intervention requested.',
      containerStyle: 'border-amber-300 bg-amber-50/50 text-amber-950',
      badgeTone: 'amber',
      icon: AlertTriangle,
      iconColor: 'text-amber-600'
    };
  }

  const TriageIcon = triageConfig.icon;

  return (
    <div className={`card p-6 border-2 rounded-2xl flex flex-col justify-between ${triageConfig.containerStyle}`}>
      <div>
        <div className="flex items-center justify-between gap-2 mb-4">
          <Badge tone={triageConfig.badgeTone}>{triageConfig.badge}</Badge>
          <TriageIcon size={22} className={triageConfig.iconColor} />
        </div>

        <h3 className="font-extrabold text-lg tracking-tight uppercase">
          {triageConfig.title}
        </h3>

        <div className="mt-4 bg-white/80 backdrop-blur border border-slate-200/80 rounded-xl p-4 space-y-2 text-xs">
          <div className="flex items-center justify-between border-b pb-2">
            <span className="text-slate-500 font-medium">Deterministic MEWS Output</span>
            <b className="font-bold text-slate-800">MEWS Score {totalScore}</b>
          </div>
          <p className="text-slate-600 leading-relaxed mt-1">
            {triageConfig.desc}
          </p>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
        <span className="flex items-center gap-1 font-semibold">
          <ShieldCheck size={14} className="text-teal-700" /> Auto-Triage Rule Engine
        </span>
        <span className="font-semibold text-slate-700">ABHA Ledger Connected</span>
      </div>
    </div>
  );
}