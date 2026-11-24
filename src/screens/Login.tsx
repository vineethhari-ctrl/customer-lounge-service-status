import { useState } from "react";
import { RECEPTIONIST, WORKS_MANAGER, type PortalUser, type Role } from "../session";

// Mock login (no real authentication yet). A login lasts for the rest of the day on this device.
// A link with ?role=frontoffice shows only the Receptionist button (for the TV bit.ly link).
export function Login({ onLogin, onlyRole }: { onLogin: (user: PortalUser) => void; onlyRole: Role | null }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const input = "w-full rounded-lg border border-line bg-card px-3 py-2.5 text-[0.95rem] text-ink outline-none transition focus:border-brand focus:ring-2 focus:ring-brand-soft";
  return (
    <div className="flex min-h-screen flex-col bg-page text-ink">
      <header className="flex items-center gap-3 border-b border-line bg-card px-6 py-3 shadow-card">
        <span className="text-[1.2rem] font-extrabold tracking-[0.08em]">TATA MOTORS</span>
        <span className="h-6 w-px bg-line" />
        <span className="font-semibold italic">Service Transformation</span>
      </header>
      <main className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-md rounded-2xl border border-line bg-card p-8 shadow-card">
          <h1 className="m-0 text-[1.4rem] font-semibold">Workshop Service Status</h1>
          <p className="mb-6 mt-1 text-[0.9rem] text-ink-2">Sign in to open the live screens.</p>
          <label className="mb-1 block text-[0.8rem] font-semibold text-ink-2">Username</label>
          <input className={`${input} mb-4`} value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Your user ID" autoComplete="username" />
          <label className="mb-1 block text-[0.8rem] font-semibold text-ink-2">Password</label>
          <input className={`${input} mb-6`} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" autoComplete="current-password" />
          <div className="flex flex-col gap-3">
            {onlyRole !== "WorksManager" && (
              <button type="button" onClick={() => onLogin(RECEPTIONIST)}
                className="rounded-full bg-brand px-4 py-3 text-[0.95rem] font-semibold text-white transition hover:bg-[#1859b3]">
                Customer Lounge · Receptionist
              </button>
            )}
            {onlyRole !== "Receptionist" && (
              <button type="button" onClick={() => onLogin(WORKS_MANAGER)}
                className="rounded-full border border-brand bg-card px-4 py-3 text-[0.95rem] font-semibold text-brand transition hover:bg-brand-soft">
                Workshop Board · Works Manager
              </button>
            )}
          </div>
          <p className="mb-0 mt-6 text-[0.78rem] leading-relaxed text-ink-3">
            You only need to sign in once a day: the login lasts until midnight on this device.
          </p>
        </div>
      </main>
      <footer className="py-3 text-center text-[0.78rem] text-ink-3">Copyright, Confidential, Tata Motors Limited</footer>
    </div>
  );
}
