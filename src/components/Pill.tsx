import type { ReactNode } from "react";

// Soft status chips (light background, strong text).
const TONES = {
  green: "bg-[#e6f6ec] text-[#16794a]",
  red: "bg-[#fdecec] text-[#c0262d]",
  amber: "bg-[#fff3df] text-[#a86200]",
  blue: "bg-[#e7f0fd] text-[#1c5fc0]",
  grey: "bg-[#eef0f4] text-[#566070]",
  teal: "bg-[#e0f5f3] text-[#0d7d76]",
} as const;
export type Tone = keyof typeof TONES;

export function Pill({ tone, children, blink }: { tone: Tone; children: ReactNode; blink?: boolean }) {
  return (
    <span className={`inline-flex items-center whitespace-nowrap rounded-full px-3 py-[0.2em] text-[0.88em] font-semibold leading-none ${TONES[tone]} ${blink ? "blink" : ""}`}>
      {children}
    </span>
  );
}

export function DeptTag({ dept }: { dept: "MECHANICAL" | "BODYSHOP" }) {
  return dept === "BODYSHOP" ? <Pill tone="amber">Bodyshop</Pill> : <Pill tone="blue">Mechanical</Pill>;
}
