import type { ReactNode } from "react";

// Rounded filter pills; the selected one is light blue with blue text.
export function PillGroup<T extends string>({ value, options, onChange, label }: {
  value: T; options: { value: T; label: ReactNode }[]; onChange: (v: T) => void; label: string;
}) {
  return (
    <div role="group" aria-label={label} className="flex items-center gap-0.5 rounded-full bg-card px-1.5 py-1 shadow-card ring-1 ring-line">
      {options.map((o) => (
        <button key={o.value} type="button" aria-pressed={value === o.value} onClick={() => onChange(o.value)}
          className={`whitespace-nowrap rounded-full px-4 py-1 text-[0.92rem] transition ${value === o.value ? "bg-brand-soft font-semibold text-brand" : "text-ink-2 hover:text-ink"}`}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

// White card that holds the filters above a table.
export function FilterBar({ children }: { children: ReactNode }) {
  return <div className="flex shrink-0 flex-wrap items-center gap-3 rounded-xl border border-line bg-card px-4 py-2 shadow-card">{children}</div>;
}

export function ToolButton({ children, onClick, primary, title }: { children: ReactNode; onClick: () => void; primary?: boolean; title?: string }) {
  return (
    <button type="button" onClick={onClick} title={title}
      className={`whitespace-nowrap rounded-full px-4 py-1.5 text-[0.9rem] font-medium transition ${primary ? "bg-brand text-white hover:bg-[#1859b3]" : "border border-line bg-card text-ink-2 hover:border-brand hover:text-brand"}`}>
      {children}
    </button>
  );
}
