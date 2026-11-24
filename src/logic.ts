// Business rules for the screens. Kept in one file so BU can review them.
import { APPOINTMENT_LATE_MINUTES, MILESTONES } from "./config";
import type { Appointment, BayJob, LoungeVehicle } from "./data/types";

const MIN = 60_000;

export type BayStatus = "Yet to start" | "WIP" | "Done";

// Status column: from the actual start/end time stamps.
export function bayStatus(j: BayJob): BayStatus {
  if (j.actualEnd !== undefined) return "Done";
  if (j.actualStart !== undefined) return "WIP";
  return "Yet to start";
}

// Elapsed time = current time - actual start (frozen at actual end once Done).
export function elapsedMs(j: BayJob, now: number): number | undefined {
  if (j.actualStart === undefined) return undefined;
  return (j.actualEnd ?? now) - j.actualStart;
}

// Time column (assumption, to confirm with BU):
//  - Yet to start: Delayed once the planned start time has passed.
//  - WIP:          Delayed once the planned end time has passed.
//  - Done:         Delayed if it finished after the planned end time.
export function timeStatus(j: BayJob, now: number): { delayed: boolean; minutes: number } {
  const s = bayStatus(j);
  const ref = s === "Yet to start" ? j.planStart : j.planEnd;
  const at = s === "Done" ? j.actualEnd! : now;
  const late = Math.floor((at - ref) / MIN);
  return late > 0 ? { delayed: true, minutes: late } : { delayed: false, minutes: 0 };
}

export type AppointmentStatus = "Arrived" | "Expected" | "Late";
export function appointmentStatus(a: Appointment, now: number): AppointmentStatus {
  if (a.arrivedAt !== undefined) return "Arrived";
  return now > a.slot + APPOINTMENT_LATE_MINUTES * MIN ? "Late" : "Expected";
}

export type LoungeStatus = "Ready" | "On time" | "Delayed";
export function loungeStatus(v: LoungeVehicle, now: number): LoungeStatus {
  if (v.stage >= MILESTONES[v.dept].length - 1) return "Ready";
  return now > v.edt ? "Delayed" : "On time";
}

export function isSameDay(a: number, b: number): boolean {
  const x = new Date(a), y = new Date(b);
  return x.getFullYear() === y.getFullYear() && x.getMonth() === y.getMonth() && x.getDate() === y.getDate();
}

export function fmtTime(ms: number | undefined): string {
  if (ms === undefined) return "—";
  const d = new Date(ms);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export function fmtDuration(ms: number | undefined): string {
  if (ms === undefined) return "—";
  const m = Math.max(0, Math.floor(ms / MIN));
  return `${Math.floor(m / 60)}h ${String(m % 60).padStart(2, "0")}m`;
}

export function fmtLate(minutes: number): string {
  return minutes >= 60 ? `+${Math.floor(minutes / 60)}h ${String(minutes % 60).padStart(2, "0")}m` : `+${minutes}m`;
}

// 12-hour clock for customer-facing times, e.g. "09:20 AM".
export function fmt12(ms: number): string {
  return new Date(ms).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
}
