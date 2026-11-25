import { useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "../components/Icon";
import { playChime } from "../chime";
import { PAGE_SECONDS } from "../config";
import type { Appointment, LoungeVehicle } from "../data/types";
import { formatReg, privateName } from "../format";
import { useNow, useRowSpace, useSnapshot, useTvScale } from "../hooks";
import { customerStatus, fmt12, isSameDay, loungeApptStatus, loungeStep, readyTimeLabel, type LoungeApptStatus } from "../logic";
import type { PortalUser } from "../session";
import { SettingsDrawer, type DeptFilter, type LoungeScreenName } from "./lounge/SettingsDrawer";
import { StepTrack } from "./lounge/StepTrack";
import { Ticker } from "./lounge/Ticker";

// Row heights (rem): never smaller than MIN (still readable from across the room), grow up to MAX to fill the card.
const STATUS_ROW = { min: 4.2, max: 6.2 };
const APPT_ROW = { min: 3.3, max: 4.8 };
const HEAD_REM = 4.5; // column-title row (2.6rem) + footer (1.9rem)

type Slide = { screen: LoungeScreenName; page: number; pages: number };

// Split n rows into the fewest pages that fit, as even as possible (e.g. 19 + 19, not 28 + 10).
function pageSize(n: number, maxPerPage: number): number {
  const pages = Math.max(1, Math.ceil(n / Math.max(1, maxPerPage)));
  return Math.max(1, Math.ceil(n / pages));
}

function Clock() {
  const now = useNow(1000);
  const d = new Date(now);
  const hm = d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true }).replace(" ", " ");
  return (
    <div className="flex items-center gap-5 whitespace-nowrap">
      <span className="text-[1.15rem] text-[#94A3B8]">{d.toLocaleDateString("en-IN", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })}</span>
      <span className="font-mono text-[2.4rem] font-bold leading-none tracking-tight text-white" aria-label="Current time">{hm}</span>
    </div>
  );
}

function KpiCard({ label, value, tone }: { label: string; value: number; tone: "green" | "blue" | "slate" }) {
  const t = {
    green: "border-[#10B981]/60 bg-gradient-to-br from-[#064E3B]/70 to-[#111827] text-[#34D399] shadow-[0_0_2rem_rgba(16,185,129,0.12)]",
    blue: "border-[#3B82F6]/50 bg-gradient-to-br from-[#1E3A8A]/50 to-[#111827] text-[#60A5FA]",
    slate: "border-[#334155] bg-[#111827] text-white",
  }[tone];
  return (
    <div data-kpi={label} data-value={value} className={`flex flex-1 items-center justify-between rounded-2xl border px-6 py-3 ${t}`}>
      <span className="text-[1.2rem] font-semibold uppercase tracking-[0.12em] text-[#CBD5E1]">{label}</span>
      <span className="text-[3.2rem] font-bold leading-none">{value}</span>
    </div>
  );
}

const DEPT_PILL = { MECHANICAL: "bg-[#1E3A8A]/60 text-[#93C5FD]", BODYSHOP: "bg-[#78350F]/60 text-[#FCD34D]" } as const;
const APPT_PILL: Record<LoungeApptStatus, string> = {
  Arrived: "bg-[#064E3B] text-[#6EE7B7]", Expected: "bg-[#1F2937] text-[#CBD5E1]", "On Way": "bg-[#0C4A6E] text-[#7DD3FC]",
};

