import type { ReactNode } from "react";

const TONES = {
  green: "bg-emerald-500/15 text-emerald-300 ring-emerald-400/40",
  red: "bg-red-500/20 text-red-300 ring-red-400/50",
  blue: "bg-sky-500/15 text-sky-300 ring-sky-400/40",
  amber: "bg-amber-500/15 text-amber-300 ring-amber-400/40",
  slate: "bg-slate-500/15 text-slate-300 ring-slate-400/30",
  done: "bg-teal-500/15 text-teal-200 ring-teal-400/40",
} as const;
export type Tone = keyof typeof TONES;

export function Pill({ tone, children, blink }: { tone: Tone; children: ReactNode; blink?: boolean }) {
  return (
    <span className={`inline-flex items-center whitespace-nowrap rounded-md px-2.5 py-0.5 text-[0.95em] font-semibold ring-1 ${TONES[tone]} ${blink ? "blink" : ""}`}>
      {children}
    </span>
  );
}

export function DeptTag({ dept }: { dept: "MECHANICAL" | "BODYSHOP" }) {
  return dept === "BODYSHOP"
    ? <span className="text-amber-300">Bodyshop</span>
    : <span className="text-sky-300">Mechanical</span>;
}
