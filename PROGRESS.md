# PROGRESS — Customer Lounge & Works Manager Service Status Portal

Standalone repo (exported from Google AI Studio). Not related to tml-appointment-journey or TML-ST-Admin.
Live (main): https://vineethhari-ctrl.github.io/customer-lounge-service-status/ (GitHub Pages; every push to main deploys).
Run: `npm install --legacy-peer-deps && npm run dev`; check: `npm run lint && npm run build`. React 18 + TS + Vite 5 + Tailwind v4, mostly `src/App.tsx`.

## Live on main (2026-11-20): BU points 2–7 only, on the original design
- 2: Appointments is a list (table), no tiles, no vehicle images.
- 3: Only today's appointments. The sandbox data (written for 19 Oct 2026) is shown as today, so the filter has rows to show.
- 4: Walk-In Customers screen removed; walk-ins appear in Appointments with no separate label.
  The auto-switch now rotates Appointments <-> Vehicle Status every 15 s.
- 5: Vehicle Status: Customer column added; PTD/promised date column and "RO Created" stage removed.
- 6: Login once a day: kept on the device until midnight, then back to login.
- 7: `?role=frontoffice` shows only the Receptionist (Customer Lounge) login, for the TV bit.ly link:
  `https://vineethhari-ctrl.github.io/customer-lounge-service-status/?role=frontoffice` (user creates the bit.ly link).
- No car images anywhere (BU rule): image helper and `public/images/cars` deleted; Vehicle Status shows the model as text.
- Number plates shown as plain text (decorative "IND" plate graphic removed) on Vehicle Status and Works Manager.
- Works Manager board otherwise unchanged.

## Ready on branch `feature/workshop-board-table` (2026-11-21, waiting for go-live OK)
- Workshop Board = table, one row per bay, per BU whiteboard: Bay | Technician | Vehicle | Start Plan | Start Actual | End Plan | End Actual | Elapsed | Job Status | Schedule.
  Old tile/stepper Works Manager view replaced. Last two column names chosen by Claude (BU had not named them).
- Bay group filter, summary counts, auto-paging, TV text scaling (this screen only). Uses `src/data` sandbox source (DMS-ready).
- All screens share ONE data source (`src/data/source.ts` -> `mockSource.ts`, DMS later): same cars on Appointments, Vehicle Status
  and the Board. Old fixed sample lists removed from `App.tsx`; lounge screens convert the snapshot in `buildLoungeVehicles()`.
  Vehicle Status shows arrived cars only; bay bookings whose car has not arrived show as "Expected" in Appointments.
  Bodyshop estimate amounts are no longer shown (not in the shared data yet).

## ON HOLD (do not forget): branch `feature/bu-simple-list-views`
Full redesign from BU's whiteboard and notebook photos, waiting for the user's go-ahead:
- Works Manager bay board as a table: Bay | Technician | Vehicle | Start Plan/Actual | End Plan | Elapsed | Status (Yet to start/WIP/Done) | Time (On time/Delayed).
- Bay groups filter (S1 = 5, S2 = 15, S3 = 20 = 40 bays, placeholders), 20–25+ bays per screen with auto-paging, 43" TV sizing.
- Vehicle Status: only today's EDT vehicles, Washing stage, simple stage bar; new dark table style everywhere.
- Data layer behind a DataSource interface (sandbox now, DMS later), refresh every 60 s.
- Decisions taken there (user answered: show "Done"; data from DMS; the rest decided by Claude):
  Elapsed = now − actual start; Delayed = past planned start (not started) / past planned end (WIP) / ended after planned end (Done).
- BU rule: NO car images anywhere (the branch has none; delete `public/images/cars` there too when merging).
- When resuming: rebase this branch on main (it also contains points 2–7 in its own way; keep the redesign's version).

## Open questions (for BU)
- Real bay group names and counts (paper reads 5 / 15 / 11, but "40 bays" is circled).
- Confirm the "Delayed" rule and the milestone list and logic.
- DMS: which system, API access, how plan and actual times are recorded.
- Is a real login needed, or is the once-a-day mock enough for TVs?
- `package.json` name is still `react-example`.
