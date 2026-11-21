import React, { useState, useEffect, useRef } from "react";
import { WorksManagerScreen } from "./screens/WorksManagerScreen";
import { MILESTONES } from "./config";
import type { Snapshot } from "./data/types";
import { useSnapshot } from "./hooks";
import { loungeStatus } from "./logic";

// BU: no car images anywhere in the portal.

export type ServiceDepartment = "MECHANICAL" | "BODYSHOP";

// Workshop Bay Definition (for Bay-wise workshop monitoring)
export interface WorkshopBay {
  id: string;
  name: string;
  type: string;
  floorZone: string;
  defaultTechnician: string;
  technicalSupervisor: string;
  department: ServiceDepartment;
}

export const MECHANICAL_BAYS: WorkshopBay[] = [
  { id: "BAY-01", name: "Bay 01 - Heavy Repairs", type: "Heavy Running Repairs", floorZone: "Zone A (Mechanical)", defaultTechnician: "Ramesh Sharma", technicalSupervisor: "Parveen Vari", department: "MECHANICAL" },
  { id: "BAY-02", name: "Bay 02 - Periodic Service", type: "Mechanical / Periodic", floorZone: "Zone A (Mechanical)", defaultTechnician: "Sunil Verma", technicalSupervisor: "Parveen Vari", department: "MECHANICAL" },
  { id: "BAY-03", name: "Bay 03 - EV High Voltage", type: "EV High Voltage", floorZone: "Zone B (EV Special)", defaultTechnician: "Amit Saxena", technicalSupervisor: "Sanjay Deshmukh", department: "MECHANICAL" },
  { id: "BAY-04", name: "Bay 04 - Express Bay (Walk-In)", type: "Express Maintenance", floorZone: "Zone C (Express Fast-Track)", defaultTechnician: "Vikas Yadav", technicalSupervisor: "Parveen Vari", department: "MECHANICAL" },
  { id: "BAY-05", name: "Bay 05 - Wheel Alignment", type: "Wheel Alignment & Tyres", floorZone: "Zone D (Alignment)", defaultTechnician: "Manoj Tiwari", technicalSupervisor: "Sanjay Deshmukh", department: "MECHANICAL" },
  { id: "BAY-06", name: "Bay 06 - Washing & Final", type: "Washing & Detailing", floorZone: "Zone E (Wash & Inspection)", defaultTechnician: "Deepak Kumar", technicalSupervisor: "Sanjay Deshmukh", department: "MECHANICAL" },
];

export const BODYSHOP_BAYS: WorkshopBay[] = [
  { id: "BS-01", name: "Bay BS-01 - Frame Alignment & Jig", type: "Structural Frame & Heavy Collision", floorZone: "Zone BS-A (Chassis Alignment)", defaultTechnician: "Mohan Lal", technicalSupervisor: "Rajan Kulkarni", department: "BODYSHOP" },
  { id: "BS-02", name: "Bay BS-02 - Panel Beating & Denting", type: "Metal Work & Panel Beating", floorZone: "Zone BS-B (Body & Panel)", defaultTechnician: "Kailash Chand", technicalSupervisor: "Rajan Kulkarni", department: "BODYSHOP" },
  { id: "BS-03", name: "Bay BS-03 - Surface Prep & Primer", type: "Dry Sanding & Primer Booth", floorZone: "Zone BS-C (Paint Prep)", defaultTechnician: "Rakesh Pal", technicalSupervisor: "Dinesh Mehta", department: "BODYSHOP" },
  { id: "BS-04", name: "Bay BS-04 - Heated Paint Booth", type: "Bake Oven & Robotic Spray", floorZone: "Zone BS-D (Climate Paint Booth)", defaultTechnician: "Anand Swamy", technicalSupervisor: "Dinesh Mehta", department: "BODYSHOP" },
  { id: "BS-05", name: "Bay BS-05 - Reassembly & Trim", type: "Electrical, Trim & Calibration", floorZone: "Zone BS-E (Post-Paint Assembly)", defaultTechnician: "Suresh Jha", technicalSupervisor: "Rajan Kulkarni", department: "BODYSHOP" },
  { id: "BS-06", name: "Bay BS-06 - Rubbing & Polishing", type: "Ceramic Buffing & Detailing", floorZone: "Zone BS-F (Final Inspection)", defaultTechnician: "Kamal Hassan", technicalSupervisor: "Dinesh Mehta", department: "BODYSHOP" },
];

export const WORKSHOP_BAYS: WorkshopBay[] = [...MECHANICAL_BAYS, ...BODYSHOP_BAYS];

export interface BodyshopEstimate {
  estimatedAmount: string;
  insuranceProvider: string;
  approvalStatus: "Approved" | "Awaiting Customer Approval" | "Under Review";
  partsIncluded: string[];
  approvalDate?: string;
}

