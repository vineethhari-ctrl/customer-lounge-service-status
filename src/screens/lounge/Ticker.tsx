import { useEffect, useState } from "react";
import type { LoungeVehicle } from "../../data/types";
import { formatReg } from "../../format";

// Bottom announcement bar: one "ready for delivery" message at a time, rotating every few seconds.
export function Ticker({ ready }: { ready: LoungeVehicle[] }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (ready.length < 2) return;
    const t = setInterval(() => setI((n) => n + 1), 7000);
    return () => clearInterval(t);
  }, [ready.length]);
  const v = ready.length ? ready[i % ready.length] : null;
  return (
    <div className="flex h-[3.6rem] shrink-0 items-center gap-4 overflow-hidden border-t border-[#1E2A44] bg-gradient-to-r from-[#064E3B] via-[#065F46] to-[#0B132B] px-6">
      {v ? (
        <>
          <span key={v.regNo} className="ticker-in flex-1 truncate text-[1.35rem] font-semibold text-white">
            <span className="mr-3 text-[#FBBF24]">★</span>
            Vehicle <b className="font-mono tracking-wide">{formatReg(v.regNo)}</b> ({v.model}) is ready for delivery
            <span className="text-[#A7F3D0]"> — Please contact Service Advisor <b className="text-white">{v.advisor}</b></span>
          </span>
          {ready.length > 1 && <span className="whitespace-nowrap text-[0.95rem] text-[#A7F3D0]">{(i % ready.length) + 1} of {ready.length} ready</span>}
        </>
      ) : (
        <span className="flex-1 truncate text-[1.2rem] text-[#94A3B8]">Welcome to Tata Motors Service — we will announce your vehicle here as soon as it is ready.</span>
      )}
    </div>
  );
}
