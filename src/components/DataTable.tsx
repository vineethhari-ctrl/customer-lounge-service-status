import type { ReactNode } from "react";
import { usePager, useRowsThatFit } from "../hooks";

export interface Column<T> {
  key: string;
  header: ReactNode;
  width: string;      // e.g. "w-[10%]"
  className?: string; // cell styling (not applied to the header)
  render: (row: T) => ReactNode;
}

const ROW_REM = 2.6;
const CHROME_REM = 5.5; // table header + footer

// TV-friendly table: rows always fit the screen; extra rows are shown page by page.
export function DataTable<T>({ columns, rows, rowKey, rowClassName, empty, countLabel }: {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  rowClassName?: (row: T) => string;
  empty: string;
  countLabel: string;
}) {
  const { ref, rows: perPage } = useRowsThatFit(ROW_REM, CHROME_REM);
  const { pageItems, page, pages } = usePager(rows, perPage);
  return (
    <div ref={ref} className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-slate-700/70 bg-slate-900/60">
      <table className="w-full table-fixed border-collapse">
        <thead>
          <tr className="h-[2.6rem] bg-slate-800 text-left text-[0.8rem] font-bold uppercase tracking-wider text-slate-300">
            {columns.map((c) => <th key={c.key} className={`px-3 ${c.width}`}>{c.header}</th>)}
          </tr>
        </thead>
        <tbody>
          {pageItems.map((r, i) => (
            <tr key={rowKey(r)} style={{ height: `${ROW_REM}rem` }}
              className={`border-t border-slate-800 ${i % 2 ? "bg-slate-900/40" : ""} ${rowClassName?.(r) ?? ""}`}>
              {columns.map((c) => <td key={c.key} className={`truncate px-3 ${c.className ?? ""}`}>{c.render(r)}</td>)}
            </tr>
          ))}
          {rows.length === 0 && (
            <tr><td colSpan={columns.length} className="px-3 py-10 text-center text-slate-400">{empty}</td></tr>
          )}
        </tbody>
      </table>
      <div className="mt-auto flex h-[2.4rem] items-center justify-between border-t border-slate-800 px-3 text-[0.85rem] text-slate-400">
        <span>{countLabel}</span>
        {pages > 1 && (
          <span className="flex items-center gap-2">
            Page {page + 1} of {pages}
            {Array.from({ length: pages }, (_, i) => (
              <span key={i} className={`inline-block h-2 w-2 rounded-full ${i === page ? "bg-cyan-400" : "bg-slate-600"}`} />
            ))}
          </span>
        )}
      </div>
    </div>
  );
}
