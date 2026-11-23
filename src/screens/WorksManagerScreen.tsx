import { useState } from "react";
import { BAY_GROUPS } from "../config";
import { dataSource } from "../data/source";
import { Segmented, TopBar } from "../components/TopBar";
import { useNow, useSnapshot } from "../hooks";
import { WorksManagerBoard } from "./WorksManagerBoard";

// Works Manager board as a table, one row per bay (BU whiteboard layout). No tiles, no images.
export function WorksManagerScreen({ onOpenLounge, onSignOut }: { onOpenLounge: () => void; onSignOut: () => void }) {
  const { snapshot, error, nextIn } = useSnapshot();
  const now = useNow(15_000);
  const [group, setGroup] = useState("ALL");

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#0b1730] text-slate-200">
      <TopBar title="Workshop Board" subtitle="Works Manager" onSignOut={onSignOut}>
        <Segmented value={group} onChange={setGroup}
          options={[{ value: "ALL", label: "All bays" }, ...BAY_GROUPS.map((g) => ({ value: g.id, label: `${g.name} (${g.bayCount})` }))]} />
        <button onClick={onOpenLounge}
          className="rounded-md border border-slate-700 px-3 py-1 text-[0.85rem] text-slate-300 hover:text-white">
          Open Lounge View
        </button>
      </TopBar>
      <main className="flex min-h-0 flex-1 flex-col p-4">
        {!snapshot
          ? <div className="m-auto text-[1.2rem] text-slate-400">Loading today's data…</div>
          : <WorksManagerBoard snapshot={snapshot} now={now} group={group} />}
      </main>
      <footer className="flex items-center justify-between border-t border-slate-800 bg-[#06102a] px-5 py-1.5 text-[0.8rem] text-slate-500">
        <span>Data: {dataSource.name}{error ? <span className="ml-2 text-red-400">· last refresh failed</span> : null}</span>
        <span>Next refresh in {nextIn}s</span>
      </footer>
    </div>
  );
}
