import type { Dept } from "../config";

export interface Bay {
  id: string;         // "B1"
  groupId: string;    // "S1"
  dept: Dept;
  technician: string; // technician assigned to the bay today
}

// One job in a bay. Times are epoch milliseconds. From the DMS.
export interface BayJob {
  bayId: string;
  regNo: string;
  model: string;
  jobType: string;
  customer: string;
  planStart: number;
  planEnd: number;
  actualStart?: number; // set when work starts
  actualEnd?: number;   // set when work is done
}

export interface Appointment {
  id: string;
  slot: number; // appointment time today
  regNo: string;
  model: string;
  customer: string;
  advisor: string;
  dept: Dept;
  jobType: string;
  arrivedAt?: number;
}

// Vehicle as shown to customers in the lounge.
export interface LoungeVehicle {
  regNo: string;
  model: string;
  customer: string;
  advisor: string;
  dept: Dept;
  jobType: string;
  stage: number; // index into MILESTONES[dept]
  edt: number;   // estimated delivery time
}

export interface Snapshot {
  bays: Bay[];
  jobs: BayJob[];
  appointments: Appointment[];
  vehicles: LoungeVehicle[];
  fetchedAt: number;
}

// The screens only talk to this interface. Today: mock data. Later: a DMS adapter.
export interface DataSource {
  name: string;
  fetchSnapshot(now: number): Promise<Snapshot>;
}
