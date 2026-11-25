// Display formatting shared by the screens.

// "MH01EK9921" -> "MH 01 EK 9921" (state, district, series, number). Anything unusual is returned as is.
export function formatReg(reg: string): string {
  const m = reg.toUpperCase().match(/^([A-Z]{2})(\d{1,2})([A-Z]{1,3})(\d{3,4})$/);
  return m ? `${m[1]} ${m[2]} ${m[3]} ${m[4]}` : reg;
}

// Privacy for a lounge TV: first name in full, every other name as an initial.
// "Rajesh K. Verma" -> "Rajesh K. V."   "Sunita Aggarwal" -> "Sunita A."
export function privateName(full: string): string {
  const parts = full.trim().split(/\s+/);
  if (parts.length === 1) return parts[0];
  return [parts[0], ...parts.slice(1).map((p) => `${p.replace(/\./g, "").charAt(0).toUpperCase()}.`)].join(" ");
}
