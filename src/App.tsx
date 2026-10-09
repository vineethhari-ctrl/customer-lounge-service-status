import React, { useState, useEffect, useRef } from "react";

// =========================================================================
// REAL TATA MOTORS PASSENGER VEHICLES (PV) IMAGES MAPPING
// High-resolution transparent background PNGs with authentic silhouettes & subtle drop shadow
// =========================================================================

export function getTataCarImage(
  model: string,
  className: string = "w-full h-full object-contain filter drop-shadow-[0_8px_14px_rgba(0,0,0,0.6)] transition-transform duration-200"
) {
  const norm = (model || "").toLowerCase();
  let localPath = "/images/cars/safari.png";
  let cdnFallback = "https://imgd.aeplcdn.com/664x374/n/cw/ec/138895/safari-exterior-right-front-three-quarter-40.png?isig=0&q=80";
  let altText = "Tata Safari";

  if (norm.includes("harrier")) {
    localPath = "/images/cars/harrier.png";
    cdnFallback = "https://imgd.aeplcdn.com/664x374/n/cw/ec/139139/harrier-exterior-right-front-three-quarter-7.png?isig=0&q=80";
    altText = "Tata Harrier";
  } else if (norm.includes("nexon")) {
    localPath = "/images/cars/nexon.png";
    cdnFallback = "https://imgd.aeplcdn.com/664x374/n/cw/ec/141867/nexon-exterior-right-front-three-quarter-79.png?isig=0&q=80";
    altText = "Tata Nexon";
  } else if (norm.includes("punch")) {
    localPath = "/images/cars/punch.png";
    cdnFallback = "https://imgd.aeplcdn.com/664x374/n/cw/ec/172825/punch-exterior-right-front-three-quarter-250.png?isig=0&q=80";
    altText = "Tata Punch";
  } else if (norm.includes("altroz")) {
    localPath = "/images/cars/altroz.png";
    cdnFallback = "https://imgd.aeplcdn.com/664x374/n/cw/ec/199863/altroz-exterior-right-front-three-quarter-13.png?isig=0&q=80";
    altText = "Tata Altroz";
  } else if (norm.includes("curvv")) {
    localPath = "/images/cars/curvv.png";
    cdnFallback = "https://imgd.aeplcdn.com/664x374/n/cw/ec/139651/curvv-exterior-right-front-three-quarter-16.png?isig=0&q=80";
    altText = "Tata Curvv";
  } else if (norm.includes("safari")) {
    localPath = "/images/cars/safari.png";
    cdnFallback = "https://imgd.aeplcdn.com/664x374/n/cw/ec/138895/safari-exterior-right-front-three-quarter-40.png?isig=0&q=80";
    altText = "Tata Safari";
  }

  return (
    <img
      src={localPath}
      alt={altText}
      className={className}
      loading="eager"
      onError={(e) => {
        // Fallback to official CDN if local file encounters any issue
        if (e.currentTarget.src !== cdnFallback) {
          e.currentTarget.src = cdnFallback;
        }
      }}
    />
  );
}

// Passenger Vehicle Database Record
export interface Vehicle {
  id: string;
  numberTag: number; // 1, 3, 5 style badge
  regNo: string;
  model: string; // e.g. "Safari", "Harrier", "Nexon", "Curvv", "Punch", "Altroz"
  fullModelName: string;
  customer: string;
  serviceAdvisor: string;
  workType: string;
  promiseTime: string;
  stageIndex: number; // 0 to 5
  wmStageIndex: number; // 0 to 9 (Gate In to Gate Out, No Fenced In/Out)
  flightStatus: "ON TIME" | "DELAYED" | "EXPEDITED" | "READY FOR PICKUP";
  delayMinutes?: number;
  isWalkIn: boolean;
  odometer: string;
  jobCard: string;
  badgeType?: "red" | "blue" | "gray";
  badgeText?: string;
  vehCategory: string;
  gateInDate: string;
  promisedDeliveryDate: string;
}

