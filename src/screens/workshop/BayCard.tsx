import type { Bay, BayJob } from "../../data/types";
import { formatReg } from "../../format";
import { bayStatus, elapsedMs, fmtLate, fmtTime, timeStatus, type CardState } from "../../logic";

const BADGE: Record<CardState, { text: string; cls: string }> = {
  free: { text: "BAY FREE", cls: "bg-[#E2E8F0] text-[#475569]" },
  done: { text: "DONE", cls: "bg-[#16A34A] text-white" },
  hold: { text: "ESTIMATE HOLD", cls: "bg-[#F59E0B] text-[#451A03]" },
  delayed: { text: "DELAYED", cls: "bg-[#DC2626] text-white" },
  ontime: { text: "ON TIME", cls: "bg-[#DBEAFE] text-[#1D4ED8]" },
};

const FRAME: Record<CardState, string> = {
  free: "border-2 border-dashed border-[#CBD5E1] bg-[#F8FAFC]",
  done: "border border-[#BBF7D0] bg-white",
  hold: "border-2 border-[#F59E0B] bg-[#FFFBEB]",
  delayed: "border border-[#FECACA] border-t-[0.35rem] border-t-[#DC2626] bg-white",
  ontime: "border border-[#D8DFEA] bg-white",
};

export function BayCard({ bay, job, advisor, state, now }: { bay: Bay; job?: BayJob; advisor?: string; state: CardState; now: number }) {
  const b = BADGE[state];
  const late = job ? timeStatus(job, now) : { delayed: false, minutes: 0 };
  const planned = job ? Math.max(1, Math.round((job.planEnd - job.planStart) / 60000)) : 0;
  const elapsed = job ? Math.max(0, Math.round((elapsedMs(job, now) ?? 0) / 60000)) : 0;
  const over = elapsed > planned;
  const pct = Math.min(100, (elapsed / planned) * 100);
  const barColor = state === "done" ? (over ? "bg-[#DC2626]" : "bg-[#16A34A]") : over ? "bg-[#DC2626]" : state === "hold" ? "bg-[#F59E0B]" : "bg-[#2563EB]";
  const started = job && bayStatus(job) !== "Yet to start";

  const tip = job
    ? `${bay.id} · ${bay.technician}\n${formatReg(job.regNo)} · ${job.model} · ${job.jobType}\nService Advisor: ${advisor ?? "—"}\nPlan: ${fmtTime(job.planStart)} – ${fmtTime(job.planEnd)}`
    : `${bay.id} · ${bay.technician}\nAvailable for Allocation`;
  const label = state === "hold" ? "Approval Pending" : started ? (state === "done" ? "Total time" : "Elapsed") : "Not started";

  return (
    <article data-bay={bay.id} data-state={state} data-bay-status={job ? bayStatus(job) : "Free"} title={tip}
      className={`flex min-h-0 flex-col overflow-hidden rounded-xl shadow-[0_1px_3px_rgba(15,23,42,0.08)] ${FRAME[state]}`}>
      <header className={`px-[0.65rem] pb-[0.1rem] pt-[0.35rem] leading-tight ${state === "delayed" ? "bg-[#FEF2F2]" : ""}`}>
        <div className="flex items-center justify-between gap-2">
          <span className="shrink-0 whitespace-nowrap"><b className="text-[1.05rem] text-[#0F172A]">{bay.id}</b><span className="text-[0.8rem] text-[#64748B]"> · {bay.groupId}</span></span>
          <span className={`shrink-0 whitespace-nowrap rounded-md px-[0.45rem] py-[0.2rem] text-[0.74rem] font-extrabold leading-none tracking-wide ${b.cls}`}>
            {state === "delayed" ? `DELAYED ${fmtLate(late.minutes)}` : state === "hold" ? <><span className="badge-long">ESTIMATE HOLD</span><span className="badge-short">HOLD</span></> : b.text}
          </span>
        </div>
        <div className="truncate text-[0.8rem] text-[#475569]">{bay.technician}</div>
      </header>

      {!job ? (
        <div className="flex flex-1 items-center justify-center px-2 pb-2 text-[0.9rem] font-medium text-[#94A3B8]">Available for Allocation</div>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col justify-between px-[0.65rem] pb-[0.4rem] pt-[0.1rem]">
          <div className="leading-tight">
            <div className="truncate font-mono text-[1.15rem] font-bold tracking-wide text-[#0F172A]">{formatReg(job.regNo)}</div>
            <div className="truncate text-[0.8rem] text-[#334155]"><b>{job.model}</b> · {job.jobType}</div>
            <div className="bay-extra truncate text-[0.74rem] text-[#64748B]">SA: {advisor ?? "—"}</div>
          </div>
          <div>
            <div className="mb-[0.12rem] flex items-baseline justify-between gap-[0.35rem] text-[0.74rem] leading-none">
              <span className={`whitespace-nowrap ${state === "hold" ? "font-bold text-[#B45309]" : "text-[#64748B]"}`}>{label}</span>
              <span className={`whitespace-nowrap font-mono font-bold ${over ? "text-[#DC2626]" : "text-[#334155]"}`}>{started ? `${elapsed}m / ${planned}m` : `0m / ${planned}m`}</span>
            </div>
            <div className="h-[0.42rem] overflow-hidden rounded-full bg-[#E2E8F0]"><div className={`h-full rounded-full ${barColor}`} style={{ width: `${started ? pct : 0}%` }} /></div>
            <div className="bay-extra mt-[0.12rem] text-[0.7rem] leading-none text-[#94A3B8]">Plan: {fmtTime(job.planStart)} – {fmtTime(job.planEnd)}</div>
          </div>
        </div>
      )}
    </article>
  );
}
