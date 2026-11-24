import type { ReactNode } from "react";
import { usePager, useRowSpace } from "../hooks";

export interface Column<T> {
  key: string;
  header: ReactNode;
  width: string;      // e.g. "w-[10%]"
  className?: string; // cell styling (not applied to the header)
  render: (row: T) => ReactNode;
}

const MAX_ROW_REM = 2.6;  // roomy rows when there are few
const MIN_ROW_REM = 1.3;  // most compact row that is still readable on a TV
const CHROME_REM = 4.4;   // table header (2.4rem) + footer (2rem)

// TV-friendly table. BU: the summary count must match what is on screen, so ALL rows are shown at once;
// rows get more compact (down to MIN_ROW_REM) before the table falls back to showing page by page.
export function DataTable<T>({ columns, rows, rowKey, rowClassName, empty, countLabel }: {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  rowClassName?: (row: T) => string;
  empty: string;
  countLabel: string;
}) {
  const { ref, space } = useRowSpace(CHROME_REM);
  // Everything fits: one screen. Otherwise split into EVEN pages (e.g. 19 + 19, not 28 + 10).
  const maxPerPage = Math.max(3, Math.floor(space / MIN_ROW_REM));
  const pageCount = Math.max(1, Math.ceil(rows.length / maxPerPage));
  const perPage = Math.max(1, Math.ceil(rows.length / pageCount));
  const rowRem = Math.min(MAX_ROW_REM, space / perPage);
  const { pageItems, page, pages } = usePager(rows, perPage);
  return (
    <div ref={ref} className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-line bg-card shadow-card">
      <table className="w-full table-fixed border-collapse">
        <thead>
          <tr className="h-[2.4rem] border-b border-line bg-head text-left text-[0.85rem] font-semibold leading-tight text-ink">
            {columns.map((c) => <th key={c.key} className={`px-3 ${c.width}`}>{c.header}</th>)}
          </tr>
        </thead>
        <tbody className="text-ink-2">
          {pageItems.map((r, i) => (
            <tr key={rowKey(r)} style={{ height: `${rowRem}rem` }}
              className={`border-t border-line/70 ${i % 2 ? "bg-zebra" : "bg-card"} ${rowClassName?.(r) ?? ""}`}>
              {columns.map((c) => <td key={c.key} className={`truncate px-3 leading-none ${c.className ?? ""}`}>{c.render(r)}</td>)}
            </tr>
          ))}
          {rows.length === 0 && (
            <tr><td colSpan={columns.length} className="px-3 py-10 text-center text-ink-3">{empty}</td></tr>
          )}
        </tbody>
      </table>
      <div className="mt-auto flex h-[2rem] shrink-0 items-center justify-between border-t border-line px-3 text-[0.85rem] text-ink-3">
        <span>{countLabel}</span>
        {pages > 1 && (
          <span className="flex items-center gap-2">
            Showing {page * perPage + 1}–{Math.min(rows.length, (page + 1) * perPage)} of {rows.length} · summary counts cover all {rows.length} · page {page + 1} of {pages}
            {Array.from({ length: pages }, (_, i) => (
              <span key={i} className={`inline-block h-2 w-2 rounded-full ${i === page ? "bg-brand" : "bg-line"}`} />
            ))}
          </span>
        )}
      </div>
    </div>
  );
}
