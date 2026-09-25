import React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, QrCode, ArrowRight, CheckCircle2 } from "lucide-react";
import { roles } from "../data";
import { loginSuccess } from "../store/authSlice";
import { api } from "../api";
import Modal from "../components/Modal";

export default function Login() {
  const [role, setRole] = useState("patient");
  const [qr, setQr] = useState(false);
  const [error, setError] = useState("");
  let [input, setInput] = useState("");
  const dispatch = useDispatch();
  const nav = useNavigate();
  const submit = async (e) => {
    e.preventDefault();
    setError("");

    // 1. Capture what the user actually types into the form inputs
    const enteredUsername = e.currentTarget.username?.value;
    const enteredPassword = e.currentTarget.password.value;

    try {
      const data = await api("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          // 2. Send the real user-entered details to your new Express backend controller
          username: enteredUsername || role, // Fallback to role string only if field is blank
          password: enteredPassword,
          role, // Matches the active selected workspace tab
        }),
      });

      // 3. Save the token payload into localStorage so api.js can read it for protected endpoints
      localStorage.setItem(
        "ss_auth",
        JSON.stringify({ token: data.token, user: data.user }),
      );

      // 4. Update Redux store state and navigate to workspace shell
      dispatch(loginSuccess(data));
      nav("/dashboard");
    } catch (err) {
      // Displays the exact reason sent by your Express controller (e.g. "Invalid credentials")
      setError(err.message || "Login failed.");
    }
  };

  const handleRedirect = () => {
    nav('/');
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-[1.1fr_.9fr] bg-[#f6f9fc]">
      <div className="hidden lg:flex bg-[#0b2239] text-white p-12 relative overflow-hidden">
        <div className="max-w-xl self-center relative z-10">
          <div className="flex items-center gap-3 mb-8 cursor-pointer" onClick={handleRedirect}>
            <div className="w-12 h-12 rounded-2xl bg-teal-400 text-[#0b2239] text-xl  grid place-items-center font-black ">
              स्व
            </div>
            <div>
              <div className="text-xl font-bold">Swasthya Sakha</div>
              <div className="text-sm text-slate-300">
                Connected public healthcare
              </div>
            </div>
          </div>
          <h1 className="text-5xl font-black leading-tight">
            One workspace for the whole care journey.
          </h1>
          <p className="text-slate-300 mt-5 text-lg leading-8">
            Multilingual intake, ABHA-ready registration, facility intelligence,
            triage, referrals and teleconsultation — designed for connected and
            low-connectivity settings.
          </p>
          <div className="grid grid-cols-2 gap-3 mt-9">
            {[
              "5 role-based workspaces",
              "Offline-ready architecture",
              "GIS facility visibility",
              "Referral & follow-up tracking",
            ].map((x) => (
              <div className="bg-white/6 border border-white/10 rounded-xl p-3 text-sm flex gap-2">
                <CheckCircle2 size={17} className="text-teal-300 shrink-0" />
                {x}
              </div>
            ))}
          </div>
        </div>
        <div className="absolute -right-28 -bottom-28 w-96 h-96 rounded-full border-[60px] border-teal-400/10" />
      </div>
      <div className="flex items-center justify-center p-5 sm:p-10">
        <div className="w-full max-w-lg">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-11 h-11 rounded-xl bg-teal-600 text-white grid place-items-center font-black">
              स्व
            </div>
            <b>Swasthya Sakha</b>
          </div>
          <div className="card p-7 sm:p-9">
            <div className="mb-7">
              <p className="text-teal-700 text-xs font-bold uppercase tracking-wider">
                Secure sign in
              </p>
              <h2 className="text-3xl font-black mt-2">Welcome back</h2>
              <p className="text-sm text-muted mt-2">
                Choose your role to open the right workspace.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
              {roles.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setRole(r.id)}
                  className={`text-left p-3 rounded-xl border ${role === r.id ? "border-teal-500 bg-teal-50" : "border-slate-200 hover:bg-slate-50"}`}
                >
                  <div className="font-semibold text-sm">{r.label}</div>
                  <div className="text-[11px] text-muted mt-1">{r.hint}</div>
                </button>
              ))}
            </div>
            <form onSubmit={submit} className="space-y-4">
              <label className="block text-sm font-semibold">
                Mobile / User ID or ABHA Address
                <input
                  name="username" // 👈 ADDED: Essential property for the submit handler to read values
                  required
                  type="text"
                  className="mt-1.5 w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-teal-500"
                  placeholder={
                    role === "patient"
                      ? "e.g., username@abdm"
                      : "Enter email or user ID"
                  } // 👈 UPDATED: Dynamic guidance placeholders matching our live database fields
                />
              </label>

              <label className="block text-sm font-semibold">
                Password
                <input
                  name="password"
                  required
                  type="password"
                  className="mt-1.5 w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-teal-500"
                  placeholder="••••••••"
                />
              </label>

              {error && <p className="text-sm text-rose-600">{error}</p>}

              <button
                type="submit"
                className="w-full bg-[#0b2239] text-white rounded-xl py-3.5 font-semibold flex items-center justify-center gap-2 hover:bg-[#12355b]"
              >
                Sign in as {roles.find((r) => r.id === role)?.label}
                <ArrowRight size={18} />
              </button>

              {error && <p className="text-sm text-rose-600">{error}</p>}

            </form>

            {role !== "districtAdmin" && (
              <button
                type="button"
                onClick={() => nav(`/register?role=${role}`)}
                className="w-full bg-[#0b2239] text-white rounded-xl py-3.5 font-semibold flex mt-3 items-center justify-center gap-2 hover:bg-[#12355b]"
              >
                Create Account as {roles.find((r) => r.id === role)?.label}
                <ArrowRight size={18} />
              </button>
            )}

            {role === "patient" && (
              <button
                onClick={() => setQr(true)}
                className="w-full mt-3 border border-teal-200 text-teal-800 bg-teal-50 rounded-xl py-3 font-semibold flex items-center justify-center gap-2"
              >
                <QrCode size={18} /> Scan ABHA QR instead
              </button>
            )}
            <div className="flex gap-2 items-start mt-6 text-[11px] text-muted">
              <ShieldCheck size={15} className="text-teal-600 shrink-0" />
              Demo authentication for the prototype. Production deployment
              should use ABDM/ABHA consent, identity and session flows.
            </div>
          </div>
        </div>
      </div>
      <Modal
        open={qr}
        onClose={() => setQr(false)}
        title="ABHA QR registration"
      >
        <div className="border-2 border-dashed border-teal-200 bg-teal-50 rounded-2xl p-8 text-center">
          <QrCode size={90} className="mx-auto text-teal-700" />
          <h4 className="font-bold mt-4">QR scanner placeholder</h4>
          <p className="text-sm text-muted mt-1">
            Connect the camera scanner to the official ABHA flow in production.
          </p>
          <button
            onClick={() => {
              setQr(false);
              dispatch(
                loginSuccess({
                  user: { name: "Asha Patil", role: "patient" },
                  token: "demo-token",
                }),
              );
              nav("/dashboard");
            }}
            className="mt-5 bg-teal-700 text-white px-5 py-2.5 rounded-xl font-semibold"
          >
            Use demo ABHA
          </button>
        </div>
      </Modal>
    </div>
  );
}
