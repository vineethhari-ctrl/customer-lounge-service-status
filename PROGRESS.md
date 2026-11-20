# PROGRESS — Customer Lounge & Works Manager Service Status Portal

Standalone repo (exported from Google AI Studio app "Tata Motors TMSA-CV Workshop Portal & FIDS").
Not related to tml-appointment-journey or TML-ST-Admin; don't mix them.

## What the app is
- Single-page React 18 + TypeScript + Vite 5 + Tailwind v4 app; nearly all logic is in `src/App.tsx` (~2.9k lines).
- Mock login with two roles (no real auth):
  - **Receptionist / Customer Lounge (FIDS-style display):** tabs 1. Appointments, 2. Walk-In Customers,
    3. Vehicle Status. Appointments and Walk-In switch automatically every 15 s (can be paused).
  - **Works Manager / Workshop Board:** 12 bays (6 Mechanical, 6 Bodyshop), bay and pipeline views,
    milestone stepper (Mechanical 10 stages; Bodyshop 11, which adds "Customer estimate approval"),
    PTD-delay blinking alarms, filters by department, bay and work type.
- Department filter: All / Mechanical / Bodyshop. Data refreshes every 20 s (a random vehicle moves on a stage).
  An optional airport-style chime (WebAudio) plays on refresh when sound is on.
- Data is in-memory mock (`INITIAL_VEHICLES`, `WORKSHOP_BAYS`). Customer names and vehicle numbers are sandbox data; keep them.

## Run / build
- `npm install --legacy-peer-deps`, then `npm run dev` (port 3000), `npm run lint` (tsc), `npm run build` (output in `dist/`).
- CI: `.github/workflows/static.yml` builds on push to `main` and deploys `dist/` to GitHub Pages.

## Done
- 2026-11-20: Reviewed the repo. Install, lint and build all pass on Node 22 (bundle: JS 232 kB, 63 kB gzipped).
- 2026-11-20: Secret check: only `.env.example` (placeholders) is tracked, and `.gitignore` excludes `.env*`.
  History scanned: the old `server.ts` (removed in 6dcf7d9) only read `process.env.GEMINI_API_KEY`; no keys found.

## In progress
- Nothing. Waiting for the user's instructions.

## Next step
- Ask the user for priorities. Candidates are in the open questions below.

## Decisions
- Keep sandbox customer and vehicle data as is.
- `npm install` creates `package-lock.json`. It was NOT committed: the repo tracks `bun.lock` and CI uses `npm install`.

## Open questions / issues found
- Car images use absolute paths (`/images/cars/...`) while `vite.config.ts` uses `base: './'`. On GitHub Pages
  (served under `/customer-lounge-service-status/`) the images will probably 404. Fix: use `import.meta.env.BASE_URL`.
- `index.html` loads the Tailwind Play CDN as well as `@tailwindcss/vite`, so Tailwind loads twice. Remove the CDN?
- No README (it was deleted from history). Add one?
- `metadata.json` mentions Gemini / "AI Telecaller VOC Engine", but the server code is gone. Is that feature dropped?
- The login form is pre-filled with ID `NP7_3007960` and staff names. Is that a real employee ID? The repo is public.
- `package.json` name is still `react-example`. Rename it?
- `App.tsx` is a single large file. Split it into components or data modules?
