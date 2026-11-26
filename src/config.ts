// Central configuration. Edit these values when BU confirms the real numbers.

export type Dept = "MECHANICAL" | "BODYSHOP";

export interface BayGroup {
  id: string;     // internal code, e.g. "BG1"
  name: string;   // label shown on screen, e.g. "Bay group 1"
  dept: Dept;
  bayCount: number;
}

// BU paper: "Sets / bays: S1 -> 5, S2 -> 15, S3 -> 11" (31 bays). Shown on screen as "Bay group 1 / 2 / 3" (user decision, 26 Nov).
// Departments per set are not on the paper; they only drive the sample data (Mechanical / Bodyshop).
export const BAY_GROUPS: BayGroup[] = [
  { id: "BG1", name: "Bay group 1", dept: "MECHANICAL", bayCount: 5 },
  { id: "BG2", name: "Bay group 2", dept: "MECHANICAL", bayCount: 15 },
  { id: "BG3", name: "Bay group 3", dept: "BODYSHOP", bayCount: 11 },
];

// Customer-facing milestones (BU: "remove RO, promise date; add Washing").
export const MILESTONES: Record<Dept, string[]> = {
  MECHANICAL: ["Gate In", "Job Card", "In Bay (WIP)", "Washing", "Ready for Delivery"],
  BODYSHOP: ["Gate In", "Job Card", "Estimate Approval", "In Bay (WIP)", "Washing", "Ready for Delivery"],
};

export const DMS_REFRESH_SECONDS = 60; // how often data is re-read from the DMS
export const PAGE_SECONDS = 15;        // TV list paging when rows don't fit
export const TAB_SWITCH_SECONDS = 15;  // Front Office auto-switch Appointments <-> Vehicle Status
export const APPOINTMENT_LATE_MINUTES = 15;
