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
export const INITIAL_VEHICLES: Vehicle[] = [
  // ================= MECHANICAL SERVICING VEHICLES =================
  {
    id: "V1",
    numberTag: 1,
    regNo: "UP81DJ6809",
    model: "Safari",
    fullModelName: "Tata Safari Dark Edition",
    customer: "Rajesh K. Verma",
    serviceAdvisor: "Rohit Malviya",
    technicalSupervisor: "Parveen Vari",
    technician: "Ramesh Sharma",
    bayId: "BAY-01",
    bayName: "Bay 01 - Heavy Repairs",
    allocation: "Zone A - Bay 01 (RFID #TML-B01-4429)",
    workType: "Running Repairs",
    serviceDept: "MECHANICAL",
    ptdDate: "19 Oct 2026",
    ptdTime: "04:30 PM",
    ptd: "19 Oct 2026, 04:30 PM",
    isPtdCrossed: false,
    plannedDate: "19 Oct 2026",
    plannedTime: "04:00 PM",
    targetTime: "04:15 PM",
    workStart: "09:15 AM",
    workEnd: "04:10 PM",
    qiStatus: "In Progress",
    promiseTime: "2026/10/19 04:30 PM",
    stageIndex: 2,
    wmStageIndex: 4, // WIP in Mechanical
    flightStatus: "ON TIME",
    delayMinutes: 0,
    isWalkIn: false,
    odometer: "28,400 KM",
    jobCard: "JC-TML-DEL-2324-004429",
    badgeType: "red",
    badgeText: "JC-TML-DEL-2324-004429",
    vehCategory: "Premium SUV",
    gateInDate: "19 Oct '26, 09:15 AM",
    promisedDeliveryDate: "19 Oct '26, 04:30 PM"
  },
  {
    id: "V2",
    numberTag: 2,
    regNo: "DL14CH2428",
    model: "Harrier",
    fullModelName: "Tata Harrier Fearless Red",
    customer: "Sunita Aggarwal",
    serviceAdvisor: "Saurabh Joshi",
    technicalSupervisor: "Parveen Vari",
    technician: "Sunil Verma",
    bayId: "BAY-02",
    bayName: "Bay 02 - Periodic Service",
    allocation: "Zone A - Bay 02 (RFID #TML-B02-4812)",
    workType: "Paid Service",
    serviceDept: "MECHANICAL",
    ptdDate: "19 Oct 2026",
    ptdTime: "05:15 PM",
    ptd: "19 Oct 2026, 05:15 PM",
    isPtdCrossed: true, // BU REQUIREMENT: PTD crossed, delayed status with blinking alert
    plannedDate: "19 Oct 2026",
    plannedTime: "04:55 PM",
    targetTime: "04:55 PM",
    workStart: "09:40 AM",
    workEnd: "Est. 05:40 PM",
    qiStatus: "Under QI",
    promiseTime: "2026/10/19 05:15 PM",
    stageIndex: 4,
    wmStageIndex: 7, // Road Test
    flightStatus: "DELAYED",
    delayMinutes: 25, // Active delay beyond PTD
    isWalkIn: false,
    odometer: "38,200 KM",
    jobCard: "JC-TML-DEL-2324-004812",
    badgeType: "red",
    badgeText: "JC-TML-DEL-2324-004812",
    vehCategory: "Mid-Size SUV",
    gateInDate: "19 Oct '26, 09:40 AM",
    promisedDeliveryDate: "19 Oct '26, 05:15 PM"
  },
  {
    id: "V3",
    numberTag: 3,
    regNo: "UP16CS7403",
    model: "Nexon",
    fullModelName: "Tata Nexon.ev Empowered",
    customer: "Anand Deshmukh",
    serviceAdvisor: "Imran Khan",
    technicalSupervisor: "Sanjay Deshmukh",
    technician: "Amit Saxena",
    bayId: "BAY-03",
    bayName: "Bay 03 - EV High Voltage",
    allocation: "Zone B - Bay 03 (RFID #TML-B03-4645)",
    workType: "Second Free Service",
    serviceDept: "MECHANICAL",
    ptdDate: "19 Oct 2026",
    ptdTime: "03:45 PM",
    ptd: "19 Oct 2026, 03:45 PM",
    isPtdCrossed: false,
    plannedDate: "19 Oct 2026",
    plannedTime: "03:30 PM",
    targetTime: "03:30 PM",
    workStart: "10:00 AM",
    workEnd: "03:25 PM",
    qiStatus: "Passed",
    promiseTime: "2026/10/19 03:45 PM",
    stageIndex: 3,
    wmStageIndex: 5,
    flightStatus: "ON TIME",
    delayMinutes: 0,
    isWalkIn: false,
    odometer: "14,850 KM",
    jobCard: "SR-TML-DEL-2324-004645",
    badgeType: "blue",
    badgeText: "SR-TML-DEL-2324-004645",
    vehCategory: "Electric SUV",
    gateInDate: "19 Oct '26, 10:00 AM",
    promisedDeliveryDate: "19 Oct '26, 03:45 PM"
  },
  {
    id: "V4",
    numberTag: 4,
    regNo: "UP14EJ9609",
    model: "Curvv",
    fullModelName: "Tata Curvv EV Coupe",
    customer: "Rohan Verma",
    serviceAdvisor: "Hemendra Chundawat",
    technicalSupervisor: "Parveen Vari",
    technician: "Vikas Yadav",
    bayId: "BAY-04",
    bayName: "Bay 04 - Express Bay (Walk-In)",
    allocation: "Zone C - Bay 04 (RFID #TML-B04-4426)",
    workType: "First Free Service",
    serviceDept: "MECHANICAL",
    ptdDate: "19 Oct 2026",
    ptdTime: "06:00 PM",
    ptd: "19 Oct 2026, 06:00 PM",
    isPtdCrossed: false,
    plannedDate: "19 Oct 2026",
    plannedTime: "05:30 PM",
    targetTime: "05:30 PM",
    workStart: "10:30 AM",
    workEnd: "05:15 PM",
    qiStatus: "In Progress",
    promiseTime: "2026/10/19 06:00 PM",
    stageIndex: 1,
    wmStageIndex: 2,
    flightStatus: "EXPEDITED",
    delayMinutes: 0,
    isWalkIn: true,
    odometer: "4,500 KM",
    jobCard: "JC-TML-DEL-2324-004426",
    badgeType: "red",
    badgeText: "JC-TML-DEL-2324-004426",
    vehCategory: "Coupe SUV",
    gateInDate: "19 Oct '26, 10:30 AM",
    promisedDeliveryDate: "19 Oct '26, 06:00 PM"
  },
  {
    id: "V5",
    numberTag: 5,
    regNo: "DL5CS0664",
    model: "Punch",
    fullModelName: "Tata Punch.ev Accomplished",
    customer: "Vikramaditya Roy",
    serviceAdvisor: "Praveen Nair",
    technicalSupervisor: "Sanjay Deshmukh",
    technician: "Manoj Tiwari",
    bayId: "BAY-05",
    bayName: "Bay 05 - Wheel Alignment",
    allocation: "Zone D - Bay 05 (RFID #TML-B05-4810)",
    workType: "First Free Service",
    serviceDept: "MECHANICAL",
    ptdDate: "19 Oct 2026",
    ptdTime: "02:00 PM",
    ptd: "19 Oct 2026, 02:00 PM",
    isPtdCrossed: false,
    plannedDate: "19 Oct 2026",
    plannedTime: "01:30 PM",
    targetTime: "01:30 PM",
    workStart: "08:30 AM",
    workEnd: "01:45 PM",
    qiStatus: "Passed",
    promiseTime: "2026/10/19 02:00 PM",
    stageIndex: 5,
    wmStageIndex: 8,
    flightStatus: "READY FOR PICKUP",
    delayMinutes: 0,
    isWalkIn: false,
    odometer: "12,340 KM",
    jobCard: "JC-TML-DEL-2324-004810",
    badgeType: "red",
    badgeText: "JC-TML-DEL-2324-004810",
    vehCategory: "Compact SUV",
    gateInDate: "19 Oct '26, 08:30 AM",
    promisedDeliveryDate: "19 Oct '26, 02:00 PM"
  },
  {
    id: "V6",
    numberTag: 6,
    regNo: "MH01EK9921",
    model: "Altroz",
    fullModelName: "Tata Altroz Racer Edition",
    customer: "Farhan Akhtar",
    serviceAdvisor: "Naveen Kaushik",
    technicalSupervisor: "Sanjay Deshmukh",
    technician: "Deepak Kumar",
    bayId: "BAY-06",
    bayName: "Bay 06 - Washing & Final",
    allocation: "Zone E - Bay 06 (RFID #TML-B06-4899)",
    workType: "Running Repairs",
    serviceDept: "MECHANICAL",
    ptdDate: "19 Oct 2026",
    ptdTime: "05:45 PM",
    ptd: "19 Oct 2026, 05:45 PM",
    isPtdCrossed: false,
    plannedDate: "19 Oct 2026",
    plannedTime: "05:15 PM",
    targetTime: "05:15 PM",
    workStart: "11:15 AM",
    workEnd: "05:00 PM",
    qiStatus: "Pending",
    promiseTime: "2026/10/19 05:45 PM",
    stageIndex: 0,
    wmStageIndex: 0,
    flightStatus: "ON TIME",
    delayMinutes: 0,
    isWalkIn: false,
    odometer: "21,100 KM",
    jobCard: "SR-TML-DEL-2324-004899",
    badgeType: "blue",
    badgeText: "SR-TML-DEL-2324-004899",
    vehCategory: "Premium Hatchback",
    gateInDate: "19 Oct '26, 11:15 AM",
    promisedDeliveryDate: "19 Oct '26, 05:45 PM"
  },

  // ================= BODYSHOP SERVICING VEHICLES =================
  // BU Requirement: For Bodyshop servicing, milestone between Floor In and WIP called "Customer estimate approval"
  {
    id: "BS1",
    numberTag: 7,
    regNo: "HR26EM1008",
    model: "Safari",
    fullModelName: "Tata Safari Accomplished Stealth",
    customer: "Rajeshwar Rao",
    serviceAdvisor: "Vikram Rathore",
    technicalSupervisor: "Rajan Kulkarni",
    technician: "Mohan Lal (Frame Alignment)",
    bayId: "BS-01",
    bayName: "Bay BS-01 - Frame Alignment & Jig",
    allocation: "Zone BS-A - Bay BS-01 (RFID #TML-BS01-9012)",
    workType: "Accidental Bodyshop Repair",
    serviceDept: "BODYSHOP",
    bodyshopEstimate: {
      estimatedAmount: "₹48,200",
      insuranceProvider: "Tata AIG General Insurance",
      approvalStatus: "Approved",
      partsIncluded: ["Front Bumper Assembly", "LH Front Fender", "LED Headlamp Cluster", "Structural Apron Pulling"],
      approvalDate: "19 Oct '26, 11:20 AM"
    },
    ptdDate: "20 Oct 2026",
    ptdTime: "05:30 PM",
    ptd: "20 Oct 2026, 05:30 PM",
    isPtdCrossed: false,
    plannedDate: "20 Oct 2026",
    plannedTime: "05:00 PM",
    targetTime: "05:00 PM",
    workStart: "09:00 AM",
    workEnd: "05:15 PM",
    qiStatus: "In Progress",
    promiseTime: "2026/10/20 05:30 PM",
    stageIndex: 2,
    wmStageIndex: 4, // Exactly at milestone: "Customer estimate approval"
    flightStatus: "ON TIME",
    delayMinutes: 0,
    isWalkIn: false,
    odometer: "31,400 KM",
    jobCard: "JC-BS-DEL-2324-001201",
    badgeType: "red",
    badgeText: "JC-BS-DEL-2324-001201",
    vehCategory: "Premium SUV",
    gateInDate: "19 Oct '26, 08:45 AM",
    promisedDeliveryDate: "20 Oct '26, 05:30 PM"
  },
  {
    id: "BS2",
    numberTag: 8,
    regNo: "DL04CA6721",
    model: "Harrier",
    fullModelName: "Tata Harrier Fearless Sunlit Yellow",
    customer: "Pooja Malhotra",
    serviceAdvisor: "Vikram Rathore",
    technicalSupervisor: "Rajan Kulkarni",
    technician: "Kailash Chand (Panel Beating)",
    bayId: "BS-02",
    bayName: "Bay BS-02 - Panel Beating & Denting",
    allocation: "Zone BS-B - Bay BS-02 (RFID #TML-BS02-9014)",
    workType: "Denting & Painting",
    serviceDept: "BODYSHOP",
    bodyshopEstimate: {
      estimatedAmount: "₹24,500",
      insuranceProvider: "ICICI Lombard",
      approvalStatus: "Approved",
      partsIncluded: ["Rear Door Outer Skin", "Quarter Panel Beating", "Polyurethane Clear Coat"],
      approvalDate: "19 Oct '26, 10:15 AM"
    },
    ptdDate: "19 Oct 2026",
    ptdTime: "06:15 PM",
    ptd: "19 Oct 2026, 06:15 PM",
    isPtdCrossed: true, // Delayed Bodyshop Vehicle with blinking alert
    plannedDate: "19 Oct 2026",
    plannedTime: "05:45 PM",
    targetTime: "05:45 PM",
    workStart: "09:30 AM",
    workEnd: "Est. 06:45 PM",
    qiStatus: "Under QI",
    promiseTime: "2026/10/19 06:15 PM",
    stageIndex: 3,
    wmStageIndex: 5, // WIP (post customer approval)
    flightStatus: "DELAYED",
    delayMinutes: 30, // 30m delay beyond PTD
    isWalkIn: false,
    odometer: "19,800 KM",
    jobCard: "JC-BS-DEL-2324-001202",
    badgeType: "red",
    badgeText: "JC-BS-DEL-2324-001202",
    vehCategory: "Mid-Size SUV",
    gateInDate: "19 Oct '26, 09:10 AM",
    promisedDeliveryDate: "19 Oct '26, 06:15 PM"
  },
  {
    id: "BS3",
    numberTag: 9,
    regNo: "MH12PQ3344",
    model: "Nexon",
    fullModelName: "Tata Nexon Fearless Purple",
    customer: "Arjun Singhal",
    serviceAdvisor: "Amitabh Sen",
    technicalSupervisor: "Dinesh Mehta",
    technician: "Rakesh Pal (Prep Master)",
    bayId: "BS-03",
    bayName: "Bay BS-03 - Surface Prep & Primer",
    allocation: "Zone BS-C - Bay BS-03 (RFID #TML-BS03-9018)",
    workType: "Scratch & Dent Repair",
    serviceDept: "BODYSHOP",
    bodyshopEstimate: {
      estimatedAmount: "₹16,800",
      insuranceProvider: "HDFC ERGO General Insurance",
      approvalStatus: "Awaiting Customer Approval", // Demonstrates Pending Customer Approval
      partsIncluded: ["Front Bumper Full Paint", "Door Mirror Shell", "Primer Surfacer"],
      approvalDate: "Pending Customer Call"
    },
    ptdDate: "19 Oct 2026",
    ptdTime: "04:45 PM",
    ptd: "19 Oct 2026, 04:45 PM",
    isPtdCrossed: false,
    plannedDate: "19 Oct 2026",
    plannedTime: "04:15 PM",
    targetTime: "04:15 PM",
    workStart: "10:15 AM",
    workEnd: "04:30 PM",
    qiStatus: "Pending",
    promiseTime: "2026/10/19 04:45 PM",
    stageIndex: 2,
    wmStageIndex: 4, // Exactly at milestone: "Customer estimate approval"
    flightStatus: "ON TIME",
    delayMinutes: 0,
    isWalkIn: false,
    odometer: "25,300 KM",
    jobCard: "JC-BS-DEL-2324-001203",
    badgeType: "red",
    badgeText: "JC-BS-DEL-2324-001203",
    vehCategory: "Compact SUV",
    gateInDate: "19 Oct '26, 10:00 AM",
    promisedDeliveryDate: "19 Oct '26, 04:45 PM"
  },
  {
    id: "BS4",
    numberTag: 10,
    regNo: "UP16BQ9001",
    model: "Curvv",
    fullModelName: "Tata Curvv EV Pure Grey",
    customer: "Nisha Singhania",
    serviceAdvisor: "Amitabh Sen",
    technicalSupervisor: "Dinesh Mehta",
    technician: "Anand Swamy (Spray Master)",
    bayId: "BS-04",
    bayName: "Bay BS-04 - Heated Paint Booth",
    allocation: "Zone BS-D - Bay BS-04 (RFID #TML-BS04-9022)",
    workType: "Full Side Paint & Clear Coat",
    serviceDept: "BODYSHOP",
    bodyshopEstimate: {
      estimatedAmount: "₹36,000",
      insuranceProvider: "Bajaj Allianz",
      approvalStatus: "Approved",
      partsIncluded: ["Running Board Panel", "LH Front & Rear Door Paint", "High Solid Clear Coat"],
      approvalDate: "19 Oct '26, 11:45 AM"
    },
    ptdDate: "19 Oct 2026",
    ptdTime: "07:00 PM",
    ptd: "19 Oct 2026, 07:00 PM",
    isPtdCrossed: false,
    plannedDate: "19 Oct 2026",
    plannedTime: "06:30 PM",
    targetTime: "06:30 PM",
    workStart: "11:00 AM",
    workEnd: "06:45 PM",
    qiStatus: "In Progress",
    promiseTime: "2026/10/19 07:00 PM",
    stageIndex: 3,
    wmStageIndex: 5, // WIP (Paint booth baking)
    flightStatus: "EXPEDITED",
    delayMinutes: 0,
    isWalkIn: false,
    odometer: "8,900 KM",
    jobCard: "JC-BS-DEL-2324-001204",
    badgeType: "red",
    badgeText: "JC-BS-DEL-2324-001204",
    vehCategory: "Coupe SUV",
    gateInDate: "19 Oct '26, 10:45 AM",
    promisedDeliveryDate: "19 Oct '26, 07:00 PM"
  },
  {
    id: "BS5",
    numberTag: 11,
    regNo: "DL01BZ4512",
    model: "Punch",
    fullModelName: "Tata Punch Daytona Grey",
    customer: "Gaurav Kapoor",
    serviceAdvisor: "Vikram Rathore",
    technicalSupervisor: "Rajan Kulkarni",
    technician: "Suresh Jha (Trim Assembler)",
    bayId: "BS-05",
    bayName: "Bay BS-05 - Reassembly & Trim",
    allocation: "Zone BS-E - Bay BS-05 (RFID #TML-BS05-9025)",
    workType: "Accidental Bodyshop Repair",
    serviceDept: "BODYSHOP",
    bodyshopEstimate: {
      estimatedAmount: "₹28,900",
      insuranceProvider: "Tata AIG General Insurance",
      approvalStatus: "Approved",
      partsIncluded: ["Radiator Support Assembly", "Grille & Chrome Insert", "Front Camera Recalibration"],
      approvalDate: "18 Oct '26, 04:30 PM"
    },
    ptdDate: "19 Oct 2026",
    ptdTime: "03:30 PM",
    ptd: "19 Oct 2026, 03:30 PM",
    isPtdCrossed: false,
    plannedDate: "19 Oct 2026",
    plannedTime: "03:00 PM",
    targetTime: "03:00 PM",
    workStart: "08:15 AM",
    workEnd: "03:15 PM",
    qiStatus: "Passed",
    promiseTime: "2026/10/19 03:30 PM",
    stageIndex: 4,
    wmStageIndex: 7, // Floor Out / Ready for Detailing
    flightStatus: "ON TIME",
    delayMinutes: 0,
    isWalkIn: true,
    odometer: "15,200 KM",
    jobCard: "JC-BS-DEL-2324-001205",
    badgeType: "red",
    badgeText: "JC-BS-DEL-2324-001205",
    vehCategory: "Compact SUV",
    gateInDate: "19 Oct '26, 08:00 AM",
    promisedDeliveryDate: "19 Oct '26, 03:30 PM"
  },
  {
    id: "BS6",
    numberTag: 12,
    regNo: "UP32EF8899",
    model: "Altroz",
    fullModelName: "Tata Altroz Opera Blue",
    customer: "Shweta Tiwari",
    serviceAdvisor: "Amitabh Sen",
    technicalSupervisor: "Dinesh Mehta",
    technician: "Kamal Hassan (Detailing)",
    bayId: "BS-06",
    bayName: "Bay BS-06 - Rubbing & Polishing",
    allocation: "Zone BS-F - Bay BS-06 (RFID #TML-BS06-9028)",
    workType: "Denting & Painting",
    serviceDept: "BODYSHOP",
    bodyshopEstimate: {
      estimatedAmount: "₹12,400",
      insuranceProvider: "Cash / Customer Paid",
      approvalStatus: "Approved",
      partsIncluded: ["Bonnet Rubbing & Buffing", "Ceramic Gloss Finishing"],
      approvalDate: "19 Oct '26, 09:00 AM"
    },
    ptdDate: "19 Oct 2026",
    ptdTime: "02:30 PM",
    ptd: "19 Oct 2026, 02:30 PM",
    isPtdCrossed: false,
    plannedDate: "19 Oct 2026",
    plannedTime: "02:00 PM",
    targetTime: "02:00 PM",
    workStart: "08:00 AM",
    workEnd: "02:15 PM",
    qiStatus: "Passed",
    promiseTime: "2026/10/19 02:30 PM",
    stageIndex: 5,
    wmStageIndex: 9, // Road Test / Ready
    flightStatus: "READY FOR PICKUP",
    delayMinutes: 0,
    isWalkIn: false,
    odometer: "27,600 KM",
    jobCard: "JC-BS-DEL-2324-001206",
    badgeType: "red",
    badgeText: "JC-BS-DEL-2324-001206",
    vehCategory: "Premium Hatchback",
    gateInDate: "19 Oct '26, 07:45 AM",
    promisedDeliveryDate: "19 Oct '26, 02:30 PM"
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
    technicalSupervisor: "Parveen Vari",
    technician: "Ramesh Sharma",
    bayId: "BAY-01",
    bayName: "Bay 01 - Heavy Repairs",
    allocation: "Zone A - Staging Queue #01 (Chip #RFID-Q01)",
    workType: "Paid Service",
    serviceDept: "MECHANICAL",
    ptdDate: "19 Oct 2026",
    ptdTime: "06:30 PM",
    ptd: "19 Oct 2026, 06:30 PM",
    isPtdCrossed: false,
    plannedDate: "19 Oct 2026",
    plannedTime: "06:00 PM",
    targetTime: "06:00 PM",
    workStart: "Pending",
    workEnd: "Est. 06:15 PM",
    qiStatus: "Pending",
    promiseTime: "2026/10/19 06:30 PM",
    stageIndex: 0,
    wmStageIndex: 1,
    flightStatus: "ON TIME",
    delayMinutes: 0,
    isWalkIn: false,
    odometer: "44,200 KM",
    jobCard: "JC-TML-DEL-2324-004901",
    badgeType: "red",
    badgeText: "JC-TML-DEL-2324-004901",
    vehCategory: "Premium SUV",
    gateInDate: "19 Oct '26, 11:30 AM",
    promisedDeliveryDate: "19 Oct '26, 06:30 PM"
  },
  {
    id: "Q2",
    numberTag: 2,
    regNo: "DL03CB8821",
    model: "Harrier",
    fullModelName: "Tata Harrier Adventure Plus",
    customer: "Meenakshi Iyer",
    serviceAdvisor: "Saurabh Joshi",
    technicalSupervisor: "Parveen Vari",
    technician: "Sunil Verma",
    bayId: "BAY-02",
    bayName: "Bay 02 - Periodic Service",
    allocation: "Zone A - Staging Queue #02 (Chip #RFID-Q02)",
    workType: "Running Repairs",
    serviceDept: "MECHANICAL",
    ptdDate: "19 Oct 2026",
    ptdTime: "07:00 PM",
    ptd: "19 Oct 2026, 07:00 PM",
    isPtdCrossed: false,
    plannedDate: "19 Oct 2026",
    plannedTime: "06:30 PM",
    targetTime: "06:30 PM",
    workStart: "Pending",
    workEnd: "Est. 06:45 PM",
    qiStatus: "Pending",
    promiseTime: "2026/10/19 07:00 PM",
    stageIndex: 0,
    wmStageIndex: 0,
    flightStatus: "ON TIME",
    delayMinutes: 0,
    isWalkIn: false,
    odometer: "22,600 KM",
    jobCard: "JC-TML-DEL-2324-004933",
    badgeType: "red",
    badgeText: "JC-TML-DEL-2324-004933",
    vehCategory: "Mid-Size SUV",
    gateInDate: "19 Oct '26, 11:45 AM",
    promisedDeliveryDate: "19 Oct '26, 07:00 PM"
  },
  {
    id: "BS-Q1",
    numberTag: 3,
    regNo: "DL09CD1122",
    model: "Harrier",
    fullModelName: "Tata Harrier Dark Edition",
    customer: "Manish Chawla",
    serviceAdvisor: "Vikram Rathore",
    technicalSupervisor: "Rajan Kulkarni",
    technician: "Mohan Lal",
    bayId: "BS-01",
    bayName: "Bay BS-01 - Frame Alignment & Jig",
    allocation: "Zone BS-A - Staging Queue #01 (Chip #RFID-BSQ01)",
    workType: "Accidental Bodyshop Repair",
    serviceDept: "BODYSHOP",
    bodyshopEstimate: {
      estimatedAmount: "₹55,000",
      insuranceProvider: "Tata AIG General Insurance",
      approvalStatus: "Under Review",
      partsIncluded: ["Front Crossmember", "AC Condenser", "Front Subframe"],
      approvalDate: "Awaiting Surveyor Inspection"
    },
    ptdDate: "20 Oct 2026",
    ptdTime: "06:00 PM",
    ptd: "20 Oct 2026, 06:00 PM",
    isPtdCrossed: false,
    plannedDate: "20 Oct 2026",
    plannedTime: "05:30 PM",
    targetTime: "05:30 PM",
    workStart: "Pending",
    workEnd: "Est. 05:45 PM",
    qiStatus: "Pending",
    promiseTime: "2026/10/20 06:00 PM",
    stageIndex: 0,
    wmStageIndex: 0,
    flightStatus: "ON TIME",
    delayMinutes: 0,
    isWalkIn: false,
    odometer: "18,400 KM",
    jobCard: "JC-BS-DEL-2324-001210",
    badgeType: "red",
    badgeText: "JC-BS-DEL-2324-001210",
    vehCategory: "Mid-Size SUV",
    gateInDate: "19 Oct '26, 11:30 AM",
    promisedDeliveryDate: "20 Oct '26, 06:00 PM"
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

export default function App() {
  const [currentUser, setCurrentUser] = useState<{ role: "Receptionist" | "WorksManager"; name: string; username: string } | null>(null);
  const [usernameInput, setUsernameInput] = useState("NP7_3007960");
  const [passwordInput, setPasswordInput] = useState("••••••••••");

  // BU Requirement: Support Mechanical vehicle servicing AND Bodyshop servicing
  const [selectedDept, setSelectedDept] = useState<"ALL" | "MECHANICAL" | "BODYSHOP">("ALL");

  const [receptionTab, setReceptionTab] = useState<"appointments" | "walkin" | "status">("appointments");
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
  const [vehicles, setVehicles] = useState<Vehicle[]>(INITIAL_VEHICLES);
  const [countdown, setCountdown] = useState<number>(20);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
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
        const stages = getPipelineStages(v.serviceDept);
        const nextWmIdx = (v.wmStageIndex + 1) % stages.length;
        const nextStageIdx = Math.min(
          STATUS_STAGES.length - 1,
          Math.floor((nextWmIdx / (stages.length - 1)) * (STATUS_STAGES.length - 1))
        );
        const isReady = nextWmIdx >= stages.length - 2;
        return {
          ...v,
          wmStageIndex: nextWmIdx,
          stageIndex: nextStageIdx,
          flightStatus: isReady ? "READY FOR PICKUP" : (v.flightStatus === "DELAYED" ? "DELAYED" : "ON TIME"),
          qiStatus: nextWmIdx >= stages.length - 2 ? "Passed" : (nextWmIdx === stages.length - 3 ? "Under QI" : v.qiStatus)
        };
      }
      return v;
    }));
  };

  const toggleEstimateApproval = (id: string) => {
    setVehicles((prev) => prev.map((v) => {
      if (v.id === id && v.bodyshopEstimate) {
        const isApproved = v.bodyshopEstimate.approvalStatus === "Approved";
        const newStatus: "Approved" | "Awaiting Customer Approval" = isApproved ? "Awaiting Customer Approval" : "Approved";
        return {
          ...v,
          bodyshopEstimate: {
            ...v.bodyshopEstimate,
            approvalStatus: newStatus,
            approvalDate: newStatus === "Approved" ? "Customer Approved Just Now" : "Pending Sign-off"
          }
        };
      }
      return v;
    }));
  };

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
    const totalSecs = (baseMins * 60) + delayElapsedSeconds;
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

  // Adjust delay time on demand (+5m, -5m) with immediate live update
  const adjustVehicleDelay = (id: string, deltaMinutes: number) => {
    setVehicles((prev) => prev.map((v) => {
      if (v.id === id) {
        const currentMins = v.delayMinutes ?? 25;
        const newMins = Math.max(5, currentMins + deltaMinutes);
        return {
          ...v,
          flightStatus: "DELAYED",
          isPtdCrossed: true,
          delayMinutes: newMins
        };
      }
      return v;
    }));
  };

  // BU Testing & Simulation: Toggle between DELAYED / PTD CROSSED and ON TIME
  const toggleVehicleDelay = (id: string) => {
    setVehicles((prev) => prev.map((v) => {
      if (v.id === id) {
        const willBeDelayed = !(v.flightStatus === "DELAYED" || v.isPtdCrossed);
        return {
          ...v,
          flightStatus: willBeDelayed ? "DELAYED" : "ON TIME",
          isPtdCrossed: willBeDelayed,
          delayMinutes: willBeDelayed ? (v.delayMinutes || 25) : 0,
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
                <button
                  onClick={() => setCurrentUser({ role: "WorksManager", name: "Neeraj Patel (Works Manager)", username: "NP7_3007960" })}
                  className="w-full bg-[#002244] hover:bg-[#001730] text-white py-2.5 rounded text-xs font-semibold transition shadow-xs flex items-center justify-center space-x-1.5"
                >
                  <span>🔧 Works Manager Workshop Board</span>
                </button>
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
              <div className="font-bold text-xs">TATA MOTORS AUTHORIZED SERVICE - 3007960</div>
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
            <span className="font-semibold text-gray-700">TATA MOTORS PASSENGER VEHICLES WORKSHOP-3007960</span>
            <span className="text-gray-400 text-[11px]">Passenger Vehicle (PV) Track &amp; Trace</span>
          </div>

          <div className="flex items-center space-x-3">
            {/* BU Workshop Department Selector: Mechanical Servicing vs Bodyshop Servicing */}
            <div className="flex items-center bg-gray-100 p-0.5 rounded border border-gray-300 shadow-2xs">
              <button
                type="button"
                onClick={() => {
                  setSelectedDept("MECHANICAL");
                  setSelectedMilestoneFilter("ALL");
                  if (generalFilter.type === "bay" && !generalFilter.value.startsWith("BAY")) {
                    setGeneralFilter({ type: "all", value: "ALL", label: "All Vehicles / All Bays" });
                  }
                }}
                className={`flex items-center space-x-1.5 px-3 py-1 rounded text-xs font-bold transition cursor-pointer ${
                  selectedDept === "MECHANICAL"
                    ? "bg-[#002244] text-white shadow-xs"
                    : "text-gray-700 hover:text-blue-900"
                }`}
                title="Mechanical Vehicle Servicing (Periodic, Repairs, EV, Express, Wheel Alignment)"
              >
                <span>🚗 Mechanical</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold font-mono ${
                  selectedDept === "MECHANICAL" ? "bg-cyan-400 text-slate-950" : "bg-blue-100 text-blue-900"
                }`}>
                  {vehicles.filter(v => v.serviceDept === "MECHANICAL").length}
                </span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedDept("BODYSHOP");
                  setSelectedMilestoneFilter("ALL");
                  if (generalFilter.type === "bay" && !generalFilter.value.startsWith("BS")) {
                    setGeneralFilter({ type: "all", value: "ALL", label: "All Vehicles / All Bays" });
                  }
                }}
                className={`flex items-center space-x-1.5 px-3 py-1 rounded text-xs font-bold transition cursor-pointer ${
                  selectedDept === "BODYSHOP"
                    ? "bg-[#801b00] text-white shadow-xs"
                    : "text-gray-700 hover:text-red-900"
                }`}
                title="Bodyshop Servicing (Denting, Painting, Frame Alignment, Customer Estimate Approval)"
              >
                <span>🎨 Bodyshop</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold font-mono ${
                  selectedDept === "BODYSHOP" ? "bg-amber-400 text-slate-950" : "bg-amber-100 text-amber-900"
                }`}>
                  {vehicles.filter(v => v.serviceDept === "BODYSHOP").length}
                </span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedDept("ALL");
                  setSelectedMilestoneFilter("ALL");
                }}
                className={`flex items-center space-x-1 px-2.5 py-1 rounded text-xs font-semibold transition cursor-pointer ${
                  selectedDept === "ALL"
                    ? "bg-slate-700 text-white shadow-xs"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                title="View All Servicing Departments Consolidated"
              >
                <span>All ({vehicles.length})</span>
              </button>
            </div>

            {/* BU Requested Display Toggle: Bay-Wise Display vs Milestone Pipeline */}
            <div className="flex items-center bg-gray-100 p-0.5 rounded border border-gray-300 shadow-2xs">
              <button
                type="button"
                onClick={() => setWmViewMode("bay")}
                className={`flex items-center space-x-1 px-3 py-1 rounded text-xs font-bold transition cursor-pointer ${
                  wmViewMode === "bay"
                    ? "bg-[#002244] text-white shadow-xs"
                    : "text-gray-700 hover:text-blue-900"
                }`}
                title="BU Standard: View workshop organized by Service Bays"
              >
                <span>🏬 Bay-Wise Display</span>
                <span className="ml-1 px-1.5 py-0.2 text-[9px] rounded-full bg-cyan-500 text-slate-950 font-extrabold uppercase">BU</span>
              </button>
              <button
                type="button"
                onClick={() => setWmViewMode("pipeline")}
                className={`flex items-center space-x-1 px-3 py-1 rounded text-xs font-semibold transition cursor-pointer ${
                  wmViewMode === "pipeline"
                    ? "bg-[#002244] text-white shadow-xs"
                    : "text-gray-700 hover:text-blue-900"
                }`}
                title="View vehicles arranged linearly by Milestone Stepper"
              >
                <span>📋 Stepper View</span>
              </button>
            </div>

            <div className="text-right font-mono text-[11px] border-l border-gray-200 pl-3.5">
              <div className="font-extrabold text-blue-900 flex items-center justify-end space-x-1">
                <span className="text-[10px]">📅</span>
                <span>{currentTime.toLocaleDateString("en-IN", { weekday: "short", day: "2-digit", month: "short", year: "numeric" })}</span>
              </div>
              <div className="font-black text-gray-900 text-xs flex items-center justify-end space-x-1 mt-0.5">
                <span className="text-[10px]">⏰</span>
                <span>{currentTime.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true })}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Milestone Metrics Ribbon - Dynamically adapts to Mechanical (10 stages) or Bodyshop (11 stages with Customer estimate approval between Floor In and WIP) */}
        <div className="bg-[#E5E7EB] border-b border-gray-300 px-6 py-1.5 flex items-center gap-2.5 text-xs select-none">
          {/* Left area matching vehicle info columns */}
          <div className="w-[455px] shrink-0 flex items-center justify-between pr-2">
            <div className="flex items-center space-x-2">
              {/* Functional Filter Dropdown */}
              <div className="relative flex items-center">
                <select
                  value={`${generalFilter.type}:${generalFilter.value}`}
                  onChange={(e) => {
                    const [type, value] = e.target.value.split(":");
                    let foundOpt: GeneralFilterOption = { type: "all", value: "ALL", label: "All Vehicles / All Bays" };
                    for (const grp of DROPDOWN_FILTER_GROUPS) {
                      const match = grp.options.find(o => o.type === type && o.value === value);
                      if (match) {
                        foundOpt = match;
                        break;
                      }
                    }
                    setGeneralFilter(foundOpt);
                  }}
                  className={`border px-2.5 py-1 pr-6 rounded text-xs font-bold shadow-2xs transition cursor-pointer appearance-none ${
                    generalFilter.type !== "all"
                      ? "bg-blue-600 text-white border-blue-700 shadow-xs"
                      : "bg-[#002244] hover:bg-[#001730] text-white border-[#002244]"
                  }`}
                  title="Filter vehicles by department, bay, work type, model, or status"
                >
                  {DROPDOWN_FILTER_GROUPS.map((grp) => (
                    <optgroup key={grp.group} label={grp.group} className="text-gray-900 bg-white font-bold">
                      {grp.options.map((opt) => (
                        <option
                          key={`${opt.type}-${opt.value}`}
                          value={`${opt.type}:${opt.value}`}
                          className="text-gray-800 bg-white font-normal py-1"
                        >
                          {opt.label}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-2 text-white text-[9px]">▾</span>
              </div>

              <span className="text-[11px] font-bold text-gray-700">
                {wmViewMode === "bay" ? "Active Bay Floor Monitor" : "Milestone Pipeline"}
              </span>
            </div>

            {(generalFilter.type !== "all" || selectedMilestoneFilter !== "ALL") && (
              <button
                type="button"
                onClick={() => {
                  setGeneralFilter({ type: "all", value: "ALL", label: "All Vehicles / All Bays" });
                  setSelectedMilestoneFilter("ALL");
                }}
                className="text-[10px] text-blue-700 hover:underline font-semibold cursor-pointer"
              >
                Clear Filter ✕
              </button>
            )}
          </div>

          {/* Right area matching the stepper line width and padding - Dynamically renders department milestones */}
          {(() => {
            const activeMilestones = selectedDept === "BODYSHOP"
              ? BODYSHOP_PIPELINE_STAGES
              : (selectedDept === "MECHANICAL" ? MECHANICAL_PIPELINE_STAGES : BODYSHOP_PIPELINE_STAGES);

            return (
              <div
                className="flex-1 px-1 grid gap-1 items-center"
                style={{ gridTemplateColumns: `repeat(${activeMilestones.length}, minmax(0, 1fr))` }}
              >
                {activeMilestones.map((label) => {
                  const isSelected = selectedMilestoneFilter === label;
                  const isEstimateApproval = label === "Customer estimate approval";

                  return (
                    <button
                      key={label}
                      type="button"
                      onClick={() => setSelectedMilestoneFilter(isSelected ? "ALL" : label)}
                      title={`Filter by milestone: ${label}`}
                      className={`border py-1 px-0.5 rounded shadow-2xs font-extrabold text-[8px] uppercase transition cursor-pointer text-center w-full truncate flex items-center justify-center ${
                        isSelected
                          ? (isEstimateApproval ? "bg-amber-600 text-white border-amber-700 shadow-xs ring-2 ring-amber-400" : "bg-blue-600 text-white border-blue-700 shadow-xs")
                          : (isEstimateApproval
                              ? "bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-400 font-black ring-1 ring-amber-300"
                              : "bg-white hover:bg-blue-50 text-gray-800 border-gray-300")
                      }`}
                    >
                      {isEstimateApproval ? "📝 Estimate Appr." : label}
                    </button>
                  );
                })}
              </div>
            );
          })()}
        </div>

        {/* WORKSHOP DISPLAY AREA: EITHER BU REQUESTED BAY-WISE DISPLAY OR VEHICLE STEPPER ROW DISPLAY */}
        {wmViewMode === "bay" ? (
          /* =========================================================================
             BU REQUESTED BAY-WISE DISPLAY (Organized by Workshop Service Bays)
             ========================================================================= */
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {/* Quick Bay Statistics Bar (Filtered by Selected Department) */}
            {(() => {
              const activeBays = WORKSHOP_BAYS.filter(b => selectedDept === "ALL" || b.department === selectedDept);
              const gridColsClass = activeBays.length <= 6
                ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6"
                : "grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-12";

              return (
                <div className={`grid ${gridColsClass} gap-2.5`}>
                  {activeBays.map((b) => {
                    const assigned = vehicles.filter(v => v.bayId === b.id);
                    const isOccupied = assigned.length > 0;
                    const isCurrentFiltered = generalFilter.type === "bay" && generalFilter.value === b.id;
                    const isBodyshopBay = b.department === "BODYSHOP";

                    return (
                      <button
                        key={`bay-summary-${b.id}`}
                        type="button"
                        onClick={() => {
                          if (isCurrentFiltered) {
                            setGeneralFilter({ type: "all", value: "ALL", label: "All Vehicles / All Bays" });
                          } else {
                            setGeneralFilter({ type: "bay", value: b.id, label: b.name });
                          }
                        }}
                        className={`p-2 rounded border text-left transition shadow-2xs cursor-pointer flex flex-col justify-between ${
                          isCurrentFiltered
                            ? "bg-blue-50 border-blue-600 ring-2 ring-blue-500/40"
                            : "bg-white hover:border-blue-400 border-gray-300"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`font-extrabold text-[11px] font-mono ${isBodyshopBay ? "text-amber-900" : "text-blue-950"}`}>
                            {b.id}
                          </span>
                          <span className={`text-[8.5px] font-bold px-1.5 py-0.2 rounded-xs uppercase ${
                            isOccupied
                              ? (isBodyshopBay ? "bg-amber-100 text-amber-900 border border-amber-300" : "bg-emerald-100 text-emerald-800 border border-emerald-300")
                              : "bg-gray-100 text-gray-500"
                          }`}>
                            {isOccupied ? "Occupied" : "Vacant"}
                          </span>
                        </div>
                        <div className="text-[9.5px] font-bold text-gray-800 truncate mt-1">{b.name.replace(/^Bay (BAY-\d+|BS-\d+) - /, "")}</div>
                        <div className="text-[8.5px] text-gray-500 truncate mt-0.5">Tech: {b.defaultTechnician}</div>
                        <div className="mt-1.5 pt-1 border-t border-gray-100 flex items-center justify-between text-[9.5px]">
                          <span className="text-gray-400 text-[8.5px]">{isBodyshopBay ? "🎨 Bodyshop" : "🚗 Mech"}</span>
                          <span className="font-extrabold text-blue-900 font-mono">Veh: {assigned.length}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              );
            })()}

            {/* Bay-Wise Detailed Grid (2 Columns on large screens, each Bay showing equipment, tech, assigned vehicle & stage) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {(() => {
                const activeBays = WORKSHOP_BAYS.filter(b => selectedDept === "ALL" || b.department === selectedDept);

                return activeBays.map((bay) => {
                  const bayVehicles = vehicles.filter((v) => {
                    if (v.bayId !== bay.id) return false;
                    if (selectedDept !== "ALL" && v.serviceDept !== selectedDept) return false;
                    if (selectedMilestoneFilter !== "ALL") {
                      const stages = getPipelineStages(v.serviceDept);
                      if (stages[v.wmStageIndex] !== selectedMilestoneFilter) {
                        return false;
                      }
                    }
                    if (generalFilter.type === "workType") {
                      if (v.workType !== generalFilter.value) return false;
                    } else if (generalFilter.type === "model") {
                      if (v.model !== generalFilter.value) return false;
                    } else if (generalFilter.type === "flightStatus") {
                      if (v.flightStatus !== generalFilter.value) return false;
                    } else if (generalFilter.type === "bay") {
                      if (v.bayId !== generalFilter.value) return false;
                    } else if (generalFilter.type === "dept") {
                      if (v.serviceDept !== generalFilter.value) return false;
                    }
                    return true;
                  });

                  const isBayFilteredOut = generalFilter.type === "bay" && generalFilter.value !== bay.id;
                  if (isBayFilteredOut) return null;

                  const primaryVeh = bayVehicles[0];
                  const liveDelay = primaryVeh ? getLiveVehicleDelay(primaryVeh) : null;
                  const isDelayed = primaryVeh && (primaryVeh.flightStatus === "DELAYED" || primaryVeh.isPtdCrossed);
                  const isBodyshopBay = bay.department === "BODYSHOP";

                  return (
                    <div
                      key={bay.id}
                      className={`bg-white rounded-md shadow-2xs overflow-hidden flex flex-col transition duration-300 ${
                        isDelayed
                          ? "bay-border-alarm ring-2 ring-red-500/60 border-2 border-red-500"
                          : "border border-gray-300 hover:border-blue-500"
                      }`}
                    >
                      {/* Bay Header */}
                      <div className={`text-white px-3.5 py-2 flex items-center justify-between text-xs transition-colors ${
                        isDelayed
                          ? "bg-red-950 border-b border-red-800"
                          : (isBodyshopBay ? "bg-[#331100] border-b border-amber-900" : "bg-[#002244]")
                      }`}>
                        <div className="flex items-center space-x-2">
                          <span className={`font-black font-mono px-2 py-0.5 rounded text-[11px] ${
                            isDelayed ? "bg-red-500 text-white" : (isBodyshopBay ? "bg-amber-500 text-slate-950" : "bg-cyan-500 text-slate-950")
                          }`}>
                            {bay.id}
                          </span>
                          <span className="font-extrabold text-sm tracking-tight">{bay.name}</span>
                          <span className="hidden sm:inline text-blue-200 text-[10.5px]">| {bay.floorZone}</span>
                          <span className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded uppercase ${
                            isBodyshopBay ? "bg-amber-900/80 text-amber-200 border border-amber-700/60" : "bg-blue-900/80 text-cyan-200 border border-blue-700/60"
                          }`}>
                            {isBodyshopBay ? "🎨 Bodyshop Bay" : "🚗 Mechanical Bay"}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] text-blue-100 bg-black/40 px-2 py-0.5 rounded border border-white/20 font-medium">
                            👤 Sup: <b>{primaryVeh?.technicalSupervisor || bay.technicalSupervisor}</b>
                          </span>
                          {isDelayed && liveDelay ? (
                            <span className="bg-red-600 text-white font-black px-2.5 py-0.5 rounded text-[10px] uppercase tracking-wide blink-alarm flex items-center space-x-1 shadow-sm">
                              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                              <span>🚨 DELAYED ({liveDelay.displayLive})</span>
                            </span>
                          ) : (
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                              primaryVeh ? "bg-emerald-500 text-black" : "bg-gray-600 text-gray-200"
                            }`}>
                              {primaryVeh ? "ACTIVE JOB" : "VACANT"}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Bay Body */}
                      {primaryVeh ? (
                        <div className="p-3.5 flex flex-col space-y-3">
                          {/* Vehicle Primary Info & Plate */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
                            <div className="flex items-center space-x-3">
                              <div className="w-24 h-14 bg-[#071322] rounded border border-gray-200 p-1 flex items-center justify-center shrink-0 shadow-2xs overflow-hidden">
                                {getTataCarImage(primaryVeh.model, "w-full h-full object-contain filter drop-shadow-[0_3px_5px_rgba(0,0,0,0.5)]")}
                              </div>
                              <div>
                                <div className="flex items-center space-x-2 mb-0.5">
                                  <span className="text-base font-extrabold text-blue-950">{primaryVeh.fullModelName}</span>
                                  {renderFlightBadge(primaryVeh.flightStatus, primaryVeh.delayMinutes, primaryVeh.isPtdCrossed, liveDelay?.displayLive)}
                                  <span className={`text-[9.5px] font-bold px-1.5 py-0.2 rounded border ${
                                    primaryVeh.serviceDept === "BODYSHOP" ? "bg-amber-50 text-amber-900 border-amber-300" : "bg-blue-50 text-blue-900 border-blue-200"
                                  }`}>
                                    {primaryVeh.serviceDept === "BODYSHOP" ? "Bodyshop Servicing" : "Mechanical Servicing"}
                                  </span>
                                </div>
                                <div className="text-xs text-gray-600">
                                  Customer: <b className="text-gray-900 uppercase">{primaryVeh.customer}</b> • SA: <b className="text-gray-900">{primaryVeh.serviceAdvisor}</b>
                                </div>
                                <div className="text-[10px] text-gray-500 mt-0.5">
                                  Work: <b className="text-blue-700 font-semibold">{primaryVeh.workType}</b> • Job Card: <span className="font-mono">{primaryVeh.jobCard}</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-col items-end shrink-0">
                              {renderIndianPlate(primaryVeh.regNo)}
                              <span className="text-[10px] font-semibold text-gray-600 mt-1">Odo: {primaryVeh.odometer}</span>
                            </div>
                          </div>

                          {/* BU REQUIREMENT: Active Chip Telemetry Matrix (PTD, Supervisor, Tech, Planned Time, Work Start/End, QI) */}
                          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                            {/* 1. PTD (Promised Delivery) with High-Visibility Date, Time, Alarm & Live Ticking Delay */}
                            {isDelayed && liveDelay ? (
                              <div className="bg-red-50 border-2 border-red-500 rounded p-2 flex flex-col justify-between shadow-xs">
                                <div className="flex items-center justify-between">
                                  <span className="text-[8.5px] font-black text-red-800 uppercase tracking-wider flex items-center space-x-1">
                                    <span>⏰ PTD (DELIVERY)</span>
                                  </span>
                                  <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
                                </div>

                                <div className="mt-1 flex flex-col space-y-0.5">
                                  <div className="flex items-center justify-between text-[9.5px]">
                                    <span className="text-red-700 font-bold">DATE:</span>
                                    <span className="font-black text-red-950 font-mono bg-white px-1.5 py-0.2 rounded border border-red-200">
                                      📅 {primaryVeh.ptdDate || "19-Oct-2026"}
                                    </span>
                                  </div>
                                  <div className="flex items-center justify-between text-[10px]">
                                    <span className="text-red-700 font-bold">TIME:</span>
                                    <span className="font-black text-red-900 font-mono text-xs">
                                      {primaryVeh.ptdTime || "05:15 PM"}
                                    </span>
                                  </div>
                                </div>

                                <div className="mt-1 pt-1 border-t border-red-200/80 flex flex-col">
                                  <div className="flex items-center justify-between">
                                    <span className="blink-alarm text-[8px] bg-red-600 text-white px-1 py-0.2 rounded font-black uppercase">
                                      PTD CROSSED
                                    </span>
                                    <span className="text-[9px] font-black text-red-800 font-mono tracking-tight animate-pulse">
                                      ⏱️ {liveDelay.displayLive}
                                    </span>
                                  </div>
                                  <span className="text-[8px] text-red-700 font-bold mt-0.5">
                                    {liveDelay.estimatedDeliveryTime}
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <div className="bg-emerald-50 border border-emerald-300 rounded p-2 flex flex-col justify-between shadow-2xs">
                                <div className="flex items-center justify-between">
                                  <span className="text-[8.5px] font-bold text-emerald-800 uppercase tracking-wider">⏰ PTD (DELIVERY)</span>
                                  <span className="text-[8px] font-bold text-emerald-700 bg-emerald-100 px-1 py-0.2 rounded">ON TIME</span>
                                </div>

                                <div className="mt-1 flex flex-col space-y-0.5">
                                  <div className="flex items-center justify-between text-[9.5px]">
                                    <span className="text-emerald-700 font-semibold">DATE:</span>
                                    <span className="font-extrabold text-emerald-950 font-mono bg-white px-1.5 py-0.2 rounded border border-emerald-200">
                                      📅 {primaryVeh.ptdDate || "19-Oct-2026"}
                                    </span>
                                  </div>
                                  <div className="flex items-center justify-between text-[10px]">
                                    <span className="text-emerald-700 font-semibold">TIME:</span>
                                    <span className="font-black text-emerald-950 font-mono text-xs">
                                      {primaryVeh.ptdTime || "04:30 PM"}
                                    </span>
                                  </div>
                                </div>

                                <div className="mt-1 pt-1 border-t border-emerald-200/80 flex items-center justify-between text-[8px] text-emerald-700 font-medium">
                                  <span>✓ On Schedule</span>
                                  <span className="font-mono">{primaryVeh.targetTime}</span>
                                </div>
                              </div>
                            )}

                            {/* 2. Technical Supervisor */}
                            <div className="bg-slate-50 border border-slate-200 rounded p-2 flex flex-col justify-between">
                              <span className="text-[8.5px] font-bold text-slate-500 uppercase tracking-wider">Technical Supervisor</span>
                              <span className="text-[11px] font-black text-slate-900 truncate mt-0.5">{primaryVeh.technicalSupervisor}</span>
                              <span className="text-[8px] text-blue-700 font-semibold mt-0.5">Supervisor</span>
                            </div>

                            {/* 3. Technician Name */}
                            <div className="bg-slate-50 border border-slate-200 rounded p-2 flex flex-col justify-between">
                              <span className="text-[8.5px] font-bold text-slate-500 uppercase tracking-wider">Technician</span>
                              <span className="text-[11px] font-black text-slate-900 truncate mt-0.5">{primaryVeh.technician}</span>
                              <span className="text-[8px] text-slate-600 truncate mt-0.5">{isBodyshopBay ? "Bodyshop Master" : "Lead Tech"}</span>
                            </div>

                            {/* 4. Planned Time & Target Time */}
                            <div className="bg-slate-50 border border-slate-200 rounded p-2 flex flex-col justify-between">
                              <span className="text-[8.5px] font-bold text-slate-500 uppercase tracking-wider">Planned / Target Time</span>
                              <span className="text-[11px] font-black text-slate-900 font-mono mt-0.5">{primaryVeh.plannedTime}</span>
                              <span className="text-[8px] text-slate-600 mt-0.5">Target: {primaryVeh.targetTime}</span>
                            </div>

                            {/* 5. Work Start & End (Active Chip) */}
                            <div className="bg-slate-50 border border-slate-200 rounded p-2 flex flex-col justify-between">
                              <span className="text-[8.5px] font-bold text-slate-500 uppercase tracking-wider">Work Start → End</span>
                              <span className="text-[10px] font-bold text-slate-900 font-mono mt-0.5 truncate">{primaryVeh.workStart} → {primaryVeh.workEnd}</span>
                              <span className="text-[8px] text-slate-500 truncate mt-0.5">{primaryVeh.allocation}</span>
                            </div>

                            {/* 6. QI (Quality Inspection) */}
                            <div className="bg-slate-50 border border-slate-200 rounded p-2 flex flex-col justify-between">
                              <span className="text-[8.5px] font-bold text-slate-500 uppercase tracking-wider">QI Inspection</span>
                              <span className={`text-[9.5px] font-black px-1.5 py-0.5 rounded uppercase inline-block w-fit mt-0.5 ${
                                primaryVeh.qiStatus === "Passed" ? "bg-emerald-100 text-emerald-800 border border-emerald-300" :
                                primaryVeh.qiStatus === "Under QI" ? "bg-blue-100 text-blue-800 border border-blue-400 animate-pulse" :
                                "bg-amber-100 text-amber-800 border border-amber-300"
                              }`}>
                                {primaryVeh.qiStatus}
                              </span>
                              <span className="text-[8px] text-slate-500 mt-0.5">Quality Gate</span>
                            </div>
                          </div>

                          {/* BU REQUIREMENT FOR BODYSHOP: Milestone "Customer estimate approval" Interactive Card */}
                          {primaryVeh.serviceDept === "BODYSHOP" && primaryVeh.bodyshopEstimate && (
                            <div className={`p-2.5 rounded border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 transition ${
                              primaryVeh.bodyshopEstimate.approvalStatus === "Approved"
                                ? "bg-emerald-50/70 border-emerald-300 text-emerald-950"
                                : "bg-amber-50 border-amber-300 text-amber-950"
                            }`}>
                              <div className="flex items-center space-x-2.5">
                                <div className={`w-8 h-8 rounded flex items-center justify-center font-bold text-sm shrink-0 ${
                                  primaryVeh.bodyshopEstimate.approvalStatus === "Approved"
                                    ? "bg-emerald-600 text-white shadow-xs"
                                    : "bg-amber-500 text-slate-950 animate-pulse shadow-xs"
                                }`}>
                                  {primaryVeh.bodyshopEstimate.approvalStatus === "Approved" ? "✓" : "📝"}
                                </div>
                                <div>
                                  <div className="flex items-center space-x-2">
                                    <span className="font-extrabold text-[11px] uppercase tracking-wide">
                                      Bodyshop Milestone: Customer Estimate Approval
                                    </span>
                                    <span className={`px-2 py-0.2 rounded-full font-bold text-[9px] uppercase ${
                                      primaryVeh.bodyshopEstimate.approvalStatus === "Approved"
                                        ? "bg-emerald-200 text-emerald-900 border border-emerald-400"
                                        : "bg-amber-200 text-amber-900 border border-amber-400 font-extrabold"
                                    }`}>
                                      {primaryVeh.bodyshopEstimate.approvalStatus}
                                    </span>
                                  </div>
                                  <div className="text-[10px] text-gray-700 mt-0.5 flex flex-wrap items-center gap-x-2">
                                    <span>Insurance: <b className="text-gray-900">{primaryVeh.bodyshopEstimate.insuranceProvider}</b></span>
                                    <span>•</span>
                                    <span>Est. Amount: <b className="font-mono text-emerald-800 font-black">{primaryVeh.bodyshopEstimate.estimatedAmount}</b></span>
                                    <span>•</span>
                                    <span className="text-[9.5px] text-gray-500">Parts: {primaryVeh.bodyshopEstimate.partsIncluded.join(", ")}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center space-x-2 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => toggleEstimateApproval(primaryVeh.id)}
                                  className={`px-2.5 py-1 rounded text-[10px] font-bold cursor-pointer transition border shadow-2xs ${
                                    primaryVeh.bodyshopEstimate.approvalStatus === "Approved"
                                      ? "bg-white hover:bg-amber-100 text-amber-800 border-amber-300"
                                      : "bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-700"
                                  }`}
                                  title="Toggle customer estimate approval state"
                                >
                                  {primaryVeh.bodyshopEstimate.approvalStatus === "Approved" ? "Revoke Approval" : "✓ Approve Estimate"}
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Milestone Stepper across the Bay - Dynamically adapts to Bodyshop vs Mechanical milestones */}
                          {(() => {
                            const vehStages = getPipelineStages(primaryVeh.serviceDept);
                            const currentStageName = vehStages[primaryVeh.wmStageIndex] || vehStages[0];

                            return (
                              <div className="bg-gray-50 p-2.5 rounded border border-gray-200">
                                <div className="flex items-center justify-between mb-1.5 text-[10px]">
                                  <span className="font-bold text-gray-700 uppercase tracking-wide flex items-center space-x-1.5">
                                    <span>Milestone:</span>
                                    <b className={`text-xs font-mono px-1.5 py-0.2 rounded ${
                                      currentStageName === "Customer estimate approval"
                                        ? "bg-amber-200 text-amber-950 border border-amber-400 font-extrabold"
                                        : "bg-blue-100 text-blue-900"
                                    }`}>
                                      {currentStageName}
                                    </b>
                                    {primaryVeh.serviceDept === "BODYSHOP" && (
                                      <span className="text-[9px] text-amber-800 bg-amber-100 px-1 rounded">
                                        (Bodyshop 11-Stage Workflow)
                                      </span>
                                    )}
                                  </span>
                                  <span className="text-gray-500 font-mono text-[9px]">
                                    Step {primaryVeh.wmStageIndex + 1} of {vehStages.length}
                                  </span>
                                </div>

                                <div
                                  className="relative grid gap-1 items-center"
                                  style={{ gridTemplateColumns: `repeat(${vehStages.length}, minmax(0, 1fr))` }}
                                >
                                  <div className="absolute top-2 left-[5%] right-[5%] h-0.5 bg-gray-200 -z-0"></div>
                                  <div
                                    className="absolute top-2 left-[5%] h-0.5 bg-emerald-500 -z-0 transition-all duration-300"
                                    style={{ width: `${(primaryVeh.wmStageIndex / (vehStages.length - 1)) * 90}%` }}
                                  ></div>

                                  {vehStages.map((label, idx) => {
                                    const isCompleted = idx < primaryVeh.wmStageIndex;
                                    const isCurrent = idx === primaryVeh.wmStageIndex;
                                    const isEstimateApproval = label === "Customer estimate approval";

                                    return (
                                      <div
                                        key={label}
                                        className="flex flex-col items-center z-10 cursor-pointer group w-full"
                                        onClick={() => advanceVehicleMilestone(primaryVeh.id)}
                                        title={`Milestone: ${label} (Click to advance)`}
                                      >
                                        {isEstimateApproval ? (
                                          <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[7px] font-black border transition-all ${
                                            isCurrent
                                              ? "bg-amber-500 text-slate-950 border-amber-600 ring-2 ring-amber-400 scale-110"
                                              : (isCompleted ? "bg-[#4CAF50] text-white border-white" : "bg-amber-100 text-amber-800 border-amber-300")
                                          }`}>
                                            {isCompleted ? "✓" : "📝"}
                                          </div>
                                        ) : label === "WIP" && isCurrent ? (
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
                                          className={`text-[7px] mt-0.5 tracking-tight text-center leading-tight truncate w-full ${
                                            isEstimateApproval
                                              ? "font-extrabold text-amber-900"
                                              : (isCurrent ? "font-bold text-emerald-800" : "text-gray-500")
                                          }`}
                                        >
                                          {isEstimateApproval ? "Estimate" : label}
                                        </span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })()}

                          {/* Bay Bottom Timestamps & Action Buttons */}
                          <div className="flex flex-wrap items-center justify-between text-[10px] text-gray-500 pt-1.5 border-t border-gray-100 gap-y-2">
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                              <div className="flex items-center space-x-1">
                                <span className="text-gray-500 font-bold">GATE IN:</span>
                                <span className="text-gray-800 font-mono bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">
                                  📅 {primaryVeh.gateInDate}
                                </span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <span className="text-gray-500 font-bold">PTD:</span>
                                <span className={`font-mono px-1.5 py-0.5 rounded border ${
                                  isDelayed
                                    ? "bg-red-50 text-red-700 font-bold border-red-300"
                                    : "bg-emerald-50 text-emerald-800 font-bold border-emerald-300"
                                }`}>
                                  📅 {primaryVeh.ptdDate} • ⏰ {primaryVeh.ptdTime}
                                </span>
                              </div>
                              {isDelayed && liveDelay && (
                                <div className="flex items-center space-x-1 text-red-700 font-black">
                                  <span>⏱️ DELAY:</span>
                                  <span className="font-mono bg-red-100 px-1.5 py-0.5 rounded text-red-900 blink-alarm">
                                    {liveDelay.displayLive}
                                  </span>
                                </div>
                              )}
                            </div>

                            <div className="flex items-center space-x-2">
                              {/* Live Delay Adjustment Buttons for Works Manager */}
                              {isDelayed && liveDelay && (
                                <div className="flex items-center space-x-1 bg-red-50 border border-red-300 rounded px-1.5 py-0.5 shadow-2xs">
                                  <span className="text-[8.5px] font-bold text-red-800">Delay:</span>
                                  <button
                                    type="button"
                                    onClick={() => adjustVehicleDelay(primaryVeh.id, -5)}
                                    className="bg-white hover:bg-red-100 text-red-800 font-mono font-bold text-[9px] px-1.5 py-0.2 rounded border border-red-300 cursor-pointer shadow-2xs"
                                    title="Decrease delay by 5 minutes"
                                  >
                                    -5m
                                  </button>
                                  <span className="font-mono font-black text-[9px] text-red-900 px-1">{liveDelay.displayLive}</span>
                                  <button
                                    type="button"
                                    onClick={() => adjustVehicleDelay(primaryVeh.id, 5)}
                                    className="bg-white hover:bg-red-100 text-red-800 font-mono font-bold text-[9px] px-1.5 py-0.2 rounded border border-red-300 cursor-pointer shadow-2xs"
                                    title="Increase delay by 5 minutes"
                                  >
                                    +5m
                                  </button>
                                </div>
                              )}

                              {/* Toggle PTD Delayed/On-Time simulation button */}
                              <button
                                type="button"
                                onClick={() => toggleVehicleDelay(primaryVeh.id)}
                                className={`text-[9.5px] px-2.5 py-1 rounded font-semibold transition cursor-pointer border ${
                                  isDelayed
                                    ? "bg-red-50 text-red-700 border-red-300 hover:bg-red-100"
                                    : "bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100"
                                }`}
                                title="Toggle PTD Delay to test live blinking alarm"
                              >
                                {isDelayed ? "Simulate On-Time" : "Simulate PTD Delay"}
                              </button>

                              <button
                                type="button"
                                onClick={() => advanceVehicleMilestone(primaryVeh.id)}
                                className="bg-[#002244] hover:bg-[#001730] text-white text-[10px] px-3 py-1 rounded font-semibold transition shadow-2xs flex items-center space-x-1 cursor-pointer"
                              >
                                <span>Next Milestone</span>
                                <span>➔</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="p-8 text-center text-gray-400 flex flex-col items-center justify-center space-y-1">
                          <span className="text-2xl">{isBodyshopBay ? "🎨" : "🔧"}</span>
                          <span className="font-semibold text-gray-600 text-xs">No vehicle currently staged in {bay.id}</span>
                          <span className="text-[11px] text-gray-400">Ready for vehicle allocation from queue.</span>
                        </div>
                      )}
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        ) : (
          /* =========================================================================
             FALLBACK PIPELINE VIEW (Linear Stepper Rows with Department Milestones)
             ========================================================================= */
          <div className="flex-1 p-3 space-y-1.5 overflow-y-auto">
            {(() => {
              const list = vehicles.filter((v) => {
                if (selectedDept !== "ALL" && v.serviceDept !== selectedDept) return false;
                if (selectedMilestoneFilter !== "ALL") {
                  const stages = getPipelineStages(v.serviceDept);
                  if (stages[v.wmStageIndex] !== selectedMilestoneFilter) {
                    return false;
                  }
                }
                if (generalFilter.type === "workType") {
                  if (v.workType !== generalFilter.value) return false;
                } else if (generalFilter.type === "model") {
                  if (v.model !== generalFilter.value) return false;
                } else if (generalFilter.type === "flightStatus") {
                  if (v.flightStatus !== generalFilter.value) return false;
                } else if (generalFilter.type === "bay") {
                  if (v.bayId !== generalFilter.value) return false;
                } else if (generalFilter.type === "dept") {
                  if (v.serviceDept !== generalFilter.value) return false;
                }
                return true;
              });

              if (list.length === 0) {
                return (
                  <div className="bg-white border border-dashed border-gray-300 rounded p-8 text-center text-gray-500 text-xs shadow-2xs">
                    <p className="font-semibold text-gray-800 text-sm mb-1">No vehicles matching the selected filters.</p>
                    <p className="text-gray-500 text-[11px] mb-3">Try choosing another milestone stage, department, or resetting the filter.</p>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedDept("ALL");
                        setGeneralFilter({ type: "all", value: "ALL", label: "All Vehicles / All Bays" });
                        setSelectedMilestoneFilter("ALL");
                      }}
                      className="bg-[#002244] hover:bg-[#001730] text-white px-3 py-1 rounded text-xs font-semibold shadow-2xs cursor-pointer"
                    >
                      Reset to All Vehicles
                    </button>
                  </div>
                );
              }

              return list.map((v) => {
                const liveDelay = getLiveVehicleDelay(v);
                const isDelayed = v.flightStatus === "DELAYED" || v.isPtdCrossed;
                const stages = getPipelineStages(v.serviceDept);
                const isBodyshop = v.serviceDept === "BODYSHOP";

                return (
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
                      {/* Bay ID Badge */}
                      <span className={`text-[8px] font-black px-1.5 py-0.2 rounded-xs shadow-2xs truncate max-w-[115px] leading-tight text-center font-mono ${
                        isBodyshop ? "bg-[#801b00] text-amber-200" : "bg-[#002244] text-cyan-300"
                      }`}>
                        {v.bayId}
                      </span>
                    </div>

                    {/* Meta Specifications Column 1 */}
                    <div className="grid grid-cols-[55px_1fr] gap-y-0.2 text-[10px] leading-tight w-[155px] shrink-0">
                      <span className="text-gray-500 text-[9px]">Veh. No:</span>
                      <span className="font-extrabold text-gray-900 font-mono text-[10.5px]">{v.regNo}</span>

                      <span className="text-gray-500 text-[9px]">SA Name:</span>
                      <span className="font-semibold text-gray-800 text-[10px] truncate">{v.serviceAdvisor}</span>

                      <span className="text-gray-500 text-[9px]">Dept:</span>
                      <span className={`font-bold text-[9.5px] ${isBodyshop ? "text-amber-800" : "text-blue-800"}`}>
                        {isBodyshop ? "🎨 Bodyshop" : "🚗 Mechanical"}
                      </span>

                      <span className="text-gray-500 text-[9px]">ST:</span>
                      <span className="font-bold text-gray-900 text-[10px] truncate">{v.workType}</span>
                    </div>

                    {/* Meta Specifications Column 2 */}
                    <div className="grid grid-cols-[55px_1fr] gap-y-0.2 text-[10px] leading-tight w-[175px] shrink-0 border-l border-gray-200 pl-2.5">
                      <div className="col-span-2 text-gray-900 font-bold text-[10.5px] truncate pb-0.5">
                        {v.fullModelName}
                      </div>

                      <span className="text-gray-500 text-[9px]">Supervisor:</span>
                      <span className="font-semibold text-gray-800 text-[10px] truncate">{v.technicalSupervisor}</span>

                      <span className="text-gray-500 text-[9px]">PTD Date:</span>
                      <span className="font-mono font-bold text-[10px] text-gray-900">
                        📅 {v.ptdDate}
                      </span>

                      <span className="text-gray-500 text-[9px]">PTD Time:</span>
                      <span className={`font-mono font-bold text-[10px] ${
                        isDelayed ? "text-red-700 blink-alarm" : "text-emerald-700"
                      }`}>
                        ⏰ {v.ptdTime} {isDelayed ? "⚠️" : ""}
                      </span>

                      <span className="text-gray-500 text-[9px]">Tech:</span>
                      <span className="text-gray-800 text-[10px] truncate">{v.technician || "Floor Pool"}</span>
                    </div>
                  </div>

                  {/* Right Stepper Section - Dynamically renders exact milestones */}
                  <div className="flex-1 flex flex-col justify-center px-1">
                    <div
                      className="relative grid gap-1 items-center"
                      style={{ gridTemplateColumns: `repeat(${stages.length}, minmax(0, 1fr))` }}
                    >
                      <div className="absolute top-2 left-[5%] right-[5%] h-0.5 bg-gray-200 -z-0"></div>
                      <div
                        className="absolute top-2 left-[5%] h-0.5 bg-emerald-500 -z-0 transition-all duration-300"
                        style={{ width: `${(v.wmStageIndex / (stages.length - 1)) * 90}%` }}
                      ></div>

                      {stages.map((label, idx) => {
                        const isCompleted = idx < v.wmStageIndex;
                        const isCurrent = idx === v.wmStageIndex;
                        const isEstimateApproval = label === "Customer estimate approval";

                        return (
                          <div
                            key={label}
                            className="flex flex-col items-center z-10 cursor-pointer group w-full"
                            onClick={() => advanceVehicleMilestone(v.id)}
                            title={`Milestone: ${label} (Click to set)`}
                          >
                            {isEstimateApproval ? (
                              <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[7px] font-bold transition-all ${
                                isCurrent
                                  ? "bg-amber-500 text-slate-950 ring-2 ring-amber-400"
                                  : (isCompleted ? "bg-[#4CAF50] text-white" : "bg-amber-100 text-amber-800 border border-amber-300")
                              }`}>
                                {isCompleted ? "✓" : "📝"}
                              </div>
                            ) : label === "WIP" && isCurrent ? (
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
                              className={`text-[7.5px] mt-0.5 tracking-tight text-center leading-tight truncate w-full ${
                                isEstimateApproval
                                  ? "font-extrabold text-amber-900"
                                  : (isCurrent ? "font-bold text-emerald-800" : "text-gray-500")
                              }`}
                            >
                              {isEstimateApproval ? "Estimate" : label}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Gate In & Promised Delivery Timestamps */}
                    <div className="flex justify-between items-center text-[9px] text-gray-500 mt-1 pt-0.5 border-t border-gray-100">
                      <div>
                        GATE IN: <b className="text-gray-800 font-mono">📅 {v.gateInDate}</b> • QI: <b className="text-blue-700">{v.qiStatus}</b>
                      </div>
                      <div className="flex items-center space-x-2">
                        {renderFlightBadge(v.flightStatus, v.delayMinutes, v.isPtdCrossed, liveDelay.displayLive)}
                        <span>PTD: <b className={`font-mono ${isDelayed ? "text-red-700 font-black" : "text-gray-800"}`}>📅 {v.ptdDate} • ⏰ {v.ptdTime}</b></span>
                        {isDelayed && (
                          <span className="text-red-700 font-mono font-bold text-[9px]">({liveDelay.displayLive})</span>
                        )}
                        <button
                          type="button"
                          onClick={() => toggleVehicleDelay(v.id)}
                          className="text-gray-500 hover:text-red-700 underline text-[9px] cursor-pointer"
                          title="Toggle PTD Delay"
                        >
                          {isDelayed ? "Set On-Time" : "Set Delay"}
                        </button>
                        <button
                          onClick={() => advanceVehicleMilestone(v.id)}
                          className="bg-[#002244] hover:bg-[#001730] text-white text-[9px] px-2 py-0.5 rounded font-semibold transition shadow-2xs cursor-pointer"
                        >
                          Advance ➔
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            });
          })()}
        </div>
      )}
    </div>
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
                <span>Auto-switching to Walk-In Customers in <b>{rotationCountdown}s</b></span>
              </span>
            </div>
            <span className="text-lg font-black tracking-widest text-gray-300">TATA MOTORS</span>
          </div>

          <div className="flex-1 grid grid-cols-12 gap-5">
            {/* In Progress Cards Grid - Customer-facing Service Progress */}
            <div className="col-span-8 flex flex-col">
              <div className="bg-[#0b1726] border border-gray-800 text-center py-1.5 font-semibold text-xs tracking-wider uppercase text-gray-300 mb-3 rounded-t">
                Vehicles In Service (Live Progress)
              </div>
              <div className="grid grid-cols-3 gap-3.5">
                {vehicles
                  .filter(v => !v.isWalkIn && (selectedDept === "ALL" || v.serviceDept === selectedDept))
                  .slice(0, 6)
                  .map((item, idx) => {
                    const itemDelay = getLiveVehicleDelay(item);
                    const isItemDelayed = item.flightStatus === "DELAYED" || item.isPtdCrossed;
                    const isBodyshop = item.serviceDept === "BODYSHOP";

                    return (
                      <div
                        key={item.id}
                        className={`bg-[#0b1726] rounded-md p-3 flex flex-col justify-between shadow-lg relative group transition-colors ${
                          isItemDelayed
                            ? "border-2 border-red-500 ring-2 ring-red-500/40 bay-border-alarm"
                            : "border border-[#1e2d42] hover:border-cyan-500/50"
                        }`}
                      >
                        {/* Top Row: Sequential Number Tag + Department Badge + PTD Alarm (NO BAY ID) */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="w-5 h-5 bg-white text-slate-900 font-extrabold text-xs flex items-center justify-center rounded-xs shadow">
                              {idx + 1}
                            </div>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                              isBodyshop
                                ? "bg-amber-950 text-amber-300 border-amber-800/80"
                                : "bg-blue-950 text-cyan-300 border-blue-700/80"
                            }`}>
                              {isBodyshop ? "🎨 Bodyshop" : "🚗 Mechanical"}
                            </span>
                          </div>
                          {isItemDelayed ? (
                            <div className="flex flex-col items-end">
                              <span className="bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded blink-alarm tracking-wide uppercase shadow-xs flex items-center space-x-1">
                                <span className="w-1 h-1 rounded-full bg-white animate-ping"></span>
                                <span>PTD CROSSED ({itemDelay.displayLive})</span>
                              </span>
                              <span className="text-[8.5px] text-red-300 font-mono font-bold mt-0.5">
                                📅 {item.ptdDate} • ⏰ {item.ptdTime}
                              </span>
                            </div>
                          ) : (
                            <div className="flex flex-col items-end text-[9px] text-emerald-400 font-mono font-semibold">
                              <span>📅 {item.ptdDate}</span>
                              <span>⏰ {item.ptdTime}</span>
                            </div>
                          )}
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

                        {/* Bodyshop Customer Estimate Approval Badge (If applicable) */}
                        {isBodyshop && item.bodyshopEstimate && (
                          <div className="mb-2 bg-amber-950/40 border border-amber-800/60 rounded px-2 py-1 text-[9.5px] flex items-center justify-between">
                            <span className="text-amber-300 font-semibold">Customer Estimate Approval:</span>
                            <span className={`font-bold px-1.5 py-0.2 rounded text-[8.5px] uppercase ${
                              item.bodyshopEstimate.approvalStatus === "Approved" ? "bg-emerald-800 text-white" : "bg-amber-600 text-white animate-pulse"
                            }`}>
                              {item.bodyshopEstimate.approvalStatus}
                            </span>
                          </div>
                        )}

                        {/* Bottom Ribbon: Customer & Service Advisor & Work Type (NO BAY ID) */}
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
                    );
                  })}
              </div>
            </div>

            {/* Next In Queue Cards - Customer Queue (No Bay Staging) */}
            <div className="col-span-4 flex flex-col">
              <div className="bg-[#0b1726] border border-gray-800 text-center py-1.5 font-semibold text-xs tracking-wider uppercase text-gray-300 mb-3 rounded-t">
                Next In Queue (Upcoming Service Queue)
              </div>
              <div className="space-y-3">
                {QUEUE_VEHICLES
                  .filter(v => selectedDept === "ALL" || v.serviceDept === selectedDept)
                  .map((item, idx) => {
                    const isBodyshop = item.serviceDept === "BODYSHOP";

                    return (
                      <div
                        key={`queue-${item.id}`}
                        className="bg-[#0b1726] border border-[#1e2d42] rounded-md p-3 flex flex-col justify-between shadow-lg relative"
                      >
                        <div className="flex items-center justify-between">
                          <div className="w-5 h-5 bg-white text-slate-900 font-extrabold text-xs flex items-center justify-center rounded-xs shadow">
                            {idx + 1}
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                            isBodyshop
                              ? "bg-amber-950 text-amber-300 border-amber-800/80"
                              : "bg-blue-950 text-cyan-300 border-blue-700/80"
                          }`}>
                            {isBodyshop ? "🎨 Bodyshop Queue" : "🚗 Mechanical Queue"}
                          </span>
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
                    );
                  })}
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

      {/* RECEPTIONIST SCREEN 2: WALK-IN CUSTOMERS (No Bay tracking) */}
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
                Priority Walk-In Customers (In Service)
              </div>
              <div className="grid grid-cols-3 gap-3.5">
                {vehicles
                  .filter(v => v.isWalkIn && (selectedDept === "ALL" || v.serviceDept === selectedDept))
                  .map((item, idx) => {
                    const itemDelay = getLiveVehicleDelay(item);
                    const isItemDelayed = item.flightStatus === "DELAYED" || item.isPtdCrossed;
                    const isBodyshop = item.serviceDept === "BODYSHOP";

                    return (
                      <div
                        key={item.id}
                        className={`bg-[#0b1726] rounded-md p-3 flex flex-col justify-between shadow-lg ${
                          isItemDelayed ? "border-2 border-red-500 ring-2 ring-red-500/40 bay-border-alarm" : "border border-[#1e2d42]"
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-2">
                            <div className="w-5 h-5 bg-white text-slate-900 font-extrabold text-xs flex items-center justify-center rounded-xs shadow">
                              {idx + 1}
                            </div>
                            <span className="bg-amber-950 text-amber-300 border border-amber-700/80 px-2 py-0.5 rounded text-[10px] font-bold">
                              ⚡ Walk-In Express
                            </span>
                            <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                              isBodyshop ? "bg-amber-900 text-amber-200" : "bg-blue-900 text-cyan-200"
                            }`}>
                              {isBodyshop ? "Bodyshop" : "Mechanical"}
                            </span>
                          </div>
                          {isItemDelayed ? (
                            <div className="flex flex-col items-end">
                              <span className="bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded blink-alarm tracking-wide uppercase shadow-xs flex items-center space-x-1">
                                <span className="w-1 h-1 rounded-full bg-white animate-ping"></span>
                                <span>PTD CROSSED ({itemDelay.displayLive})</span>
                              </span>
                              <span className="text-[8.5px] text-red-300 font-mono font-bold mt-0.5">
                                📅 {item.ptdDate} • ⏰ {item.ptdTime}
                              </span>
                            </div>
                          ) : (
                            <div className="flex flex-col items-end text-[9px] text-emerald-400 font-mono font-semibold">
                              <span>📅 {item.ptdDate}</span>
                              <span>⏰ {item.ptdTime}</span>
                            </div>
                          )}
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
                    );
                  })}
              </div>
            </div>

            <div className="col-span-4 border border-dashed border-gray-800 rounded flex flex-col items-center justify-center text-gray-400 text-xs p-6 text-center">
              <span className="font-semibold text-gray-300 mb-1">Priority Express Service Track</span>
              <span>All registered walk-in passenger vehicles are actively in service in the workshop.</span>
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-gray-800 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-white">TATA MOTORS</span>
              <span className="text-gray-400 text-xs">Fast Track &amp; Priority Express Service</span>
            </div>
            <div className="bg-[#0d1c2d] px-4 py-1 rounded-full border border-gray-800 text-gray-300 text-xs">
              Priority Express Track delivers prompt turnaround for scheduled walk-in services.
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
                  <th className="py-3 px-3">Vehicle</th>
                  <th className="py-3 px-3">Registration</th>
                  <th className="py-3 px-3">Department</th>
                  <th className="py-3 px-3">Work Type</th>
                  <th className="py-3 px-3">Service Advisor</th>
                  <th className="py-3 px-3">PTD (Delivery Date &amp; Time)</th>
                  <th className="py-3 px-3">Status</th>
                  {STATUS_STAGES.map((col) => (
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
                        <td className="py-2 px-3">
                          <div className="w-24 h-14 bg-[#071322] rounded p-1 overflow-hidden flex items-center justify-center border border-gray-800">
                            {getTataCarImage(v.model)}
                          </div>
                        </td>
                        <td className="py-3 px-3 font-mono">{renderIndianPlate(v.regNo)}</td>
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
                          <div className="text-[10px] text-gray-400 uppercase">{v.customer}</div>
                        </td>
                        <td className="py-3 px-3 font-mono">
                          <div className="flex flex-col">
                            <span className="text-[10px] text-gray-300 font-semibold">📅 {v.ptdDate}</span>
                            <span className={`font-black text-xs ${isItemDelayed ? "text-red-400 blink-alarm" : "text-emerald-400"}`}>
                              ⏰ {v.ptdTime} {isItemDelayed ? "⚠️" : ""}
                            </span>
                            <span className="text-[9px] text-gray-500">Target: {v.plannedTime}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          {renderFlightBadge(v.flightStatus, v.delayMinutes, v.isPtdCrossed, itemDelay.displayLive)}
                          {isItemDelayed && (
                            <div className="text-[9.5px] font-mono text-red-400 font-bold mt-1 animate-pulse">
                              ⏱️ Delay: {itemDelay.displayLive}
                            </div>
                          )}
                        </td>
                        {STATUS_STAGES.map((col, idx) => {
                          const isCompleted = idx <= v.stageIndex;
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
