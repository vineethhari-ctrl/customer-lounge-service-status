import { useState } from "react";
import type { Role } from "../session";

// Mock login (no real authentication yet). A login lasts for the rest of the day on this device
// (BU: "log in only once a day"). A link with ?role=frontoffice shows only the Receptionist login (for the TV).
export function Login({ onLogin, onlyRole }: { onLogin: (role: Role, user: string) => void; onlyRole?: Role }) {
  const [user, setUser] = useState("");
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0b1730] p-6">
      <div className="w-full max-w-md rounded-xl border border-slate-700 bg-slate-900 p-8 shadow-2xl">
        <div className="text-[1.6rem] font-extrabold tracking-wide text-white">TATA MOTORS</div>
        <div className="mb-6 text-[0.85rem] uppercase tracking-widest text-slate-400">Workshop Service Status</div>
        <label className="mb-1 block text-[0.85rem] text-slate-300">User ID</label>
        <input value={user} onChange={(e) => setUser(e.target.value)} placeholder="Your DMS user ID"
          className="mb-3 w-full rounded border border-slate-600 bg-slate-800 px-3 py-2 text-white outline-none focus:border-cyan-500" />
        <label className="mb-1 block text-[0.85rem] text-slate-300">Password</label>
        <input type="password" placeholder="••••••••"
          className="mb-6 w-full rounded border border-slate-600 bg-slate-800 px-3 py-2 text-white outline-none focus:border-cyan-500" />
        <div className="space-y-2">
          {onlyRole !== "worksmanager" && <button onClick={() => onLogin("frontoffice", user || "Receptionist")}
            className="w-full rounded bg-cyan-600 py-3 font-semibold text-white hover:bg-cyan-500">
            Receptionist · Appointments &amp; Vehicle Status
          </button>}
          {onlyRole !== "frontoffice" && <button onClick={() => onLogin("worksmanager", user || "Works Manager")}
            className="w-full rounded bg-slate-700 py-3 font-semibold text-white hover:bg-slate-600">
            Works Manager · Bay Board
          </button>}
        </div>
        <p className="mt-6 text-[0.75rem] leading-relaxed text-slate-500">
          Log in once a day. The login lasts until midnight on this device. For TVs, open the short (bit.ly) link,
          save it as a bookmark or home-screen icon, and log in each morning.
        </p>
      </div>
    </div>
  );
}
