// Row of big coloured numbers with an icon and label (like the other Service Transformation screens).
// Every number is counted from the SAME rows the table shows (BU: summary must match the table).
import { Icon, type IconName } from "./Icon";

export type KpiTone = "blue" | "red" | "amber" | "green" | "purple" | "teal" | "grey";
const TONE: Record<KpiTone, string> = {
  blue: "text-kpi-blue", red: "text-kpi-red", amber: "text-kpi-amber", green: "text-kpi-green",
  purple: "text-kpi-purple", teal: "text-kpi-teal", grey: "text-ink-2",
};

export interface Kpi {
  label: string;
  value: number;
  tone: KpiTone;
  icon: IconName;
  group?: string; // small caption above the first item of a group, e.g. "Status", "Time"
}

export function KpiStrip({ items }: { items: Kpi[] }) {
  return (
    <div className="flex shrink-0 items-stretch rounded-xl border border-line bg-card px-2 py-2 shadow-card">
      {items.map((k, i) => (
        <div key={k.label} data-kpi={k.label} data-value={k.value}
          className={`relative flex flex-1 flex-col items-center justify-end gap-0.5 px-3 ${i ? (k.group ? "border-l-2 border-line" : "border-l border-line") : ""}`}>
          {k.group && <span className="absolute left-3 top-0 text-[0.62rem] font-bold uppercase leading-none tracking-wider text-ink-3">{k.group}</span>}
          <span className={`text-[1.9rem] font-medium leading-none ${TONE[k.tone]}`}>{String(k.value).padStart(2, "0")}</span>
          <span className="mt-1 flex items-center gap-1.5 whitespace-nowrap text-[0.92rem] text-ink-2">
            <Icon name={k.icon} className="h-[1.1em] w-[1.1em] text-ink-3" />{k.label}
          </span>
        </div>
      ))}
    </div>
  );
}
