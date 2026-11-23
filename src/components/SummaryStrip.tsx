// Summary counts shown above a table. Always count the SAME rows that the table shows
// (BU: the number in the summary must match the number of rows with that status value).
export interface SummaryItem { label: string; value: number; tone: string }
export interface SummaryGroup { title: string; items: SummaryItem[] }

export function SummaryStrip({ groups }: { groups: SummaryGroup[] }) {
  return (
    <div className="flex flex-wrap items-stretch gap-4 text-[0.95rem]">
      {groups.map((g) => (
        <div key={g.title} className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/70 px-3 py-1.5">
          <span className="mr-1 text-[0.7rem] font-bold uppercase tracking-wider text-slate-500">{g.title}</span>
          {g.items.map((it) => (
            <div key={it.label} className="flex items-baseline gap-1.5 rounded-md bg-slate-800/60 px-3 py-0.5">
              <span className={`text-[1.4rem] font-bold ${it.tone}`}>{it.value}</span>
              <span className="text-slate-400">{it.label}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
