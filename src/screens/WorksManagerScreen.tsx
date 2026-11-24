import { useState } from "react";
import { AppHeader } from "../components/AppHeader";
import { FilterBar, PillGroup, ToolButton } from "../components/PillGroup";
import { BAY_GROUPS } from "../config";
import { dataSource } from "../data/source";
import { useNow, useSnapshot } from "../hooks";
import { ROLE_LABEL, type PortalUser } from "../session";
import { WorksManagerBoard } from "./WorksManagerBoard";

// Works Manager board as a table, one row per bay (BU paper). No tiles, no images.
export function WorksManagerScreen({ user, onOpenLounge, onSignOut }: { user: PortalUser; onOpenLounge: () => void; onSignOut: () => void }) {
  const { snapshot, error, nextIn } = useSnapshot();
  const now = useNow(15_000);
  const [group, setGroup] = useState("ALL");

  const filterBar = (
    <FilterBar>
      <PillGroup label="Bay group" value={group} onChange={setGroup}
        options={[{ value: "ALL", label: "All bays" }, ...BAY_GROUPS.map((g) => ({ value: g.id, label: `${g.name} (${g.bayCount})` }))]} />
      <div className="ml-auto"><ToolButton onClick={onOpenLounge}>Open Lounge View</ToolButton></div>
    </FilterBar>
  );

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-page text-ink">
      <AppHeader context="Workshop Board" name={user.name} role={ROLE_LABEL[user.role]} updatedAt={snapshot?.fetchedAt} onSignOut={onSignOut} />
      <main className="flex min-h-0 flex-1 flex-col gap-2.5 px-4 pb-1 pt-3">
        {!snapshot
          ? <div className="m-auto text-[1.1rem] text-ink-3">Loading today's data…</div>
          : <WorksManagerBoard snapshot={snapshot} now={now} group={group} filterBar={filterBar} />}
      </main>
      <footer className="flex shrink-0 items-center justify-between px-6 pb-1.5 text-[0.78rem] text-ink-3">
        <span>Data: {dataSource.name}{error ? <span className="ml-2 text-kpi-red">· last refresh failed</span> : null}</span>
        <span>Next refresh in {nextIn}s</span>
      </footer>
    </div>
  );
}
