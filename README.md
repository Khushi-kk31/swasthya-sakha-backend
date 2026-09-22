# Swasthya Sakha — MERN + React + Tailwind

A modular prototype for the Swasthya Sakha public-health workflow. The UI is built in **React.js + Tailwind CSS**, state is managed with **Redux Toolkit**, maps use **Leaflet**, and the API is **Node.js + Express + MongoDB/Mongoose**.

## Run it

### 1. Install Node.js LTS

Use a current Node.js LTS release.

### 2. Install all dependencies

From the project root:

```bash
npm install
```

### 3. Start frontend + backend together

```bash
npm run dev
```

Open `http://localhost:5173`.

The API runs at `http://localhost:5000`.

### 4. MongoDB

The app can open without MongoDB for UI/demo login. To enable persisted appointments, create `server/.env` from `server/.env.example` and set:

```env
MONGO_URI=mongodb://127.0.0.1:27017/swasthya_sakha
JWT_SECRET=replace-with-a-long-random-secret
```

Restart `npm run dev` after changing `.env`.

## Demo credentials

All demo users use password `demo123`:

| Role | Username |
|---|---|
| Patient | `patient` |
| Health Worker | `worker` |
| Doctor | `doctor` |
| Facility Admin | `facility` |
| District Admin | `district` |

Patient also has an **ABHA QR** entry point in the login UI. It is deliberately a production integration placeholder rather than a fake ABHA verification system.

## Main workspaces

- **Patient:** multilingual voice-to-text (English, Hindi, Marathi), medical history, appointments/follow-up.
- **Health Worker:** triage/field queue, facility GIS, emergency ambulance workflow, teleconsultation.
- **Doctor:** patient queue, patient details, appointment slots, facility GIS, teleconsultation and ePrescription builder.
- **Facility Admin:** district/network capacity, beds + ICU + specialists, medical-store stock/out-of-stock, pathology/diagnostic machine availability, maintenance and operational extras.
- **District Admin:** district GIS command view, network health, analytics, alerts and command actions.

## Architecture

```text
React + Tailwind
  ├─ Pages
  ├─ Reusable components
  ├─ Redux Toolkit store
  ├─ React Router
  └─ Leaflet GIS
        ↓
Node + Express REST API
        ↓
MongoDB / Mongoose
```

### Production integration notes

- Replace demo login with the actual identity provider and ABDM/ABHA consent/authentication flow.
- Connect ABHA QR to the official ABDM sandbox/production APIs; QR should act as an identity/lookup mechanism, not expose the complete medical record.
- Send speech-to-text output to a backend Indic-language NLP service for symptom extraction. Keep clinical RED/YELLOW/GREEN decisions in a clinician-validated deterministic triage rules engine rather than letting an NLP model make the final clinical decision.
- Add IndexedDB/Dexie for true offline-first records and a durable sync queue with conflict handling.
- Add WebRTC/Jitsi or an equivalent approved telehealth service with video → audio-only degradation and a conventional phone fallback when internet is unavailable.
- Replace mock facility/medicine/diagnostic data with MongoDB collections and add WebSockets/SSE for real-time capacity updates.
- Add audit logs, encrypted storage, least-privilege RBAC, consent management and secure secret management before production use.