export function LoungeScreen({ user, onSignOut, onOpenWorkshop }: { user: PortalUser; onSignOut: () => void; onOpenWorkshop?: () => void }) {
  useTvScale(1);
  const { snapshot, error, nextIn } = useSnapshot();
  const now = useNow(10_000);
  const [dept, setDept] = useState<DeptFilter>("ALL");
  const [autoSwitch, setAutoSwitch] = useState(true);
  const [countdown, setCountdown] = useState(PAGE_SECONDS);
  const [slideNo, setSlideNo] = useState(0);
  const [sound, setSound] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { ref: listRef, space } = useRowSpace(HEAD_REM);

  // ---- rows (what customers see), ordered for reading: ready vehicles first, then soonest estimate first
  const vehicles = useMemo(() => (snapshot?.vehicles ?? [])
    .filter((v) => dept === "ALL" || v.dept === dept)
    .sort((a, b) => Number(loungeStep(b) === 4) - Number(loungeStep(a) === 4) || a.edt - b.edt), [snapshot, dept]);
  const appointments = useMemo(() => (snapshot?.appointments ?? [])
    .filter((a) => isSameDay(a.slot, now) && (dept === "ALL" || a.dept === dept))
    .sort((a, b) => a.slot - b.slot), [snapshot, dept, now]);
  const ready = vehicles.filter((v) => loungeStep(v) === 4);

  // ---- slides: Vehicle Status pages, then Appointments pages, then round again
  const perStatus = pageSize(vehicles.length, Math.floor(space / STATUS_ROW.min));
  const perAppt = pageSize(appointments.length, Math.floor(space / APPT_ROW.min));
  const statusRowRem = Math.min(STATUS_ROW.max, space / perStatus);
  const apptRowRem = Math.min(APPT_ROW.max, space / perAppt);
  const slides: Slide[] = useMemo(() => {
    const sp = Math.max(1, Math.ceil(vehicles.length / perStatus)), ap = Math.max(1, Math.ceil(appointments.length / perAppt));
    return [
      ...Array.from({ length: sp }, (_, page): Slide => ({ screen: "status", page, pages: sp })),
      ...Array.from({ length: ap }, (_, page): Slide => ({ screen: "appointments", page, pages: ap })),
    ];
  }, [vehicles.length, appointments.length, perStatus, perAppt]);
  const slide = slides[((slideNo % slides.length) + slides.length) % slides.length];

  const go = (delta: number) => { setSlideNo((n) => n + delta); setCountdown(PAGE_SECONDS); };
  useEffect(() => {
    if (!autoSwitch) return;
    const t = setInterval(() => {
      setCountdown((c) => { if (c <= 1) { setSlideNo((n) => n + 1); return PAGE_SECONDS; } return c - 1; });
    }, 1000);
    return () => clearInterval(t);
  }, [autoSwitch]);
  const setScreen = (s: LoungeScreenName) => {
    const idx = slides.findIndex((x) => x.screen === s);
    setSlideNo(idx < 0 ? 0 : idx); setCountdown(PAGE_SECONDS);
  };

  // Chime when a vehicle becomes ready (new data arrives every 60 s).
  const readySet = useRef<Set<string> | null>(null);
  useEffect(() => {
    if (!snapshot) return;
    const now2 = new Set(snapshot.vehicles.filter((v) => loungeStep(v) === 4).map((v) => v.regNo));
    if (sound && readySet.current && [...now2].some((r) => !readySet.current!.has(r))) playChime();
    readySet.current = now2;
  }, [snapshot, sound]);

  const pageRows = <T,>(rows: T[], per: number) => rows.slice(slide.page * per, slide.page * per + per);
  const inService = vehicles.length - ready.length;

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#0B132B] text-white">
      <header className="flex h-[4.4rem] shrink-0 items-center gap-5 border-b border-[#1E2A44] bg-[#0B132B] px-8">
        <span className="whitespace-nowrap text-[1.5rem] font-extrabold tracking-[0.1em]">TATA MOTORS</span>
        <span className="h-7 w-px bg-[#334155]" />
        <span className="whitespace-nowrap text-[1.2rem] font-medium italic text-[#93C5FD]">Service Transformation</span>
        <span className="whitespace-nowrap rounded-full border border-[#3B82F6]/50 bg-[#1E3A8A]/30 px-4 py-1 text-[0.85rem] font-bold uppercase tracking-[0.18em] text-[#93C5FD]">Customer Lounge</span>
        <div className="ml-auto flex items-center gap-6">
          <Clock />
          <button type="button" onClick={() => setSettingsOpen(true)} aria-label="Open TV settings" title="Settings"
            className="rounded-full p-2 text-[#475569] opacity-60 transition hover:bg-[#1F2937] hover:text-white hover:opacity-100">
            <Icon name="gear" className="h-[1.4rem] w-[1.4rem]" />
          </button>
        </div>
      </header>

      <div className="flex shrink-0 gap-4 px-8 pb-2 pt-4">
        <KpiCard label="Ready for Delivery" value={ready.length} tone="green" />
        <KpiCard label="Vehicles In Service" value={inService} tone="blue" />
        <KpiCard label="Today's Appointments" value={appointments.length} tone="slate" />
      </div>

      <main className="flex min-h-0 flex-1 flex-col px-8 pb-3 pt-2">
        <div ref={listRef} className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-[#1E2A44] bg-[#111827]">
          {!snapshot ? (
            <div className="m-auto text-[1.4rem] text-[#64748B]">Loading today's vehicles…</div>
          ) : slide.screen === "status" ? (
            <StatusList rows={pageRows(vehicles, perStatus)} now={now} slide={slide} total={vehicles.length} rowRem={statusRowRem} />
          ) : (
            <ApptList rows={pageRows(appointments, perAppt)} now={now} slide={slide} total={appointments.length} rowRem={apptRowRem} />
          )}
        </div>
      </main>

      <Ticker ready={ready} />
      <SettingsDrawer open={settingsOpen} onClose={() => setSettingsOpen(false)}
        screen={slide.screen} setScreen={setScreen} dept={dept} setDept={(d) => { setDept(d); setSlideNo(0); }}
        autoSwitch={autoSwitch} setAutoSwitch={(v) => { setAutoSwitch(v); setCountdown(PAGE_SECONDS); }} countdown={countdown} onPrev={() => go(-1)} onNext={() => go(1)}
        sound={sound} setSound={setSound} nextRefresh={nextIn} error={error} onOpenWorkshop={onOpenWorkshop} onSignOut={onSignOut} userName={`${user.name} (Receptionist)`} />
    </div>
  );
}