// Passenger Vehicle Database Record with Full BU Active Chip Telemetry
export interface Vehicle {
  edtMs?: number;              // estimated delivery time (epoch ms) from the shared data source
  id: string;
  numberTag: number; // 1, 2, 3 sequential badge
  regNo: string;
  model: string; // e.g. "Safari", "Harrier", "Nexon", "Curvv", "Punch", "Altroz"
  fullModelName: string;
  customer: string;
  serviceAdvisor: string;
  technicalSupervisor: string; // BU Requirement: Technical Supervisor
  technician: string;          // BU Requirement: Technician Name
  bayId: string;               // BU Requirement: Bay (e.g. "BAY-01" or "BS-01")
  bayName: string;
  allocation: string;          // BU Active Chip: Allocation Slot & RFID chip
  workType: string;
  serviceDept: ServiceDepartment; // BU Requirement: Mechanical vs Bodyshop
  bodyshopEstimate?: BodyshopEstimate; // BU Bodyshop Milestone: Customer estimate approval data
  ptdDate: string;             // BU Requirement: Promised Delivery Date (e.g. "19 Oct 2026")
  ptdTime: string;             // BU Requirement: Promised Delivery Time (e.g. "05:15 PM")
  ptd: string;                 // Full Promised Time of Delivery (e.g. "19 Oct 2026, 05:15 PM")
  isPtdCrossed: boolean;       // BU Requirement: Blink if PTD is crossed
  plannedDate: string;         // BU Requirement: Planned Date
  plannedTime: string;         // BU Requirement: Planned Time / Target Duration
  targetTime: string;          // BU Active Chip: Target Time
  workStart: string;           // BU Active Chip: Work Start
  workEnd: string;             // BU Active Chip: Work End
  qiStatus: "Passed" | "Under QI" | "Pending" | "In Progress"; // BU Active Chip: Quality Inspection
  promiseTime: string;
  stageIndex: number; // 0 to 5 (Lounge status)
  wmStageIndex: number; // Index in pipeline stages
  flightStatus: "ON TIME" | "DELAYED" | "EXPEDITED" | "READY FOR PICKUP";
  delayMinutes?: number;       // Base delay in minutes
  isWalkIn: boolean;
  odometer: string;
  jobCard: string;
  badgeType?: "red" | "blue" | "gray";
  badgeText?: string;
  vehCategory: string;
  gateInDate: string;
  promisedDeliveryDate: string;
}

// 100% Passenger Vehicles (PV) - Mechanical & Bodyshop Fleets
// Service Status Pipeline Columns (Receptionist Table)
const STATUS_STAGES = [
  { key: "received", label: "Vehicle Received" },
  { key: "ro_created", label: "RO Created" },
  { key: "wip", label: "Work In Progress" },
  { key: "washing", label: "Washing" },
  { key: "inspection", label: "Final Inspection" },
  { key: "ready", label: "Ready For Delivery" }
];

// BU (Nov 2026): "RO Created" is not shown on the lounge Vehicle Status screen.
const LOUNGE_STATUS_STAGES = STATUS_STAGES.filter((st) => st.key !== "ro_created");

// BU Requirement: Mechanical Vehicle Servicing Milestones (10 Stages)
export const MECHANICAL_PIPELINE_STAGES = [
  "Gate In",
  "SR",
  "JC",
  "Floor In",
  "WIP",
  "Washing",
  "Floor Out",
  "Road Test",
  "JC Closed",
  "Gate Out"
];

// BU Requirement: Bodyshop Servicing Milestones (11 Stages)
// "And for Bodyshop servicing, there should be a milestone between Floor In and WIP, called Customer estimate approval."
export const BODYSHOP_PIPELINE_STAGES = [
  "Gate In",
  "SR",
  "JC",
  "Floor In",
  "Customer estimate approval",
  "WIP",
  "Washing",
  "Floor Out",
  "Road Test",
  "JC Closed",
  "Gate Out"
];

// Default helper for pipeline stages
export function getPipelineStages(dept?: ServiceDepartment): string[] {
  return dept === "BODYSHOP" ? BODYSHOP_PIPELINE_STAGES : MECHANICAL_PIPELINE_STAGES;
}

// Fallback compatibility alias
const WM_PIPELINE_STAGES = MECHANICAL_PIPELINE_STAGES;

interface GeneralFilterOption {
  type: "all" | "workType" | "model" | "flightStatus" | "bay" | "dept";
  value: string;
  label: string;
}

const DROPDOWN_FILTER_GROUPS: { group: string; options: GeneralFilterOption[] }[] = [
  {
    group: "Overview",
    options: [
      { type: "all", value: "ALL", label: "All Vehicles / All Bays (12)" },
      { type: "dept", value: "MECHANICAL", label: "🚗 Mechanical Servicing Only (6 Bays)" },
      { type: "dept", value: "BODYSHOP", label: "🎨 Bodyshop Servicing Only (6 Bays)" }
    ]
  },
  {
    group: "Mechanical Bays",
    options: [
      { type: "bay", value: "BAY-01", label: "Bay 01 - Heavy Repairs" },
      { type: "bay", value: "BAY-02", label: "Bay 02 - Periodic Service" },
      { type: "bay", value: "BAY-03", label: "Bay 03 - EV High Voltage" },
      { type: "bay", value: "BAY-04", label: "Bay 04 - Express Bay (Walk-In)" },
      { type: "bay", value: "BAY-05", label: "Bay 05 - Wheel Alignment" },
      { type: "bay", value: "BAY-06", label: "Bay 06 - Washing & Final" },
    ]
  },
  {
    group: "Bodyshop Bays",
    options: [
      { type: "bay", value: "BS-01", label: "Bay BS-01 - Frame Alignment & Jig" },
      { type: "bay", value: "BS-02", label: "Bay BS-02 - Panel Beating & Denting" },
      { type: "bay", value: "BS-03", label: "Bay BS-03 - Surface Prep & Primer" },
      { type: "bay", value: "BS-04", label: "Bay BS-04 - Heated Paint Booth" },
      { type: "bay", value: "BS-05", label: "Bay BS-05 - Reassembly & Trim" },
      { type: "bay", value: "BS-06", label: "Bay BS-06 - Rubbing & Polishing" },
    ]
  },
  {
    group: "By Work Type",
    options: [
      { type: "workType", value: "First Free Service", label: "First Free Service" },
      { type: "workType", value: "Second Free Service", label: "Second Free Service" },
      { type: "workType", value: "Paid Service", label: "Paid Service" },
      { type: "workType", value: "Running Repairs", label: "Running Repairs" },
      { type: "workType", value: "Accidental Bodyshop Repair", label: "Accidental Bodyshop Repair" },
      { type: "workType", value: "Denting & Painting", label: "Denting & Painting" },
      { type: "workType", value: "Scratch & Dent Repair", label: "Scratch & Dent Repair" }
    ]
  },
  {
    group: "By Vehicle Model",
    options: [
      { type: "model", value: "Safari", label: "Tata Safari" },
      { type: "model", value: "Harrier", label: "Tata Harrier" },
      { type: "model", value: "Nexon", label: "Tata Nexon / EV" },
      { type: "model", value: "Curvv", label: "Tata Curvv EV" },
      { type: "model", value: "Punch", label: "Tata Punch / EV" },
      { type: "model", value: "Altroz", label: "Tata Altroz" }
    ]
  },
  {
    group: "By Delivery Status",
    options: [
      { type: "flightStatus", value: "READY FOR PICKUP", label: "Ready For Pickup" },
      { type: "flightStatus", value: "ON TIME", label: "On Time" },
      { type: "flightStatus", value: "DELAYED", label: "Delayed" },
      { type: "flightStatus", value: "EXPEDITED", label: "Expedited" }
    ]
  }
];

