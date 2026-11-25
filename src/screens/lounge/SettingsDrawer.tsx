import { useEffect, type ReactNode } from "react";
import type { Dept } from "../../config";

export type LoungeScreenName = "status" | "appointments";
export type DeptFilter = Dept | "ALL";

function Seg<T extends string>({ value, options, onChange }: { value: T; options: { value: T; label: string }[]; onChange: (v: T) => void }) {
  return (
    <div className="flex rounded-lg bg-[#0B132B] p-1">
      {options.map((o) => (
        <button key={o.value} type="button" onClick={() => onChange(o.value)}
          className={`flex-1 rounded-md px-2 py-1.5 text-[0.9rem] transition ${value === o.value ? "bg-[#2563EB] font-semibold text-white" : "text-[#94A3B8] hover:text-white"}`}>{o.label}</button>
      ))}
    </div>
  );
}
function Row({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <div className="border-b border-[#1E2A44] py-3.5">
      <div className="mb-2 flex items-baseline justify-between"><span className="text-[0.85rem] font-semibold uppercase tracking-wider text-[#94A3B8]">{label}</span>{hint && <span className="text-[0.8rem] text-[#64748B]">{hint}</span>}</div>
      {children}
    </div>
  );
}
function Toggle({ on, onClick, label }: { on: boolean; onClick: () => void; label: string }) {
  return (
    <button type="button" role="switch" aria-checked={on} aria-label={label} onClick={onClick}
      className={`relative h-7 w-12 rounded-full transition ${on ? "bg-[#10B981]" : "bg-[#334155]"}`}>
      <span className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all ${on ? "left-6" : "left-1"}`} />
    </button>
  );
}

// Controls for the person who looks after the TV. Hidden behind the gear icon so the TV shows only the display.
export function SettingsDrawer({ open, onClose, screen, setScreen, dept, setDept, autoSwitch, setAutoSwitch, countdown, onPrev, onNext,
  sound, setSound, nextRefresh, error, onOpenWorkshop, onSignOut, userName }: {
  open: boolean; onClose: () => void;
  screen: LoungeScreenName; setScreen: (s: LoungeScreenName) => void;
  dept: DeptFilter; setDept: (d: DeptFilter) => void;
  autoSwitch: boolean; setAutoSwitch: (v: boolean) => void; countdown: number; onPrev: () => void; onNext: () => void;
  sound: boolean; setSound: (v: boolean) => void; nextRefresh: number; error: string | null;
  onOpenWorkshop?: () => void; onSignOut: () => void; userName: string;
}) {
  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40" onClick={onClose}>
      <aside role="dialog" aria-label="TV settings" onClick={(e) => e.stopPropagation()}
        className="flex h-full w-[26rem] max-w-full flex-col overflow-y-auto border-l border-[#1E2A44] bg-[#111827] p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <div><div className="text-[1.2rem] font-bold text-white">TV settings</div><div className="text-[0.85rem] text-[#64748B]">Signed in as {userName}</div></div>
          <button type="button" onClick={onClose} aria-label="Close settings" className="rounded-full px-3 py-1 text-[1.4rem] leading-none text-[#94A3B8] hover:text-white">×</button>
        </div>
        <Row label="Screen"><Seg<LoungeScreenName> value={screen} onChange={setScreen} options={[{ value: "status", label: "Vehicle Status" }, { value: "appointments", label: "Appointments" }]} /></Row>
        <Row label="Department"><Seg<DeptFilter> value={dept} onChange={setDept} options={[{ value: "ALL", label: "All" }, { value: "MECHANICAL", label: "Mechanical" }, { value: "BODYSHOP", label: "Bodyshop" }]} /></Row>
        <Row label="Auto-switch" hint={autoSwitch ? `next in ${countdown}s` : "paused"}>
          <div className="flex items-center justify-between">
            <span className="text-[0.95rem] text-[#CBD5E1]">Change page every 15 seconds</span>
            <Toggle on={autoSwitch} onClick={() => setAutoSwitch(!autoSwitch)} label="Auto-switch" />
          </div>
          <div className="mt-3 flex gap-2">
            <button type="button" onClick={onPrev} className="flex-1 rounded-lg border border-[#334155] py-1.5 text-[0.9rem] text-[#CBD5E1] hover:border-[#3B82F6]">‹ Previous page</button>
            <button type="button" onClick={onNext} className="flex-1 rounded-lg border border-[#334155] py-1.5 text-[0.9rem] text-[#CBD5E1] hover:border-[#3B82F6]">Next page ›</button>
          </div>
        </Row>
        <Row label="Chime when a vehicle is ready">
          <div className="flex items-center justify-between"><span className="text-[0.95rem] text-[#CBD5E1]">{sound ? "On" : "Off"}</span><Toggle on={sound} onClick={() => setSound(!sound)} label="Chime" /></div>
        </Row>
        <Row label="Data" hint={`next refresh in ${nextRefresh}s`}>
          <div className="text-[0.95rem] text-[#CBD5E1]">Source: sandbox data</div>
          {error && <div className="mt-1 text-[0.9rem] text-[#FCA5A5]">Last refresh failed: {error}</div>}
        </Row>
        <div className="mt-auto flex flex-col gap-2 pt-6">
          {onOpenWorkshop && <button type="button" onClick={onOpenWorkshop} className="rounded-lg border border-[#3B82F6] py-2 text-[0.95rem] font-semibold text-[#93C5FD] hover:bg-[#1E3A8A]/40">Switch to Works Manager</button>}
          <button type="button" onClick={onSignOut} className="rounded-lg bg-[#1F2937] py-2 text-[0.95rem] text-[#E2E8F0] hover:bg-[#374151]">Sign out</button>
        </div>
      </aside>
    </div>
  );
}