// 100% Passenger Vehicles (PV) - Tata Safari, Harrier, Nexon, Curvv, Punch, Altroz
export const INITIAL_VEHICLES: Vehicle[] = [
  {
    id: "V1",
    numberTag: 1,
    regNo: "UP81DJ6809",
    model: "Safari",
    fullModelName: "Tata Safari Dark Edition",
    customer: "Rajesh K. Verma",
    serviceAdvisor: "Rohit Malviya",
    workType: "Running Repairs",
    promiseTime: "2026/12/24 04:30 PM",
    stageIndex: 2,
    wmStageIndex: 4,
    flightStatus: "ON TIME",
    isWalkIn: false,
    odometer: "28,400 KM",
    jobCard: "JC-TML-DEL-2324-004429",
    badgeType: "red",
    badgeText: "JC-TML-DEL-2324-004429",
    vehCategory: "Premium SUV",
    gateInDate: "18 Jul '23, 09:15 AM",
    promisedDeliveryDate: "18 Jul '23, 04:30 PM"
  },
  {
    id: "V2",
    numberTag: 3,
    regNo: "DL14CH2428",
    model: "Harrier",
    fullModelName: "Tata Harrier Fearless Red",
    customer: "Sunita Aggarwal",
    serviceAdvisor: "Saurabh Joshi",
    workType: "Paid Service",
    promiseTime: "2026/12/24 05:15 PM",
    stageIndex: 4,
    wmStageIndex: 7,
    flightStatus: "DELAYED",
    delayMinutes: 20,
    isWalkIn: false,
    odometer: "38,200 KM",
    jobCard: "JC-TML-DEL-2324-004812",
    badgeType: "red",
    badgeText: "JC-TML-DEL-2324-004812",
    vehCategory: "Mid-Size SUV",
    gateInDate: "18 Jul '23, 09:40 AM",
    promisedDeliveryDate: "18 Jul '23, 05:15 PM"
  },
  {
    id: "V3",
    numberTag: 5,
    regNo: "UP16CS7403",
    model: "Nexon",
    fullModelName: "Tata Nexon.ev Empowered",
    customer: "Anand Deshmukh",
    serviceAdvisor: "Imran Khan",
    workType: "Second Free Service",
    promiseTime: "2026/12/24 03:45 PM",
    stageIndex: 3,
    wmStageIndex: 5,
    flightStatus: "ON TIME",
    isWalkIn: false,
    odometer: "14,850 KM",
    jobCard: "SR-TML-DEL-2324-004645",
    badgeType: "blue",
    badgeText: "SR-TML-DEL-2324-004645",
    vehCategory: "Electric SUV",
    gateInDate: "18 Jul '23, 10:00 AM",
    promisedDeliveryDate: "18 Jul '23, 03:45 PM"
  },
  {
    id: "V4",
    numberTag: 7,
    regNo: "UP14EJ9609",
    model: "Curvv",
    fullModelName: "Tata Curvv EV Coupe",
    customer: "Rohan Verma",
    serviceAdvisor: "Hemendra Chundawat",
    workType: "First Free Service",
    promiseTime: "2026/12/24 06:00 PM",
    stageIndex: 1,
    wmStageIndex: 2,
    flightStatus: "EXPEDITED",
    isWalkIn: true,
    odometer: "4,500 KM",
    jobCard: "JC-TML-DEL-2324-004426",
    badgeType: "red",
    badgeText: "JC-TML-DEL-2324-004426",
    vehCategory: "Coupe SUV",
    gateInDate: "18 Jul '23, 10:30 AM",
    promisedDeliveryDate: "18 Jul '23, 06:00 PM"
  },
  {
    id: "V5",
    numberTag: 9,
    regNo: "DL5CS0664",
    model: "Punch",
    fullModelName: "Tata Punch.ev Accomplished",
    customer: "Vikramaditya Roy",
    serviceAdvisor: "Praveen Nair",
    workType: "First Free Service",
    promiseTime: "2026/12/24 02:00 PM",
    stageIndex: 5,
    wmStageIndex: 8,
    flightStatus: "READY FOR PICKUP",
    isWalkIn: false,
    odometer: "12,340 KM",
    jobCard: "JC-TML-DEL-2324-004810",
    badgeType: "red",
    badgeText: "JC-TML-DEL-2324-004810",
    vehCategory: "Compact SUV",
    gateInDate: "18 Jul '23, 08:30 AM",
    promisedDeliveryDate: "18 Jul '23, 02:00 PM"
  },
  {
    id: "V6",
    numberTag: 11,
    regNo: "MH01EK9921",
    model: "Altroz",
    fullModelName: "Tata Altroz Racer Edition",
    customer: "Farhan Akhtar",
    serviceAdvisor: "Naveen Kaushik",
    workType: "Running Repairs",
    promiseTime: "2026/12/24 05:45 PM",
    stageIndex: 0,
    wmStageIndex: 0,
    flightStatus: "ON TIME",
    isWalkIn: false,
    odometer: "21,100 KM",
    jobCard: "SR-TML-DEL-2324-004899",
    badgeType: "blue",
    badgeText: "SR-TML-DEL-2324-004899",
    vehCategory: "Premium Hatchback",
    gateInDate: "18 Jul '23, 11:15 AM",
    promisedDeliveryDate: "18 Jul '23, 05:45 PM"
  }
];

// Dedicated Next in Queue Vehicles with specific customer & model assignments
export const QUEUE_VEHICLES: Vehicle[] = [
  {
    id: "Q1",
    numberTag: 1,
    regNo: "HR26DK5510",
    model: "Safari",
    fullModelName: "Tata Safari Accomplished Plus",
    customer: "Deepak Chopra",
    serviceAdvisor: "Hemendra Chundawat",
    workType: "Paid Service",
    promiseTime: "2026/12/24 06:30 PM",
    stageIndex: 0,
    wmStageIndex: 1,
    flightStatus: "ON TIME",
    isWalkIn: false,
    odometer: "44,200 KM",
    jobCard: "JC-TML-DEL-2324-004901",
    badgeType: "red",
    badgeText: "JC-TML-DEL-2324-004901",
    vehCategory: "Premium SUV",
    gateInDate: "18 Jul '23, 11:30 AM",
    promisedDeliveryDate: "18 Jul '23, 06:30 PM"
  },
  {
    id: "Q2",
    numberTag: 2,
    regNo: "DL03CB8821",
    model: "Harrier",
    fullModelName: "Tata Harrier Adventure Plus",
    customer: "Meenakshi Iyer",
    serviceAdvisor: "Saurabh Joshi",
    workType: "Running Repairs",
    promiseTime: "2026/12/24 07:00 PM",
    stageIndex: 0,
    wmStageIndex: 0,
    flightStatus: "ON TIME",
    isWalkIn: false,
    odometer: "22,600 KM",
    jobCard: "JC-TML-DEL-2324-004933",
    badgeType: "red",
    badgeText: "JC-TML-DEL-2324-004933",
    vehCategory: "Mid-Size SUV",
    gateInDate: "18 Jul '23, 11:45 AM",
    promisedDeliveryDate: "18 Jul '23, 07:00 PM"
  }
];

// Service Status Pipeline Columns (Receptionist Table)
const STATUS_STAGES = [
  { key: "received", label: "Vehicle Received" },
  { key: "ro_created", label: "RO Created" },
  { key: "wip", label: "Work In Progress" },
  { key: "washing", label: "Washing" },
  { key: "inspection", label: "Final Inspection" },
  { key: "ready", label: "Ready For Delivery" }
];

