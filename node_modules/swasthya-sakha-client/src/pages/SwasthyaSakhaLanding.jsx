import React, { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Heart,
  Users,
  ShieldCheck,
  Leaf,
  Mic,
  QrCode,
  Video,
  MapPin,
  FileText,
  Link2,
  Siren,
  Database,
  LockKeyhole,
  Radio,
  Stethoscope,
  Building2,
  Ambulance,
  Sparkles,
  Play,
  Sun,
  Moon,
} from "lucide-react";
import heroImage from "../images/heroImage.png";
import image2 from "../images/image2.png";
import image2Light from "../images/image2Light.png";
import heroImageLight from "../images/heroImageLight.png";
import phase1 from "../images/phase1Img.png";
import phase2 from "../images/phase2.png";
import phase3 from "../images/phase3.png";
import phase4 from "../images/phase4.png";

const features = [
  [
    Users,
    "Role-Based Access",
    "Patients, health workers, doctors and administrators",
  ],
  [Mic, "Voice Input", "Hindi, Marathi & English speech-to-text"],
  [
    QrCode,
    "ABHA Integration",
    "QR-based registration and quick access to records",
  ],
  [
    Video,
    "Teleconsultation",
    "High-quality, low-bandwidth video/audio consultation",
  ],
  [
    MapPin,
    "GIS Resource Discovery",
    "Find nearby hospitals, diagnostics, medicines and available beds",
  ],
  [
    FileText,
    "Digital Health Records",
    "Longitudinal and portable patient records",
  ],
  [
    Link2,
    "Referrals & Tracking",
    "Track referrals and follow-ups in real time",
  ],
  [
    Siren,
    "Emergency Alerts",
    "Identify critical cases, assign ambulances & ICU",
  ],
];

// Add your own images by replacing each `img: null` in the four phase objects.
const phases = [
  {
    n: "PHASE 1",
    title: "ASHA Multilingual Field Triage",
    status: "COMPLETED (100%)",
    tone: "green",
    progress: 100,
    desc: "Zero-connectivity diagnostic tool using native Web Speech API & client-side MEWS risk engine.",
    bullets: [
      "ABHA ID QR Regex parser & demographic autofill",
      "Web Speech API with regional Marathi/Hindi intent matching",
      "Deterministic MEWS rule matrix (Green/Yellow/Red)",
      "IndexedDB offline form persistence (Dexie.js)",
    ],
    tags: ["React", "Dexie.js", "Web Speech API", "Tailwind CSS"],
    img: phase1,
    side: "right",
    icon: Mic,
  },
  {
    n: "PHASE 2",
    title: "Doctor Teleconsult Hub",
    status: "COMPLETED (80%)",
    tone: "purple",
    progress: 80,
    desc: "Central medical queue with adaptive audio streaming and inventory-linked prescription builder.",
    bullets: [
      "Priority Auto-Sorting algorithm (Severity > FIFO timestamp)",
      "Dynamic WebRTC 2G fallback (video drop + 12kbps audio clamp)",
      "Live pharmacy inventory stock check prior to e-prescription issuance",
    ],
    tags: ["WebRTC Stats API", "Opus Codec", "Recharts", "Lucide React"],
    img: phase2, // Add your Phase 2 image here
    side: "left",
    icon: Video,
  },
  {
    n: "PHASE 3",
    title: "Live GIS & Resource Inventory Map",
    status: "IN PROGRESS (70%)",
    tone: "amber",
    progress: 70,
    desc: "Interactive regional spatial view mapping bed availability, doctors on duty, and medicine stocks.",
    bullets: [
      "District map node selection (PHC vs. District Hospital)",
      "Real-time bed availability & ambulance standby counters",
      "Visual stock gauges for essential antibiotics & fever meds",
    ],
    tags: ["Leaflet.js / GeoJSON", "State Sync Engine", "Tailwind Progress"],
    img: phase3, // Add your Phase 3 image here
    side: "right",
    icon: MapPin,
  },
  {
    n: "PHASE 4",
    title: "Emergency Dispatch Admin",
    status: "IN PROGRESS (50%)",
    tone: "red",
    progress: 50,
    desc: "Trauma escalation control center for pre-booking hospital assets and tracking 108 fleets.",
    bullets: [
      "Instant RED emergency referral banner reception",
      "One-click ICU bed pre-reservation & specialist auto-alert",
      "Live 108 ambulance GPS coordinate & ETA telemetry",
    ],
    tags: ["WebSockets Telemetry", "LocalStorage Event Sync"],
    img: phase4, // Add your Phase 4 image here
    side: "left",
    icon: Ambulance,
  },
];