// =========================================================================
// BU changes (Nov 2026): appointments for today only, and log in once a day.
// =========================================================================
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const pad2 = (n: number) => String(n).padStart(2, "0");
const fmtLong = (d: Date) => `${pad2(d.getDate())} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
const fmtShort = (d: Date) => `${pad2(d.getDate())} ${MONTHS[d.getMonth()]} '${String(d.getFullYear()).slice(2)}`;
const fmtSlash = (d: Date) => `${d.getFullYear()}/${pad2(d.getMonth() + 1)}/${pad2(d.getDate())}`;

// All screens read the same data source (src/data/source.ts: sandbox now, DMS later).
// The lounge screens still use their original Vehicle shape, so the snapshot is converted here.
const fmt12 = (ms: number) => new Date(ms).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
const LOUNGE_STAGE_INDEX: Record<string, number> = {
  "Gate In": 0, "Job Card": 1, "Estimate Approval": 1, "In Bay (WIP)": 2, "Washing": 3, "Ready for Delivery": 5,
};
function toLegacyVehicle(base: { regNo: string; model: string; customer: string; advisor: string; dept: ServiceDepartment; jobType: string }, slot: number, i: number): Vehicle {
  const day = fmtShort(new Date(slot));
  return {
    id: `V-${base.regNo}`, numberTag: i + 1, regNo: base.regNo, model: base.model, fullModelName: `Tata ${base.model}`,
    customer: base.customer, serviceAdvisor: base.advisor, technicalSupervisor: "", technician: "", bayId: "", bayName: "",
    allocation: "", workType: base.jobType, serviceDept: base.dept, ptdDate: "", ptdTime: "", ptd: "", isPtdCrossed: false,
    plannedDate: "", plannedTime: "", targetTime: "", workStart: "", workEnd: "", qiStatus: "Pending", promiseTime: "",
    stageIndex: 0, wmStageIndex: 0, flightStatus: "ON TIME", delayMinutes: 0, isWalkIn: false, odometer: "", jobCard: "",
    vehCategory: "", gateInDate: `${day}, ${fmt12(slot)}`, promisedDeliveryDate: "",
  };
}
function buildLoungeVehicles(snapshot: Snapshot | null, now: number): { vehicles: Vehicle[]; queueVehicles: Vehicle[] } {
  if (!snapshot) return { vehicles: [], queueVehicles: [] };
  const slotByReg = new Map(snapshot.appointments.map((a) => [a.regNo, a.slot]));
  const vehicles = snapshot.vehicles.map((lv, i) => {
    const v = toLegacyVehicle(lv, slotByReg.get(lv.regNo) ?? lv.edt, i);
    const status = loungeStatus(lv, now);
    const lateMins = Math.max(0, Math.floor((now - lv.edt) / 60000));
    v.stageIndex = LOUNGE_STAGE_INDEX[MILESTONES[lv.dept][lv.stage]] ?? 0;
    v.flightStatus = status === "Ready" ? "READY FOR PICKUP" : status === "Delayed" ? "DELAYED" : "ON TIME";
    v.isPtdCrossed = status === "Delayed";
    v.delayMinutes = status === "Delayed" ? lateMins : 0;
    v.edtMs = lv.edt;
    v.ptdTime = fmt12(lv.edt);
    return v;
  });
  const queueVehicles = snapshot.appointments
    .filter((a) => a.arrivedAt === undefined)
    .map((a, i) => toLegacyVehicle(a, a.slot, i));
  return { vehicles, queueVehicles };
}
const isTodayLabel = (label: string) => label.startsWith(fmtShort(new Date())) || label.startsWith(fmtLong(new Date()));
// "20 Nov '26, 09:15 AM" -> minutes since midnight (for sorting)
const minutesOf = (label: string) => {
  const m = label.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!m) return 0;
  return ((Number(m[1]) % 12) + (m[3].toUpperCase() === "PM" ? 12 : 0)) * 60 + Number(m[2]);
};
const timeOnly = (label: string) => label.split(",").pop()?.trim() ?? label;

