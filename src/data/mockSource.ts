// Sandbox data source. Generates a believable "today" relative to the current time and
// moves jobs forward on every refresh, so the screens look live without a DMS.
// All names and number plates are sandbox data.
import { BAY_GROUPS, MILESTONES, type Dept } from "../config";
import type { Bay, BayJob, DataSource, LoungeVehicle, Snapshot } from "./types";

const MIN = 60_000;

function makeRng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const CUSTOMERS = [
  "Rajesh K. Verma", "Sunita Aggarwal", "Anand Deshmukh", "Vikramaditya Roy", "Farhan Akhtar",
  "Rajeshwar Rao", "Deepak Chopra", "Meenakshi Iyer", "Manish Chawla", "Rohan Verma",
  "Pooja Malhotra", "Arjun Singhal", "Nisha Singhania", "Gaurav Kapoor", "Shweta Tiwari",
  "Kavita Menon", "Sanjay Bhatia", "Priyanka Das", "Harish Gupta", "Lakshmi Narayan",
  "Aditya Kulkarni", "Neha Saxena", "Mohit Arora", "Ritu Bansal", "Suresh Pillai",
  "Ankita Joshi", "Vivek Chauhan", "Swati Mishra", "Kunal Mehra", "Divya Reddy",
  "Ajay Thakur", "Pallavi Sinha", "Rahul Khanna", "Sneha Patil", "Tarun Bhalla",
  "Geeta Rawat", "Nitin Goel", "Bhavna Shah", "Imtiaz Qureshi", "Rekha Nair",
];
const KNOWN_REGS = [
  "UP81DJ6809", "DL14CH2428", "UP16CS7403", "UP14EJ9609", "DL5CS0664", "MH01EK9921",
  "HR26EM1008", "DL04CA6721", "MH12PQ3344", "UP16BQ9001", "DL01BZ4512", "UP32EF8899",
  "HR26DK5510", "DL03CB8821", "DL09CD1122",
];
const MODELS = ["Nexon", "Harrier", "Safari", "Punch", "Altroz", "Curvv", "Tiago", "Tigor", "Nexon.ev", "Punch.ev"];
const MECH_JOBS = ["Paid Service", "First Free Service", "Second Free Service", "Running Repairs", "Wheel Alignment", "EV Health Check"];
const BODY_JOBS = ["Denting & Painting", "Accidental Repair", "Scratch & Dent Repair", "Full Side Paint", "Bumper Replacement"];
const TECHNICIANS = [
  "Ramesh Sharma", "Sunil Verma", "Amit Saxena", "Vikas Yadav", "Manoj Tiwari", "Deepak Kumar",
  "Mohan Lal", "Kailash Chand", "Rakesh Pal", "Anand Swamy", "Suresh Jha", "Kamal Hassan",
  "Raj Malhotra", "Ajay Jain", "Pradeep Singh", "Naresh Kumar", "Satish Rana", "Dinesh Mehta",
  "Gopal Krishna", "Harpreet Singh", "Irfan Ali", "Jagdish Prasad", "Kishore Lal", "Lokesh Sharma",
  "Mahesh Yadav", "Om Prakash", "Pawan Kumar", "Ravi Shankar", "Sandeep Gill", "Tilak Raj",
  "Umesh Pandey", "Vinod Bisht", "Yogesh Rawat", "Zakir Hussain", "Arvind Negi", "Bharat Lal",
  "Chetan Das", "Dharmendra Pal", "Ganesh Rao", "Hemant Joshi",
];
const ADVISORS = ["Rohit Malviya", "Saurabh Joshi", "Imran Khan", "Hemendra Chundawat", "Praveen Nair", "Naveen Kaushik", "Vikram Rathore", "Amitabh Sen"];
const STATES = ["DL", "HR", "UP", "MH", "RJ", "PB"];

// One customer vehicle visiting the workshop today. Every screen is built from this one list,
// so the same car shows on Appointments, Vehicle Status and the Workshop Board.
interface Visit {
  regNo: string;
  model: string;
  customer: string;
  advisor: string;
  dept: Dept;
  jobType: string;
  slot: number;            // appointment time
  arrivedAt?: number;      // gate-in time
  job?: BayJob;            // bay allocation and plan/actual times (if allocated)
  estimatePending: boolean; // bodyshop only: customer has not approved the estimate yet
}

