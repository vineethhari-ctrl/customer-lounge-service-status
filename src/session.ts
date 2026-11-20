export type Role = "frontoffice" | "worksmanager";
export interface Session { role: Role; user: string; day: string }

const KEY = "tml-service-status-session";

// BU: "Log in to be done only once a day". A login is valid for the calendar day it was made on.
export function today(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function loadSession(): Session | null {
  try {
    const s = JSON.parse(localStorage.getItem(KEY) ?? "null");
    if (!s || (s.role !== "frontoffice" && s.role !== "worksmanager")) return null;
    if (s.day !== today()) { localStorage.removeItem(KEY); return null; } // expired at midnight
    return s;
  } catch { return null; }
}
export function saveSession(s: Session | null) {
  if (s) localStorage.setItem(KEY, JSON.stringify(s)); else localStorage.removeItem(KEY);
}

// Screen, filters and role live in the URL, so a bookmark or short link (bit.ly) reopens the same view.
export function readParams() {
  const p = new URLSearchParams(location.search);
  return { screen: p.get("screen"), dept: p.get("dept"), group: p.get("group"), role: p.get("role") };
}
export function writeParams(params: Record<string, string>) {
  const p = new URLSearchParams(params);
  history.replaceState(null, "", `${location.pathname}?${p.toString()}`);
}
