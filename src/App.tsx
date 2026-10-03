import React, { useState, useEffect } from "react";

// --- Vector Commercial Vehicles & Passenger Cars ---
const VEHICLE_SVGS: Record<string, React.ReactNode> = {
  trailer: (
    <svg viewBox="0 0 160 70" className="w-full h-full object-contain">
      <rect x="6" y="20" width="95" height="32" rx="2" fill="#C2410C" />
      <line x1="6" y1="28" x2="101" y2="28" stroke="#7C2D12" strokeWidth="1.5" />
      <line x1="6" y1="36" x2="101" y2="36" stroke="#7C2D12" strokeWidth="1.5" />
      <path d="M104 26 L128 26 L144 38 L144 52 L104 52 Z" fill="#DC2626" />
      <path d="M108 30 L124 30 L136 38 L108 38 Z" fill="#1E293B" />
      <circle cx="28" cy="54" r="10" fill="#0F172A" />
      <circle cx="28" cy="54" r="5" fill="#94A3B8" />
      <circle cx="50" cy="54" r="10" fill="#0F172A" />
      <circle cx="50" cy="54" r="5" fill="#94A3B8" />
      <circle cx="82" cy="54" r="10" fill="#0F172A" />
      <circle cx="82" cy="54" r="5" fill="#94A3B8" />
      <circle cx="128" cy="54" r="10" fill="#0F172A" />
      <circle cx="128" cy="54" r="5" fill="#94A3B8" />
    </svg>
  ),
  tipper: (
    <svg viewBox="0 0 160 70" className="w-full h-full object-contain">
      <path d="M14 22 L96 22 L90 52 L14 52 Z" fill="#CA8A04" />
      <path d="M98 26 L124 26 L140 38 L140 52 L98 52 Z" fill="#D97706" />
      <path d="M102 30 L120 30 L132 38 L102 38 Z" fill="#1E293B" />
      <circle cx="34" cy="54" r="10" fill="#0F172A" />
      <circle cx="34" cy="54" r="5" fill="#94A3B8" />
      <circle cx="70" cy="54" r="10" fill="#0F172A" />
      <circle cx="70" cy="54" r="5" fill="#94A3B8" />
      <circle cx="124" cy="54" r="10" fill="#0F172A" />
      <circle cx="124" cy="54" r="5" fill="#94A3B8" />
    </svg>
  ),
  lpt: (
    <svg viewBox="0 0 160 70" className="w-full h-full object-contain">
      <rect x="10" y="22" width="88" height="30" rx="2" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1.5" />
      <path d="M102 26 L124 26 L138 38 L138 52 L102 52 Z" fill="#3B82F6" />
      <path d="M106 30 L120 30 L132 38 L106 38 Z" fill="#1E293B" />
      <circle cx="32" cy="54" r="10" fill="#0F172A" />
      <circle cx="32" cy="54" r="5" fill="#94A3B8" />
      <circle cx="72" cy="54" r="10" fill="#0F172A" />
      <circle cx="72" cy="54" r="5" fill="#94A3B8" />
      <circle cx="122" cy="54" r="10" fill="#0F172A" />
      <circle cx="122" cy="54" r="5" fill="#94A3B8" />
    </svg>
  ),
  signa: (
    <svg viewBox="0 0 160 70" className="w-full h-full object-contain">
      <rect x="14" y="24" width="82" height="28" rx="2" fill="#475569" />
      <path d="M100 22 L126 22 L142 36 L142 52 L100 52 Z" fill="#0284C7" />
      <path d="M104 26 L122 26 L134 36 L104 36 Z" fill="#0F172A" />
      <circle cx="36" cy="54" r="10" fill="#0F172A" />
      <circle cx="36" cy="54" r="5" fill="#94A3B8" />
      <circle cx="68" cy="54" r="10" fill="#0F172A" />
      <circle cx="68" cy="54" r="5" fill="#94A3B8" />
      <circle cx="124" cy="54" r="10" fill="#0F172A" />
      <circle cx="124" cy="54" r="5" fill="#94A3B8" />
    </svg>
  ),
  safari: (
    <svg viewBox="0 0 160 65" className="w-full h-full object-contain filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.6)]">
      <path d="M12 41 L22 19 C26 14 42 11 65 11 L120 11 C134 11 143 18 148 27 L154 41 C158 46 155 51 149 51 L9 51 C5 49 5 43 12 41 Z" fill="#B91C1C"/>
      <path d="M32 19 L64 14 L114 14 L110 21 Z" fill="#1C1917"/>
      <circle cx="35" cy="49" r="13" fill="#090D16"/>
      <circle cx="35" cy="49" r="6" fill="#E2E8F0"/>
      <circle cx="125" cy="49" r="13" fill="#090D16"/>
      <circle cx="125" cy="49" r="6" fill="#E2E8F0"/>
    </svg>
  ),
  harrier: (
    <svg viewBox="0 0 160 65" className="w-full h-full object-contain filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.6)]">
      <path d="M14 42 L25 22 C30 17 46 14 68 13 L112 13 C128 13 140 20 146 29 L154 42 C158 46 156 50 150 51 L10 51 C6 49 6 44 14 42 Z" fill="#047857"/>
      <path d="M36 22 L62 16 L108 16 L104 23 Z" fill="#022C22"/>
      <circle cx="36" cy="49" r="13" fill="#090D16"/>
      <circle cx="36" cy="49" r="6" fill="#CBD5E1"/>
      <circle cx="124" cy="49" r="13" fill="#090D16"/>
      <circle cx="124" cy="49" r="6" fill="#CBD5E1"/>
    </svg>
  ),
  nexon: (
    <svg viewBox="0 0 160 65" className="w-full h-full object-contain filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.6)]">
      <path d="M18 40 L28 24 C33 20 45 18 65 17 L105 17 C120 17 135 22 142 30 L152 40 C156 44 156 48 152 50 L12 50 C8 48 8 43 18 40 Z" fill="#2563EB"/>
      <circle cx="38" cy="48" r="12" fill="#090D16"/>
      <circle cx="38" cy="48" r="6" fill="#94A3B8"/>
      <circle cx="122" cy="48" r="12" fill="#090D16"/>
      <circle cx="122" cy="48" r="6" fill="#94A3B8"/>
    </svg>
  )
};