// Works Manager Milestone Pipeline Stages
const WM_PIPELINE_STAGES = [
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

interface GeneralFilterOption {
  type: "all" | "workType" | "model" | "flightStatus";
  value: string;
  label: string;
}

const DROPDOWN_FILTER_GROUPS: { group: string; options: GeneralFilterOption[] }[] = [
  {
    group: "Overview",
    options: [
      { type: "all", value: "ALL", label: "All Vehicles" }
    ]
  },
  {
    group: "By Work Type",
    options: [
      { type: "workType", value: "First Free Service", label: "First Free Service" },
      { type: "workType", value: "Second Free Service", label: "Second Free Service" },
      { type: "workType", value: "Paid Service", label: "Paid Service" },
      { type: "workType", value: "Running Repairs", label: "Running Repairs" }
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

export default function App() {
  const [currentUser, setCurrentUser] = useState<{ role: "Receptionist" | "WorksManager"; name: string; username: string } | null>(null);
  const [usernameInput, setUsernameInput] = useState("NP7_1007960");
  const [passwordInput, setPasswordInput] = useState("••••••••••");

  const [receptionTab, setReceptionTab] = useState<"appointments" | "walkin" | "status">("appointments");
  const [rotationCountdown, setRotationCountdown] = useState<number>(15);
  const [isRotating, setIsRotating] = useState<boolean>(true);

  const [selectedMilestoneFilter, setSelectedMilestoneFilter] = useState<string>("ALL");
  const [generalFilter, setGeneralFilter] = useState<GeneralFilterOption>({
    type: "all",
    value: "ALL",
    label: "All"
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [vehicles, setVehicles] = useState<Vehicle[]>(INITIAL_VEHICLES);
  const [countdown, setCountdown] = useState<number>(20);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 15-Second Auto-Rotation between 1. Appointments and 2. Walk-In Customers for Reception Login
  useEffect(() => {
    if (!currentUser || currentUser.role !== "Receptionist") return;

    const rotationInterval = setInterval(() => {
      if (!isRotating) return;

      // Only auto-rotate when currently displaying Appointments or Walk-In Customers
      if (receptionTab === "status") return;

      setRotationCountdown((prev) => {
        if (prev <= 1) {
          setReceptionTab((curr) => (curr === "appointments" ? "walkin" : "appointments"));
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

  // 20-Second Refresh Countdown Engine
  useEffect(() => {
    if (!currentUser) return;

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          playAirportChime();
          setVehicles((prevV) => {
            const next = [...prevV];
            const randIdx = Math.floor(Math.random() * next.length);
            if (next[randIdx].stageIndex < STATUS_STAGES.length - 1) {
              const nextStage = next[randIdx].stageIndex + 1;
              const nextWmStage = Math.min(next[randIdx].wmStageIndex + 1, WM_PIPELINE_STAGES.length - 1);
              next[randIdx] = {
                ...next[randIdx],
                stageIndex: nextStage,
                wmStageIndex: nextWmStage,
                flightStatus: nextStage === STATUS_STAGES.length - 1 ? "READY FOR PICKUP" : next[randIdx].flightStatus
              };
            }
            return next;
          });
          return 20;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentUser, soundEnabled]);

  const advanceVehicleMilestone = (id: string) => {
    setVehicles((prev) => prev.map((v) => {
      if (v.id === id) {
        const nextWmIdx = (v.wmStageIndex + 1) % WM_PIPELINE_STAGES.length;
        const nextStageIdx = Math.min(
          STATUS_STAGES.length - 1,
          Math.floor((nextWmIdx / (WM_PIPELINE_STAGES.length - 1)) * (STATUS_STAGES.length - 1))
        );
        return {
          ...v,
          wmStageIndex: nextWmIdx,
          stageIndex: nextStageIdx,
          flightStatus: nextWmIdx >= 8 ? "READY FOR PICKUP" : "ON TIME"
        };
      }
      return v;
    }));
  };

  // Indian Number Plate badge with authentic IND blue strip
  const renderIndianPlate = (plate: string) => (
    <div className="inline-flex items-center bg-white text-black font-mono px-1.5 py-0.5 rounded shadow-xs border border-slate-300">
      <div className="flex flex-col items-center justify-center bg-[#003399] text-white px-1 py-0.5 rounded-xs mr-1.5 leading-none">
        <div className="w-2 h-2 rounded-full border border-dotted border-white/90 flex items-center justify-center mb-0.5">
          <div className="w-0.5 h-0.5 rounded-full bg-white"></div>
        </div>
        <span className="text-[6px] font-sans font-bold tracking-tighter">IND</span>
      </div>
      <span className="text-xs font-black text-slate-900 tracking-wider font-mono">{plate}</span>
    </div>
  );

  const renderFlightBadge = (status: Vehicle["flightStatus"], delay?: number) => {
    if (status === "READY FOR PICKUP") {
      return <span className="bg-emerald-500 text-black px-2 py-0.5 rounded text-[10px] font-bold animate-pulse">READY</span>;
    }
    if (status === "DELAYED") {
      return <span className="bg-amber-100 text-amber-800 border border-amber-400 px-2 py-0.5 rounded text-[10px] font-semibold">DELAYED (+{delay || 15}m)</span>;
    }
    if (status === "EXPEDITED") {
      return <span className="bg-cyan-100 text-cyan-800 border border-cyan-400 px-2 py-0.5 rounded text-[10px] font-semibold">EXPEDITED</span>;
    }
    return <span className="bg-emerald-100 text-emerald-800 border border-emerald-400 px-2 py-0.5 rounded text-[10px] font-semibold">ON TIME</span>;
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
                <button
                  onClick={() => setCurrentUser({ role: "WorksManager", name: "Neeraj Patel (Works Manager)", username: "NP7_1007960" })}
                  className="w-full bg-[#002244] hover:bg-[#001730] text-white py-2.5 rounded text-xs font-semibold transition shadow-xs flex items-center justify-center space-x-1.5"
                >
                  <span>🔧 Works Manager Workshop Board</span>
                </button>
              </div>
            </div>
          </div>
          <div className="text-xs text-slate-500 mt-6 font-mono text-center">
            Tata Motors Passenger Vehicles (PV) • Pasco Motors Dealership (1007960)
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
    return (
      <div className="min-h-screen flex flex-col bg-[#F3F4F6] text-slate-900 font-sans select-none">
        {/* Top Header */}
        <div className="bg-[#002244] text-white px-6 py-2.5 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="font-extrabold text-base tracking-wider">TATA MOTORS</span>
            <span className="text-xs text-blue-200 border-l border-blue-900 pl-3">TMSA-PV Works Manager</span>
          </div>

          <div className="flex items-center space-x-5">
            {/* Quick Switch to Lounge View */}
            <button
              onClick={() => setCurrentUser({ role: "Receptionist", name: "Priya Sharma (Reception)", username: "REC_DELHI_01" })}
              className="bg-blue-800/60 hover:bg-blue-700 border border-blue-600 text-white text-[11px] px-2.5 py-1 rounded transition"
            >
              📺 Open Lounge View
            </button>

            {/* 20-Second Refresh Meter */}
            <div className="flex items-center space-x-1.5 bg-slate-900 border border-slate-700 px-2 py-1 rounded">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              <span className="text-[11px] text-slate-300 font-mono">Refresh: <b className="text-cyan-400">{countdown}s</b></span>
            </div>

            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`px-2 py-1 rounded text-[11px] border ${
                soundEnabled ? "bg-cyan-950 text-cyan-300 border-cyan-500" : "bg-slate-800 text-slate-400 border-slate-700"
              }`}
            >
              {soundEnabled ? "🔊 Chime ON" : "🔇 Chime OFF"}
            </button>

            <div className="text-right border-l border-blue-900 pl-4">
              <div className="font-bold text-xs">TATA MOTORS AUTHORIZED SERVICE - 1007960</div>
              <div className="text-[10px] text-blue-200 font-mono">DELHI PV WORKSHOP | 1-9FRGY0Z</div>
            </div>

            <div className="flex items-center space-x-2 border-l border-blue-900 pl-3">
              <div className="w-7 h-7 rounded-full bg-white text-blue-950 font-bold flex items-center justify-center text-xs">
                NP
              </div>
              <span className="font-semibold text-xs text-white">{currentUser.name} ▾</span>
            </div>

            <button
              onClick={() => setCurrentUser(null)}
              className="text-xs text-red-300 hover:text-white underline ml-2"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Sub Header Ribbon */}
        <div className="bg-white border-b border-gray-300 px-6 py-2 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-3">
            <span className="font-bold text-blue-900 tracking-wider">TATA MOTORS</span>
            <span className="text-[11px] text-gray-400">Connecting Aspirations</span>
            <span className="text-gray-300">|</span>
            <span className="font-semibold text-gray-700">TATA MOTORS PASSENGER VEHICLES WORKSHOP-1007960</span>
            <span className="text-gray-400 text-[11px]">Passenger Vehicle (PV) Track &amp; Trace</span>
          </div>
          <div className="text-right font-mono text-[11px] text-gray-600">
            <div>Fri, 21 July '23</div>
            <div className="font-bold">{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
          </div>
        </div>

        {/* Milestone Metrics Ribbon - Aligned directly over the actual milestone stepper */}
        <div className="bg-[#E5E7EB] border-b border-gray-300 px-6 py-1.5 flex items-center gap-2.5 text-xs select-none">
          {/* Left area matching vehicle info columns */}
          <div className="w-[455px] shrink-0 flex items-center justify-between pr-2">
            <div className="flex items-center space-x-2">
              {/* Functional All Dropdown Menu */}
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={`border px-3 py-1 rounded text-xs font-bold shadow-2xs transition cursor-pointer flex items-center space-x-1.5 ${
                    generalFilter.type !== "all"
                      ? "bg-blue-600 text-white border-blue-700 shadow-xs"
                      : "bg-[#002244] hover:bg-[#001730] text-white border-[#002244]"
                  }`}
                >
                  <span className="truncate max-w-[130px]">{generalFilter.label}</span>
                  <span className={`text-[9px] transform transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}>
                    ▾
                  </span>
                </button>

                {isDropdownOpen && (
                  <div className="absolute left-0 top-full mt-1.5 w-60 bg-white border border-gray-300 rounded shadow-2xl z-50 py-1 text-xs text-gray-800 max-h-80 overflow-y-auto">
                    {DROPDOWN_FILTER_GROUPS.map((grp) => (
                      <div key={grp.group} className="border-b border-gray-100 last:border-0 pb-1 mb-1 last:mb-0 last:pb-0">
                        <div className="px-3 py-1 text-[9.5px] font-extrabold text-gray-500 uppercase tracking-wider bg-gray-50">
                          {grp.group}
                        </div>
                        {grp.options.map((opt) => {
                          const isSelected =
                            generalFilter.type === opt.type && generalFilter.value === opt.value;
                          return (
                            <button
                              key={`${opt.type}-${opt.value}`}
                              type="button"
                              onClick={() => {
                                setGeneralFilter(opt);
                                setIsDropdownOpen(false);
                              }}
                              className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between transition hover:bg-blue-50 ${
                                isSelected ? "bg-blue-100 text-blue-900 font-bold" : "text-gray-700"
                              }`}
                            >
                              <span>{opt.label}</span>
                              {isSelected && <span className="text-blue-600 font-bold">✓</span>}
                            </button>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <span className="text-[11px] font-bold text-gray-700">
                Milestone Pipeline
              </span>
            </div>

            {(generalFilter.type !== "all" || selectedMilestoneFilter !== "ALL") && (
              <button
                type="button"
                onClick={() => {
                  setGeneralFilter({ type: "all", value: "ALL", label: "All" });
                  setSelectedMilestoneFilter("ALL");
                }}
                className="text-[10px] text-blue-700 hover:underline font-semibold cursor-pointer"
              >
                Clear Filter ✕
              </button>
            )}
          </div>

          {/* Right area matching the stepper line width and padding */}
          <div className="flex-1 px-1 flex items-center justify-between">
            {WM_PIPELINE_STAGES.map((label) => {
              const isSelected = selectedMilestoneFilter === label;
              return (
                <div key={label} className="w-11 flex justify-center">
                  <button
                    onClick={() => setSelectedMilestoneFilter(isSelected ? "ALL" : label)}
                    title={`Filter by ${label}`}
                    className={`border px-1 py-0.5 rounded shadow-2xs font-extrabold text-[8.5px] uppercase transition cursor-pointer text-center w-full truncate ${
                      isSelected
                        ? "bg-blue-600 text-white border-blue-700 shadow-xs"
                        : "bg-white hover:bg-blue-50 text-gray-800 border-gray-300"
                    }`}
                  >
                    {label}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Vehicles Board with Realistic Tata Car Images - Compact Single-View Layout */}
        <div className="flex-1 p-3 space-y-1.5 overflow-y-auto">
          {(() => {
            const list = vehicles.filter((v) => {
              if (selectedMilestoneFilter !== "ALL") {
                if (WM_PIPELINE_STAGES[v.wmStageIndex] !== selectedMilestoneFilter) {
                  return false;
                }
              }
              if (generalFilter.type === "workType") {
                if (v.workType !== generalFilter.value) return false;
              } else if (generalFilter.type === "model") {
                if (v.model !== generalFilter.value) return false;
              } else if (generalFilter.type === "flightStatus") {
                if (v.flightStatus !== generalFilter.value) return false;
              }
              return true;
            });

            if (list.length === 0) {
              return (
                <div className="bg-white border border-dashed border-gray-300 rounded p-8 text-center text-gray-500 text-xs shadow-2xs">
                  <p className="font-semibold text-gray-800 text-sm mb-1">No vehicles matching the selected filters.</p>
                  <p className="text-gray-500 text-[11px] mb-3">Try choosing another milestone stage or resetting the dropdown filter.</p>
                  <button
                    type="button"
                    onClick={() => {
                      setGeneralFilter({ type: "all", value: "ALL", label: "All" });
                      setSelectedMilestoneFilter("ALL");
                    }}
                    className="bg-[#002244] hover:bg-[#001730] text-white px-3 py-1 rounded text-xs font-semibold shadow-2xs cursor-pointer"
                  >
                    Reset to All Vehicles
                  </button>
                </div>
              );
            }

            return list.map((v) => (
              <div
                key={v.id}
                className="bg-white border border-gray-300 rounded shadow-2xs px-3 py-1 flex flex-col xl:flex-row xl:items-center justify-between gap-2.5 text-xs hover:border-blue-400 transition"
              >
              {/* Left Vehicle Details - width 455px matching header */}
              <div className="flex items-center gap-2.5 w-[455px] shrink-0">
                {/* PV Real Image Box & Tag Badge */}
                <div className="flex flex-col items-center justify-center w-[115px] shrink-0">
                  <div className="w-22 h-10 flex items-center justify-center bg-[#071322] rounded border border-gray-200 p-0.5 mb-0.5 shadow-2xs overflow-hidden">
                    {getTataCarImage(v.model, "w-full h-full object-contain filter drop-shadow-[0_3px_5px_rgba(0,0,0,0.5)]")}
                  </div>
                  {v.badgeType === "red" && (
                    <span className="bg-[#D32F2F] text-white text-[8px] font-bold px-1.5 py-0.2 rounded-xs shadow-2xs truncate max-w-[115px] leading-tight text-center">
                      {v.badgeText}
                    </span>
                  )}
                  {v.badgeType === "blue" && (
                    <span className="bg-[#1976D2] text-white text-[8px] font-bold px-1.5 py-0.2 rounded-xs shadow-2xs truncate max-w-[115px] leading-tight text-center">
                      {v.badgeText}
                    </span>
                  )}
                  {v.badgeType === "gray" && (
                    <span className="bg-white border border-gray-300 text-gray-500 text-[8px] font-semibold px-1.5 py-0.2 rounded-xs shadow-2xs leading-tight text-center">
                      {v.badgeText}
                    </span>
                  )}
                </div>

                {/* Meta Specifications Column 1 */}
                <div className="grid grid-cols-[55px_1fr] gap-y-0.2 text-[10px] leading-tight w-[155px] shrink-0">
                  <span className="text-gray-500 text-[9px]">Veh. No:</span>
                  <span className="font-extrabold text-gray-900 font-mono text-[10.5px]">{v.regNo}</span>

                  <span className="text-gray-500 text-[9px]">SA Name:</span>
                  <span className="font-semibold text-gray-800 text-[10px] truncate">{v.serviceAdvisor}</span>

                  <span className="text-gray-500 text-[9px]">Odometer:</span>
                  <span className="text-gray-800 text-[10px]">{v.odometer}</span>

                  <span className="text-gray-500 text-[9px]">ST:</span>
                  <span className="font-bold text-gray-900 text-[10px]">{v.workType}</span>
                </div>

                {/* Meta Specifications Column 2 */}
                <div className="grid grid-cols-[55px_1fr] gap-y-0.2 text-[10px] leading-tight w-[175px] shrink-0 border-l border-gray-200 pl-2.5">
                  <div className="col-span-2 text-gray-900 font-bold text-[10.5px] truncate pb-0.5">
                    {v.fullModelName}
                  </div>

                  <span className="text-gray-500 text-[9px]">TL Name:</span>
                  <span className="font-semibold text-gray-800 text-[10px]">PARVEEN VARI</span>

                  <span className="text-gray-500 text-[9px]">Veh. Type:</span>
                  <span className="font-bold text-blue-700 text-[10px]">{v.vehCategory?.includes("EV") ? "EV PASSENGER" : "PV PASSENGER"}</span>

                  <span className="text-gray-500 text-[9px]">Veh. Category:</span>
                  <span className="text-gray-800 text-[10px]">{v.vehCategory}</span>
                </div>
              </div>

              {/* Right Stepper Section - flex-1 px-1 matching header */}
              <div className="flex-1 flex flex-col justify-center px-1">
                <div className="relative flex items-center justify-between">
                  <div className="absolute top-2 left-2 right-2 h-0.5 bg-gray-200 -z-0"></div>
                  <div
                    className="absolute top-2 left-2 h-0.5 bg-emerald-500 -z-0 transition-all duration-300"
                    style={{ width: `${(v.wmStageIndex / (WM_PIPELINE_STAGES.length - 1)) * 96}%` }}
                  ></div>

                  {WM_PIPELINE_STAGES.map((label, idx) => {
                    const isCompleted = idx < v.wmStageIndex;
                    const isCurrent = idx === v.wmStageIndex;

                    return (
                      <div
                        key={label}
                        className="w-11 flex flex-col items-center z-10 cursor-pointer group"
                        onClick={() => advanceVehicleMilestone(v.id)}
                        title={`Click to set stage to ${label}`}
                      >
                        {label === "WIP" && isCurrent ? (
                          <div className="w-3.5 h-3.5 rotate-45 bg-[#4CAF50] border border-white shadow-2xs flex items-center justify-center">
                            <span className="-rotate-45 text-[6px] font-bold text-white">●</span>
                          </div>
                        ) : (
                          <div
                            className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[7px] font-bold transition-all ${
                              isCompleted || isCurrent
                                ? "bg-[#4CAF50] text-white"
                                : "bg-gray-200 text-gray-400"
                            }`}
                          >
                            {isCompleted || isCurrent ? "✓" : ""}
                          </div>
                        )}

                        <span
                          className={`text-[8px] mt-0.5 tracking-tight text-center max-w-[42px] leading-none ${
                            isCurrent ? "font-bold text-emerald-800" : "text-gray-500"
                          }`}
                        >
                          {label}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Gate In & Promised Delivery Timestamps */}
                <div className="flex justify-between items-center text-[9px] text-gray-500 mt-1 pt-0.5 border-t border-gray-100">
                  <div>
                    GATE IN: <b className="text-gray-800 font-mono">{v.gateInDate || "18 Jul '23, 10:00 AM"}</b>
                  </div>
                  <div className="flex items-center space-x-2">
                    {renderFlightBadge(v.flightStatus, v.delayMinutes)}
                    <span>PROMISED DELIVERY: <b className="text-gray-800 font-mono">{v.promisedDeliveryDate || v.promiseTime}</b></span>
                    <button
                      onClick={() => advanceVehicleMilestone(v.id)}
                      className="bg-[#002244] hover:bg-[#001730] text-white text-[9px] px-2 py-0.5 rounded font-semibold transition shadow-2xs"
                    >
                      Advance ➔
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))})()}
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 3: RECEPTIONIST INTERFACE (Customer Lounge & AI Telecaller CRM)
  // =========================================================================
  return (
    <div className="min-h-screen flex flex-col bg-[#040911] text-white font-sans select-none">
      <header className="bg-[#0b1724] border-b border-gray-800 px-6 py-2.5 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-4">
          <span className="font-extrabold text-blue-400 tracking-wider text-base">TATA MOTORS</span>
          <span className="text-gray-500">|</span>
          <span className="text-gray-300">TATA MOTORS PASSENGER VEHICLES LOUNGE (1007960)</span>
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
              setReceptionTab("walkin");
              setRotationCountdown(15);
            }}
            className={`px-3 py-1 rounded font-semibold transition ${
              receptionTab === "walkin" ? "bg-blue-600 text-white shadow-xs" : "text-gray-400 hover:text-white"
            }`}
          >
            2. Walk-In Customers
          </button>
          <button
            onClick={() => setReceptionTab("status")}
            className={`px-3 py-1 rounded font-semibold transition ${
              receptionTab === "status" ? "bg-blue-600 text-white shadow-xs" : "text-gray-400 hover:text-white"
            }`}
          >
            3. Vehicle Status
          </button>

          {receptionTab !== "status" && (
            <div className="flex items-center space-x-1.5 bg-blue-950/80 border border-blue-600/60 px-2 py-0.5 rounded text-[11px] text-blue-200 ml-1 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
              <span>
                Auto-switch: <b className="text-white font-mono">{rotationCountdown}s</b>
              </span>
              <button
                onClick={() => setIsRotating(!isRotating)}
                className="text-[10px] text-cyan-300 hover:text-white underline ml-1"
                title={isRotating ? "Pause auto-switch" : "Resume auto-switch"}
              >
                {isRotating ? "Pause" : "Resume"}
              </button>
            </div>
          )}
        </nav>

        <div className="flex items-center space-x-3">
          {/* Quick Switch to Works Manager */}
          <button
            onClick={() => setCurrentUser({ role: "WorksManager", name: "Neeraj Patel (Works Manager)", username: "NP7_1007960" })}
            className="bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 text-[11px] px-2.5 py-1 rounded transition"
          >
            🔧 Workshop Board
          </button>

          <div className="flex items-center space-x-1.5 bg-slate-900 border border-slate-700 px-2 py-1 rounded">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            <span className="text-[11px] text-gray-300 font-mono">Refresh: <b className="text-cyan-400">{countdown}s</b></span>
          </div>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`px-2 py-1 rounded border text-[11px] ${
              soundEnabled ? "bg-cyan-950 text-cyan-300 border-cyan-500" : "bg-gray-800 text-gray-400 border-gray-700"
            }`}
          >
            {soundEnabled ? "🔊 Chime ON" : "🔇 Chime OFF"}
          </button>

          <button
            onClick={() => setCurrentUser(null)}
            className="text-gray-400 hover:text-red-400 ml-2 text-xs"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* RECEPTIONIST SCREEN 1: APPOINTMENTS (Card Style with Real Tata Vehicles) */}
      {receptionTab === "appointments" && (
        <main className="flex-1 flex flex-col p-6 overflow-y-auto">
          <div className="flex items-center justify-between border-b-2 border-gray-700 pb-2 mb-4">
            <div className="flex items-center space-x-3">
              <span className="text-xl font-bold tracking-tight text-white uppercase">Appointments</span>
              <span className="text-xs text-gray-400 font-mono">TATA MOTORS PASSENGER VEHICLES LOUNGE</span>
              <span className="text-[11px] text-cyan-300 bg-cyan-950/70 border border-cyan-800/80 px-2.5 py-0.5 rounded-full flex items-center space-x-1.5 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
                <span>Auto-switching to Walk-In Customers in <b>{rotationCountdown}s</b></span>
              </span>
            </div>
            <span className="text-lg font-black tracking-widest text-gray-300">TATA MOTORS</span>
          </div>

          <div className="flex-1 grid grid-cols-12 gap-5">
            {/* In Progress Cards Grid */}
            <div className="col-span-8 flex flex-col">
              <div className="bg-[#0b1726] border border-gray-800 text-center py-1.5 font-semibold text-xs tracking-wider uppercase text-gray-300 mb-3 rounded-t">
                In Progress
              </div>
              <div className="grid grid-cols-3 gap-3.5">
                {vehicles.filter(v => !v.isWalkIn).slice(0, 6).map((item) => (
                  <div
                    key={item.id}
                    className="bg-[#0b1726] border border-[#1e2d42] rounded-md p-3 flex flex-col justify-between shadow-lg relative group hover:border-cyan-500/50 transition-colors"
                  >
                    {/* Top Row: Square White Number Tag + Status Badge */}
                    <div className="flex items-center justify-between">
                      <div className="w-5 h-5 bg-white text-slate-900 font-extrabold text-xs flex items-center justify-center rounded-xs shadow">
                        {item.numberTag}
                      </div>
                      {renderFlightBadge(item.flightStatus, item.delayMinutes)}
                    </div>

                    {/* Center: Real High-Quality Transparent PNG Image of Tata Vehicle */}
                    <div className="my-2 h-24 flex items-center justify-center px-1">
                      {getTataCarImage(item.model)}
                    </div>

                    {/* Middle: Cyan Model Name on Left + IND License Plate on Right */}
                    <div className="flex items-center justify-between my-2">
                      <span className="text-lg font-extrabold text-[#00b4d8] tracking-tight">{item.model}</span>
                      {renderIndianPlate(item.regNo)}
                    </div>

                    {/* Bottom Ribbon: Customer & Service Advisor */}
                    <div className="bg-[#060e18] border-t border-[#132033] -mx-3 -mb-3 px-3 py-2 rounded-b grid grid-cols-2 text-[10px]">
                      <div>
                        <div className="text-[9px] text-gray-400 font-normal">Customer</div>
                        <div className="font-bold text-white uppercase truncate">{item.customer}</div>
                      </div>
                      <div>
                        <div className="text-[9px] text-gray-400 font-normal">Service Advisor</div>
                        <div className="font-bold text-white truncate">{item.serviceAdvisor}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Next In Queue Cards */}
            <div className="col-span-4 flex flex-col">
              <div className="bg-[#0b1726] border border-gray-800 text-center py-1.5 font-semibold text-xs tracking-wider uppercase text-gray-300 mb-3 rounded-t">
                Next In Queue
              </div>
              <div className="space-y-3">
                {QUEUE_VEHICLES.map((item, idx) => (
                  <div
                    key={`queue-${item.id}`}
                    className="bg-[#0b1726] border border-[#1e2d42] rounded-md p-3 flex flex-col justify-between shadow-lg relative"
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-5 h-5 bg-white text-slate-900 font-extrabold text-xs flex items-center justify-center rounded-xs shadow">
                        {idx + 1}
                      </div>
                      {renderFlightBadge(item.flightStatus, item.delayMinutes)}
                    </div>

                    <div className="my-1 h-20 flex items-center justify-center px-1">
                      {getTataCarImage(item.model)}
                    </div>

                    <div className="flex items-center justify-between my-2">
                      <span className="text-lg font-extrabold text-[#00b4d8] tracking-tight">{item.model}</span>
                      {renderIndianPlate(item.regNo)}
                    </div>

                    <div className="bg-[#060e18] border-t border-[#132033] -mx-3 -mb-3 px-3 py-2 rounded-b grid grid-cols-2 text-[10px]">
                      <div>
                        <div className="text-[9px] text-gray-400 font-normal">Customer</div>
                        <div className="font-bold text-white uppercase truncate">{item.customer}</div>
                      </div>
                      <div>
                        <div className="text-[9px] text-gray-400 font-normal">Service Advisor</div>
                        <div className="font-bold text-white truncate">{item.serviceAdvisor}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
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
              <span className="bg-[#112233] px-3 py-1 rounded border border-gray-700">{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              <span className="bg-[#112233] px-3 py-1 rounded border border-gray-700">{currentTime.toLocaleDateString("en-GB")}</span>
            </div>
          </div>
        </main>
      )}

      {/* RECEPTIONIST SCREEN 2: WALK-IN CUSTOMERS */}
      {receptionTab === "walkin" && (
        <main className="flex-1 flex flex-col p-6 overflow-y-auto">
          <div className="flex items-center justify-between border-b-2 border-gray-700 pb-2 mb-4">
            <div className="flex items-center space-x-3">
              <span className="text-xl font-bold tracking-tight text-white uppercase">Walk-In Customers</span>
              <span className="text-xs text-gray-400 font-mono">TATA MOTORS PASSENGER VEHICLES LOUNGE</span>
              <span className="text-[11px] text-cyan-300 bg-cyan-950/70 border border-cyan-800/80 px-2.5 py-0.5 rounded-full flex items-center space-x-1.5 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
                <span>Auto-switching to Appointments in <b>{rotationCountdown}s</b></span>
              </span>
            </div>
            <span className="text-lg font-black tracking-widest text-gray-300">TATA MOTORS</span>
          </div>

          <div className="flex-1 grid grid-cols-12 gap-5">
            <div className="col-span-8">
              <div className="bg-[#0b1726] border border-gray-800 text-center py-1.5 font-semibold text-xs tracking-wider uppercase text-gray-300 mb-3 rounded-t">
                In Progress
              </div>
              <div className="grid grid-cols-3 gap-3.5">
                {vehicles.filter(v => v.isWalkIn).map((item) => (
                  <div
                    key={item.id}
                    className="bg-[#0b1726] border border-[#1e2d42] rounded-md p-3 flex flex-col justify-between shadow-lg"
                  >
                    <div className="flex justify-between items-center">
                      <div className="w-5 h-5 bg-white text-slate-900 font-extrabold text-xs flex items-center justify-center rounded-xs shadow">
                        {item.numberTag}
                      </div>
                      {renderFlightBadge(item.flightStatus, item.delayMinutes)}
                    </div>

                    <div className="my-2 h-24 flex items-center justify-center px-1">
                      {getTataCarImage(item.model)}
                    </div>

                    <div className="flex items-center justify-between my-2">
                      <span className="text-lg font-extrabold text-[#00b4d8] tracking-tight">{item.model}</span>
                      {renderIndianPlate(item.regNo)}
                    </div>

                    <div className="bg-[#060e18] border-t border-[#132033] -mx-3 -mb-3 px-3 py-2 rounded-b grid grid-cols-2 text-[10px]">
                      <div>
                        <div className="text-[9px] text-gray-400 font-normal">Customer</div>
                        <div className="font-bold text-white uppercase truncate">{item.customer}</div>
                      </div>
                      <div>
                        <div className="text-[9px] text-gray-400 font-normal">Service Advisor</div>
                        <div className="font-bold text-white truncate">{item.serviceAdvisor}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-span-4 border border-dashed border-gray-800 rounded flex flex-col items-center justify-center text-gray-400 text-xs p-6 text-center">
              <span className="font-semibold text-gray-300 mb-1">Fast Entry Bay</span>
              <span>All currently registered walk-in passenger vehicles are active on the board.</span>
            </div>
          </div>
        </main>
      )}

      {/* RECEPTIONIST SCREEN 3: VEHICLE STATUS */}
      {receptionTab === "status" && (
        <main className="flex-1 flex flex-col p-6 overflow-y-auto">
          <div className="flex items-center justify-between border-b-2 border-gray-700 pb-2 mb-4">
            <span className="text-xl font-bold tracking-tight text-white uppercase">TATA MOTORS Vehicle Status</span>
            <span className="text-lg font-black tracking-widest text-gray-300">TATA MOTORS</span>
          </div>

          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#122336] text-gray-300 border-b border-gray-700 font-semibold uppercase text-[11px]">
                  <th className="py-3 px-3">Vehicle</th>
                  <th className="py-3 px-3">Registration</th>
                  <th className="py-3 px-3">Service Advisor</th>
                  <th className="py-3 px-3">Work Type</th>
                  <th className="py-3 px-3">Promise Time</th>
                  {STATUS_STAGES.map((col) => (
                    <th key={col.key} className="py-3 px-2 text-center">
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {vehicles.map((v) => (
                  <tr key={v.id} className="hover:bg-[#0c1827] transition">
                    <td className="py-2 px-3">
                      <div className="w-24 h-14 bg-[#071322] rounded p-1 overflow-hidden flex items-center justify-center border border-gray-800">
                        {getTataCarImage(v.model)}
                      </div>
                    </td>
                    <td className="py-3 px-3 font-mono">{renderIndianPlate(v.regNo)}</td>
                    <td className="py-3 px-3 font-semibold text-gray-200">{v.serviceAdvisor}</td>
                    <td className="py-3 px-3 text-gray-300">{v.workType}</td>
                    <td className="py-3 px-3 font-mono text-gray-400">{v.promiseTime}</td>
                    {STATUS_STAGES.map((col, idx) => {
                      const isCompleted = idx <= v.stageIndex;
                      return (
                        <td key={col.key} className="py-3 px-2 text-center">
                          <div className="flex justify-center">
                            <div className={`w-8 h-4 rounded transition-all ${
                              isCompleted 
                                ? "bg-emerald-400 drop-shadow-[0_0_6px_rgba(52,211,153,0.7)]" 
                                : "bg-gray-800 opacity-20"
                            }`}></div>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      )}
    </div>
  );
}
