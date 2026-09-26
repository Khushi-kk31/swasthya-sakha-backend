import React, { useEffect , useState} from "react";
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { setHealthData } from "./store/healthSlice";
import { facilities, medicines, diagnostics, appointments } from "./data";

import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

import Login from "./pages/Login";
import SwasthyaSakhaLanding from "./pages/SwasthyaSakhaLanding";

import PatientDashboard from "./pages/PatientDashboard";
import HealthWorkerDashboard from "./pages/HealthWorkerDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";

import ProfilePage from "./pages/ProfilePage"; 

import {
  FacilityAdminDashboard,
  DistrictAdminDashboard,
} from "./pages/AdminDashboards";

import Register from "./components/Register";

function Guard({ children, roles }) {
  const cachedAuth = localStorage.getItem("ss_auth");
  const session = cachedAuth ? JSON.parse(cachedAuth) : null;
  const user = session?.user;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}


function Shell() {
  const [user, setUser] = useState(() => {
    const cachedAuth = localStorage.getItem("ss_auth");
    return cachedAuth ? JSON.parse(cachedAuth).user : null;
  });


  const loc = useLocation();

  // Watch for state changes across route updates
  useEffect(() => {
    const handleStorageChange = () => {
      const cachedAuth = localStorage.getItem("ss_auth");
      if (cachedAuth) {
        setCurrentUser(JSON.parse(cachedAuth).user);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  if (!user) return <Navigate to="/login" replace />;

  const seg = loc.pathname.split("/").filter(Boolean);
  const subpage = seg[1] || "overview";

  const titles = {
    overview: {
      patient: "Patient Dashboard",
      healthWorker: "Health Worker Dashboard",
      doctor: "Doctor Dashboard",
      facilityAdmin: "Facility Admin",
      districtAdmin: "District Admin",
    },
    profile: "Account Profile Settings",
    facilities: "Facility GIS & Finder",
    emergency: "Emergency Ambulance",
    teleconsult: "Teleconsultation",
    history: "Medical History",
    appointments: "Appointments & Follow-up",
    network: "Facility Network",
    medicines: "Medical Stores",
    diagnostics: "Diagnostics & Machines",
    insights: "Analytics & Alerts",
  };

  return (
    <div className="min-h-screen flex">
      <Sidebar />

      <main className="min-w-0 flex-1">
        <Topbar
  title={
    typeof titles[subpage] === "object"
      ? (titles[subpage]?.[user?.role] || "Dashboard") // If it's the overview object, resolve the string safely
      : (titles[subpage] || "Dashboard")               // If it's a normal string, print it directly
  }
/>

        <div className="p-4 md:p-7 max-w-[1600px] mx-auto">
          <Routes>

            {/* MAIN DASHBOARD */}
            <Route
            path="/dashboard"
            element={
              user.role === "patient" ? (
                <PatientDashboard loggedInUser={user} /> 
              ) : user.role === "healthWorker" ? (
                <HealthWorkerDashboard loggedInUser={user} />
              ) : user.role === "doctor" ? (
                <DoctorDashboard loggedInUser={user} />
              ) : user.role === "facilityAdmin" ? (
                <FacilityAdminDashboard loggedInUser={user} />
              ) : (
                <DistrictAdminDashboard loggedInUser={user} />
              )
            }
          />

            <Route
              path="/dashboard/profile"
              element={<ProfilePage loggedInUser={user} />}
            />
            

            {/* PATIENT */}
            <Route
              path="/dashboard/history"
              element={
                <PatientDashboard subpage="history"  loggedInUser={user} />
              }
            />

            <Route
              path="/dashboard/appointments"
              element={
                <PatientDashboard subpage="appointments" loggedInUser={user}  />
              }
            />

            {/* FACILITIES */}
            <Route
              path="/dashboard/facilities"
              element={
                user.role === "doctor" ? (
                  <DoctorDashboard subpage="facilities" />
                ) : (
                  <HealthWorkerDashboard subpage="facilities" />
                )
              }
            />

            {/* EMERGENCY */}
            <Route
              path="/dashboard/emergency"
              element={
                <HealthWorkerDashboard subpage="emergency" />
              }
            />

            {/* TELECONSULT */}
            <Route
              path="/dashboard/teleconsult"
              element={
                user.role === "doctor" ? (
                  <DoctorDashboard subpage="teleconsult" />
                ) : (
                  <HealthWorkerDashboard subpage="teleconsult" />
                )
              }
            />

            {/* FACILITY NETWORK */}
            <Route
              path="/dashboard/network"
              element={
                user.role === "districtAdmin" ? (
                  <DistrictAdminDashboard subpage="network" />
                ) : (
                  <FacilityAdminDashboard subpage="network" />
                )
              }
            />

            {/* MEDICINES */}
            <Route
              path="/dashboard/medicines"
              element={
                <FacilityAdminDashboard subpage="medicines" />
              }
            />

            {/* DIAGNOSTICS */}
            <Route
              path="/dashboard/diagnostics"
              element={
                <FacilityAdminDashboard subpage="diagnostics" />
              }
            />

            {/* INSIGHTS */}
            <Route
              path="/dashboard/insights"
              element={
                <DistrictAdminDashboard subpage="insights" />
              }
            />

          </Routes>
        </div>
      </main>
    </div>
  );
}


export default function App() {
  const navigate = useNavigate();

  return (
    <Routes>

      {/* =========================================
          LANDING PAGE
          ========================================= */}

      <Route
        path="/"
        element={
          <SwasthyaSakhaLanding
            onCreateAccount={() => navigate("/login")}
            onSignIn={() => navigate("/login")}
            onExplore={() => {
              document
                .getElementById("features")
                ?.scrollIntoView({
                  behavior: "smooth",
                });
            }}
          />
        }
      />


      {/* =========================================
          LOGIN
          ========================================= */}

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register/>}
      />


      {/* =========================================
          PROTECTED DASHBOARD
          ========================================= */}

      <Route
        path="/*"
        element={
          <Guard>
            <Shell />
          </Guard>
        }
      />

    </Routes>
  );
}