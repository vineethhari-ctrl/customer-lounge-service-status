import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { DMS_REFRESH_SECONDS, PAGE_SECONDS } from "./config";
import { dataSource } from "./data/source";
import type { Snapshot } from "./data/types";

export function useNow(intervalMs = 1000): number {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(t);
  }, [intervalMs]);
  return now;
}

// Loads data now and every DMS_REFRESH_SECONDS. Returns the snapshot and seconds to next refresh.
export function useSnapshot(): { snapshot: Snapshot | null; error: string | null; nextIn: number } {
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [nextIn, setNextIn] = useState(DMS_REFRESH_SECONDS);
  useEffect(() => {
    let alive = true;
    const load = () =>
      dataSource.fetchSnapshot(Date.now())
        .then((s) => { if (alive) { setSnapshot(s); setError(null); } })
        .catch((e) => { if (alive) setError(String(e)); });
    load();
    let left = DMS_REFRESH_SECONDS;
    const t = setInterval(() => {
      left -= 1;
      if (left <= 0) { left = DMS_REFRESH_SECONDS; load(); }
      setNextIn(left);
    }, 1000);
    return () => { alive = false; clearInterval(t); };
  }, []);
  return { snapshot, error, nextIn };
}

// Measures the height (in rem) left for table rows, so TVs never need scrolling.
export function useRowSpace(headerRem: number) {
  const ref = useRef<HTMLDivElement>(null);
  const [space, setSpace] = useState(30);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
      setSpace(Math.max(3, el.clientHeight / rem - headerRem));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [headerRem]);
  return { ref, space };
}

// Rotates through pages of a list every PAGE_SECONDS.
export function usePager<T>(items: T[], perPage: number) {
  const pages = Math.max(1, Math.ceil(items.length / perPage));
  const [page, setPage] = useState(0);
  useEffect(() => {
    if (pages <= 1) { setPage(0); return; }
    const t = setInterval(() => setPage((p) => (p + 1) % pages), PAGE_SECONDS * 1000);
    return () => clearInterval(t);
  }, [pages]);
  const current = Math.min(page, pages - 1);
  return { pageItems: items.slice(current * perPage, current * perPage + perPage), page: current, pages };
}

// Scale all text with the screen width so a 43" TV and a laptop both read well.
export function useTvScale() {
  useLayoutEffect(() => {
    const root = document.documentElement;
    const previous = root.style.fontSize;
    root.style.fontSize = "clamp(13px, 0.9vw, 26px)";
    return () => { root.style.fontSize = previous; };
  }, []);
}
