import { useMemo, useState } from "react";
import { BAY_GROUPS } from "../config";
import { useNow, useSnapshot, useTvScale } from "../hooks";
import { bayCardState, bayStatus, timeStatus, type CardState } from "../logic";
import type { PortalUser } from "../session";
import { BayCard } from "./workshop/BayCard";

type Group = "ALL" | string;
const PRIORITY: Record<CardState, number> = { delayed: 0, hold: 1, ontime: 2, done: 3, free: 4 };
const GROUP_LABEL: Record<string, string> = { S1: "S1 Mechanical", S2: "S2 Mechanical", S3: "S3 Bodyshop" };

function Clock() {
  const now = useNow(1000);
  const d = new Date(now);
  return (
    <div className="whitespace-nowrap text-right leading-tight">
      <div className="font-mono text-[1.5rem] font-bold text-white">{d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })}</div>
      <div className="text-[0.75rem] text-[#94A3B8]">{d.toLocaleDateString("en-IN", { weekday: "short", day: "2-digit", month: "short", year: "numeric" })}</div>
    </div>
  );
}

function Kpi({ label, value, tone, sub }: { label: string; value: number; tone: string; sub?: string }) {
  return (
    <div data-kpi={label} data-value={value} className="flex flex-1 flex-col items-center justify-center border-l border-[#E2E8F0] px-2 first:border-l-0">
      <span className={`text-[2rem] font-bold leading-none ${tone}`}>{value}</span>
      <span className="mt-[0.2rem] whitespace-nowrap text-[0.82rem] font-semibold text-[#334155]">{label}</span>
      {sub && <span className="text-[0.68rem] leading-none text-[#94A3B8]">{sub}</span>}
    </div>
  );
}