interface Vehicle {
  id: string;
  regNo: string;
  model: string;
  customer: string;
  serviceAdvisor: string;
  workType: string;
  promiseTime: string;
  stageIndex: number;
  flightStatus: "ON TIME" | "DELAYED" | "EXPEDITED" | "READY FOR PICKUP";
  delayMinutes?: number;
  isWalkIn: boolean;
  svgKey: string;
  odometer: string;
  jobCard: string;
  badgeType?: "gray" | "red" | "blue";
  badgeText?: string;
  vehCategory?: string;
  fencedInDate?: string;
  promisedDeliveryDate?: string;
}

const INITIAL_VEHICLES: Vehicle[] = [
  {
    id: "V1",
    regNo: "RJ27GD9268",
    model: "Tractor Trailer 55 / LPS5530TC",
    customer: "Rajasthan Logistics",
    serviceAdvisor: "Hemendra Chundawat",
    workType: "Running Repair",
    promiseTime: "2026/12/24 9:30 AM",
    stageIndex: 1,
    flightStatus: "ON TIME",
    isWalkIn: false,
    svgKey: "trailer",
    odometer: "84,200 KM",
    jobCard: "SR/JC Not Available",
    badgeType: "gray",
    badgeText: "SR/JC Not Available",
    vehCategory: "Commercial",
    fencedInDate: "18 Jul '23, 12:03 PM",
    promisedDeliveryDate: ""
  },
  {
    id: "V2",
    regNo: "RJ27GD5386",
    model: "MAV Tippers 42 / SIGNA 4225.TK",
    customer: "Parveen Vari",
    serviceAdvisor: "Hemendra Chundawat",
    workType: "Clutch & Suspension",
    promiseTime: "2026/12/24 9:30 AM",
    stageIndex: 2,
    flightStatus: "DELAYED",
    delayMinutes: 20,
    isWalkIn: false,
    svgKey: "tipper",
    odometer: "142,544 KM",
    jobCard: "JC-TML-DEL-2324-004429",
    badgeType: "red",
    badgeText: "JC-TML-DEL-2324-004429",
    vehCategory: "Zippy Fleet",
    fencedInDate: "16 Jul '23, 02:42 PM",
    promisedDeliveryDate: "18 Jul '23, 06:44 PM"
  },
  {
    id: "V3",
    regNo: "GJ31T5456",
    model: "MAV 28 / LPT 2821",
    customer: "Gujarat Express Lines",
    serviceAdvisor: "Hemendra Chundawat",
    workType: "DEF Dosing Unit Inspection",
    promiseTime: "2026/12/24 10:00 AM",
    stageIndex: 1,
    flightStatus: "ON TIME",
    isWalkIn: false,
    svgKey: "lpt",
    odometer: "1,234 KM",
    jobCard: "SR-TML-DEL-2324-004645",
    badgeType: "blue",
    badgeText: "SR-TML-DEL-2324-004645",
    vehCategory: "DEF Only",
    fencedInDate: "18 Jul '23, 11:48 AM",
    promisedDeliveryDate: ""
  },
  {
    id: "V4",
    regNo: "RJ27GE1463",
    model: "MAV 48 / LPT 4825",
    customer: "Parveen Vari",
    serviceAdvisor: "Imran Khan",
    workType: "First Free Service",
    promiseTime: "2026/12/24 10:30 AM",
    stageIndex: 2,
    flightStatus: "EXPEDITED",
    isWalkIn: false,
    svgKey: "signa",
    odometer: "41,130 KM",
    jobCard: "JC-TML-DEL-2324-004426",
    badgeType: "red",
    badgeText: "JC-TML-DEL-2324-004426",
    vehCategory: "Zippy Fleet",
    fencedInDate: "18 Jul '23, 11:50 AM",
    promisedDeliveryDate: "18 Jul '23, 06:35 PM"
  },
  {
    id: "V5",
    regNo: "UP14ES6945",
    model: "Tata Safari Dark",
    customer: "Joe Doe",
    serviceAdvisor: "Bhawani Shankar",
    workType: "Periodic Maintenance 30k",
    promiseTime: "2026/12/24 11:15 AM",
    stageIndex: 3,
    flightStatus: "ON TIME",
    isWalkIn: false,
    svgKey: "safari",
    odometer: "28,400 KM",
    jobCard: "JC-TML-DEL-2324-004810",
    badgeType: "red",
    badgeText: "JC-TML-DEL-2324-004810",
    vehCategory: "Passenger SUV",
    fencedInDate: "18 Jul '23, 01:10 PM",
    promisedDeliveryDate: "18 Jul '23, 05:00 PM"
  },
  {
    id: "V6",
    regNo: "UP16DU8208",
    model: "Tata Harrier Fearless",
    customer: "Joe Doe",
    serviceAdvisor: "Bhawani Shankar",
    workType: "Brake Pad & General Check",
    promiseTime: "2026/12/24 12:00 PM",
    stageIndex: 4,
    flightStatus: "ON TIME",
    isWalkIn: false,
    svgKey: "harrier",
    odometer: "18,200 KM",
    jobCard: "JC-TML-DEL-2324-004812",
    badgeType: "red",
    badgeText: "JC-TML-DEL-2324-004812",
    vehCategory: "Passenger SUV",
    fencedInDate: "18 Jul '23, 01:25 PM",
    promisedDeliveryDate: "18 Jul '23, 04:30 PM"
  },
  {
    id: "V7",
    regNo: "UP14EJ9609",
    model: "Tata Nexon EV",
    customer: "Joe Doe",
    serviceAdvisor: "Bhawani Shankar",
    workType: "Software Update & Wash",
    promiseTime: "2026/12/24 01:00 PM",
    stageIndex: 3,
    flightStatus: "ON TIME",
    isWalkIn: true,
    svgKey: "nexon",
    odometer: "9,400 KM",
    jobCard: "JC-TML-DEL-2324-004899",
    badgeType: "red",
    badgeText: "JC-TML-DEL-2324-004899",
    vehCategory: "EV Fleet",
    fencedInDate: "18 Jul '23, 02:00 PM",
    promisedDeliveryDate: "18 Jul '23, 03:45 PM"
  }
];

