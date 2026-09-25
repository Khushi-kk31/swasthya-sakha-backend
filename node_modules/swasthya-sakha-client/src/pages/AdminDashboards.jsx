import React from "react";
import { useState } from "react";
import {
  Building2,
  BedDouble,
  Stethoscope,
  Ambulance,
  PackageSearch,
  AlertTriangle,
  Activity,
  Users,
  MapPinned,
  Settings,
  CheckCircle2,
  Wrench,
  TrendingUp,
} from "lucide-react";
import StatCard from "../components/StatCard";
import SectionHeader from "../components/SectionHeader";
import FacilityMap from "../components/FacilityMap";
import Badge from "../components/Badge";
import { districtStats, facilities, medicines, diagnostics } from "../data";
export function FacilityAdminDashboard({ subpage }) {
  const [filter, setFilter] = useState("All");
  const [medicineFilter, setMedicineFilter] = useState("All");
  const filtered = medicines.filter(
    (x) => medicineFilter === "All" || x.status === medicineFilter,
  );
  if (subpage === "network")
    return <Network title="District facility network" />;
  if (subpage === "medicines")
    return (
      <div>
        <SectionHeader
          title="Medical stores & medicine availability"
          sub="Track stock, low-stock items and out-of-stock medicines across stores."
        />
        <div className="grid md:grid-cols-3 gap-4 mb-5">
          <StatCard
            label="Stores mapped"
            value={districtStats.pharmacies}
            sub="Across the district"
            icon={PackageSearch}
          />
          <StatCard
            label="Low stock"
            value="14"
            sub="Reorder recommended"
            icon={AlertTriangle}
            tone="amber"
          />
          <StatCard
            label="Out of stock"
            value="6"
            sub="Requires escalation"
            icon={AlertTriangle}
            tone="rose"
          />
        </div>
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <b>Medicine inventory</b>
              <p className="text-xs text-muted mt-1">
                Store-level availability
              </p>
            </div>
            <select
              value={medicineFilter}
              onChange={(e) => setMedicineFilter(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm"
            >
              <option>All</option>
              <option>In stock</option>
              <option>Low stock</option>
              <option>Out of stock</option>
            </select>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs text-muted border-b">
                <tr>
                  <th className="pb-3">Store</th>
                  <th className="pb-3">Medicine</th>
                  <th className="pb-3">Stock</th>
                  <th className="pb-3">Reorder point</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((x) => (
                  <tr className="border-b last:border-0">
                    <td className="py-3">{x.store}</td>
                    <td className="font-semibold">{x.medicine}</td>
                    <td>{x.stock}</td>
                    <td>{x.reorder}</td>
                    <td>
                      <Badge
                        tone={
                          x.status === "Out of stock"
                            ? "red"
                            : x.status === "Low stock"
                              ? "amber"
                              : "green"
                        }
                      >
                        {x.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  if (subpage === "diagnostics")
    return (
      <div>
        <SectionHeader
          title="Pathology, diagnostics & machine availability"
          sub="See operational equipment and maintenance gaps by facility."
        />
        <div className="grid md:grid-cols-3 gap-4 mb-5">
          <StatCard
            label="Diagnostic centres"
            value={districtStats.diagnosticCentres}
            sub="Mapped facilities"
            icon={Stethoscope}
          />
          <StatCard
            label="Machines tracked"
            value="86"
            sub="Across district"
            icon={Activity}
            tone="blue"
          />
          <StatCard
            label="Maintenance issues"
            value="5"
            sub="Open work orders"
            icon={Wrench}
            tone="amber"
          />
        </div>
        <div className="card p-5">
          <table className="w-full text-left text-sm">
            <thead className="text-xs text-muted border-b">
              <tr>
                <th className="pb-3">Facility</th>
                <th>Machine</th>
                <th>Available</th>
                <th>Capacity</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {diagnostics.map((x) => (
                <tr className="border-b last:border-0">
                  <td className="py-3 font-semibold">{x.facility}</td>
                  <td>{x.machine}</td>
                  <td>{x.available}</td>
                  <td>{x.total}</td>
                  <td>
                    <Badge
                      tone={
                        x.status === "Operational"
                          ? "green"
                          : x.status === "Out of service"
                            ? "red"
                            : "amber"
                      }
                    >
                      {x.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="card p-5 mt-5">
          <SectionHeader
            title="Suggested operational extras"
            sub="Useful admin controls for a production implementation."
          />
          <div className="grid md:grid-cols-3 gap-3">
            {[
              [
                "Maintenance calendar",
                "Schedule machine downtime and vendor visits",
              ],
              ["Lab turnaround time", "Track pending and completed reports"],
              [
                "Referral load",
                "See where diagnostic referrals are accumulating",
              ],
            ].map(([a, b]) => (
              <div className="border rounded-xl p-4">
                <b className="text-sm">{a}</b>
                <p className="text-xs text-muted mt-1">{b}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  return (
    <div>
      <div className="grid md:grid-cols-4 gap-4">
        <StatCard
          label="PHCs / centres"
          value={districtStats.centres}
          sub="Across district"
          icon={Building2}
        />
        <StatCard
          label="Sub centres"
          value={districtStats.subCentres}
          sub="Mapped & reporting"
          icon={MapPinned}
          tone="blue"
        />
        <StatCard
          label="District hospitals"
          value={districtStats.districtHospitals}
          sub="2 hospitals"
          icon={Building2}
        />
        <StatCard
          label="Total beds"
          value={districtStats.totalBeds.toLocaleString()}
          sub={`${districtStats.icuBeds} ICU beds`}
          icon={BedDouble}
        />
      </div>
      <div className="grid md:grid-cols-4 gap-4 mt-4">
        <StatCard
          label="Specialists"
          value={districtStats.specialists}
          sub="Across network"
          icon={Stethoscope}
        />
        <StatCard
          label="Ambulances"
          value={districtStats.ambulances}
          sub="38 mapped units"
          icon={Ambulance}
          tone="amber"
        />
        <StatCard
          label="Medical stores"
          value={districtStats.pharmacies}
          sub="Stock visibility"
          icon={PackageSearch}
        />
        <StatCard
          label="Diagnostic centres"
          value={districtStats.diagnosticCentres}
          sub="Machine tracking"
          icon={Activity}
        />
      </div>
      <div className="grid lg:grid-cols-[1.2fr_.8fr] gap-5 mt-5">
        <div className="card p-5">
          <SectionHeader
            title="District network map"
            sub="Facilities and resource capacity at a glance."
          />
          <FacilityMap height="450px" />
        </div>
        <div className="card p-5">
          <SectionHeader title="Capacity snapshot" />
          <div className="space-y-4">
            {[
              ["Beds occupied", "68%", "amber"],
              ["Specialist coverage", "82%", "green"],
              ["Medicine availability", "91%", "green"],
              ["Diagnostic uptime", "94%", "green"],
              ["Referral completion", "76%", "amber"],
            ].map(([a, v, t]) => (
              <div>
                <div className="flex justify-between text-sm">
                  <b>{a}</b>
                  <span className="text-muted">{v}</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full mt-2">
                  <div
                    className={`h-2 rounded-full ${t === "green" ? "bg-teal-600" : "bg-amber-500"}`}
                    style={{ width: v }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 p-4 rounded-xl bg-rose-50 border border-rose-100">
            <b className="text-sm text-rose-800">2 attention items</b>
            <p className="text-xs text-rose-700 mt-1">
              Amoxicillin and Azithromycin are out of stock. One hematology
              analyzer is under maintenance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
function Network({ title }) {
  const [filter, setFilter] = useState("All");
  const list = facilities.filter((f) => filter === "All" || f.type === filter);
  return (
    <div>
      <SectionHeader
        title={title}
        sub="Compare centres, sub centres and district hospitals with beds, specialists and service capacity."
        action={
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm"
          >
            <option>All</option>
            <option>District Hospital</option>
            <option>PHC</option>
            <option>CHC</option>
            <option>Sub Centre</option>
          </select>
        }
      />
      <div className="card p-5">
        <div className="grid md:grid-cols-2 gap-4">
          {list.map((f) => (
            <div className="border rounded-2xl p-4 hover:border-teal-300">
              <div className="flex justify-between">
                <div>
                  <b>{f.name}</b>
                  <p className="text-xs text-muted mt-1">{f.type}</p>
                </div>
                <Badge tone="green">Open</Badge>
              </div>
              <div className="grid grid-cols-4 gap-2 mt-4 text-xs">
                <div className="bg-slate-50 p-2 rounded-lg">
                  <b className="block text-sm">{f.beds}</b>beds
                </div>
                <div className="bg-slate-50 p-2 rounded-lg">
                  <b className="block text-sm">{f.icu}</b>ICU
                </div>
                <div className="bg-slate-50 p-2 rounded-lg">
                  <b className="block text-sm">{f.specialists}</b>specialists
                </div>
                <div className="bg-slate-50 p-2 rounded-lg">
                  <b className="block text-sm">{f.diagnostics}</b>diagnostics
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-5">
        <FacilityMap height="480px" />
      </div>
    </div>
  );
}
export function DistrictAdminDashboard({ subpage }) {
  if (subpage === "network")
    return <Network title="Facility network oversight" />;
  if (subpage === "insights")
    return (
      <div>
        <SectionHeader
          title="Analytics & alerts"
          sub="District-level operational intelligence for decisions and escalation."
        />
        <div className="grid md:grid-cols-3 gap-4">
          <StatCard
            label="Referral completion"
            value="76%"
            sub="+8% this month"
            icon={TrendingUp}
          />
          <StatCard
            label="Emergency response"
            value="11 min"
            sub="Median dispatch time"
            icon={Ambulance}
            tone="blue"
          />
          <StatCard
            label="Open alerts"
            value="9"
            sub="3 high priority"
            icon={AlertTriangle}
            tone="rose"
          />
        </div>
        <div className="grid lg:grid-cols-2 gap-5 mt-5">
          <div className="card p-5">
            <SectionHeader title="Priority alerts" />
            <div className="space-y-3">
              {[
                "Medicine stockout at 2 stores",
                "Hematology analyzer maintenance pending",
                "Referral waiting > 48 hours at CHC Kurla",
                "3 ambulances currently on dispatch",
              ].map((x, i) => (
                <div className="flex gap-3 p-3 rounded-xl bg-slate-50">
                  <AlertTriangle
                    size={17}
                    className={i < 2 ? "text-rose-600" : "text-amber-600"}
                  />
                  <span className="text-sm">{x}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="card p-5">
            <SectionHeader title="Recommended command actions" />
            <div className="space-y-2">
              {[
                "Rebalance critical medicines between stores",
                "Review diagnostic maintenance SLA",
                "Call facilities with delayed referrals",
                "Validate ambulance availability feed",
              ].map((x) => (
                <div className="border rounded-xl p-3 flex items-center gap-3">
                  <CheckCircle2 size={17} className="text-teal-600" />
                  <span className="text-sm">{x}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  return (
    <div>
      <div className="grid md:grid-cols-4 gap-4">
        <StatCard
          label="Facilities"
          value="162"
          sub="2 hospitals · 42 centres · 118 sub-centres"
          icon={Building2}
        />
        <StatCard
          label="Beds"
          value="1,840"
          sub="146 ICU"
          icon={BedDouble}
          tone="blue"
        />
        <StatCard
          label="Specialists"
          value="214"
          sub="Coverage across network"
          icon={Users}
        />
        <StatCard
          label="Live alerts"
          value="9"
          sub="3 high priority"
          icon={AlertTriangle}
          tone="rose"
        />
      </div>
      <div className="grid lg:grid-cols-[1.2fr_.8fr] gap-5 mt-5">
        <div className="card p-5">
          <SectionHeader
            title="District GIS command view"
            sub="Resource visibility across facilities."
          />
          <FacilityMap height="520px" />
        </div>
        <div className="space-y-5">
          <div className="card p-5">
            <SectionHeader title="Network health" />
            <div className="space-y-4">
              {[
                ["Bed occupancy", "68%"],
                ["Specialist availability", "82%"],
                ["Medicine coverage", "91%"],
                ["Diagnostics uptime", "94%"],
              ].map(([a, v]) => (
                <div>
                  <div className="flex justify-between text-sm">
                    <b>{a}</b>
                    <span>{v}</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full mt-2">
                    <div
                      className="h-2 bg-teal-600 rounded-full"
                      style={{ width: v }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="card p-5">
            <SectionHeader title="Command shortcuts" />
            <div className="grid grid-cols-2 gap-2">
              {[
                ["Manage users", Users],
                ["Facility setup", Settings],
                ["Emergency view", Ambulance],
                ["Reports", Activity],
              ].map(([x, I]) => (
                <button className="border rounded-xl p-3 text-left hover:bg-slate-50">
                  <I size={18} className="text-teal-700" />
                  <b className="block text-xs mt-2">{x}</b>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
