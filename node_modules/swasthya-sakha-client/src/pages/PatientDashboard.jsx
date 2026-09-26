import React, { useEffect, useState, useRef } from 'react';
import { Mic, Square, FileText, CalendarDays, Languages, CheckCircle2, Loader2, AlertCircle, Save } from 'lucide-react';
import StatCard from '../components/StatCard';
import SectionHeader from '../components/SectionHeader';
import Badge from '../components/Badge';
import { appointments } from '../data';
import { SymptomSelector, TriageCard, QUICK_SYMPTOMS } from '../components/EmergencyTriage';
import { api } from "../api";
import { saveOfflineAssessment } from "../utils/offlineSync";
import { useDispatch } from "react-redux";
import { setToast } from "../store/uiSlice";
import { useNavigate } from 'react-router-dom';


// Safely strip trailing /api if present to avoid double '/api/api/...'
const rawUrl = import.meta.env.VITE_API_URL || 'https://swasthya-sakha-web.onrender.com';
const API_BASE_URL = rawUrl.replace(/\/api\/?$/, '');
export default function PatientDashboard({ subpage, loggedInUser }) {

  const dispatch = useDispatch();
  const [lang, setLang] = useState('en-IN');
  const [listening, setListening] = useState(false);
  const [text, setText] = useState('');
  const [tab, setTab] = useState(subpage || 'overview');

  const navigate = useNavigate()

 
  const recognitionRef = useRef(null);


  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  // Onboarding Form Local State Variables
  const [onboardingForm, setOnboardingForm] = useState({
    phone: loggedInUser?.phone || "",
    address: loggedInUser?.address || "",
    bloodGroup: loggedInUser?.bloodGroup || "",
    heightCm: loggedInUser?.heightCm || "",
    weightKg: loggedInUser?.weightKg || "",
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [isSkipped, setIsSkipped] = useState(false);

  useEffect(() => { setTab(subpage || 'overview'); }, [subpage]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const isProfileIncomplete = (loggedInUser?.isProfileComplete === false || loggedInUser?.isProfileComplete === undefined) && !isSkipped;

  const handleFormInputChange = (e) => {
    setOnboardingForm({ ...onboardingForm, [e.target.name]: e.target.value });
  };

  const handleOnboardingSubmit = async (e) => {
  e.preventDefault();
  setSavingProfile(true);

  try {
    const data = await api("/profile/update", {
      method: "PUT",
      body: JSON.stringify({
        username: loggedInUser.username,
        role: loggedInUser.role,
        ...onboardingForm
      })
    });

    const updatedUser = data.user || data;

    const session = {
      token: JSON.parse(localStorage.getItem("ss_auth") || "{}").token,
      user: updatedUser
    };
    
    localStorage.setItem("ss_auth", JSON.stringify(session));

    dispatch(setToast({ type: 'success', message: 'Medical profile activated successfully!' }));
    
    window.location.reload();
  } catch (err) {
    console.error(err);
    dispatch(setToast({ type: 'error', message: err.message || 'Profile sync failed.' }));
  } finally {
    setSavingProfile(false);
  }
};


  if (isProfileIncomplete) {
    
    return (
      <div className="max-w-xl mx-auto my-10 bg-white p-8 rounded-2xl border border-gray-200/60 shadow-sm space-y-6">
        <div>
          <h2 className="text-2xl font-black text-[#0b2239]">Complete Initial Profile Details</h2>
          <p className="text-sm text-gray-500 mt-1">Please provide these basic healthcare parameters to finish setting up your account tracker access.</p>
        </div>

        {/* Read-only verification blocks */}
        <div className="bg-[#eef3f8] p-4 rounded-xl space-y-2 text-sm text-[#0b2239]">
        <div>
          <strong>Full Name:</strong> 
          <span className="ml-2 font-medium">{loggedInUser?.name || "Not Found"}</span>
        </div>
        <div>
          <strong>ABHA Address:</strong> 
          <span className="ml-2 font-mono text-teal-700">{loggedInUser?.abhaAddress || loggedInUser?.abhaId || "Not Found"}</span>
        </div>
        <div>
          <strong>Gender Designation:</strong> 
          <span className="ml-2 font-medium">{loggedInUser?.gender || "Not Found"}</span>
        </div>
      </div>

        <form onSubmit={handleOnboardingSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-[#0b2239] mb-1">Phone Number</label>
            <input type="tel" name="phone" value={onboardingForm.phone} onChange={handleFormInputChange} required className="w-full px-4 py-2.5 bg-[#eef3f8] border border-transparent rounded-xl focus:bg-white focus:border-teal-500 outline-none text-sm transition-all" placeholder="e.g. +91 9876543210" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#0b2239] mb-1">Residential Address</label>
            <textarea name="address" value={onboardingForm.address} onChange={handleFormInputChange} required rows="2" className="w-full px-4 py-2.5 bg-[#eef3f8] border border-transparent rounded-xl focus:bg-white focus:border-teal-500 outline-none text-sm transition-all" placeholder="Your full home address..." />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#0b2239] mb-1">Blood Group</label>
              <select name="bloodGroup" value={onboardingForm.bloodGroup} onChange={handleFormInputChange} className="w-full px-3 py-2.5 bg-[#eef3f8] border border-transparent rounded-xl focus:bg-white focus:border-teal-500 outline-none bg-white text-sm">
                <option value="">Select</option>
                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#0b2239] mb-1">Height (cm)</label>
              <input type="number" name="heightCm" value={onboardingForm.heightCm} onChange={handleFormInputChange} className="w-full px-3 py-2.5 bg-[#eef3f8] border border-transparent rounded-xl focus:bg-white focus:border-teal-500 outline-none text-sm" placeholder="170" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#0b2239] mb-1">Weight (kg)</label>
              <input type="number" name="weightKg" value={onboardingForm.weightKg} onChange={handleFormInputChange} className="w-full px-3 py-2.5 bg-[#eef3f8] border border-transparent rounded-xl focus:bg-white focus:border-teal-500 outline-none text-sm" placeholder="60" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
            <button 
              type="submit" 
              disabled={savingProfile} 
              className="bg-[#0b2239] text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-[#153554] transition-colors disabled:bg-gray-400 text-sm shadow-sm"
            >
              {savingProfile ? <Loader2 className="animate-spin" size={16} /> : "Save Metrics"}
            </button>

            
            <button 
              type="button" 
              onClick={() => setIsSkipped(true)}
              className="border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 py-3 rounded-xl font-semibold text-sm transition-colors shadow-2xs"
            >
              Skip for Now
            </button>
          </div>
        </form>
      </div>
    );
  }

  // Handle language change + translation
  const handleLanguageChange = async (targetLang) => {
    if (listening) stopSpeech();

    const sourceCode = lang.split('-')[0];
    const targetCode = targetLang.split('-')[0];

    setLang(targetLang);

    if (text.trim() && sourceCode !== targetCode) {
      setIsTranslating(true);
      setStatusMsg('Translating text...');

      try {
        const res = await fetch(
          `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceCode}|${targetCode}`
        );

        const data = await res.json();

        if (data?.responseData?.translatedText) {
          setText(data.responseData.translatedText);
          setStatusMsg('');
        }
      } catch (err) {
        console.error('Translation error:', err);
        setStatusMsg('Translation failed. You can type directly.');
      } finally {
        setIsTranslating(false);
      }
    }
  };

  const toggleSymptom = (id) => {
    setSelectedSymptoms((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const resetSymptoms = () => setSelectedSymptoms([]);

  const totalScore = selectedSymptoms.reduce((sum, id) => {
    const item = QUICK_SYMPTOMS.find((s) => s.id === id);
    return sum + (item ? item.score : 0);
  }, 0);

  const handleSubmitTriage = async () => {
    if (!text.trim() && selectedSymptoms.length === 0) {
      setStatusMsg('Please select symptoms or speak/type before submitting.');
      return;
    }
   const payload = {
      symptomsText: text,
      selectedSymptoms,
      totalScore,
      language: lang,
      timestamp: new Date().toISOString()
    };
    setSubmitting(true);
    setStatusMsg('');
// 1. Check if Offline
    if (!navigator.onLine) {
      saveOfflineAssessment(payload);
      setStatusMsg('📶 Offline: Record Sumbitted to local storage');
      dispatch(setToast({ type: 'info', message: 'Offline assessment saved locally!' }));
      setText('');
      resetSymptoms();
      setSubmitting(false);
      return;
    }

    // 2. Try Online Submission
    try {
      const response = await fetch(`${API_BASE_URL}/api/triage/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symptomsText: text,
          selectedSymptoms,
          totalScore,
          language: lang
        })
      });

      const data = await response.json();

      if (data.success) {
        setStatusMsg('Triage recorded successfully!');
        dispatch(setToast({ type: 'success', message: 'Triage submitted successfully!' }));
        setText('');
        resetSymptoms();
      } else {
        setStatusMsg('Failed to record triage.');
      }
    } catch (err) {
    console.error('Triage fetch error detail:', err);
    setStatusMsg(`Error: ${err.message || 'Unable to reach backend'}`);
  } finally {
    setSubmitting(false);
  }
  };

  // Robust Multilingual Web Speech Handler
  const startSpeech = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setStatusMsg('Speech recognition requires Google Chrome, Microsoft Edge, or Safari.');
      return;
    }

    // Stop active instance if running
    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch (e) {}
    }

    const recognition = new SpeechRecognition();
    recognition.lang = lang; // 'en-IN', 'hi-IN', or 'mr-IN'
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setListening(true);
      setStatusMsg(
        `🎙️ Listening in ${
          lang === 'hi-IN'
            ? 'Hindi'
            : lang === 'mr-IN'
              ? 'Marathi'
              : 'English'
        }... Speak now.`
      );
    };

    recognition.onresult = (event) => {
      let liveTranscript = '';

      for (let i = 0; i < event.results.length; i++) {
        liveTranscript += event.results[i][0].transcript;
      }

      setText(liveTranscript);
    };

    recognition.onerror = (event) => {
      console.error('Speech error:', event.error);
      setListening(false);

      if (event.error === 'not-allowed') {
        setStatusMsg(
          '❌ Microphone blocked. Click the lock/cam icon in the browser address bar to allow mic access.'
        );
      } else if (event.error === 'no-speech') {
        setStatusMsg('⚠️ No speech detected. Please speak closer to the mic.');
      } else if (event.error === 'network') {
        setStatusMsg('⚠️ Network error connecting to speech engine.');
      } else {
        setStatusMsg(`Speech error: ${event.error}`);
      }
    };

    recognition.onend = () => {
      setListening(false);
    };

    try {
      recognition.start();
      recognitionRef.current = recognition;
    } catch (err) {
      console.error('Speech start exception:', err);
      setStatusMsg('Failed to initialize microphone.');
    }
  };

  const stopSpeech = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    setListening(false);
  };

  if (tab === 'history')
    return (
      <Page title="Medical History">
        <div className="grid lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 card p-5">
            <SectionHeader title="Medical timeline" sub="Recent encounters and prescriptions" />

            <div className="space-y-4">
              {[
                '12 Aug 2026 — District Hospital · Follow-up',
                '28 Jul 2026 — PHC Andheri · Consultation',
                '11 Jun 2026 — Diagnostics · CBC + Hb'
              ].map((x) => (
                <div key={x} className="flex gap-4 p-4 bg-slate-50 rounded-xl">
                  <div className="w-2 h-2 rounded-full bg-teal-600 mt-2" />

                  <div>
                    <b className="text-sm">{x}</b>
                    <p className="text-xs text-muted mt-1">
                      Clinical notes, reports and e-prescription available to authorized care team.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-5">
            <SectionHeader title="Documents" />

            <div className="space-y-2">
              {[
                'Lab report · CBC',
                'Prescription · 12 Aug',
                'Referral · Cardiology'
              ].map((x) => (
                <div key={x} className="border rounded-xl p-3 flex items-center gap-3">
                  <FileText size={17} className="text-teal-700" />
                  <span className="text-sm">{x}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Page>
    );

  if (tab === 'appointments')
    return (
      <Page title="Appointments & Follow-up">
        <div className="card p-5">
          <SectionHeader
            title="Your care schedule"
            sub="Appointments, referrals and follow-up actions"
          />

          <div className="space-y-3">
            {appointments.slice(0, 3).map((a) => (
              <div
                key={a.id || a.time}
                className="border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <b>{a.time} · {a.doctor}</b>
                  <p className="text-xs text-muted mt-1">{a.reason}</p>
                </div>

                <Badge tone={a.status === 'Waiting' ? 'amber' : 'green'}>
                  {a.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </Page>
    );

  return (
    <Page title="Patient Dashboard">
      <div className="grid md:grid-cols-3 gap-4">
        <StatCard
          label="Next appointment"
          value="10:30 AM"
          sub="Dr. Meera Shah · 12 Sep"
          icon={CalendarDays}
        />

        <StatCard
          label="Medical records"
          value="12"
          sub="Last updated 12 Aug"
          icon={FileText}
          tone="blue"
        />

        <StatCard
          label="Follow-up"
          value="Due in 8 days"
          sub="Cardiology referral"
          icon={CheckCircle2}
          tone="amber"
        />
      </div>

      <SymptomSelector
        selectedSymptoms={selectedSymptoms}
        toggleSymptom={toggleSymptom}
        resetSymptoms={resetSymptoms}
      />

      <div className="grid lg:grid-cols-[1.35fr_.65fr] gap-5 mt-5">
        <div className="card p-5">
          <SectionHeader
            title="Multilingual symptom intake"
            sub="Speak or type in Marathi, Hindi or English. Speech is converted to text live."
          />

          <div className="flex gap-2 mb-4 items-center">
            {[
              ['en-IN', 'English'],
              ['hi-IN', 'हिन्दी'],
              ['mr-IN', 'मराठी']
            ].map(([v, l]) => (
              <button
                key={v}
                onClick={() => handleLanguageChange(v)}
                disabled={isTranslating}
                className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  lang === v
                    ? 'bg-teal-700 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Languages size={14} className="inline mr-1" />
                {l}
              </button>
            ))}

            {isTranslating && (
              <span className="text-xs text-teal-600 font-medium flex items-center gap-1 ml-2">
                <Loader2 size={13} className="animate-spin" />
                Translating...
              </span>
            )}
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={isTranslating}
            placeholder="Type your symptoms here or click the mic button below to speak..."
            className="w-full min-h-40 bg-slate-50 border rounded-2xl p-4 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-600 resize-y disabled:opacity-60"
          />

          <div className="flex flex-col items-center gap-3 mt-4">
            <div className="flex justify-center">
              {listening ? (
                <button
                  onClick={stopSpeech}
                  className="w-14 h-14 rounded-full bg-rose-500 text-white grid place-items-center shadow-lg animate-pulse"
                >
                  <Square size={19} />
                </button>
              ) : (
                <button
                  onClick={startSpeech}
                  className="w-14 h-14 rounded-full bg-teal-700 hover:bg-teal-800 text-white grid place-items-center shadow-lg transition-all"
                >
                  <Mic size={23} />
                </button>
              )}
            </div>

            <p className="text-center text-[11px] font-medium text-slate-600">
              {listening ? 'Listening... Speak now' : 'Tap the microphone to speak'}
            </p>

            <button
              onClick={handleSubmitTriage}
              disabled={submitting || isTranslating}
              className="w-full mt-2 py-2.5 px-4 bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs rounded-xl shadow-sm transition-all disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Symptoms & Triage'}
            </button>

            {statusMsg && (
              <p className="text-xs text-center font-medium text-teal-800 bg-teal-50 px-3 py-1.5 rounded-lg border border-teal-100 flex items-center gap-1 justify-center">
                <AlertCircle size={14} />
                {statusMsg}
              </p>
            )}
          </div>
        </div>

        <TriageCard totalScore={totalScore} />
      </div>
    </Page>
  );
}

function Page({ title, children }) {
  return <div>{children}</div>;
}