export function WorksManagerScreen({ user, onOpenLounge, onSignOut }: { user: PortalUser; onOpenLounge: () => void; onSignOut: () => void }) {
  useTvScale(0.9);
  const { snapshot } = useSnapshot();
  const now = useNow(15_000);
  const [group, setGroup] = useState<Group>("ALL");
  const [exceptionsFirst, setExceptionsFirst] = useState(false);

  const cards = useMemo(() => {
    if (!snapshot) return [];
    const jobByBay = new Map(snapshot.jobs.map((j) => [j.bayId, j]));
    const advisorByReg = new Map(snapshot.appointments.map((a) => [a.regNo, a.advisor]));
    return snapshot.bays
      .filter((b) => group === "ALL" || b.groupId === group)
      .map((bay) => {
        const job = jobByBay.get(bay.id);
        return { bay, job, advisor: job ? advisorByReg.get(job.regNo) : undefined, state: bayCardState(job, now) };
      });
  }, [snapshot, group, now]);

  // Every KPI is counted from the same cards that are drawn below.
  const n = { wip: 0, yet: 0, done: 0, free: 0, ontime: 0, delayed: 0, hold: 0 };
  for (const c of cards) {
    if (c.state === "free") n.free++; else if (c.state === "done") n.done++;
    if (c.job && bayStatus(c.job) === "WIP") n.wip++;
    if (c.job && bayStatus(c.job) === "Yet to start") n.yet++;
    if (c.state === "ontime") n.ontime++; else if (c.state === "delayed") n.delayed++; else if (c.state === "hold") n.hold++;
  }

  const sorted = exceptionsFirst
    ? [...cards].sort((a, b) =>
        PRIORITY[a.state] - PRIORITY[b.state]
        || (a.state === "delayed" ? timeStatus(b.job!, now).minutes - timeStatus(a.job!, now).minutes : 0) // most late first
        || Number(a.bay.id.slice(1)) - Number(b.bay.id.slice(1)))
    : cards;
  const sections = exceptionsFirst
    ? [{ id: "ex", title: `Exceptions first · ${n.delayed + n.hold} need attention`, items: sorted }]
    : BAY_GROUPS.map((g) => ({ id: g.id, title: `${GROUP_LABEL[g.id] ?? g.id} · ${cards.filter((c) => c.bay.groupId === g.id).length} bays`, items: sorted.filter((c) => c.bay.groupId === g.id) })).filter((s) => s.items.length);

  const pillCls = (on: boolean) => `whitespace-nowrap rounded-full px-[0.9rem] py-[0.3rem] text-[0.88rem] transition ${on ? "bg-white font-bold text-[#0F172A]" : "text-[#CBD5E1] hover:text-white"}`;
  const total = snapshot?.bays.length ?? 31;

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#E8ECF2] text-[#0F172A]">
      <header className="flex h-[3.6rem] shrink-0 items-center gap-4 bg-[#0F172A] px-5 text-white">
        <span className="whitespace-nowrap text-[1.15rem] font-extrabold tracking-[0.1em]">TATA MOTORS</span>
        <span className="h-6 w-px bg-[#334155]" />
        <span className="whitespace-nowrap text-[1.05rem] font-semibold">Workshop Control Board</span>
        <div role="group" aria-label="Bay group" className="ml-3 flex items-center gap-0.5 rounded-full bg-[#1E293B] p-1">
          <button type="button" aria-pressed={group === "ALL"} onClick={() => setGroup("ALL")} className={pillCls(group === "ALL")}>All Bays ({total})</button>
          {BAY_GROUPS.map((g) => (
            <button key={g.id} type="button" aria-pressed={group === g.id} onClick={() => setGroup(g.id)} className={pillCls(group === g.id)}>
              {g.id} {g.dept === "BODYSHOP" ? "Bodyshop" : "Mech"} ({g.bayCount})
            </button>
          ))}
        </div>
        <button type="button" role="switch" aria-checked={exceptionsFirst} onClick={() => setExceptionsFirst(!exceptionsFirst)}
          className={`flex items-center gap-2 whitespace-nowrap rounded-full border px-[0.9rem] py-[0.3rem] text-[0.88rem] transition ${exceptionsFirst ? "border-[#F87171] bg-[#7F1D1D] font-bold text-white" : "border-[#475569] text-[#CBD5E1] hover:text-white"}`}>
          <span className={`h-2.5 w-2.5 rounded-full ${exceptionsFirst ? "bg-[#FCA5A5]" : "bg-[#64748B]"}`} />Exceptions First
        </button>
        <div className="ml-auto flex items-center gap-4">
          <button type="button" onClick={onOpenLounge} className="whitespace-nowrap rounded-full border border-[#475569] px-4 py-[0.3rem] text-[0.88rem] text-[#E2E8F0] hover:border-[#60A5FA] hover:text-white">Lounge View</button>
          <Clock />
          <div className="whitespace-nowrap border-l border-[#334155] pl-4 text-right leading-tight"><div className="text-[0.85rem] font-semibold">{user.name}</div><button type="button" onClick={onSignOut} className="text-[0.75rem] text-[#93C5FD] hover:underline">Sign out</button></div>
        </div>
      </header>

      <div className="flex shrink-0 items-stretch gap-0 border-b border-[#CBD5E1] bg-white px-3 py-[0.5rem] shadow-sm">
        <Kpi label="Active WIP" value={n.wip} tone="text-[#2563EB]" />
        <Kpi label="Yet to Start" value={n.yet} tone="text-[#475569]" />
        <Kpi label="Completed" value={n.done} tone="text-[#16A34A]" />
        <Kpi label="Free Bays" value={n.free} tone="text-[#64748B]" />
        <Kpi label="On Time" value={n.ontime} tone="text-[#2563EB]" sub="running to plan" />
        <Kpi label="Approval Hold" value={n.hold} tone="text-[#D97706]" sub="bodyshop" />
        <Kpi label="Delayed (Action Needed)" value={n.delayed} tone="text-[#DC2626]" />
      </div>

      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-4 py-3">
        {!snapshot ? <div className="mt-20 text-center text-[1.1rem] text-[#64748B]">Loading bays…</div> : sections.map((s) => (
          <section key={s.id} className="mb-2" aria-label={s.title}>
            <h2 className="mb-[0.3rem] text-[0.78rem] font-bold uppercase tracking-[0.14em] text-[#64748B]">{s.title}</h2>
            <div className="grid gap-[0.5rem] bays-grid">
              {s.items.map((c) => <BayCard key={c.bay.id} bay={c.bay} job={c.job} advisor={c.advisor} state={c.state} now={now} />)}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
