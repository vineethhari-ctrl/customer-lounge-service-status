# PROGRESS — Customer Lounge & Works Manager Service Status Portal

Standalone repo (exported from Google AI Studio). Not related to tml-appointment-journey or TML-ST-Admin.
Live (main): https://vineethhari-ctrl.github.io/customer-lounge-service-status/ (GitHub Pages; every push to main deploys).

## What the app is (branch feature/bu-simple-list-views)
- React 18 + TS + Vite 5 + Tailwind v4. Simple table screens for a 43" TV, redesigned from BU's whiteboard and notebook input (2026-11-20).
- **Front Office:** Today's Appointments (list, no walk-in split) and Vehicle Status (today's EDT vehicles only,
  customer name, stages incl. Washing, no RO / promise date). Auto-switch every 15 s, All/Mechanical/Bodyshop filter, chime when a vehicle is ready.
- **Works Manager Bay Board:** one row per bay: Bay | Technician | Vehicle | Start Plan/Actual | End Plan | Elapsed | Status | Time.
  Filter by bay group (S1/S2/S3), summary counts, auto-paging when rows don't fit.
- Code: `src/config.ts` (groups, milestones, timings), `src/logic.ts` (rules), `src/data/` (types, mock source, `source.ts` = swap point for the DMS), `src/screens/`.
- Run: `npm install --legacy-peer-deps && npm run dev`; check: `npm run lint && npm run build`.

## Done
- 2026-11-20: Repo review; build OK; no secrets committed (only `.env.example`; history clean).
- 2026-11-20: Rebuilt the UI as TV-friendly tables on branch `feature/bu-simple-list-views` (old card UI replaced).
  Removed the duplicate Tailwind CDN script. Login is remembered on the device; screen and filters are kept in the URL (bookmarkable).

## In progress
- Waiting for the user to review the branch before merging to main (merging changes the live site).

## Next step
- After approval: merge to main. Then a DMS adapter (`src/data/source.ts`) once the API, credentials and field mapping are known.

## Decisions (user: "Done" status, data from DMS; the rest decided by Claude, to confirm with BU)
- Status values: Yet to start / WIP / Done (from actual start and end time stamps).
- Elapsed = now − actual start (frozen at actual end).
- Time: Yet to start → Delayed after planned start; WIP → Delayed after planned end; Done → Delayed if it ended after planned end.
- Bay groups: S1 = 5 (Express, Mech), S2 = 15 (Mech), S3 = 20 (Bodyshop) = 40 bays. Placeholders in `config.ts`.
- Vehicle cell = reg no. + model · job type (reading of "Next / Running" on the whiteboard).
- Milestones: Mech = Gate In, Job Card, In Bay (WIP), Washing, Ready; Bodyshop adds Estimate Approval.
- Data: `DataSource` interface; sandbox mock now, DMS later. Refresh every 60 s.
- Login: mock (no auth); remembered in localStorage until Sign out. Short link (bit.ly) to be created by the user.
- Sandbox customer names and number plates are kept.

## Open questions (for BU)
- Real bay group names and counts (paper reads 5 / 15 / 11, but "40 bays" is circled).
- Confirm the "Delayed" rule and the milestone list and logic.
- DMS: which system, API access, how plan and actual times are recorded.
- Is a real login needed, or is a device-remembered mock enough for TVs?
- `package.json` name is still `react-example`; `public/images/cars` is no longer used.