// Log in once a day: the login is kept on this device until midnight.
type PortalUser = { role: "Receptionist" | "WorksManager"; name: string; username: string };
const SESSION_KEY = "tml-service-status-daily-login";
function loadDailyUser(): PortalUser | null {
  try {
    const saved = JSON.parse(localStorage.getItem(SESSION_KEY) ?? "null");
    if (!saved || saved.day !== fmtSlash(new Date())) { localStorage.removeItem(SESSION_KEY); return null; }
    return saved.user as PortalUser;
  } catch { return null; }
}
function saveDailyUser(user: PortalUser | null) {
  if (user) localStorage.setItem(SESSION_KEY, JSON.stringify({ user, day: fmtSlash(new Date()) }));
  else localStorage.removeItem(SESSION_KEY);
}
// TV / bit.ly link: ?role=frontoffice shows only the Receptionist login.
const LOGIN_ROLE = new URLSearchParams(window.location.search).get("role");

export default function App() {
  const [currentUser, setCurrentUserState] = useState<PortalUser | null>(loadDailyUser);
  const setCurrentUser = (user: PortalUser | null) => { saveDailyUser(user); setCurrentUserState(user); };
  // After midnight the screen goes back to the login page (the link is kept).
  useEffect(() => {
    if (!currentUser) return;
    const t = setInterval(() => { if (!loadDailyUser()) setCurrentUserState(null); }, 60_000);
    return () => clearInterval(t);
  }, [currentUser]);
  const [usernameInput, setUsernameInput] = useState("NP7_3007960");
  const [passwordInput, setPasswordInput] = useState("••••••••••");

  // BU Requirement: Support Mechanical vehicle servicing AND Bodyshop servicing
  const [selectedDept, setSelectedDept] = useState<"ALL" | "MECHANICAL" | "BODYSHOP">("ALL");

  const [receptionTab, setReceptionTab] = useState<"appointments" | "status">("appointments");
  const [rotationCountdown, setRotationCountdown] = useState<number>(15);
  const [isRotating, setIsRotating] = useState<boolean>(true);

  const [selectedMilestoneFilter, setSelectedMilestoneFilter] = useState<string>("ALL");
  const [generalFilter, setGeneralFilter] = useState<GeneralFilterOption>({
    type: "all",
    value: "ALL",
    label: "All"
  });
  // Works Manager View Mode: "bay" (Bay-wise Board requested by BU) or "pipeline" (Milestone Pipeline row view)
  const [wmViewMode, setWmViewMode] = useState<"bay" | "pipeline">("bay");
  // Same data source as the Workshop Board (refreshes every 60 s).
  const { snapshot, nextIn: countdown } = useSnapshot();
  const { vehicles, queueVehicles } = buildLoungeVehicles(snapshot, snapshot?.fetchedAt ?? Date.now());
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 15-Second Auto-Rotation between 1. Appointments and 2. Vehicle Status for Reception Login (Walk-In screen removed)
  useEffect(() => {
    if (!currentUser || currentUser.role !== "Receptionist") return;

    const rotationInterval = setInterval(() => {
      if (!isRotating) return;

      setRotationCountdown((prev) => {
        if (prev <= 1) {
          setReceptionTab((curr) => (curr === "appointments" ? "status" : "appointments"));
          return 15;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(rotationInterval);
  }, [currentUser, isRotating, receptionTab]);

  const playAirportChime = () => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const t = ctx.currentTime;

      const osc1 = ctx.createOscillator();
      const g1 = ctx.createGain();
      osc1.frequency.setValueAtTime(659.25, t);
      g1.gain.setValueAtTime(0.09, t);
      g1.gain.exponentialRampToValueAtTime(0.001, t + 0.45);
      osc1.connect(g1);
      g1.connect(ctx.destination);
      osc1.start(t);
      osc1.stop(t + 0.5);

      const osc2 = ctx.createOscillator();
      const g2 = ctx.createGain();
      osc2.frequency.setValueAtTime(523.25, t + 0.35);
      g2.gain.setValueAtTime(0.1, t + 0.35);
      g2.gain.exponentialRampToValueAtTime(0.001, t + 0.9);
      osc2.connect(g2);
      g2.connect(ctx.destination);
      osc2.start(t + 0.35);
      osc2.stop(t + 0.95);
    } catch {}
  };

  // Chime when a vehicle becomes ready for delivery (new data arrives every 60 s).
  const readyRegs = useRef<Set<string> | null>(null);
  useEffect(() => {
    if (!snapshot) return;
    const ready = new Set(vehicles.filter((v) => v.flightStatus === "READY FOR PICKUP").map((v) => v.regNo));
    if (readyRegs.current && [...ready].some((r) => !readyRegs.current!.has(r))) playAirportChime();
    readyRegs.current = ready;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [snapshot]);



  const [delayElapsedSeconds, setDelayElapsedSeconds] = useState<number>(0);

  // Live delay elapsed ticker: increments every second with the live clock so delayed time visibly changes
  useEffect(() => {
    const ticker = setInterval(() => {
      setDelayElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(ticker);
  }, []);

  // Live active delay calculation function that updates every second
  const getLiveVehicleDelay = (v: Vehicle) => {
    const isDelayed = v.flightStatus === "DELAYED" || v.isPtdCrossed;
    if (!isDelayed) {
      return {
        isDelayed: false,
        delayMinutes: 0,
        delaySeconds: 0,
        displayMins: "0m",
        displayLive: "On Schedule",
        estimatedDeliveryTime: `Est. ${v.workEnd || v.ptdTime || "04:30 PM"}`
      };
    }

    // Base delay in minutes from vehicle profile (defaults to 25m for delayed vehicle)
    const baseMins = v.delayMinutes && v.delayMinutes > 0 ? v.delayMinutes : 25;
    const totalSecs = v.edtMs !== undefined
      ? Math.max(0, Math.floor((currentTime.getTime() - v.edtMs) / 1000))
      : (baseMins * 60) + delayElapsedSeconds;
    const liveMins = Math.floor(totalSecs / 60);
    const liveSecs = totalSecs % 60;
    const secStr = liveSecs.toString().padStart(2, "0");

    // Dynamically calculate revised delivery time from the vehicle's specific ptdTime (e.g. "05:15 PM")
    let ptdHours = 17;
    let ptdMins = 15;
    if (v.ptdTime) {
      const match = v.ptdTime.match(/(\d+):(\d+)\s*(AM|PM)?/i);
      if (match) {
        let h = parseInt(match[1], 10);
        const m = parseInt(match[2], 10);
        const period = (match[3] || "").toUpperCase();
        if (period === "PM" && h < 12) h += 12;
        if (period === "AM" && h === 12) h = 0;
        ptdHours = h;
        ptdMins = m;
      }
    }
    const ptdTotalMinutes = (ptdHours * 60) + ptdMins;
    const estTotalMinutes = ptdTotalMinutes + liveMins;
    const estHours24 = Math.floor(estTotalMinutes / 60) % 24;
    const estRemainingMins = estTotalMinutes % 60;
    const estPeriod = estHours24 >= 12 ? "PM" : "AM";
    const estHours12 = estHours24 > 12 ? estHours24 - 12 : (estHours24 === 0 ? 12 : estHours24);
    const estimatedDeliveryTime = `Est. Delivery: ${String(estHours12).padStart(2, "0")}:${String(estRemainingMins).padStart(2, "0")} ${estPeriod}`;

    return {
      isDelayed: true,
      delayMinutes: liveMins,
      delaySeconds: liveSecs,
      displayMins: `+${liveMins}m`,
      displayLive: `+${liveMins}m ${secStr}s`,
      estimatedDeliveryTime
    };
  };



  // Indian Number Plate badge with authentic IND blue strip
  // BU Requirement: Current status with color, and BLINK if delayed or PTD crossed (showing live ticking delay)
  const renderFlightBadge = (
    status: Vehicle["flightStatus"],
    delay?: number,
    isPtdCrossed?: boolean,
    liveDisplay?: string
  ) => {
    if (status === "DELAYED" || isPtdCrossed) {
      return (
        <span className="bg-red-600 text-white border border-red-300 px-2 py-0.5 rounded text-[10px] font-black tracking-wide blink-alarm inline-flex items-center space-x-1.5 shadow-sm shadow-red-500/50">
          <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
          <span>⚠️ DELAYED ({liveDisplay || `+${delay || 25}m`}) • PTD CROSSED</span>
        </span>
      );
    }
    if (status === "READY FOR PICKUP") {
      return (
        <span className="bg-emerald-600 text-white px-2 py-0.5 rounded text-[10px] font-extrabold inline-flex items-center space-x-1 shadow-2xs">
          <span>✓</span>
          <span>READY FOR PICKUP</span>
        </span>
      );
    }
    if (status === "EXPEDITED") {
      return (
        <span className="bg-amber-400 text-slate-950 border border-amber-600 px-2 py-0.5 rounded text-[10px] font-black inline-flex items-center space-x-1 shadow-2xs">
          <span>⚡</span>
          <span>EXPEDITED PRIORITY</span>
        </span>
      );
    }
    return (
      <span className="bg-emerald-100 text-emerald-800 border border-emerald-400 px-2 py-0.5 rounded text-[10px] font-bold inline-flex items-center space-x-1">
        <span className="text-[8px] text-emerald-600">●</span>
        <span>ON TIME</span>
      </span>
    );
  };

  // =========================================================================
  // VIEW 1: LOGIN PAGE
  // =========================================================================
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col justify-between text-slate-800 font-sans">
        <div>
          <div className="bg-white border-b border-slate-200 px-8 py-3 flex justify-between items-center text-xs">
            <div className="flex items-center space-x-3">
              <span className="font-extrabold text-blue-900 tracking-wider text-base">TATA MOTORS</span>
              <span className="text-slate-400 border-l border-slate-300 pl-3">Connecting Aspirations</span>
            </div>
            <span className="font-semibold text-slate-600">Signing-in to the portal</span>
          </div>
          <div className="bg-[#002244] text-white px-8 py-3.5 shadow-md flex items-center justify-between">
            <span className="font-bold tracking-widest text-lg">TATA MOTORS</span>
            <span className="text-xs text-blue-200">TMSA-PV Workshop Portal</span>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center items-center p-4">
          <div className="bg-white border border-slate-200 rounded-lg shadow-xl p-8 w-full max-w-sm">
            <div className="text-center mb-6">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">TMSA-PV Workshop Portal</h2>
              <p className="text-xs text-slate-500 mt-1">Select your role to access Tata Motors live screens</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Username *</label>
                <input
                  type="text"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:outline-none focus:border-blue-600 bg-blue-50/40"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Password *</label>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:outline-none focus:border-blue-600 bg-blue-50/40"
                />
              </div>

              <div className="pt-2 flex flex-col space-y-2">
                <button
                  onClick={() => setCurrentUser({ role: "Receptionist", name: "Priya Sharma (Reception)", username: "REC_DELHI_01" })}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded text-xs font-semibold transition shadow-xs flex items-center justify-center space-x-1.5"
                >
                  <span>📺 Customer Lounge &amp; FIDS Display</span>
                </button>
                {LOGIN_ROLE !== "frontoffice" && (
                <button
                  onClick={() => setCurrentUser({ role: "WorksManager", name: "Neeraj Patel (Works Manager)", username: "NP7_3007960" })}
                  className="w-full bg-[#002244] hover:bg-[#001730] text-white py-2.5 rounded text-xs font-semibold transition shadow-xs flex items-center justify-center space-x-1.5"
                >
                  <span>🔧 Works Manager Workshop Board</span>
                </button>
                )}
              </div>
            </div>
          </div>
          <div className="text-xs text-slate-500 mt-6 font-mono text-center">
            Tata Motors Passenger Vehicles (PV) • Pasco Motors Dealership (3007960)
          </div>
        </div>

        <div className="border-t border-slate-200 py-3 text-center text-xs text-slate-400">
          Copyright, Confidential, Tata Motors Limited
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: WORKS MANAGER INTERFACE (Tata Passenger Vehicles & Real Images)
  // =========================================================================
  if (currentUser.role === "WorksManager") {
    // BU (Nov 2026): Workshop board as a table, one row per bay (whiteboard layout). No tile view.
    return (
      <WorksManagerScreen
        onOpenLounge={() => setCurrentUser({ role: "Receptionist", name: "Priya Sharma (Reception)", username: "REC_DELHI_01" })}
        onSignOut={() => setCurrentUser(null)}
      />
    );
  }

  // =========================================================================
  // VIEW 3: RECEPTIONIST INTERFACE (Customer Lounge & AI Telecaller CRM)
  // BU Requirement: Remove Bay wise tracking from Reception screen. It is required only for Workshop Board.
  // =========================================================================
  return (
    <div className="min-h-screen flex flex-col bg-[#040911] text-white font-sans select-none">
      <header className="bg-[#0b1724] border-b border-gray-800 px-6 py-2.5 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-4">
          <span className="font-extrabold text-blue-400 tracking-wider text-base">TATA MOTORS</span>
          <span className="text-gray-500">|</span>
          <span className="text-gray-300">TATA MOTORS PASSENGER VEHICLES LOUNGE (3007960)</span>
          <span className="bg-blue-950 text-blue-300 px-2 py-0.5 rounded border border-blue-800 text-[10px]">
            {currentUser.name}
          </span>
        </div>

        <nav className="flex items-center space-x-1.5 bg-black/40 p-1 rounded border border-gray-800">
          <button
            onClick={() => {
              setReceptionTab("appointments");
              setRotationCountdown(15);
            }}
            className={`px-3 py-1 rounded font-semibold transition ${
              receptionTab === "appointments" ? "bg-blue-600 text-white shadow-xs" : "text-gray-400 hover:text-white"
            }`}
          >
            1. Appointments
          </button>
          <button
            onClick={() => {
              setReceptionTab("status");
              setRotationCountdown(15);
            }}
            className={`px-3 py-1 rounded font-semibold transition ${
              receptionTab === "status" ? "bg-blue-600 text-white shadow-xs" : "text-gray-400 hover:text-white"
            }`}
          >
            2. Vehicle Status
          </button>

          {(
            <div className="flex items-center space-x-1.5 bg-blue-950/80 border border-blue-600/60 px-2 py-0.5 rounded text-[11px] text-blue-200 ml-1 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
              <span>
                Auto-switch: <b className="text-white font-mono">{rotationCountdown}s</b>
              </span>
              <button
                onClick={() => setIsRotating(!isRotating)}
                className="text-[10px] text-cyan-300 hover:text-white underline ml-1 cursor-pointer"
                title={isRotating ? "Pause auto-switch" : "Resume auto-switch"}
              >
                {isRotating ? "Pause" : "Resume"}
              </button>
            </div>
          )}
        </nav>

        <div className="flex items-center space-x-3">
          {/* Lounge Department Filter */}
          <div className="flex items-center bg-slate-900 border border-slate-700 p-0.5 rounded text-[10px]">
            <button
              onClick={() => setSelectedDept("ALL")}
              className={`px-2 py-0.5 rounded font-bold cursor-pointer transition ${
                selectedDept === "ALL" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedDept("MECHANICAL")}
              className={`px-2 py-0.5 rounded font-bold cursor-pointer transition ${
                selectedDept === "MECHANICAL" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              🚗 Mechanical
            </button>
            <button
              onClick={() => setSelectedDept("BODYSHOP")}
              className={`px-2 py-0.5 rounded font-bold cursor-pointer transition ${
                selectedDept === "BODYSHOP" ? "bg-amber-600 text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              🎨 Bodyshop
            </button>
          </div>

          {/* Quick Switch to Works Manager */}
          <button
            onClick={() => setCurrentUser({ role: "WorksManager", name: "Neeraj Patel (Works Manager)", username: "NP7_3007960" })}
            className="bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 text-[11px] px-2.5 py-1 rounded transition cursor-pointer"
          >
            🔧 Workshop Board
          </button>

          <div className="flex items-center space-x-1.5 bg-slate-900 border border-slate-700 px-2 py-1 rounded">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            <span className="text-[11px] text-gray-300 font-mono">Refresh: <b className="text-cyan-400">{countdown}s</b></span>
          </div>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`px-2 py-1 rounded border text-[11px] cursor-pointer ${
              soundEnabled ? "bg-cyan-950 text-cyan-300 border-cyan-500" : "bg-gray-800 text-gray-400 border-gray-700"
            }`}
          >
            {soundEnabled ? "🔊 Chime ON" : "🔇 Chime OFF"}
          </button>

          {/* Live Date and Clock in Lounge Header */}
          <div className="text-right font-mono text-[11px] border-l border-gray-700 pl-3 pr-2">
            <div className="text-cyan-300 font-bold flex items-center justify-end space-x-1">
              <span className="text-[10px]">📅</span>
              <span>{currentTime.toLocaleDateString("en-IN", { weekday: "short", day: "2-digit", month: "short", year: "numeric" })}</span>
            </div>
            <div className="text-white font-mono font-bold text-xs flex items-center justify-end space-x-1 mt-0.5">
              <span className="text-[10px]">⏰</span>
              <span>{currentTime.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true })}</span>
            </div>
          </div>

          <button
            onClick={() => setCurrentUser(null)}
            className="text-gray-400 hover:text-red-400 ml-2 text-xs cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* RECEPTIONIST SCREEN 1: APPOINTMENTS (No Bay tracking - Customer Centric) */}
      {receptionTab === "appointments" && (
        <main className="flex-1 flex flex-col p-6 overflow-y-auto">
          <div className="flex items-center justify-between border-b-2 border-gray-700 pb-2 mb-4">
            <div className="flex items-center space-x-3">
              <span className="text-xl font-bold tracking-tight text-white uppercase">Appointments</span>
              <span className="text-xs text-gray-400 font-mono">TATA MOTORS PASSENGER VEHICLES LOUNGE</span>
              <span className="text-[11px] text-cyan-300 bg-cyan-950/70 border border-cyan-800/80 px-2.5 py-0.5 rounded-full flex items-center space-x-1.5 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
                <span>Auto-switching to Vehicle Status in <b>{rotationCountdown}s</b></span>
              </span>
            </div>
            <span className="text-lg font-black tracking-widest text-gray-300">TATA MOTORS</span>
          </div>

          {/* BU: list view (no tiles, no vehicle images), today's appointments only, no walk-in differentiation */}
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-[#122336] text-gray-300 border-b border-gray-700 font-semibold uppercase text-xs">
                  <th className="py-3 px-3">#</th>
                  <th className="py-3 px-3">Time</th>
                  <th className="py-3 px-3">Vehicle No.</th>
                  <th className="py-3 px-3">Model</th>
                  <th className="py-3 px-3">Customer</th>
                  <th className="py-3 px-3">Service Advisor</th>
                  <th className="py-3 px-3">Department</th>
                  <th className="py-3 px-3">Work Type</th>
                  <th className="py-3 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {[
                  ...vehicles.map((v) => ({ v, upcoming: false })),
                  ...queueVehicles.map((v) => ({ v, upcoming: true })),
                ]
                  .filter(({ v }) => isTodayLabel(v.gateInDate) && (selectedDept === "ALL" || v.serviceDept === selectedDept))
                  .sort((a, b) => minutesOf(a.v.gateInDate) - minutesOf(b.v.gateInDate))
                  .map(({ v, upcoming }, idx) => {
                    const isBodyshop = v.serviceDept === "BODYSHOP";
                    return (
                      <tr key={`appt-${v.id}`} className="hover:bg-[#0c1827]">
                        <td className="py-2.5 px-3 text-gray-400 font-mono">{idx + 1}</td>
                        <td className="py-2.5 px-3 font-mono font-bold text-cyan-300">{timeOnly(v.gateInDate)}</td>
                        <td className="py-2.5 px-3 font-mono font-bold text-white tracking-wide">{v.regNo}</td>
                        <td className="py-2.5 px-3 text-gray-200">{v.model}</td>
                        <td className="py-2.5 px-3 font-bold text-white uppercase">{v.customer}</td>
                        <td className="py-2.5 px-3 text-gray-200">{v.serviceAdvisor}</td>
                        <td className="py-2.5 px-3">
                          <span className={`px-2 py-0.5 rounded font-bold text-[11px] border ${
                            isBodyshop ? "bg-amber-950 text-amber-300 border-amber-800" : "bg-blue-950 text-cyan-300 border-blue-800"
                          }`}>
                            {isBodyshop ? "🎨 Bodyshop" : "🚗 Mechanical"}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-gray-300">{v.workType}</td>
                        <td className="py-2.5 px-3">
                          {upcoming ? (
                            <span className="px-2 py-0.5 rounded text-[11px] font-bold border bg-slate-800 text-slate-300 border-slate-600">EXPECTED</span>
                          ) : (
                            renderFlightBadge(v.flightStatus, v.delayMinutes, v.isPtdCrossed, getLiveVehicleDelay(v).displayLive)
                          )}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>

          <div className="mt-6 pt-3 border-t border-gray-800 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-white">TATA MOTORS</span>
              <span className="text-gray-400 text-xs">Service | Connected Adaptive Responsive Engage</span>
            </div>
            <div className="bg-[#0d1c2d] px-4 py-1 rounded-full border border-gray-800 text-gray-300 text-xs">
              Appointment bookings can now be made directly through the <b className="text-cyan-400">Tata Motors Service Connect App</b>.
            </div>
            <div className="flex space-x-2 font-mono text-xs">
              <span className="bg-[#112233] px-3 py-1 rounded border border-gray-700 text-cyan-300 font-bold">
                📅 {currentTime.toLocaleDateString("en-IN", { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}
              </span>
              <span className="bg-[#112233] px-3 py-1 rounded border border-gray-700 text-white font-bold">
                ⏰ {currentTime.toLocaleTimeString("en-IN", { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
              </span>
            </div>
          </div>
        </main>
      )}

      {/* RECEPTIONIST SCREEN 3: VEHICLE STATUS (No Bay tracking - Shows Department & Customer Estimate Approval) */}
      {receptionTab === "status" && (
        <main className="flex-1 flex flex-col p-6 overflow-y-auto">
          <div className="flex items-center justify-between border-b-2 border-gray-700 pb-2 mb-4">
            <div className="flex items-center space-x-3">
              <span className="text-xl font-bold tracking-tight text-white uppercase">TATA MOTORS Vehicle Status</span>
              <span className="text-xs text-gray-400 font-mono">LIVE CUSTOMER LOUNGE DISPLAY</span>
            </div>
            <span className="text-lg font-black tracking-widest text-gray-300">TATA MOTORS</span>
          </div>

          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#122336] text-gray-300 border-b border-gray-700 font-semibold uppercase text-[11px]">
                  <th className="py-3 px-3">Model</th>
                  <th className="py-3 px-3">Registration</th>
                  <th className="py-3 px-3">Customer</th>
                  <th className="py-3 px-3">Department</th>
                  <th className="py-3 px-3">Work Type</th>
                  <th className="py-3 px-3">Service Advisor</th>
                  <th className="py-3 px-3">Status</th>
                  {LOUNGE_STATUS_STAGES.map((col) => (
                    <th key={col.key} className="py-3 px-2 text-center">
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {vehicles
                  .filter(v => selectedDept === "ALL" || v.serviceDept === selectedDept)
                  .map((v) => {
                    const itemDelay = getLiveVehicleDelay(v);
                    const isItemDelayed = v.flightStatus === "DELAYED" || v.isPtdCrossed;
                    const isBodyshop = v.serviceDept === "BODYSHOP";

                    return (
                      <tr key={v.id} className={`transition ${isItemDelayed ? "bg-red-950/20 hover:bg-red-950/30" : "hover:bg-[#0c1827]"}`}>
                        <td className="py-3 px-3 font-bold text-[#00b4d8] text-[13px]">{v.model}</td>
                        <td className="py-3 px-3 font-mono font-bold text-white tracking-wide text-[13px]">{v.regNo}</td>
                        <td className="py-3 px-3 font-bold text-white text-[12px] uppercase">{v.customer}</td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded font-bold text-[10px] border ${
                            isBodyshop
                              ? "bg-amber-950 text-amber-300 border-amber-800"
                              : "bg-blue-950 text-cyan-300 border-blue-800"
                          }`}>
                            {isBodyshop ? "🎨 Bodyshop" : "🚗 Mechanical"}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-bold text-white text-[11px]">{v.workType}</div>
                          {isBodyshop && v.bodyshopEstimate && (
                            <div className="text-[9.5px] text-amber-400 mt-0.5 flex items-center space-x-1">
                              <span>Estimate:</span>
                              <b className="font-mono">{v.bodyshopEstimate.estimatedAmount}</b>
                              <span>({v.bodyshopEstimate.approvalStatus})</span>
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-3 text-gray-200">
                          <div className="font-bold text-[11px]">{v.serviceAdvisor}</div>
                        </td>
                        <td className="py-3 px-3">
                          {renderFlightBadge(v.flightStatus, v.delayMinutes, v.isPtdCrossed, itemDelay.displayLive)}
                          {isItemDelayed && (
                            <div className="text-[9.5px] font-mono text-red-400 font-bold mt-1 animate-pulse">
                              ⏱️ Delay: {itemDelay.displayLive}
                            </div>
                          )}
                        </td>
                        {LOUNGE_STATUS_STAGES.map((col) => {
                          const isCompleted = STATUS_STAGES.indexOf(col) <= v.stageIndex;
                          return (
                            <td key={col.key} className="py-3 px-2 text-center">
                              <div className="flex justify-center">
                                <div className={`w-8 h-4 rounded transition-all ${
                                  isCompleted 
                                    ? (isItemDelayed ? "bg-red-500 drop-shadow-[0_0_6px_rgba(239,68,68,0.7)]" : "bg-emerald-400 drop-shadow-[0_0_6px_rgba(52,211,153,0.7)]")
                                    : "bg-gray-800 opacity-20"
                                }`}></div>
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>

          <div className="mt-6 pt-3 border-t border-gray-800 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-white">TATA MOTORS</span>
              <span className="text-gray-400 text-xs">Vehicle Milestone Tracking &amp; Delivery Matrix</span>
            </div>
            <div className="bg-[#0d1c2d] px-4 py-1 rounded-full border border-gray-800 text-gray-300 text-xs">
              Live customer status display updates automatically. Mechanical &amp; Bodyshop servicing tracked concurrently.
            </div>
            <div className="flex space-x-2 font-mono text-xs">
              <span className="bg-[#112233] px-3 py-1 rounded border border-gray-700 text-cyan-300 font-bold">
                📅 {currentTime.toLocaleDateString("en-IN", { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}
              </span>
              <span className="bg-[#112233] px-3 py-1 rounded border border-gray-700 text-white font-bold">
                ⏰ {currentTime.toLocaleTimeString("en-IN", { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
              </span>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
