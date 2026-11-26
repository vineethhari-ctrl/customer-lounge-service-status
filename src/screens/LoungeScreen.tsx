import { useEffect, useRef, useState } from "react";
import { AppHeader } from "../components/AppHeader";
import { DataTable, type Column } from "../components/DataTable";
import { KpiStrip } from "../components/KpiStrip";
import { FilterBar, PillGroup, ToolButton } from "../components/PillGroup";
import { DeptTag, Pill } from "../components/Pill";
import { playChime } from "../chime";
import { MILESTONES, TAB_SWITCH_SECONDS, type Dept } from "../config";
import { dataSource } from "../data/source";
import type { Appointment, LoungeVehicle } from "../data/types";
import { useNow, useSnapshot } from "../hooks";
import { appointmentStatus, fmt12, fmtLate, isSameDay, loungeStatus, type AppointmentStatus, type LoungeStatus } from "../logic";
import { ROLE_LABEL, type PortalUser } from "../session";

type Tab = "appointments" | "status";
type DeptFilter = Dept | "ALL";

// Bars lit on Vehicle Status per milestone (BU: Vehicle Received, Work In Progress, Washing, Final Inspection, Ready for Delivery).
const STAGE_COLUMNS = ["Vehicle Received", "Work In Progress", "Washing", "Final Inspection", "Ready for Delivery"];
const LIT_BARS: Record<string, number> = {
  "Gate In": 1, "Job Card": 1, "Estimate Approval": 1, "In Bay (WIP)": 2, "Washing": 3, "Ready for Delivery": 5,
};

const LOUNGE_ROW_REM = 2.9; // the same for Appointments and Vehicle Status, on every page and filter

const APPT_TONE: Record<AppointmentStatus, "green" | "grey" | "amber"> = { Arrived: "green", Expected: "grey", Late: "amber" };

