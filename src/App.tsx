import { useEffect, useRef, useState } from "react";
import { BAY_GROUPS, TAB_SWITCH_SECONDS, type Dept } from "./config";
import { dataSource } from "./data/source";
import { playChime } from "./chime";
import { Segmented, TopBar } from "./components/TopBar";
import { useNow, useSnapshot } from "./hooks";
import { loungeStatus } from "./logic";
import { AppointmentsList } from "./screens/AppointmentsList";
import { Login } from "./screens/Login";
import { VehicleStatusList } from "./screens/VehicleStatusList";
import { WorksManagerBoard } from "./screens/WorksManagerBoard";
import { loadSession, readParams, saveSession, today, writeParams, type Role, type Session } from "./session";

type FoScreen = "appointments" | "status";
type DeptFilter = Dept | "ALL";

const initial = readParams();
const asDept = (v: string | null): DeptFilter => (v === "MECHANICAL" || v === "BODYSHOP" ? v : "ALL");
const asGroup = (v: string | null) => (v && BAY_GROUPS.some((g) => g.id === v) ? v : "ALL");

export default function App() {
  const [session, setSession] = useState<Session | null>(loadSession);
  const login = (role: Role, user: string) => { const s = { role, user, day: today() }; saveSession(s); setSession(s); };
  const logout = () => { saveSession(null); setSession(null); history.replaceState(null, "", location.pathname); };

  // Once a day: after midnight the TV goes back to the login screen (the link and filters are kept).
  useEffect(() => {
    if (!session) return;
    const t = setInterval(() => { if (!loadSession()) setSession(null); }, 60_000);
    return () => clearInterval(t);
  }, [session]);

  if (!session) return <Login onLogin={login} onlyRole={initial.role === "frontoffice" || initial.role === "worksmanager" ? initial.role : undefined} />;
  return session.role === "worksmanager"
    ? <WorksManagerApp onSignOut={logout} />
    : <FrontOfficeApp onSignOut={logout} />;
}

function Shell({ children, footer }: { children: React.ReactNode; footer: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#0b1730] text-slate-200">
      {children}
      <footer className="flex items-center justify-between border-t border-slate-800 bg-[#06102a] px-5 py-1.5 text-[0.8rem] text-slate-500">
        {footer}
      </footer>
    </div>
  );
}

function DataFooter({ nextIn, error }: { nextIn: number; error: string | null }) {
  return (
    <>
      <span>Data: {dataSource.name}{error ? <span className="ml-2 text-red-400">· last refresh failed</span> : null}</span>
      <span>Next refresh in {nextIn}s</span>
    </>
  );
}

function FrontOfficeApp({ onSignOut }: { onSignOut: () => void }) {
  const { snapshot, error, nextIn } = useSnapshot();
  const now = useNow(15_000);
  const [screen, setScreen] = useState<FoScreen>(initial.screen === "status" ? "status" : "appointments");
  const [dept, setDept] = useState<DeptFilter>(asDept(initial.dept));
  const [autoSwitch, setAutoSwitch] = useState(true);
  const [countdown, setCountdown] = useState(TAB_SWITCH_SECONDS);
  const [sound, setSound] = useState(false);

  useEffect(() => { writeParams({ role: "frontoffice", screen, dept }); }, [screen, dept]);

  useEffect(() => {
    if (!autoSwitch) return;
    setCountdown(TAB_SWITCH_SECONDS);
    const t = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) { setScreen((s) => (s === "appointments" ? "status" : "appointments")); return TAB_SWITCH_SECONDS; }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [autoSwitch]);

  // Chime when a vehicle becomes ready for delivery.
  const readySet = useRef<Set<string> | null>(null);
  useEffect(() => {
    if (!snapshot) return;
    const ready = new Set(snapshot.vehicles.filter((v) => loungeStatus(v, snapshot.fetchedAt) === "Ready").map((v) => v.regNo));
    if (sound && readySet.current && [...ready].some((r) => !readySet.current!.has(r))) playChime();
    readySet.current = ready;
  }, [snapshot, sound]);

  return (
    <Shell footer={<DataFooter nextIn={nextIn} error={error} />}>
      <TopBar title={screen === "appointments" ? "Today's Appointments" : "Vehicle Status"} subtitle="Customer Lounge" onSignOut={onSignOut}>
        <Segmented<FoScreen> value={screen} onChange={(s) => { setScreen(s); setCountdown(TAB_SWITCH_SECONDS); }}
          options={[{ value: "appointments", label: "Appointments" }, { value: "status", label: "Vehicle Status" }]} />
        <button onClick={() => setAutoSwitch(!autoSwitch)}
          className="rounded-md border border-slate-700 px-3 py-1 text-[0.85rem] text-slate-300 hover:text-white">
          {autoSwitch ? <>Auto-switch in <b className="text-cyan-300">{countdown}s</b> · Pause</> : "Auto-switch off · Resume"}
        </button>
        <Segmented<DeptFilter> value={dept} onChange={setDept}
          options={[{ value: "ALL", label: "All" }, { value: "MECHANICAL", label: "Mechanical" }, { value: "BODYSHOP", label: "Bodyshop" }]} />
        <button onClick={() => setSound(!sound)} title="Chime when a vehicle is ready"
          className={`rounded-md border px-3 py-1 text-[0.85rem] ${sound ? "border-cyan-600 text-cyan-300" : "border-slate-700 text-slate-500"}`}>
          Chime {sound ? "on" : "off"}
        </button>
      </TopBar>
      <main className="flex min-h-0 flex-1 flex-col p-4">
        {!snapshot ? <Loading /> : screen === "appointments"
          ? <AppointmentsList snapshot={snapshot} now={now} dept={dept} />
          : <VehicleStatusList snapshot={snapshot} now={now} dept={dept} />}
      </main>
    </Shell>
  );
}

function WorksManagerApp({ onSignOut }: { onSignOut: () => void }) {
  const { snapshot, error, nextIn } = useSnapshot();
  const now = useNow(15_000);
  const [group, setGroup] = useState(asGroup(initial.group));
  useEffect(() => { writeParams({ role: "worksmanager", screen: "bays", group }); }, [group]);

  return (
    <Shell footer={<DataFooter nextIn={nextIn} error={error} />}>
      <TopBar title="Bay Board" subtitle="Works Manager" onSignOut={onSignOut}>
        <Segmented value={group} onChange={setGroup}
          options={[{ value: "ALL", label: "All bays" }, ...BAY_GROUPS.map((g) => ({ value: g.id, label: `${g.name} (${g.bayCount})` }))]} />
      </TopBar>
      <main className="flex min-h-0 flex-1 flex-col p-4">
        {!snapshot ? <Loading /> : <WorksManagerBoard snapshot={snapshot} now={now} group={group} />}
      </main>
    </Shell>
  );
}

function Loading() {
  return <div className="m-auto text-[1.2rem] text-slate-400">Loading today's data…</div>;
}