export function createMockSource(seed = 20261120): DataSource {
  const rnd = makeRng(seed);
  const pick = <T,>(a: T[]) => a[Math.floor(rnd() * a.length)];
  const between = (lo: number, hi: number) => lo + rnd() * (hi - lo);
  const round = (ms: number, step: number) => Math.round(ms / (step * MIN)) * step * MIN;

  let regIdx = 0;
  const nextReg = () => {
    const r = KNOWN_REGS[regIdx] ??
      `${pick(STATES)}${String(1 + Math.floor(rnd() * 98)).padStart(2, "0")}${String.fromCharCode(65 + Math.floor(rnd() * 26))}${String.fromCharCode(65 + Math.floor(rnd() * 26))}${String(1000 + Math.floor(rnd() * 9000))}`;
    regIdx++;
    return r;
  };
  let custIdx = 0;
  const nextCustomer = () => CUSTOMERS[custIdx++ % CUSTOMERS.length];

  let bays: Bay[] = [];
  let visits: Visit[] = [];
  let initialised = false;

  function init(now: number) {
    let n = 0;
    bays = BAY_GROUPS.flatMap((g) =>
      Array.from({ length: g.bayCount }, () => {
        n++;
        return { id: `B${n}`, groupId: g.id, dept: g.dept, technician: TECHNICIANS[(n - 1) % TECHNICIANS.length] };
      }),
    );

    const newVisit = (dept: Dept): Omit<Visit, "slot"> => ({
      regNo: nextReg(), model: pick(MODELS), customer: nextCustomer(), advisor: pick(ADVISORS), dept,
      jobType: pick(dept === "BODYSHOP" ? BODY_JOBS : MECH_JOBS), estimatePending: false,
    });

    visits = [];
    // Vehicles allocated to a bay.
    for (const bay of bays) {
      if (rnd() < 0.12) continue; // free bay
      const v = newVisit(bay.dept);
      const isBody = bay.dept === "BODYSHOP";
      const dur = round(isBody ? between(120, 300) * MIN : between(60, 180) * MIN, 15);
      const job: BayJob = { bayId: bay.id, regNo: v.regNo, model: v.model, jobType: v.jobType, customer: v.customer, planStart: 0, planEnd: 0 };
      const p = rnd();
      if (p < 0.25) { // done
        job.actualEnd = now - between(5, 90) * MIN;
        job.actualStart = job.actualEnd - dur * between(0.75, 1.1);
        job.planStart = round(job.actualStart - between(0, 10) * MIN, 5);
      } else if (p < 0.7) { // in progress
        job.actualStart = now - between(10, dur / MIN + 40) * MIN;
        job.planStart = round(job.actualStart - between(-10, 25) * MIN, 5);
      } else { // yet to start
        job.planStart = round(now + between(-30, 120) * MIN, 15);
      }
      job.planEnd = job.planStart + dur;
      const firstWork = job.actualStart ?? job.planStart;
      const slot = round(firstWork - between(20, 60) * MIN, 5);
      let arrivedAt: number | undefined;
      if (job.actualStart !== undefined) arrivedAt = Math.min(slot + between(-10, 10) * MIN, job.actualStart - 5 * MIN);
      else if (slot <= now) arrivedAt = Math.min(now, slot + between(-10, 10) * MIN);
      visits.push({ ...v, slot, arrivedAt, job, estimatePending: isBody && job.actualStart === undefined && rnd() < 0.5 });
    }
    // Arrived, waiting for a bay.
    for (let i = 0; i < 3; i++) {
      const v = newVisit(rnd() < 0.7 ? "MECHANICAL" : "BODYSHOP");
      const slot = round(now - between(10, 40) * MIN, 5);
      visits.push({ ...v, slot, arrivedAt: Math.min(now, slot + between(-5, 10) * MIN) });
    }
    // Appointments later today (not arrived yet, no bay yet).
    for (let i = 0; i < 6; i++) {
      const v = newVisit(rnd() < 0.75 ? "MECHANICAL" : "BODYSHOP");
      visits.push({ ...v, slot: round(now + between(20, 300) * MIN, 15) });
    }
    initialised = true;
  }

  // Each refresh: vehicles arrive, due jobs start (only once the vehicle is here), running jobs finish.
  function simulate(now: number) {
    for (const v of visits) {
      if (v.arrivedAt === undefined && v.slot <= now + 10 * MIN && rnd() < 0.3) v.arrivedAt = now;
      const j = v.job;
      if (!j || v.arrivedAt === undefined) continue;
      if (j.actualStart === undefined) {
        if (v.estimatePending && rnd() < 0.2) v.estimatePending = false;
        if (!v.estimatePending && j.planStart <= now && rnd() < 0.5) j.actualStart = now;
      } else if (j.actualEnd === undefined && now >= j.planEnd - 10 * MIN && rnd() < 0.35) {
        j.actualEnd = now;
      }
    }
  }

  function toLounge(v: Visit, now: number): LoungeVehicle {
    const stages = MILESTONES[v.dept];
    const idx = (name: string) => stages.indexOf(name);
    const j = v.job;
    let stage: number;
    if (!j) stage = idx("Gate In");
    else if (j.actualEnd !== undefined) stage = now - j.actualEnd < 40 * MIN ? idx("Washing") : idx("Ready for Delivery");
    else if (j.actualStart !== undefined) stage = idx("In Bay (WIP)");
    else stage = v.estimatePending ? idx("Estimate Approval") : idx("Job Card");
    const edt = j
      ? Math.ceil((j.planEnd + 45 * MIN) / (15 * MIN)) * 15 * MIN
      : round((v.arrivedAt ?? v.slot) + between(240, 360) * MIN, 15);
    return { regNo: v.regNo, model: v.model, customer: v.customer, advisor: v.advisor, dept: v.dept, jobType: v.jobType, stage, edt };
  }

  // EDT of vehicles without a bay is fixed once, so it does not jump on every refresh.
  const fixedEdt = new Map<string, number>();

  return {
    name: "Sandbox data",
    async fetchSnapshot(now: number): Promise<Snapshot> {
      if (!initialised) init(now);
      else simulate(now);
      const arrived = visits.filter((v) => v.arrivedAt !== undefined);
      return {
        bays: bays.map((b) => ({ ...b })),
        jobs: visits.filter((v) => v.job).map((v) => ({ ...v.job! })),
        appointments: visits.map((v, i) => ({
          id: `A${i + 1}`, slot: v.slot, regNo: v.regNo, model: v.model, customer: v.customer,
          advisor: v.advisor, dept: v.dept, jobType: v.jobType, arrivedAt: v.arrivedAt,
        })),
        vehicles: arrived.map((v) => {
          const lv = toLounge(v, now);
          if (!v.job) { if (!fixedEdt.has(v.regNo)) fixedEdt.set(v.regNo, lv.edt); lv.edt = fixedEdt.get(v.regNo)!; }
          return lv;
        }),
        fetchedAt: now,
      };
    },
  };
}
