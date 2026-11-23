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

## LIVE since 2026-11-21: Workshop Board table + shared data (from branch `feature/workshop-board-table`)
- REFERENCE = the BU paper note only (user, 21 Nov): Bay | Technician | Vehicle | Start Plan | Start Actual | End Plan |
  Elapsed Time (current − actual start) | Status (Yet to start / WIP / Done) | Time (On time / Delayed). End Actual NOT shown.
  Vehicle = number plate only. Sets: S1 = 5, S2 = 15, S3 = 11 (31 bays; user: ignore the circled "40 bays").
  The whiteboard photo and "Next / Running" are NOT a reference any more. Old tile/stepper view replaced.
- All screens share ONE data source (`src/data/source.ts` -> `mockSource.ts`, DMS later): same cars on Appointments, Vehicle Status
  and the Board. Old fixed sample lists removed from `App.tsx`; lounge screens convert the snapshot in `buildLoungeVehicles()`.
  Vehicle Status shows arrived cars only; bay bookings whose car has not arrived show as "Expected" in Appointments.
  Bodyshop estimate amounts are no longer shown (not in the shared data yet).

## LIVE since 2026-11-23 (from branch `feature/appointments-customer-status`)
- Appointments: "Time" -> "Appointment Time"; "Status" -> "Customer Status" with only Arrived / Expected / Late
  (Late = not arrived 15 min after appointment time, `APPOINTMENT_LATE_MINUTES`). Rows come from `snapshot.appointments`.
- Work Type = service type only (BU): Mechanical = Paid Service / First Free Service / Second Free Service / Running Repairs;
  Bodyshop = Accident. Lower-level works (denting, painting...) are not shown.
- Workshop board Elapsed = current time − actual start until Done, then frozen (already so; verified with a 10-minute clock test).
- "Work Type" column renamed "Visit Reason" (Appointments and Vehicle Status).
- Summary counts must equal the rows with that value (BU rule). One shared `SummaryStrip` component, counted from the same
  rows the table shows: Appointments (Arrived / Expected / Late), Vehicle Status (On time / Delayed / Ready for pickup),
  Workshop Board (Status: WIP / Yet to start / Done / Bay free; Time: On time / Delayed). Fixed old board bug: "Delayed (live)"
  skipped Done jobs although the Time column showed "Delayed" for them. Verified automatically for every filter (14/14 checks).

## LIVE since 2026-11-23: all lists fit the screen (from branch `fix/board-fit-all-rows`)
- BU/user: summary count must equal what is visible. Cause of the old mismatch: tables showed one page at a time while the
  summary counted everything. Now Appointments, Vehicle Status and the Workshop Board all use the shared `DataTable`:
  every row on one screen (rows shrink 2.6rem -> 1.4rem); only if that is not enough, EVEN pages (e.g. 19 + 19) with the footer
  "Showing 1-19 of 38 · summary counts cover all 38". TV text scaling (`useTvScale`) applies to all screens.
- At 1920x1080 (= a 43" TV): Workshop Board 31/31 and Vehicle Status 22/22 on one screen; Appointments 38 -> 2 pages of 19.
- Lounge top bar kept on one line (long lounge name shortens with "..."). Vehicle Status stage headers on two lines.
- Test lesson: count rows that are VISIBLE (inside the window), step through pages, pause the lounge auto-switch while measuring.

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
- Confirm the "Delayed" rule and the milestone list and logic.
- DMS: which system, API access, how plan and actual times are recorded.
- Is a real login needed, or is the once-a-day mock enough for TVs?
- `package.json` name is still `react-example`.