function ListTitle({ cols }: { cols: { t: string; w: string; right?: boolean }[] }) {
  return (
    <div className="flex h-[2.6rem] shrink-0 items-center border-b border-[#1E2A44] bg-[#0F1A33] px-6 text-[0.95rem] font-semibold uppercase tracking-[0.14em] text-[#7F90B0]">
      {cols.map((c) => <div key={c.t} style={{ width: c.w }} className={c.right ? "text-right" : ""}>{c.t}</div>)}
    </div>
  );
}

// Slim footer of the list card: how many rows in total and which page is showing.
function ListFooter({ slide, total, label }: { slide: Slide; total: number; label: string }) {
  return (
    <div className="flex h-[1.9rem] shrink-0 items-center justify-between border-t border-[#1E2A44] px-6 text-[0.9rem] text-[#64748B]">
      <span>{label}: <b className="text-[#94A3B8]">{total}</b></span>
      {slide.pages > 1 && (
        <span className="flex items-center gap-2">page {slide.page + 1} of {slide.pages}
          {Array.from({ length: slide.pages }, (_, i) => <span key={i} className={`inline-block h-[0.5rem] w-[0.5rem] rounded-full ${i === slide.page ? "bg-[#3B82F6]" : "bg-[#334155]"}`} />)}
        </span>
      )}
    </div>
  );
}

const STATUS_COLS = [{ t: "Vehicle", w: "19%" }, { t: "Customer", w: "13%" }, { t: "Progress", w: "36%" }, { t: "Est. ready", w: "16%" }, { t: "Status", w: "16%", right: true }];

