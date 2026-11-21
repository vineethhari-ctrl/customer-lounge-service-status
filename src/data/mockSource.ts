// Sandbox data source. Generates a believable "today" relative to the current time and
// moves jobs forward on every refresh, so the screens look live without a DMS.
// All names and number plates are sandbox data.
import { BAY_GROUPS, MILESTONES, type Dept } from "../config";
import type { Appointment, Bay, BayJob, DataSource, LoungeVehicle, Snapshot } from "./types";

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

interface InternalJob extends BayJob {
  dept: Dept;
  advisor: string;
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
  let jobs: InternalJob[] = [];
  let extraGateIn: LoungeVehicle[] = [];
  let appointments: Appointment[] = [];
  let initialised = false;

  function init(now: number) {
    let n = 0;
    bays = BAY_GROUPS.flatMap((g) =>
      Array.from({ length: g.bayCount }, () => {
        n++;
        return { id: `B${n}`, groupId: g.id, dept: g.dept, technician: TECHNICIANS[(n - 1) % TECHNICIANS.length] };
      }),
    );

    jobs = [];
    for (const bay of bays) {
      if (rnd() < 0.12) continue; // free bay
      const isBody = bay.dept === "BODYSHOP";
      const dur = round(isBody ? between(120, 300) * MIN : between(60, 180) * MIN, 15);
      const base = {
        bayId: bay.id, dept: bay.dept, regNo: nextReg(), model: pick(MODELS),
        jobType: pick(isBody ? BODY_JOBS : MECH_JOBS), customer: nextCustomer(), advisor: pick(ADVISORS),
        estimatePending: false,
      };
      const p = rnd();
      if (p < 0.25) {
        const actualEnd = now - between(5, 90) * MIN;
        const actualStart = actualEnd - dur * between(0.75, 1.1);
        const planStart = round(actualStart - between(0, 10) * MIN, 5);
        jobs.push({ ...base, planStart, planEnd: planStart + dur, actualStart, actualEnd });
      } else if (p < 0.7) {
        const actualStart = now - between(10, dur / MIN + 40) * MIN;
        const planStart = round(actualStart - between(-10, 25) * MIN, 5);
        jobs.push({ ...base, planStart, planEnd: planStart + dur, actualStart });
      } else {
        const planStart = round(now + between(-30, 120) * MIN, 15);
        jobs.push({ ...base, planStart, planEnd: planStart + dur, estimatePending: isBody && rnd() < 0.5 });
      }
    }

    extraGateIn = Array.from({ length: 3 }, () => {
      const dept: Dept = rnd() < 0.7 ? "MECHANICAL" : "BODYSHOP";
      return {
        regNo: nextReg(), model: pick(MODELS), customer: nextCustomer(), advisor: pick(ADVISORS),
        dept, stage: 0, edt: round(now + between(180, 360) * MIN, 15),
      };
    });

    const day = new Date(now);
    day.setHours(9, 0, 0, 0);
    appointments = [];
    for (let i = 0; i < 25; i++) {
      if (rnd() < 0.12) continue;
      const slot = day.getTime() + i * 20 * MIN;
      const dept: Dept = rnd() < 0.75 ? "MECHANICAL" : "BODYSHOP";
      const arrived = slot < now && rnd() < 0.85;
      appointments.push({
        id: `A${i + 1}`, slot, regNo: nextReg(), model: pick(MODELS), customer: nextCustomer(),
        advisor: pick(ADVISORS), dept, jobType: pick(dept === "BODYSHOP" ? BODY_JOBS : MECH_JOBS),
        arrivedAt: arrived ? Math.min(now, slot + between(-15, 20) * MIN) : undefined,
      });
    }
    initialised = true;
  }

  // Each refresh: some due jobs start, some running jobs finish, some appointments arrive.
  function simulate(now: number) {
    for (const j of jobs) {
      if (j.actualStart === undefined) {
        if (j.estimatePending && rnd() < 0.2) j.estimatePending = false;
        if (!j.estimatePending && j.planStart <= now && rnd() < 0.5) j.actualStart = now;
      } else if (j.actualEnd === undefined && now >= j.planEnd - 10 * MIN && rnd() < 0.35) {
        j.actualEnd = now;
      }
    }
    for (const a of appointments) {
      if (!a.arrivedAt && a.slot <= now + 10 * MIN && rnd() < 0.3) a.arrivedAt = now;
    }
  }

  function toLounge(j: InternalJob, now: number): LoungeVehicle {
    const stages = MILESTONES[j.dept];
    const idx = (name: string) => stages.indexOf(name);
    let stage: number;
    if (j.actualEnd !== undefined) stage = now - j.actualEnd < 40 * MIN ? idx("Washing") : idx("Ready for Delivery");
    else if (j.actualStart !== undefined) stage = idx("In Bay (WIP)");
    else stage = j.estimatePending ? idx("Estimate Approval") : idx("Job Card");
    const edt = Math.ceil((j.planEnd + 45 * MIN) / (15 * MIN)) * 15 * MIN;
    return { regNo: j.regNo, model: j.model, customer: j.customer, advisor: j.advisor, dept: j.dept, stage, edt };
  }

  return {
    name: "Sandbox data",
    async fetchSnapshot(now: number): Promise<Snapshot> {
      if (!initialised) init(now);
      else simulate(now);
      return {
        bays: bays.map((b) => ({ ...b })),
        jobs: jobs.map(({ dept: _d, advisor: _a, estimatePending: _e, ...j }) => ({ ...j })),
        appointments: appointments.map((a) => ({ ...a })),
        vehicles: [...jobs.map((j) => toLounge(j, now)), ...extraGateIn.map((v) => ({ ...v }))],
        fetchedAt: now,
      };
    },
  };
}