export function LoungeScreen({ user, onSignOut }: { user: PortalUser; onSignOut: () => void }) {
  const { snapshot, error, nextIn } = useSnapshot();
  const now = useNow(1000);
  const [tab, setTab] = useState<Tab>("appointments");
  const [dept, setDept] = useState<DeptFilter>("ALL");
  const [autoSwitch, setAutoSwitch] = useState(true);
  const [countdown, setCountdown] = useState(TAB_SWITCH_SECONDS);
  const [sound, setSound] = useState(false);

  // Switch between Appointments and Vehicle Status every 15 seconds (can be paused).
  useEffect(() => {
    if (!autoSwitch) return;
    setCountdown(TAB_SWITCH_SECONDS);
    const t = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) { setTab((s) => (s === "appointments" ? "status" : "appointments")); return TAB_SWITCH_SECONDS; }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [autoSwitch]);

  // Chime when a vehicle becomes ready for delivery (new data arrives every 60 s).
  const readyRegs = useRef<Set<string> | null>(null);
  useEffect(() => {
    if (!snapshot) return;
    const ready = new Set(snapshot.vehicles.filter((v) => loungeStatus(v, snapshot.fetchedAt) === "Ready").map((v) => v.regNo));
    if (sound && readyRegs.current && [...ready].some((r) => !readyRegs.current!.has(r))) playChime();
    readyRegs.current = ready;
  }, [snapshot, sound]);

  // Rows and summary come from the SAME lists, so the numbers always match the table.
  const appointments = (snapshot?.appointments ?? [])
    .filter((a) => isSameDay(a.slot, now) && (dept === "ALL" || a.dept === dept))
    .sort((a, b) => a.slot - b.slot);
  const apptCount: Record<AppointmentStatus, number> = { Arrived: 0, Expected: 0, Late: 0 };
  for (const a of appointments) apptCount[appointmentStatus(a, now)]++;

  const vehicles = (snapshot?.vehicles ?? []).filter((v) => dept === "ALL" || v.dept === dept);
  const vehCount: Record<LoungeStatus, number> = { "On time": 0, Delayed: 0, Ready: 0 };
  for (const v of vehicles) vehCount[loungeStatus(v, now)]++;

  const apptNumber = new Map(appointments.map((a, i) => [a.id, i + 1]));
  const apptColumns: Column<Appointment>[] = [
    { key: "n", header: "#", width: "w-[4%]", className: "font-mono text-ink-3", render: (a) => apptNumber.get(a.id) },
    { key: "t", header: "Appointment Time", width: "w-[11%]", className: "font-mono font-semibold text-brand", render: (a) => fmt12(a.slot) },
    { key: "r", header: "Vehicle No.", width: "w-[12%]", className: "font-mono font-semibold text-ink", render: (a) => a.regNo },
    { key: "m", header: "Model", width: "w-[9%]", render: (a) => a.model },
    { key: "c", header: "Customer", width: "w-[17%]", className: "font-semibold text-ink", render: (a) => a.customer },
    { key: "sa", header: "Service Advisor", width: "w-[15%]", render: (a) => a.advisor },
    { key: "d", header: "Department", width: "w-[10%]", render: (a) => <DeptTag dept={a.dept} /> },
    { key: "vr", header: "Visit Reason", width: "w-[12%]", render: (a) => a.jobType },
    { key: "cs", header: "Customer Status", width: "w-[10%]", render: (a) => { const s = appointmentStatus(a, now); return <Pill tone={APPT_TONE[s]}>{s}</Pill>; } },
  ];

  const statusColumns: Column<LoungeVehicle>[] = [
    { key: "m", header: "Model", width: "w-[7%]", className: "font-semibold text-brand", render: (v) => v.model },
    { key: "r", header: "Registration", width: "w-[9.5%]", className: "font-mono font-semibold text-ink", render: (v) => v.regNo },
    { key: "c", header: "Customer", width: "w-[12.5%]", className: "font-semibold text-ink", render: (v) => v.customer },
    { key: "d", header: "Department", width: "w-[9%]", render: (v) => <DeptTag dept={v.dept} /> },
    { key: "vr", header: "Visit Reason", width: "w-[12%]", render: (v) => v.jobType },
    { key: "sa", header: "Service Advisor", width: "w-[13%]", render: (v) => v.advisor },
    { key: "st", header: "Status", width: "w-[11.5%]", render: (v) => {
      const s = loungeStatus(v, now);
      return s === "Ready" ? <Pill tone="green">Ready for pickup</Pill>
        : s === "Delayed" ? <Pill tone="red" blink>Delayed {fmtLate(Math.floor((now - v.edt) / 60000))}</Pill>
        : <Pill tone="blue">On time</Pill>;
    } },
    ...STAGE_COLUMNS.map((label, idx): Column<LoungeVehicle> => ({
      key: label, width: "w-[5.1%]",
      header: <span className="block text-[0.72rem] leading-tight">{label.split(" ").slice(0, -1).join(" ")}<br />{label.split(" ").slice(-1)}</span>,
      render: (v) => {
        const lit = idx < (LIT_BARS[MILESTONES[v.dept][v.stage]] ?? 1);
        return <div className={`h-[0.65rem] w-8 rounded-full ${lit ? (loungeStatus(v, now) === "Delayed" ? "bg-kpi-red" : "bg-kpi-green") : "bg-[#e3e7ee]"}`} />;
      },
    })),
  ];

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-page text-ink">
      <AppHeader context="Customer Lounge" name={user.name} role={ROLE_LABEL[user.role]} updatedAt={snapshot?.fetchedAt} onSignOut={onSignOut} />
      <main className="flex min-h-0 flex-1 flex-col gap-2.5 px-4 pb-1 pt-3">
        {tab === "appointments" ? (
          <KpiStrip items={[
            { label: "Appointments", value: appointments.length, tone: "blue", icon: "calendar" },
            { label: "Arrived", value: apptCount.Arrived, tone: "green", icon: "check" },
            { label: "Expected", value: apptCount.Expected, tone: "grey", icon: "clock" },
            { label: "Late", value: apptCount.Late, tone: "amber", icon: "alert" },
          ]} />
        ) : (
          <KpiStrip items={[
            { label: "Vehicles", value: vehicles.length, tone: "blue", icon: "car" },
            { label: "On time", value: vehCount["On time"], tone: "blue", icon: "check" },
            { label: "Delayed", value: vehCount.Delayed, tone: "red", icon: "alert" },
            { label: "Ready for pickup", value: vehCount.Ready, tone: "green", icon: "check" },
          ]} />
        )}
        <FilterBar>
          <PillGroup<Tab> label="Screen" value={tab} onChange={(t) => { setTab(t); setCountdown(TAB_SWITCH_SECONDS); }}
            options={[{ value: "appointments", label: "Appointments" }, { value: "status", label: "Vehicle Status" }]} />
          <PillGroup<DeptFilter> label="Department" value={dept} onChange={setDept}
            options={[{ value: "ALL", label: "All" }, { value: "MECHANICAL", label: "Mechanical" }, { value: "BODYSHOP", label: "Bodyshop" }]} />
          <div className="ml-auto flex items-center gap-3">
            <ToolButton onClick={() => setAutoSwitch(!autoSwitch)} title="Switch between the two screens every 15 seconds">
              {autoSwitch ? <>Auto-switch in <b>{countdown}s</b> · Pause</> : "Auto-switch off · Resume"}
            </ToolButton>
            <ToolButton onClick={() => setSound(!sound)} title="Chime when a vehicle is ready">Chime {sound ? "on" : "off"}</ToolButton>
          </div>
        </FilterBar>
        {tab === "appointments" ? (
          <DataTable columns={apptColumns} rows={appointments} rowKey={(a) => a.id}
            rowRem={LOUNGE_ROW_REM}
            empty="No appointments today." countLabel={`${appointments.length} appointments today`} />
        ) : (
          <DataTable columns={statusColumns} rows={vehicles} rowKey={(v) => v.regNo}
            rowRem={LOUNGE_ROW_REM}
            empty="No vehicles in the workshop." countLabel={`${vehicles.length} vehicles in the workshop`} />
        )}
      </main>
      <footer className="flex shrink-0 items-center justify-between px-6 pb-1.5 text-[0.78rem] text-ink-3">
        <span>Data: {dataSource.name}{error ? <span className="ml-2 text-kpi-red">· last refresh failed</span> : null}</span>
        <span>{tab === "appointments" ? "Appointment bookings can be made through the Tata Motors Service Connect App." : "Live status; updates automatically."}</span>
        <span>Next refresh in {nextIn}s</span>
      </footer>
    </div>
  );
}
