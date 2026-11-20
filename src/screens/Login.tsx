import { useState } from "react";
import type { Role } from "../session";

// Mock login (no real authentication yet). The choice is remembered on the device,
// so a TV only needs to log in once (BU: "login at least once").
export function Login({ onLogin }: { onLogin: (role: Role, user: string) => void }) {
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
          <button onClick={() => onLogin("frontoffice", user || "Front Office")}
            className="w-full rounded bg-cyan-600 py-3 font-semibold text-white hover:bg-cyan-500">
            Front Office · Appointments &amp; Vehicle Status
          </button>
          <button onClick={() => onLogin("worksmanager", user || "Works Manager")}
            className="w-full rounded bg-slate-700 py-3 font-semibold text-white hover:bg-slate-600">
            Works Manager · Bay Board
          </button>
        </div>
        <p className="mt-6 text-[0.75rem] leading-relaxed text-slate-500">
          Tip for TVs: after logging in, bookmark this page or add it to the home screen. The screen and filters are
          kept in the link, and the login is remembered on this device.
        </p>
      </div>
    </div>
  );
}