function StatusList({ rows, now, slide, total, rowRem }: { rows: LoungeVehicle[]; now: number; slide: Slide; total: number; rowRem: number }) {
  return (
    <>
      <ListTitle cols={STATUS_COLS} />
      <div className="flex min-h-0 flex-1 flex-col" data-list="status">
        {rows.map((v, i) => {
          const status = customerStatus(v);
          const isReady = status === "Ready for Delivery";
          return (
            <div key={v.regNo} data-row="status" data-status={status}
              className={`flex shrink-0 items-center border-b border-[#1A2540] px-6 ${i % 2 ? "bg-[#0F1A33]/60" : ""} ${isReady ? "bg-[#064E3B]/25" : ""}`} style={{ height: `${rowRem}rem` }}>
              <div style={{ width: "19%" }} className="min-w-0 pr-3">
                <div className="truncate font-mono text-[1.65rem] font-bold leading-tight tracking-wide text-white">{formatReg(v.regNo)}</div>
                <div className="truncate text-[1.1rem] font-semibold leading-tight text-[#60A5FA]">{v.model}</div>
              </div>
              <div style={{ width: "13%" }} className="truncate pr-3 text-[1.45rem] text-[#E2E8F0]">{privateName(v.customer)}</div>
              <div style={{ width: "36%" }} className="pr-8"><StepTrack step={loungeStep(v)} /></div>
              <div style={{ width: "16%" }} className={`whitespace-nowrap font-bold leading-none ${isReady ? "text-[1.7rem] tracking-wide text-[#34D399]" : "text-[2rem] text-white"}`}>{readyTimeLabel(v, now)}</div>
              <div style={{ width: "16%" }} className="flex justify-end">
                <span className={`whitespace-nowrap rounded-full px-4 py-[0.45rem] text-[1.1rem] font-bold leading-none ${isReady ? "bg-[#10B981] text-[#022C22]" : status === "Washing" ? "bg-[#0F766E] text-[#CCFBF1]" : "bg-[#1D4ED8] text-[#DBEAFE]"}`}>{status}</span>
              </div>
            </div>
          );
        })}
        {rows.length === 0 && <div className="m-auto text-[1.4rem] text-[#64748B]">No vehicles in the workshop right now.</div>}
      </div>
      <ListFooter slide={slide} total={total} label="Vehicles" />
    </>
  );
}

const APPT_COLS = [{ t: "Slot time", w: "11%" }, { t: "Vehicle no.", w: "17%" }, { t: "Model", w: "11%" }, { t: "Customer", w: "15%" }, { t: "Service advisor", w: "19%" }, { t: "Department", w: "13%" }, { t: "Status", w: "14%", right: true }];

function ApptList({ rows, now, slide, total, rowRem }: { rows: Appointment[]; now: number; slide: Slide; total: number; rowRem: number }) {
  return (
    <>
      <ListTitle cols={APPT_COLS} />
      <div className="flex min-h-0 flex-1 flex-col" data-list="appointments">
        {rows.map((a, i) => {
          const st = loungeApptStatus(a, now);
          return (
            <div key={a.id} data-row="appointment" data-status={st}
              className={`flex shrink-0 items-center border-b border-[#1A2540] px-6 ${i % 2 ? "bg-[#0F1A33]/60" : ""}`} style={{ height: `${rowRem}rem` }}>
              <div style={{ width: "11%" }} className="font-mono text-[1.6rem] font-bold text-[#60A5FA]">{fmt12(a.slot)}</div>
              <div style={{ width: "17%" }} className="truncate font-mono text-[1.5rem] font-bold tracking-wide text-white">{formatReg(a.regNo)}</div>
              <div style={{ width: "11%" }} className="truncate pr-2 text-[1.3rem] text-[#93C5FD]">{a.model}</div>
              <div style={{ width: "15%" }} className="truncate pr-2 text-[1.4rem] text-[#E2E8F0]">{privateName(a.customer)}</div>
              <div style={{ width: "19%" }} className="truncate pr-2 text-[1.3rem] text-[#CBD5E1]">{a.advisor}</div>
              <div style={{ width: "13%" }}><span className={`rounded-full px-3 py-[0.3rem] text-[1rem] font-semibold ${DEPT_PILL[a.dept]}`}>{a.dept === "BODYSHOP" ? "Bodyshop" : "Mechanical"}</span></div>
              <div style={{ width: "14%" }} className="flex justify-end"><span className={`whitespace-nowrap rounded-full px-4 py-[0.4rem] text-[1.1rem] font-bold ${APPT_PILL[st]}`}>{st}</span></div>
            </div>
          );
        })}
        {rows.length === 0 && <div className="m-auto text-[1.4rem] text-[#64748B]">No appointments today.</div>}
      </div>
      <ListFooter slide={slide} total={total} label="Appointments" />
    </>
  );
}
