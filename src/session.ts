export type Role = "frontoffice" | "worksmanager";
export interface Session { role: Role; user: string }

const KEY = "tml-service-status-session";

export function loadSession(): Session | null {
  try {
    const s = JSON.parse(localStorage.getItem(KEY) ?? "null");
    return s && (s.role === "frontoffice" || s.role === "worksmanager") ? s : null;
  } catch { return null; }
}
export function saveSession(s: Session | null) {
  if (s) localStorage.setItem(KEY, JSON.stringify(s)); else localStorage.removeItem(KEY);
}

// Screen and filters live in the URL so a bookmark reopens the same view.
export function readParams() {
  const p = new URLSearchParams(location.search);
  return { screen: p.get("screen"), dept: p.get("dept"), group: p.get("group") };
}
export function writeParams(params: Record<string, string>) {
  const p = new URLSearchParams(params);
  history.replaceState(null, "", `${location.pathname}?${p.toString()}`);
}
