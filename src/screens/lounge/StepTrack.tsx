import { LOUNGE_STEPS } from "../../logic";

// One connected progress track: Received - Job Card - In Bay - Washing - Ready.
// Completed steps are green with a tick, the current step is a glowing blue node, later steps are dim.
export function StepTrack({ step }: { step: number }) {
  const allDone = step >= LOUNGE_STEPS.length - 1; // "Ready": every node, including the last, is complete
  return (
    <div className="flex w-full items-start" role="img" aria-label={`Stage: ${LOUNGE_STEPS[Math.min(step, LOUNGE_STEPS.length - 1)]}`}>
      {LOUNGE_STEPS.map((label, i) => {
        const done = i < step || allDone;
        const active = i === step && !allDone;
        return (
          <div key={label} className="relative flex flex-1 flex-col items-center">
            {i > 0 && (
              <span className={`absolute left-[-50%] top-[0.7rem] h-[0.3rem] w-full rounded-full ${i <= step || allDone ? "bg-[#10B981]" : "bg-[#243049]"}`} />
            )}
            <span className={`relative z-10 flex h-[1.5rem] w-[1.5rem] items-center justify-center rounded-full border-[0.2rem] text-[0.85rem] font-black leading-none text-white
              ${done ? "border-[#10B981] bg-[#10B981]" : active ? "border-[#38BDF8] bg-[#2563EB] shadow-[0_0_0_0.35rem_rgba(56,189,248,0.22)]" : "border-[#2B3956] bg-[#111827]"}`}>
              {done ? "✓" : ""}
            </span>
            <span className={`mt-[0.3rem] whitespace-nowrap text-[0.9rem] leading-none ${active ? "font-bold text-[#7DD3FC]" : done ? "text-[#A7B4CC]" : "text-[#5D6B87]"}`}>{label}</span>
          </div>
        );
      })}
    </div>
  );
}