const security = [
  [
    Database,
    "IndexedDB Persistence",
    "Stores patient records locally with AES-256 encryption.",
  ],
  [
    LockKeyhole,
    "Deterministic MEWS Logic",
    "Client-side clinical risk scoring (Red/Yellow/Green).",
  ],
  [
    Radio,
    "Dynamic WebRTC Telemetry",
    "Adaptive bitrate to 12 kbps audio on congested 2G networks.",
  ],
];

const tone = {
  green: "border-emerald-400/40 bg-emerald-400/10 text-emerald-300",
  purple: "border-violet-400/40 bg-violet-400/10 text-violet-300",
  amber: "border-amber-400/40 bg-amber-400/10 text-amber-300",
  red: "border-rose-400/40 bg-rose-400/10 text-rose-300",
  blue: "border-sky-400/40 bg-sky-400/10 text-sky-300",
};
function Reveal({ children, className = "", delay = 0, direction = "up" }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
          observer.unobserve(el);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal-on-scroll reveal-${direction} ${className}`}
      style={{ "--reveal-delay": `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function Badge({ children, t = "green" }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-bold tracking-wide ${tone[t]}`}
    >
      {children}
    </span>
  );
}
function Label({ children, t = "purple" }) {
  return (
    <Badge t={t}>
      <Sparkles size={11} className="mr-1.5" />
      {children}
    </Badge>
  );
}
function Feature({ Icon, title, desc }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0b1730]/80 p-5 transition hover:-translate-y-1 hover:bg-[#0f1d3d]">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
        <Icon size={21} />
      </div>
      <h3 className="text-sm font-bold text-white">{title}</h3>
      <p className="mt-2 text-xs leading-5 text-slate-400">{desc}</p>
    </div>
  );
}
function Phase({ p, isLight }) {  
  const Icon = p.icon;
  const content = (
    <div className="flex-1 p-6 sm:p-8">
      <div className="flex flex-wrap items-center gap-3">
        <span className="rounded-xl bg-indigo-500/20 px-4 py-2 text-[11px] font-extrabold tracking-widest text-indigo-200">
          {p.n}
        </span>
        <h3 className="text-xl font-extrabold tracking-tight text-white sm:text-2xl">
          {p.title}
        </h3>
        <Badge t={p.tone}>{p.status}</Badge>
      </div>
      <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className={`h-full rounded-full ${p.tone === "green" ? "bg-emerald-400" : p.tone === "purple" ? "bg-violet-400" : p.tone === "amber" ? "bg-amber-400" : "bg-rose-400"}`}
          style={{ width: `${p.progress}%` }}
        />
      </div>
      <p className="mt-5 text-sm leading-6 text-slate-300">{p.desc}</p>
      <p className="mb-3 mt-6 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
        Key functional features
      </p>
      <ul className="space-y-3">
        {p.bullets.map((x) => (
          <li key={x} className="flex gap-3 text-sm text-slate-200">
            <CheckCircle2
              size={17}
              className="mt-0.5 shrink-0 text-emerald-400"
            />
            <span>{x}</span>
          </li>
        ))}
      </ul>
      <div className="mt-6 flex flex-wrap gap-2 border-t border-white/10 pt-5">
        {p.tags.map((x) => (
          <span
            key={x}
            className="rounded-md border border-white/10 bg-[#111d35] px-3 py-1.5 text-[10px] text-slate-400"
          >
            {x}
          </span>
        ))}
      </div>
    </div>
  );
  const image = (
    <div className="relative min-h-[280px] flex-1 overflow-hidden bg-[#071229] sm:min-h-[360px]">
      {p.img ? (
        <img
          src={p.img}
          alt={`${p.n} - ${p.title}`}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center border border-dashed border-white/15 bg-gradient-to-br from-[#0b1730] to-[#071229]">
          <div className="px-6 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-emerald-300">
              <Icon size={25} />
            </div>
            <p className="mt-4 text-sm font-bold text-white">Add {p.n} Image</p>
            <p className="mt-1 text-xs text-slate-500">Replace <span className="text-slate-300">img: null</span> in the phase data</p>
          </div>
        </div>
      )}
      <div className="absolute left-5 top-5 flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 bg-[#08152e]/75 text-emerald-300 backdrop-blur">
        <Icon size={21} />
      </div>
      <div
  className={`absolute bottom-5 left-5 right-5 rounded-xl border p-4 backdrop-blur ${
    isLight
      ? "border-emerald-200 bg-emerald-50"
      : "border-white/10 bg-[#071229]/75"
  }`}
>
  <p
    className={`text-xs font-semibold ${
      isLight ? "text-emerald-900" : "text-white"
    }`}
  >
    {p.title}
  </p>

  <p
    className={`mt-1 text-[11px] ${
      isLight ? "text-emerald-700" : "text-slate-400"
    }`}
  >
    Swasthya Sakha implementation module
  </p>
</div>
    </div>
  );
  return (
    <article className="overflow-hidden rounded-[28px] border border-white/10 bg-[#09152d]/90 shadow-2xl">
      <div className="flex flex-col lg:flex-row">
        {p.side === "left" ? image : content}
        {p.side === "left" ? content : image}
      </div>
    </article>
  );
}


/* ------------------------------------------------------------------
   Landing page theme
   Dark mode remains the default. The button in the header switches
   the complete landing page to the white + green light theme.
------------------------------------------------------------------- */
const landingThemeStyles = `
  .landing-page {
    transition: background-color .35s ease, color .35s ease;
  }

  /* ------------------------------------------------
     PROFESSIONAL MOTION SYSTEM
  ------------------------------------------------ */

  html {
    scroll-behavior: smooth;
  }

  .landing-page {
    scroll-behavior: smooth;
  }

  .landing-page section {
    scroll-margin-top: 80px;
  }

  .landing-page button,
  .landing-page a,
  .landing-page article,
  .landing-page img {
    transition:
      transform .3s cubic-bezier(.22,1,.36,1),
      opacity .3s ease,
      background-color .3s ease,
      border-color .3s ease,
      color .3s ease,
      box-shadow .3s ease;
  }

  .landing-page button:hover {
    transform: translateY(-2px);
  }

  .landing-page button:active {
    transform: translateY(0) scale(.98);
  }

  .landing-page nav a {
    position: relative;
    transition: color .25s ease;
  }

  .landing-page nav a::after {
    content: "";
    position: absolute;
    left: 0;
    right: 100%;
    bottom: -7px;
    height: 2px;
    border-radius: 999px;
    background: #34d399;
    transition: right .3s cubic-bezier(.22,1,.36,1);
  }

  .landing-page nav a:hover::after {
    right: 0;
  }

  .landing-page .landing-theme-toggle:hover {
    transform: rotate(8deg) scale(1.06);
  }

  .landing-page article {
    transition:
      transform .45s cubic-bezier(.22,1,.36,1),
      box-shadow .45s ease,
      border-color .3s ease;
  }

  .landing-page article:hover {
    transform: translateY(-4px);
    box-shadow: 0 24px 65px rgba(0,0,0,.16);
  }

  .landing-page article img {
    transition: transform .8s cubic-bezier(.22,1,.36,1);
  }

  .landing-page article:hover img {
    transform: scale(1.025);
  }

  .landing-page .reveal-on-scroll {
    opacity: 0;
    transition:
      opacity .8s ease var(--reveal-delay, 0ms),
      transform .8s cubic-bezier(.22,1,.36,1) var(--reveal-delay, 0ms);
    will-change: opacity, transform;
  }

  .landing-page .reveal-up {
    transform: translateY(28px);
  }

  .landing-page .reveal-left {
    transform: translateX(-90px);
  }

  .landing-page .reveal-right {
    transform: translateX(90px);
  }

  .landing-page .reveal-on-scroll.is-visible {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }

  .landing-page .hero-entrance {
    animation: heroEntrance .9s cubic-bezier(.22,1,.36,1) both;
  }

  .landing-page .hero-image-motion {
    animation: heroImageMotion 7s ease-in-out 1s infinite;
  }

  @keyframes heroEntrance {
    from {
      opacity: 0;
      transform: translateY(22px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes heroImageMotion {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-7px);
    }
  }

  .landing-page .marquee-track {
    will-change: transform;
  }

  .landing-page .status-marquee:hover .marquee-track {
    animation-play-state: paused;
  }

  @media (prefers-reduced-motion: reduce) {
    html {
      scroll-behavior: auto;
    }

    .landing-page *,
    .landing-page *::before,
    .landing-page *::after {
      animation-duration: .01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: .01ms !important;
    }

    .landing-page .reveal-on-scroll {
      opacity: 1;
      transform: none;
    }
  }


    /* ------------------------------------------------
     CONTINUOUS STATUS MARQUEE
     Moves from LEFT → RIGHT
  ------------------------------------------------ */

  .status-marquee {
    background: linear-gradient(
      90deg,
      #062f2a,
      #075e54,
      #0b7a68,
      #075e54,
      #062f2a
    );
    border-color: rgba(52, 211, 153, 0.25);
  }

  .status-marquee .marquee-track {
    animation: marqueeRight 24s linear infinite;
    will-change: transform;
  }

  .status-marquee span {
    color: #d1fae5;
  }

  .status-marquee svg {
    color: #6ee7b7;
  }

  @keyframes marqueeRight {
    from {
      transform: translateX(-50%);
    }

    to {
      transform: translateX(0);
    }
  }

  /* LIGHT THEME */
  .landing-light .status-marquee {
    background: linear-gradient(
      90deg,
      #ecfdf5,
      #d1fae5,
      #a7f3d0,
      #d1fae5,
      #ecfdf5
    ) !important;

    border-color: #a7f3d0 !important;
  }

  .landing-light .status-marquee span {
    color: #047857 !important;
  }

  .landing-light .status-marquee svg {
    color: #059669 !important;
  }

  .landing-page.landing-dark {
    background: #050b1d;
    color: #ffffff;
  }

  .landing-page.landing-light {
    background: #ffffff;
    color: #0f2942;
  }

  .landing-light .landing-theme-toggle {
    border-color: #d5e7dc !important;
    background: #f0f9f4 !important;
    color: #087f4e !important;
  }

  .landing-light header {
    background: rgba(255,255,255,.88) !important;
    border-color: #e5eee9 !important;
  }

  .landing-light .text-white {
    color: #102a43 !important;
  }

  .landing-light .text-slate-200 {
    color: #29435c !important;
  }

  .landing-light .text-slate-300 {
    color: #405a70 !important;
  }

  .landing-light .text-slate-400 {
    color: #60758a !important;
  }

  .landing-light .text-slate-500 {
    color: #718496 !important;
  }

  .landing-light .border-white\\/5 {
    border-color: #e6eee9 !important;
  }

  .landing-light .border-white\\/10 {
    border-color: #dce9e2 !important;
  }

  .landing-light .border-white\\/20 {
    border-color: #c8ddd2 !important;
  }

  .landing-light .bg-\\[\\#09152d\\]\\/90 {
    background: rgba(248,252,250,.96) !important;
  }

  .landing-light .bg-\\[\\#0b1730\\]\\/80 {
    background: rgba(246,251,248,.96) !important;
  }

  .landing-light .bg-\\[\\#070e21\\] {
    background: #f5faf7 !important;
  }

  .landing-light .bg-\\[\\#071126\\] {
    background: #f4faf6 !important;
  }

  .landing-light .bg-\\[\\#071229\\] {
    background: #edf7f1 !important;
  }

  .landing-light .bg-\\[\\#08152e\\]\\/75 {
    background: rgba(255,255,255,.88) !important;
  }

  .landing-light .bg-\\[\\#111d35\\] {
    background: #edf7f1 !important;
  }

  .landing-light .bg-white\\/5 {
    background: rgba(16,42,67,.04) !important;
  }

  .landing-light .bg-white\\/10 {
    background: rgba(16,42,67,.06) !important;
  }

  .landing-light .bg-indigo-600\\/20 {
    background: rgba(16,185,129,.08) !important;
  }

  .landing-light .bg-violet-600\\/10 {
    background: rgba(52,211,153,.06) !important;
  }

  .landing-light .bg-blue-600\\/15 {
    background: rgba(16,185,129,.08) !important;
  }

  .landing-light .bg-blue-600\\/20 {
    background: rgba(16,185,129,.08) !important;
  }

  .landing-light .bg-emerald-400\\/10 {
    background: rgba(16,185,129,.09) !important;
  }

  .landing-light .bg-indigo-950\\/90 {
    background: rgba(236,249,241,.94) !important;
  }

  .landing-light .text-emerald-300,
  .landing-light .text-emerald-400 {
    color: #078b55 !important;
  }

  .landing-light .text-indigo-200,
  .landing-light .text-indigo-100 {
    color: #176b4a !important;
  }

  .landing-light .text-violet-300 {
    color: #6b45a8 !important;
  }

  .landing-light .text-amber-300 {
    color: #a56a00 !important;
  }

  .landing-light .text-rose-300 {
    color: #bd3d4c !important;
  }

  .landing-light .border-emerald-400\\/40 {
    border-color: rgba(5,150,105,.30) !important;
  }

  .landing-light .border-violet-400\\/40 {
    border-color: rgba(124,58,237,.22) !important;
  }

  .landing-light .border-amber-400\\/40 {
    border-color: rgba(217,119,6,.24) !important;
  }

  .landing-light .border-rose-400\\/40 {
    border-color: rgba(225,29,72,.22) !important;
  }

  .landing-light .bg-emerald-400 {
    background: #18a96b !important;
  }

  .landing-light .hover\\:bg-emerald-300:hover {
    background: #14945d !important;
  }

  .landing-light .landing-light-image-fade {
    opacity: .25;
  }

  .landing-light .shadow-2xl {
    box-shadow: 0 20px 55px rgba(20,83,45,.08) !important;
  }

  .landing-light article {
    box-shadow: 0 18px 50px rgba(20,83,45,.08);
  }

  .landing-light .from-\\[\\#071229\\] {
    --tw-gradient-from: #edf7f1 var(--tw-gradient-from-position) !important;
    --tw-gradient-to: rgb(237 247 241 / 0) var(--tw-gradient-to-position) !important;
  }

  .landing-light .via-\\[\\#071229\\]\\/75 {
    --tw-gradient-to: rgb(237 247 241 / 0) !important;
  }

  .landing-light .from-\\[\\#050b1d\\] {
    --tw-gradient-from: #ffffff var(--tw-gradient-from-position) !important;
    --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position) !important;
  }

  .landing-light .via-\\[\\#050b1d\\]\\/60 {
    --tw-gradient-to: rgb(255 255 255 / 0) !important;
  }

  .landing-light .landing-page-image-slot {
    background: linear-gradient(135deg,#f4fbf7,#e9f7ef) !important;
    border-color: #cfe5d8 !important;
  }

  @media (max-width: 767px) {
    .landing-theme-toggle {
      display: flex !important;
    }
  }
`;

export default function SwasthyaSakhaLanding({
  onCreateAccount = () => {},
  onSignIn = () => {},
  onExplore = () => {},
}) {
  const [isLight, setIsLight] = useState(false);

  return (
    <>
      <style>{landingThemeStyles}</style>
      <main className={`landing-page min-h-screen overflow-hidden text-white ${isLight ? "landing-light" : "landing-dark"}`}>
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[700px] w-[1000px] -translate-x-1/2 rounded-full bg-indigo-600/20 blur-[140px]" />
        <div className="absolute right-[-250px] top-[1100px] h-[650px] w-[650px] rounded-full bg-violet-600/10 blur-[140px]" />
      </div>
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#050b1d]/75 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
          <a href="#home" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
              <Heart size={22} fill="currentColor" />
            </div>
            <div>
              <div className="text-lg font-extrabold">
                Swasthya <span className="text-emerald-400">Sakha</span>
              </div>
              <div className="text-[10px] text-slate-400">
                Saath. Sehat. Sabke Liye.
              </div>
            </div>
          </a>
          <nav className="hidden gap-8 text-sm text-slate-300 md:flex">
            {[
              "Home",
              "About",
              "Features",
              "Impact",
              "Technology",
              "Contact",
            ].map((x) => (
              <a
                key={x}
                href={`#${x.toLowerCase()}`}
                className="hover:text-white"
              >
                {x}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsLight((v) => !v)}
              aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-300/20 bg-white/5 text-slate-200 transition hover:scale-105 hover:bg-white/10 landing-theme-toggle"
            >
              {isLight ? <Moon size={17} /> : <Sun size={17} />}
            </button>

            <button
              onClick={onCreateAccount}
              className="hidden rounded-full bg-emerald-400 px-5 py-2.5 text-sm font-bold text-[#03131b] transition hover:bg-emerald-300 sm:block"
            >
              Get Started <ArrowRight className="ml-1 inline" size={15} />
            </button>
          </div>
        </div>
      </header>
      <section id="home">
        <div className="mx-auto max-w-7xl px-5 pb-16 pt-16 sm:px-8 lg:pb-24 lg:pt-24">
          <div className="grid items-center gap-14 lg:grid-cols-[.92fr_1.08fr]">
            <div className="hero-entrance">
              <div className="mb-7 flex flex-wrap gap-3">
                <Badge t="purple">✦ SIH 2026 NATIONAL EVALUATION</Badge>
                <Badge>
                  <BarChart3 size={12} className="mr-1.5" />
                  75% PROTOTYPE COMPLETE
                </Badge>
              </div>
              <h1 className="text-5xl font-black leading-[.98] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
                Healthcare
                <br />
                Closer to
                <br />
                <span className="text-emerald-400">Every Community</span>
              </h1>
              <p className="mt-7 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
                A digital health platform connecting patients, frontline health
                workers, doctors and healthcare facilities — ensuring
                accessible, quality and continuous care in rural and underserved
                areas.
              </p>
              <div className="mt-9 flex flex-wrap gap-4">
                <button
                  onClick={onExplore}
                  className="rounded-xl bg-emerald-400 px-6 py-3.5 text-sm font-extrabold text-[#03131b]"
                >
                  Explore the Solution{" "}
                  <ArrowRight className="ml-1 inline" size={17} />
                </button>
                <a
                  href="#architecture"
                  className="rounded-xl border border-white/20 px-6 py-3.5 text-sm font-bold"
                >
                  View Architecture
                </a>
              </div>
            </div>
           <div className="relative flex min-h-[460px] items-center justify-center lg:-mr-16">

  {/* Blue + green ambient glow — DARK MODE ONLY */}
  {!isLight && (
    <>
      <div
        className="
          absolute
          right-10
          top-1/2
          h-[380px]
          w-[520px]
          -translate-y-1/2
          rounded-full
          bg-blue-600/20
          blur-[100px]
        "
      />

      <div
        className="
          absolute
          bottom-10
          right-20
          h-[220px]
          w-[350px]
          rounded-full
          bg-emerald-400/10
          blur-[90px]
        "
      />
    </>
  )}

  {/* Image wrapper */}
  <div className="relative w-full max-w-[850px]">

    {/* Extra image glow — DARK MODE ONLY */}
    {!isLight && (
      <div
        className="
          absolute
          -inset-5
          rounded-[40px]
          bg-indigo-500/15
          blur-3xl
        "
      />
    )}

    {/* Image */}
    <img
      src={isLight ? heroImageLight : heroImage}
      alt="Swasthya Sakha healthcare dashboard"
      className={`
        relative z-10 hero-image-motion
        w-full
        object-contain
        ${
          isLight
            ? "drop-shadow-[0_15px_35px_rgba(16,185,129,0.12)]"
            : "drop-shadow-[0_25px_60px_rgba(37,99,235,0.35)]"
        }
      `}
    />

    {/* Dark mode fades */}
    {!isLight && (
      <>
        {/* Bottom fade */}
        <div
          className="
            pointer-events-none
            absolute
            inset-x-0
            bottom-0
            z-20
            h-24
            bg-gradient-to-t
            from-[#050b1d]
            via-[#050b1d]/60
            to-transparent
          "
        />

        {/* Left fade */}
        <div
          className="
            pointer-events-none
            absolute
            inset-y-0
            left-0
            z-20
            w-24
            bg-gradient-to-r
            from-[#050b1d]
            to-transparent
          "
        />

        {/* Right fade */}
        <div
          className="
            pointer-events-none
            absolute
            inset-y-0
            right-0
            z-20
            w-16
            bg-gradient-to-l
            from-[#050b1d]
            to-transparent
          "
        />
      </>
    )}

  </div>
</div>
          </div>
          
        </div>
      </section>
      <section id="features" className="border-t border-white/5">
        <Reveal>
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:py-18">
          <div className="grid gap-10 lg:grid-cols-[.7fr_1.3fr]">
            <div>
              <Label>KEY FEATURES</Label>
              <h2 className="mt-6 text-4xl font-black tracking-tight sm:text-5xl">
                A Complete Healthcare Ecosystem
              </h2>
              <p className="mt-5 max-w-md text-base leading-7 text-slate-400">
                From registration to follow-up, Swasthya Sakha simplifies and
                strengthens rural healthcare delivery through technology.
              </p>
              <button
                onClick={onExplore}
                className="mt-7 rounded-xl border border-white/20 px-5 py-3 text-sm font-bold"
              >
                Explore All Features{" "}
                <ArrowRight className="ml-1 inline" size={16} />
              </button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {features.map(([I, t, d], index) => (
                <Reveal key={t} delay={index * 60}>
                  <Feature Icon={I} title={t} desc={d} />
                </Reveal>
              ))}
            </div>
          </div>
        </div>
        </Reveal>
      </section>
      <section id="architecture" className="border-t border-white/5">
        <Reveal delay={80}>
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-[.75fr_1.25fr]">
            <div>
              <Label>✦ SYSTEM ARCHITECTURE</Label>
              <h2 className="mt-6 text-4xl font-black leading-tight sm:text-5xl">
                From Community to
                <br />
                Care — A Connected Ecosystem
              </h2>
              <p className="mt-6 max-w-xl text-base leading-7 text-slate-400">
                Swasthya Sakha integrates field triage, teleconsultation,
                GIS-based resource mapping and emergency response into a
                unified, offline-first platform for low-connectivity settings.
              </p>
              <button
                onClick={onExplore}
                className="mt-8 rounded-xl bg-emerald-400 px-6 py-3.5 text-sm font-extrabold text-[#03131b]"
              >
                View Full Architecture{" "}
                <ArrowRight className="ml-1 inline" size={17} />
              </button>
            </div>
                       <div className="relative flex min-h-[460px] items-center justify-center lg:-mr-16">

  {/* Blue + green ambient glow — DARK MODE ONLY */}
  {!isLight && (
    <>
      <div
        className="
          absolute
          right-10
          top-1/2
          h-[380px]
          w-[520px]
          -translate-y-1/2
          rounded-full
          bg-blue-600/20
          blur-[100px]
        "
      />

      <div
        className="
          absolute
          bottom-10
          right-20
          h-[220px]
          w-[350px]
          rounded-full
          bg-emerald-400/10
          blur-[90px]
        "
      />
    </>
  )}

  {/* Image wrapper */}
  <div className="relative w-full max-w-[850px]">

    {/* Extra image glow — DARK MODE ONLY */}
    {!isLight && (
      <div
        className="
          absolute
          -inset-5
          rounded-[40px]
          bg-indigo-500/15
          blur-3xl
        "
      />
    )}

    {/* Image */}
    <img
      src={isLight ? image2Light : image2}
      alt="Swasthya Sakha healthcare dashboard"
      className={`
        relative
        z-10
        w-full
        object-contain
        ${
          isLight
            ? "drop-shadow-[0_15px_35px_rgba(16,185,129,0.12)]"
            : "drop-shadow-[0_25px_60px_rgba(37,99,235,0.35)]"
        }
      `}
    />

    {/* Dark mode fades */}
    {!isLight && (
      <>
        {/* Bottom fade */}
        <div
          className="
            pointer-events-none
            absolute
            inset-x-0
            bottom-0
            z-20
            h-24
            bg-gradient-to-t
            from-[#050b1d]
            via-[#050b1d]/60
            to-transparent
          "
        />

        {/* Left fade */}
        <div
          className="
            pointer-events-none
            absolute
            inset-y-0
            left-0
            z-20
            w-24
            bg-gradient-to-r
            from-[#050b1d]
            to-transparent
          "
        />

        {/* Right fade */}
        <div
          className="
            pointer-events-none
            absolute
            inset-y-0
            right-0
            z-20
            w-16
            bg-gradient-to-l
            from-[#050b1d]
            to-transparent
          "
        />
      </>
    )}

  </div>
</div>
          </div>
        </div>
        </Reveal>
      </section>
      <section id="technology" className="border-t border-white/5">
        <Reveal delay={120}>
        <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:py-26">
          <div className="mb-12 max-w-2xl">
            <Label t="blue">DEVELOPMENT PROGRESS</Label>
            <h2 className="mt-6 text-4xl font-black tracking-tight sm:text-5xl">
              Building in Phases,
              <br />
              Delivering Real Impact
            </h2>
            <p className="mt-5 text-base leading-7 text-slate-400">
              Swasthya Sakha is being developed in focused phases, from
              multilingual field triage to emergency response, with core modules
              already functional and undergoing real-world testing.
            </p>
          </div>
          <div className="space-y-8">
            {phases.map((p, index) => (
              <Reveal
                key={p.n}
                delay={index * 80}
                direction={index % 2 === 0 ? "left" : "right"}
              >
                <Phase p={p} isLight={isLight}/>
              </Reveal>
            ))}
          </div>
        </div>
        </Reveal>
      </section>
      <section>
        <Reveal delay={120}>
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
          <div className="mb-7 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
              <LockKeyhole />
            </div>
            <h2 className="text-xl font-extrabold sm:text-2xl">
              Offline Infrastructure & Security Protocols
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {security.map(([I, t, d]) => (
              <div
                key={t}
                className="rounded-2xl border border-white/10 bg-[#070e21] p-6"
              >
                <I className="text-emerald-400" />
                <h3 className="mt-4 text-sm font-bold">{t}</h3>
                <p className="mt-2 text-xs leading-5 text-slate-400">{d}</p>
              </div>
            ))}
          </div>
        </div>
        </Reveal>
      </section>
      <section className="status-marquee overflow-hidden border-y">
  <div className="marquee-track flex w-max items-center gap-10 py-4 text-xs font-bold uppercase tracking-[0.18em]">
    
    {/* FIRST SET */}
    <div className="flex items-center gap-10">
      {[
        "BETTER CARE",
        "STRONGER COMMUNITIES",
        "PROTOTYPE COMPLETE 75%",
        "HEALTHIER INDIA",
        "TOGETHER FOR TOMORROW",
      ].map((x) => (
        <span key={x} className="flex items-center whitespace-nowrap">
          {x}
          <BarChart3 className="ml-8" size={16} />
        </span>
      ))}
    </div>

    {/* DUPLICATE SET — makes the animation seamless */}
    <div className="flex items-center gap-10">
      {[
        "BETTER CARE",
        "STRONGER COMMUNITIES",
        "PROTOTYPE COMPLETE 75%",
        "HEALTHIER INDIA",
        "TOGETHER FOR TOMORROW",
      ].map((x) => (
        <span key={`duplicate-${x}`} className="flex items-center whitespace-nowrap">
          {x}
          <BarChart3 className="ml-8" size={16} />
        </span>
      ))}
    </div>

  </div>
</section>
      <section id="contact">
        <Reveal delay={100}>
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
          <div
  className={`relative overflow-hidden rounded-[32px] border px-7 py-14 sm:px-12 ${
    isLight
      ? "border-emerald-200 bg-gradient-to-br from-white via-white to-emerald-50"
      : "border-white/10 bg-[#071126]"
  }`}
>
  {/* Bottom glow */}
  <div
    className={`absolute inset-x-0 bottom-0 h-40 ${
      isLight
        ? "bg-gradient-to-t from-emerald-100/70 via-emerald-50/30 to-transparent"
        : "bg-gradient-to-t from-indigo-950/90 to-transparent"
    }`}
  />

  {/* Soft green light-theme glow */}
  {isLight && (
    <>
      <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-emerald-200/30 blur-3xl" />
      <div className="absolute -bottom-28 left-1/3 h-72 w-72 rounded-full bg-green-100/50 blur-3xl" />
    </>
  )}

  <div className="relative z-10">
    <Label>GET STARTED</Label>

    <h2 className="mt-5 text-4xl font-black sm:text-5xl">
      Be a Part of the Change
    </h2>

    <p className="mt-4 text-sm text-slate-300 sm:text-base">
      Create an account or sign in to access Swasthya Sakha.
    </p>

    <div className="mt-7 flex flex-wrap gap-3">
      <button
        onClick={onCreateAccount}
        className="rounded-xl bg-emerald-400 px-6 py-3.5 text-sm font-extrabold text-[#03131b]"
      >
        Create Account{" "}
        <ArrowRight className="ml-1 inline" size={16} />
      </button>

      <button
        onClick={onSignIn}
        className="rounded-xl border border-white/25 px-7 py-3.5 text-sm font-bold"
      >
        Sign In <ArrowRight className="ml-1 inline" size={16} />
      </button>
    </div>
  </div>
</div>
        </div>
        </Reveal>
      </section>
      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-10 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="font-extrabold">
            Swasthya <span className="text-emerald-400">Sakha</span>
            <div className="text-[10px] text-slate-500">
              Saath. Sehat. Sabke Liye.
            </div>
          </div>
          <div className="flex flex-wrap gap-5 text-xs text-slate-400">
            {[
              "Home",
              "About",
              "Features",
              "Impact",
              "Technology",
              "Contact",
            ].map((x) => (
              <a key={x} href={`#${x.toLowerCase()}`}>
                {x}
              </a>
            ))}
          </div>

          <div className="flex items-center flex-col">
            <p className="text-xs text-slate-500">
            © 2026 Swasthya Sakha. All rights reserved.
          </p>
          <p  className="text-xs text-slate-500">
            By Nexvion
          </p>
          </div>
          
          
        </div>
      </footer>
    </main>
    </>
  );
}
