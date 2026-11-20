// Short two-tone airport-style chime (WebAudio, no audio files).
export function playChime() {
  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();
    const t = ctx.currentTime;
    [[659.25, 0], [523.25, 0.35]].forEach(([f, d]) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.frequency.setValueAtTime(f, t + d);
      g.gain.setValueAtTime(0.1, t + d);
      g.gain.exponentialRampToValueAtTime(0.001, t + d + 0.5);
      o.connect(g); g.connect(ctx.destination);
      o.start(t + d); o.stop(t + d + 0.55);
    });
  } catch { /* audio not available */ }
}