const STATUS_STAGES = [
  { key: "received", label: "Vehicle Received" },
  { key: "ro_created", label: "RO Created" },
  { key: "wip", label: "Work In Progress" },
  { key: "washing", label: "Washing" },
  { key: "inspection", label: "Final Inspection" },
  { key: "ready", label: "Ready For Delivery" }
];

const WM_PIPELINE_STAGES = [
  "Fenced In",
  "Gate In",
  "SR",
  "JC",
  "Floor In",
  "WIP",
  "Washing",
  "Floor Out",
  "Road Test",
  "JC Closed",
  "Gate Out",
  "Fenced Out"
];

export default function App() {
  const [currentUser, setCurrentUser] = useState<{ role: "Receptionist" | "WorksManager"; name: string; username: string } | null>(null);
  const [usernameInput, setUsernameInput] = useState("NP7_1007960");
  const [passwordInput, setPasswordInput] = useState("••••••••••");

  const [receptionTab, setReceptionTab] = useState<"appointments" | "walkin" | "status">("appointments");

  const [vehicles, setVehicles] = useState<Vehicle[]>(INITIAL_VEHICLES);
  const [countdown, setCountdown] = useState<number>(20);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

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
              next[randIdx] = {
                ...next[randIdx],
                stageIndex: nextStage,
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
        const nextIdx = v.stageIndex < STATUS_STAGES.length - 1 ? v.stageIndex + 1 : 0;
        return {
          ...v,
          stageIndex: nextIdx,
          flightStatus: nextIdx === STATUS_STAGES.length - 1 ? "READY FOR PICKUP" : "ON TIME"
        };
      }
      return v;
    }));
  };

  const renderIndianPlate = (plate: string) => (
    <div className="inline-flex items-center bg-white text-black font-bold font-mono tracking-wider px-2 py-0.5 rounded border border-gray-400 text-xs shadow-sm">
      <div className="flex flex-col items-center mr-1 text-[7px] leading-none text-blue-900 border-r border-gray-300 pr-1">
        <span>IND</span>
        <div className="w-1.5 h-1.5 rounded-full bg-blue-700 mt-0.5"></div>
      </div>
      <span>{plate}</span>
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
            <span className="text-xs text-blue-200">TMSA-CV Workshop Portal</span>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center items-center p-4">
          <div className="bg-white border border-slate-200 rounded-lg shadow-xl p-8 w-full max-w-sm">
            <div className="text-center mb-6">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">TMSA-CV Workshop Portal</h2>
              <p className="text-xs text-slate-500 mt-1">Enter your CRM username &amp; password to login</p>
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
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-xs font-semibold transition shadow-sm"
                >
                  Sign In as Receptionist
                </button>
                <button
                  onClick={() => setCurrentUser({ role: "WorksManager", name: "Neeraj Patel (Works Manager)", username: "NP7_1007960" })}
                  className="w-full bg-[#002244] hover:bg-[#001730] text-white py-2 rounded text-xs font-semibold transition shadow-sm"
                >
                  Sign In as Works Manager
                </button>
              </div>
            </div>
          </div>
          <div className="text-xs text-slate-400 mt-6 font-mono">Version: 1.0.3 Date: 28-06-2023</div>
        </div>

        <div className="border-t border-slate-200 py-3 text-center text-xs text-slate-400">
          Copyright, Confidential, Tata Motors Limited
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: WORKS MANAGER INTERFACE (4 Links Removed)
  // =========================================================================
  if (currentUser.role === "WorksManager") {
    return (
      <div className="min-h-screen flex flex-col bg-[#F3F4F6] text-slate-900 font-sans select-none">
        {/* Top Header without the 4 inactive links */}
        <div className="bg-[#002244] text-white px-6 py-2.5 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="font-extrabold text-base tracking-wider">TATA MOTORS</span>
          </div>

          <div className="flex items-center space-x-5">
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
              <div className="text-[10px] text-blue-200 font-mono">DELHI WORKSHOP | 1-9FRGY0Z</div>
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
            <span className="font-semibold text-gray-700">TATA MOTORS WORKSHOP-1007960</span>
            <span className="text-gray-400 text-[11px]">Commercial Vehicle Track &amp; Trace</span>
          </div>
          <div className="text-right font-mono text-[11px] text-gray-600">
            <div>Fri, 21 July '23</div>
            <div className="font-bold">{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
          </div>
        </div>

        {/* Milestone Metrics Ribbon */}
        <div className="bg-[#E5E7EB] border-b border-gray-300 px-6 py-2 overflow-x-auto flex items-center space-x-1.5 text-[11px] font-semibold text-gray-700 whitespace-nowrap">
          <span className="bg-white border border-gray-300 px-2.5 py-1 rounded shadow-sm text-gray-800">All ▾</span>
          <span className="bg-white border border-gray-300 px-2.5 py-1 rounded shadow-sm">FENCED IN <b className="text-blue-900 ml-1">11</b></span>
          <span className="bg-white border border-gray-300 px-2.5 py-1 rounded shadow-sm">GATE IN <b className="text-blue-900 ml-1">6</b></span>
          <span className="bg-white border border-gray-300 px-2.5 py-1 rounded shadow-sm">SR <b className="text-blue-900 ml-1">6</b></span>
          <span className="bg-white border border-gray-300 px-2.5 py-1 rounded shadow-sm">JC <b className="text-blue-900 ml-1">0</b></span>
          <span className="bg-white border border-gray-300 px-2.5 py-1 rounded shadow-sm">FLOOR IN <b className="text-blue-900 ml-1">3</b></span>
          <span className="bg-white border border-gray-300 px-2.5 py-1 rounded shadow-sm">WIP <b className="text-blue-900 ml-1">9</b></span>
          <span className="bg-white border border-gray-300 px-2.5 py-1 rounded shadow-sm">WASHING <b className="text-blue-900 ml-1">4</b></span>
          <span className="bg-white border border-gray-300 px-2.5 py-1 rounded shadow-sm">FLOOR OUT <b className="text-blue-900 ml-1">0</b></span>
          <span className="bg-white border border-gray-300 px-2.5 py-1 rounded shadow-sm">ROAD TEST <b className="text-blue-900 ml-1">0</b></span>
          <span className="bg-white border border-gray-300 px-2.5 py-1 rounded shadow-sm">JC CLOSED <b className="text-blue-900 ml-1">51</b></span>
          <span className="bg-white border border-gray-300 px-2.5 py-1 rounded shadow-sm">GATE OUT <b className="text-blue-900 ml-1">10</b></span>
          <span className="bg-white border border-gray-300 px-2.5 py-1 rounded shadow-sm">FENCED OUT <b className="text-blue-900 ml-1">0</b></span>
        </div>

        {/* Vehicles Board */}
        <div className="flex-1 p-6 space-y-4 overflow-y-auto">
          {vehicles.map((v) => (
            <div
              key={v.id}
              className="bg-white border border-gray-300 rounded shadow-sm p-4 flex flex-col xl:flex-row xl:items-center justify-between gap-4 text-xs"
            >
              <div className="flex flex-col items-center justify-center min-w-[150px]">
                <div className="w-28 h-14 flex items-center justify-center bg-gray-50 rounded border border-gray-200 p-1 mb-1">
                  {VEHICLE_SVGS[v.svgKey] || VEHICLE_SVGS.trailer}
                </div>
                {v.badgeType === "red" && (
                  <span className="bg-[#D32F2F] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm truncate max-w-[150px]">
                    {v.badgeText}
                  </span>
                )}
                {v.badgeType === "blue" && (
                  <span className="bg-[#1976D2] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm truncate max-w-[150px]">
                    {v.badgeText}
                  </span>
                )}
                {v.badgeType === "gray" && (
                  <span className="bg-white border border-gray-300 text-gray-500 text-[10px] font-semibold px-2 py-0.5 rounded shadow-sm">
                    {v.badgeText}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-[70px_1fr] gap-y-0.5 text-[11px] min-w-[190px]">
                <span className="text-gray-500">Veh. No:</span>
                <span className="font-extrabold text-gray-900">{v.regNo}</span>

                <span className="text-gray-500">SA Name:</span>
                <span className="font-semibold text-gray-800">{v.serviceAdvisor}</span>

                <span className="text-gray-500">Odometer:</span>
                <span className="text-gray-800">{v.odometer}</span>

                <span className="text-gray-500">ST:</span>
                <span className="text-gray-800">{v.vehCategory || "Warranty"}</span>
              </div>

              <div className="grid grid-cols-[70px_1fr] gap-y-0.5 text-[11px] min-w-[210px] border-l border-gray-200 pl-4">
                <span className="text-gray-500 truncate" colSpan={2}>
                  <b className="text-gray-900 block">{v.model}</b>
                </span>

                <span className="text-gray-500">TL Name:</span>
                <span className="font-semibold text-gray-800">PARVEEN VARI</span>

                <span className="text-gray-500">Veh. Type:</span>
                <span className="font-bold text-red-600">AMC</span>

                <span className="text-gray-500">Veh. Category:</span>
                <span className="text-gray-800">Zippy</span>
              </div>

              <div className="flex-1 flex flex-col justify-center px-4">
                <div className="relative flex items-center justify-between">
                  <div className="absolute top-2.5 left-2 right-2 h-0.5 bg-gray-200 -z-0"></div>
                  <div
                    className="absolute top-2.5 left-2 h-0.5 bg-emerald-500 -z-0 transition-all duration-300"
                    style={{ width: `${(v.stageIndex / (STATUS_STAGES.length - 1)) * 96}%` }}
                  ></div>

                  {WM_PIPELINE_STAGES.map((label, idx) => {
                    const isCompleted = idx < v.stageIndex;
                    const isCurrent = idx === v.stageIndex;

                    return (
                      <div
                        key={label}
                        className="flex flex-col items-center z-10 cursor-pointer"
                        onClick={() => advanceVehicleMilestone(v.id)}
                        title={`Update to ${label}`}
                      >
                        {label === "WIP" && isCurrent ? (
                          <div className="w-5 h-5 rotate-45 bg-[#4CAF50] border-2 border-white shadow flex items-center justify-center">
                            <span className="-rotate-45 text-[8px] font-bold text-white">●</span>
                          </div>
                        ) : (
                          <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold transition-all ${
                              isCompleted || isCurrent
                                ? "bg-[#4CAF50] text-white"
                                : "bg-gray-200 text-gray-400"
                            }`}
                          >
                            {isCompleted || isCurrent ? "✓" : ""}
                          </div>
                        )}

                        <span
                          className={`text-[9px] mt-1 tracking-tight text-center max-w-[48px] leading-tight ${
                            isCurrent ? "font-bold text-emerald-800" : "text-gray-500"
                          }`}
                        >
                          {label}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-between items-center text-[10px] text-gray-500 mt-2 pt-1 border-t border-gray-100">
                  <div>
                    FENCED IN: <b className="text-gray-800">{v.fencedInDate || "18 Jul '23, 11:48 AM"}</b>
                  </div>
                  <div className="flex items-center space-x-3">
                    {renderFlightBadge(v.flightStatus, v.delayMinutes)}
                    <span>PROMISED DELIVERY: <b className="text-gray-800">{v.promiseTime}</b></span>
                    <button
                      onClick={() => advanceVehicleMilestone(v.id)}
                      className="bg-[#002244] hover:bg-[#001730] text-white text-[10px] px-2 py-0.5 rounded font-semibold transition"
                    >
                      Advance ➔
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 3: RECEPTIONIST INTERFACE (Customer Lounge Screens)
  // =========================================================================
  return (
    <div className="min-h-screen flex flex-col bg-[#040911] text-white font-sans select-none">
      <header className="bg-[#0b1724] border-b border-gray-800 px-6 py-2.5 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-4">
          <span className="font-extrabold text-blue-400 tracking-wider text-base">TATA MOTORS</span>
          <span className="text-gray-500">|</span>
          <span className="text-gray-300">TATA MOTORS AUTHORIZED SERVICE (1007960)</span>
          <span className="bg-blue-950 text-blue-300 px-2 py-0.5 rounded border border-blue-800 text-[10px]">
            {currentUser.name}
          </span>
        </div>

        <nav className="flex space-x-1 bg-black/40 p-1 rounded border border-gray-800">
          <button
            onClick={() => setReceptionTab("appointments")}
            className={`px-3 py-1 rounded font-semibold transition ${
              receptionTab === "appointments" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            1. Appointments
          </button>
          <button
            onClick={() => setReceptionTab("walkin")}
            className={`px-3 py-1 rounded font-semibold transition ${
              receptionTab === "walkin" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            2. Walk-In Customers
          </button>
          <button
            onClick={() => setReceptionTab("status")}
            className={`px-3 py-1 rounded font-semibold transition ${
              receptionTab === "status" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            3. Vehicle Status
          </button>
        </nav>

        <div className="flex items-center space-x-3">
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

      {/* RECEPTIONIST SCREEN 1: APPOINTMENTS */}
      {receptionTab === "appointments" && (
        <main className="flex-1 flex flex-col p-6 overflow-y-auto">
          <div className="flex items-center justify-between border-b-2 border-gray-700 pb-2 mb-4">
            <div className="flex items-center space-x-3">
              <span className="text-xl font-bold tracking-tight text-white uppercase">Appointments</span>
              <span className="text-xs text-gray-400 font-mono">TATA MOTORS CUSTOMER LOUNGE DISPLAY</span>
            </div>
            <span className="text-lg font-black tracking-widest text-gray-300">TATA MOTORS</span>
          </div>

          <div className="flex-1 grid grid-cols-12 gap-5">
            <div className="col-span-8 flex flex-col">
              <div className="bg-[#0b1726] border border-gray-800 text-center py-1.5 font-semibold text-xs tracking-wider uppercase text-gray-300 mb-3 rounded-t">
                In Progress
              </div>
              <div className="grid grid-cols-3 gap-3">
                {vehicles.filter(v => !v.isWalkIn).slice(0, 6).map((item, idx) => (
                  <div key={item.id} className="bg-[#0a121d] border border-gray-800 rounded p-3 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="w-5 h-5 flex items-center justify-center bg-gray-800 text-white text-[10px] font-bold rounded">
                        {idx + 1}
                      </span>
                      {renderFlightBadge(item.flightStatus, item.delayMinutes)}
                    </div>
                    <div className="my-2 h-16 flex items-center justify-center">
                      {VEHICLE_SVGS[item.svgKey] || VEHICLE_SVGS.safari}
                    </div>
                    <div className="flex items-center justify-between my-1">
                      <span className="font-bold text-blue-400 text-sm truncate max-w-[120px]">{item.model.split(" ")[0]}</span>
                      {renderIndianPlate(item.regNo)}
                    </div>
                    <div className="grid grid-cols-2 text-[10px] pt-2 border-t border-gray-800 mt-2 text-gray-400">
                      <div>
                        <span className="block text-[8px] text-gray-500 uppercase">Customer</span>
                        <span className="font-medium text-white truncate block">{item.customer}</span>
                      </div>
                      <div className="text-right">
                        <span className="block text-[8px] text-gray-500 uppercase">Service Advisor</span>
                        <span className="font-medium text-white truncate block">{item.serviceAdvisor}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-span-4 flex flex-col">
              <div className="bg-[#0b1726] border border-gray-800 text-center py-1.5 font-semibold text-xs tracking-wider uppercase text-gray-300 mb-3 rounded-t">
                Next In Queue
              </div>
              <div className="space-y-3">
                {vehicles.slice(0, 2).map((item, idx) => (
                  <div key={`queue-${item.id}`} className="bg-[#0a121d] border border-gray-800 rounded p-3 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="w-5 h-5 flex items-center justify-center bg-gray-800 text-white text-[10px] font-bold rounded">
                        {idx + 1}
                      </span>
                      {renderFlightBadge(item.flightStatus, item.delayMinutes)}
                    </div>
                    <div className="my-2 h-14 flex items-center justify-center">
                      {VEHICLE_SVGS[item.svgKey] || VEHICLE_SVGS.harrier}
                    </div>
                    <div className="flex items-center justify-between my-1">
                      <span className="font-bold text-blue-400 text-sm truncate">{item.model.split(" ")[0]}</span>
                      {renderIndianPlate(item.regNo)}
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
            <span className="text-xl font-bold tracking-tight text-white uppercase">Walk-In Customers</span>
            <span className="text-lg font-black tracking-widest text-gray-300">TATA MOTORS</span>
          </div>

          <div className="flex-1 grid grid-cols-12 gap-5">
            <div className="col-span-8">
              <div className="bg-[#0b1726] border border-gray-800 text-center py-1.5 font-semibold text-xs tracking-wider uppercase text-gray-300 mb-3 rounded-t">
                In Progress
              </div>
              <div className="grid grid-cols-3 gap-3">
                {vehicles.filter(v => v.isWalkIn).map((item) => (
                  <div key={item.id} className="bg-[#0a121d] border border-gray-800 rounded p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="w-5 h-5 flex items-center justify-center bg-gray-800 text-white text-[10px] font-bold rounded">1</span>
                      {renderFlightBadge(item.flightStatus, item.delayMinutes)}
                    </div>
                    <div className="h-16 flex items-center justify-center">
                      {VEHICLE_SVGS[item.svgKey] || VEHICLE_SVGS.nexon}
                    </div>
                    <div className="flex justify-between items-center my-2">
                      <span className="font-bold text-blue-400 text-sm">{item.model}</span>
                      {renderIndianPlate(item.regNo)}
                    </div>
                    <div className="grid grid-cols-2 text-[10px] pt-2 border-t border-gray-800 mt-2 text-gray-400">
                      <div>
                        <span className="block text-[8px] text-gray-500 uppercase">Customer</span>
                        <span className="font-medium text-white truncate block">{item.customer}</span>
                      </div>
                      <div className="text-right">
                        <span className="block text-[8px] text-gray-500 uppercase">Service Advisor</span>
                        <span className="font-medium text-white truncate block">{item.serviceAdvisor}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-span-4 border border-dashed border-gray-800 rounded flex flex-col items-center justify-center text-gray-500 text-xs p-6 text-center">
              <span>No pending unallocated walk-ins in queue.</span>
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