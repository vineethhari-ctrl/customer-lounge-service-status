import type { Dept } from "../config";
import type { Appointment, Snapshot } from "../data/types";
import { DataTable, type Column } from "../components/DataTable";
import { DeptTag, Pill } from "../components/Pill";
import { appointmentStatus, fmtTime, isSameDay } from "../logic";

// BU: list view, today only, no walk-in differentiation.
export function AppointmentsList({ snapshot, now, dept }: { snapshot: Snapshot; now: number; dept: Dept | "ALL" }) {
  const rows = snapshot.appointments
    .filter((a) => isSameDay(a.slot, now) && (dept === "ALL" || a.dept === dept))
    .sort((a, b) => a.slot - b.slot);
  const columns: Column<Appointment>[] = [
    { key: "t", header: "Time", width: "w-[8%]", className: "font-mono text-[1.15rem] font-bold text-cyan-300", render: (a) => fmtTime(a.slot) },
    { key: "r", header: "Vehicle No.", width: "w-[14%]", className: "font-mono text-[1.1rem] font-bold text-white", render: (a) => a.regNo },
    { key: "m", header: "Model", width: "w-[10%]", render: (a) => a.model },
    { key: "c", header: "Customer", width: "w-[18%]", className: "font-semibold text-white", render: (a) => a.customer },
    { key: "sa", header: "Service Advisor", width: "w-[15%]", render: (a) => a.advisor },
    { key: "j", header: "Job", width: "w-[15%]", className: "text-slate-300", render: (a) => a.jobType },
    { key: "d", header: "Dept", width: "w-[9%]", render: (a) => <DeptTag dept={a.dept} /> },
    { key: "s", header: "Status", width: "w-[11%]", render: (a) => {
      const s = appointmentStatus(a, now);
      return <Pill tone={s === "Arrived" ? "green" : s === "Late" ? "amber" : "slate"}>
        {s === "Arrived" ? `Arrived ${fmtTime(a.arrivedAt)}` : s}</Pill>;
    } },
  ];
  const arrived = rows.filter((a) => a.arrivedAt !== undefined).length;
  return <DataTable columns={columns} rows={rows} rowKey={(a) => a.id} empty="No appointments today."
    countLabel={`${rows.length} appointments today · ${arrived} arrived`} />;
}
