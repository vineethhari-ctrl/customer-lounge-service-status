import { BAY_GROUPS } from "../config";
import type { Bay, BayJob, Snapshot } from "../data/types";
import { DataTable, type Column } from "../components/DataTable";
import { Pill } from "../components/Pill";
import { bayStatus, elapsedMs, fmtDuration, fmtLate, fmtTime, timeStatus } from "../logic";

interface Row { bay: Bay; job?: BayJob }

export function WorksManagerBoard({ snapshot, now, group }: { snapshot: Snapshot; now: number; group: string }) {
  const jobByBay = new Map(snapshot.jobs.map((j) => [j.bayId, j]));
  const rows: Row[] = snapshot.bays
    .filter((b) => group === "ALL" || b.groupId === group)
    .map((bay) => ({ bay, job: jobByBay.get(bay.id) }));

  const count = { wip: 0, yet: 0, done: 0, delayed: 0, free: 0 };
  for (const r of rows) {
    if (!r.job) { count.free++; continue; }
    const s = bayStatus(r.job);
    if (s === "WIP") count.wip++; else if (s === "Done") count.done++; else count.yet++;
    if (timeStatus(r.job, now).delayed && s !== "Done") count.delayed++;
  }

  const groupName = (id: string) => BAY_GROUPS.find((g) => g.id === id)?.id ?? id;
  const dash = <span className="text-slate-600">—</span>;
  const columns: Column<Row>[] = [
    { key: "bay", header: "Bay", width: "w-[5.5%]", render: (r) => (
      <div className="leading-tight"><div className="text-[1.15rem] font-bold text-white">{r.bay.id}</div>
        <div className="text-[0.7rem] text-slate-500">{groupName(r.bay.groupId)}</div></div>) },
    { key: "tech", header: "Technician", width: "w-[13%]", render: (r) => <span className="text-slate-200">{r.bay.technician}</span> },
    { key: "veh", header: "Vehicle", width: "w-[15%]", render: (r) => r.job
      ? <span className="font-mono text-[1.15rem] font-bold text-white">{r.job.regNo}</span>
      : <span className="italic text-slate-500">Bay free</span> },
    { key: "ps", header: <>Start<br /><span className="text-slate-500">Plan</span></>, width: "w-[8%]", className: "font-mono", render: (r) => r.job ? fmtTime(r.job.planStart) : dash },
    { key: "as", header: <>Start<br /><span className="text-slate-500">Actual</span></>, width: "w-[8%]", className: "font-mono", render: (r) => r.job?.actualStart ? <span className="text-white">{fmtTime(r.job.actualStart)}</span> : dash },
    { key: "pe", header: <>End<br /><span className="text-slate-500">Plan</span></>, width: "w-[8%]", className: "font-mono", render: (r) => r.job ? fmtTime(r.job.planEnd) : dash },
    { key: "el", header: <>Elapsed<br />Time</>, width: "w-[10%]", className: "font-mono", render: (r) => r.job && r.job.actualStart ? fmtDuration(elapsedMs(r.job, now)) : dash },
    { key: "st", header: "Status", width: "w-[12%]", render: (r) => {
      if (!r.job) return dash;
      const s = bayStatus(r.job);
      return <Pill tone={s === "WIP" ? "blue" : s === "Done" ? "done" : "slate"}>{s === "Done" ? "✓ Done" : s}</Pill>;
    } },
    { key: "tm", header: "Time", width: "w-[13%]", render: (r) => {
      if (!r.job) return dash;
      const t = timeStatus(r.job, now);
      const live = bayStatus(r.job) !== "Done";
      return t.delayed
        ? <Pill tone="red" blink={live}>Delayed {fmtLate(t.minutes)}</Pill>
        : <Pill tone="green">On time</Pill>;
    } },
  ];

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <div className="flex flex-wrap gap-3 text-[0.95rem]">
        <Stat label="WIP" value={count.wip} tone="text-sky-300" />
        <Stat label="Yet to start" value={count.yet} tone="text-slate-200" />
        <Stat label="Done" value={count.done} tone="text-teal-300" />
        <Stat label="Delayed (live)" value={count.delayed} tone="text-red-400" />
        <Stat label="Free bays" value={count.free} tone="text-slate-400" />
      </div>
      <DataTable columns={columns} rows={rows} rowKey={(r) => r.bay.id}
        rowClassName={(r) => r.job && bayStatus(r.job) !== "Done" && timeStatus(r.job, now).delayed ? "shadow-[inset_4px_0_0_#ef4444]" : ""}
        empty="No bays in this group." countLabel={`${rows.length} bays`} />
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <div className="flex items-baseline gap-2 rounded-md border border-slate-800 bg-slate-900/70 px-4 py-1.5">
      <span className={`text-[1.5rem] font-bold ${tone}`}>{value}</span>
      <span className="text-slate-400">{label}</span>
    </div>
  );
}
