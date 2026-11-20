import { MILESTONES, type Dept } from "../config";
import type { LoungeVehicle, Snapshot } from "../data/types";
import { DataTable, type Column } from "../components/DataTable";
import { DeptTag, Pill } from "../components/Pill";
import { fmtTime, isSameDay, loungeStatus } from "../logic";

// BU: simple vehicle status, today's EDT vehicles only, no RO / promise date, customer name, Washing stage.
export function VehicleStatusList({ snapshot, now, dept }: { snapshot: Snapshot; now: number; dept: Dept | "ALL" }) {
  const order = { Ready: 0, Delayed: 1, "On time": 2 } as const;
  const rows = snapshot.vehicles
    .filter((v) => isSameDay(v.edt, now) && (dept === "ALL" || v.dept === dept))
    .sort((a, b) => order[loungeStatus(a, now)] - order[loungeStatus(b, now)] || a.edt - b.edt);

  const columns: Column<LoungeVehicle>[] = [
    { key: "r", header: "Vehicle No.", width: "w-[14%]", className: "font-mono text-[1.1rem] font-bold text-white", render: (v) => v.regNo },
    { key: "m", header: "Model", width: "w-[9%]", render: (v) => v.model },
    { key: "c", header: "Customer", width: "w-[17%]", className: "font-semibold text-white", render: (v) => v.customer },
    { key: "d", header: "Dept", width: "w-[9%]", render: (v) => <DeptTag dept={v.dept} /> },
    { key: "s", header: "Current Stage", width: "w-[30%]", render: (v) => <Stage v={v} /> },
    { key: "e", header: "Est. Delivery", width: "w-[10%]", className: "font-mono text-[1.15rem] font-bold text-cyan-300", render: (v) => fmtTime(v.edt) },
    { key: "st", header: "Status", width: "w-[11%]", render: (v) => {
      const s = loungeStatus(v, now);
      return <Pill tone={s === "Ready" ? "green" : s === "Delayed" ? "red" : "blue"}>{s === "Ready" ? "✓ Ready" : s}</Pill>;
    } },
  ];
  const ready = rows.filter((v) => loungeStatus(v, now) === "Ready").length;
  return <DataTable columns={columns} rows={rows} rowKey={(v) => v.regNo} empty="No vehicles due for delivery today."
    countLabel={`${rows.length} vehicles due today · ${ready} ready for delivery`} />;
}

function Stage({ v }: { v: LoungeVehicle }) {
  const stages = MILESTONES[v.dept];
  return (
    <div className="flex items-center gap-3">
      <div className="flex gap-1">
        {stages.map((name, i) => (
          <span key={name} title={name}
            className={`h-2.5 w-5 rounded-sm ${i < v.stage ? "bg-emerald-500" : i === v.stage ? "bg-cyan-400" : "bg-slate-700"}`} />
        ))}
      </div>
      <span className="truncate font-semibold text-slate-100">{stages[v.stage]}</span>
    </div>
  );
}
