import { useNow } from "../hooks";
import { Icon } from "./Icon";

// White top bar like the other Service Transformation screens: brand, screen name, update time, user.
export function AppHeader({ context, name, role, updatedAt, onSignOut }: {
  context: string; name: string; role: string; updatedAt?: number; onSignOut: () => void;
}) {
  const now = useNow(1000);
  const d = new Date(now);
  const initials = name.split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  return (
    <header className="flex shrink-0 items-center gap-4 border-b border-line bg-card px-6 py-2 shadow-card">
      <div className="flex items-center gap-3 whitespace-nowrap">
        <span className="text-[1.2rem] font-extrabold tracking-[0.08em] text-ink">TATA MOTORS</span>
        <span className="h-6 w-px bg-line" />
        <span className="text-[1rem] font-semibold italic text-ink">Service Transformation</span>
      </div>
      <span className="whitespace-nowrap rounded-full bg-brand-soft px-3 py-1 text-[0.8rem] font-semibold text-brand">{context}</span>
      <div className="ml-auto flex items-center gap-5 whitespace-nowrap text-[0.88rem] text-ink-2">
        {updatedAt !== undefined && (
          <span className="flex items-center gap-2">
            Updated {new Date(updatedAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true })}
            <Icon name="refresh" className="h-[1.1em] w-[1.1em] text-brand" />
          </span>
        )}
        <span>{d.toLocaleDateString("en-IN", { weekday: "short", day: "2-digit", month: "short", year: "numeric" })}
          {" · "}<b className="font-mono text-ink">{d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })}</b></span>
        <div className="flex items-center gap-2.5 border-l border-line pl-5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-soft text-[0.8rem] font-bold text-brand">{initials}</span>
          <div className="leading-tight"><div className="font-semibold text-ink">{name}</div><div className="text-[0.72rem] text-ink-3">{role}</div></div>
        </div>
        <button type="button" onClick={onSignOut} className="font-medium text-brand hover:underline">Sign out</button>
      </div>
    </header>
  );
}
