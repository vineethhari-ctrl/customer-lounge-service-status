// Mock login (no real authentication yet). BU: log in only once a day, so the login is kept until midnight.
export type Role = "Receptionist" | "WorksManager";
export interface PortalUser { role: Role; name: string; username: string }

export const RECEPTIONIST: PortalUser = { role: "Receptionist", name: "Priya Sharma", username: "REC_DELHI_01" };
export const WORKS_MANAGER: PortalUser = { role: "WorksManager", name: "Neeraj Patel", username: "NP7_3007960" };
export const ROLE_LABEL: Record<Role, string> = { Receptionist: "Receptionist", WorksManager: "Works Manager" };

const KEY = "tml-service-status-daily-login";
const pad = (n: number) => String(n).padStart(2, "0");
const today = () => { const d = new Date(); return `${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(d.getDate())}`; };

// Some browsers block site storage (company-managed profiles, in-app viewers, private modes). The login must still work
// there: fall back to memory (the login then lasts until the page is reloaded).
let memory: { user: PortalUser; day: string } | null = null;

export function loadUser(): PortalUser | null {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) ?? "null");
    if (saved && saved.day === today()) return saved.user as PortalUser;
    localStorage.removeItem(KEY);
    return null;
  } catch {
    return memory && memory.day === today() ? memory.user : null;
  }
}

export function saveUser(user: PortalUser | null) {
  memory = user ? { user, day: today() } : null;
  try {
    if (user) localStorage.setItem(KEY, JSON.stringify(memory));
    else localStorage.removeItem(KEY);
  } catch { /* storage blocked or full: the in-memory login is used */ }
}

// TV / bit.ly link: ?role=frontoffice shows only the Receptionist login.
export function loginRoleFromLink(): Role | null {
  const r = new URLSearchParams(window.location.search).get("role");
  return r === "frontoffice" ? "Receptionist" : r === "worksmanager" ? "WorksManager" : null;
}
