// Central configuration. Edit these values when BU confirms the real numbers.

export type Dept = "MECHANICAL" | "BODYSHOP";

export interface BayGroup {
  id: string;     // short code shown on the filter, e.g. "S1"
  name: string;   // label shown on screen
  dept: Dept;
  bayCount: number;
}

// BU note: "Sets / bays: S1 -> 5, S2 -> 15, S3 -> ..., 40 bays".
// Assumption: 40 bays in total, so S3 = 20. Group names and departments are placeholders.
export const BAY_GROUPS: BayGroup[] = [
  { id: "S1", name: "Set 1 · Express", dept: "MECHANICAL", bayCount: 5 },
  { id: "S2", name: "Set 2 · Mechanical", dept: "MECHANICAL", bayCount: 15 },
  { id: "S3", name: "Set 3 · Bodyshop", dept: "BODYSHOP", bayCount: 20 },
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
