import type { ReactNode } from "react";
import { useNow } from "../hooks";

export function TopBar({ title, subtitle, children, onSignOut }: {
  title: string; subtitle: string; children?: ReactNode; onSignOut: () => void;
}) {
  const now = useNow(1000);
  const d = new Date(now);
  return (
    <header className="flex items-center gap-4 border-b border-slate-800 bg-[#06102a] px-5 py-3">
      <div className="leading-tight">
        <div className="text-[1.35rem] font-extrabold tracking-wide text-white">TATA MOTORS</div>
        <div className="text-[0.75rem] uppercase tracking-widest text-slate-400">{subtitle}</div>
      </div>
      <div className="ml-4 border-l border-slate-700 pl-4 text-[1.6rem] font-bold uppercase tracking-tight text-white">{title}</div>
      <div className="ml-auto flex items-center gap-3">{children}</div>
      <div className="text-right leading-tight">
        <div className="font-mono text-[1.5rem] font-bold text-cyan-300">
          {d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false })}
        </div>
        <div className="text-[0.8rem] text-slate-400">
          {d.toLocaleDateString("en-IN", { weekday: "short", day: "2-digit", month: "short", year: "numeric" })}
        </div>
      </div>
      <button onClick={onSignOut} className="ml-2 rounded px-2 py-1 text-[0.8rem] text-slate-400 underline hover:text-white">Sign out</button>
    </header>
  );
}

export function Segmented<T extends string>({ value, options, onChange }: {
  value: T; options: { value: T; label: ReactNode }[]; onChange: (v: T) => void;
}) {
  return (
    <div className="flex rounded-md border border-slate-700 bg-slate-900 p-0.5 text-[0.9rem]">
      {options.map((o) => (
        <button key={o.value} onClick={() => onChange(o.value)}
          className={`rounded px-3 py-1 font-semibold transition ${value === o.value ? "bg-cyan-600 text-white" : "text-slate-400 hover:text-white"}`}>
          {o.label}
        </button>
      ))}
    </div>
  );
}
