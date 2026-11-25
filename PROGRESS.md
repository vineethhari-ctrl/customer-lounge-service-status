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

## LIVE since 2026-11-24 (with the theme): works for other users (branch `fix/works-without-browser-storage`)
- Report: "the HTML does not work for others". Found and fixed (reproduced first):
  1. Login did nothing when the browser blocks site storage (localStorage throws) -> now falls back to memory.
  2. Live `index.html` still loaded `cdn.tailwindcss.com` (not needed; a blocked CDN can stall start-up) -> removed.
  3. Blank page on failure -> now readable messages: scripts off (`noscript`), very old browser (`nomodule`), app not started after 5 s,
     and an error screen with the reason if the app crashes (`ErrorBoundary` in `main.tsx`).
  4. Phones/tablets showed a squeezed, unreadable layout -> `viewport width=1280` shows the normal layout scaled to fit.
  5. Small laptops: lounge top bar hides the long name / user badge below 1400 px (it overlapped the tabs).
- Teams report (23 Nov): colleagues opened the HTML inside Teams and saw "content did not load, script did not run correctly".
  Teams / SharePoint / Outlook previews block scripts, so no app can run there. Now: the page itself says "download the file and open it
  in Chrome or Edge" even when all scripts are blocked (tested with a script-blocking CSP). The code is also inlined as a plain
  (non-module) script for the widest compatibility.
- Standalone file: `npm run standalone` -> `standalone/Tata-Service-Status-Portal.html` (script `scripts/make-standalone.mjs`; output not committed). Not verified: Firefox / Safari (only Chromium here),
  corporate content-security policies that block inline scripts, email/chat previews (they usually run no scripts).
- Hosting: github.io is blocked on the user's network ("access denied"); a company-internal host is the lasting fix.

## LIVE since 2026-11-24: Service Transformation theme (from branch `feature/service-transformation-theme`, includes the fixes below)
- BU asked for the theme of the other Service Transformation screens (screens shared by the user as images; Figma link not used yet):
  white header "TATA MOTORS | Service Transformation", light page, white rounded cards, big coloured KPI numbers with icons,
  rounded filter pills in a card, zebra tables, soft status chips. Tokens in `src/index.css` (`@theme`).
- App rewritten into small parts: `App.tsx` (login + routing), `session.ts`, `screens/Login|LoungeScreen|WorksManagerScreen|WorksManagerBoard`,
  `components/AppHeader|KpiStrip|PillGroup|DataTable|Pill|Icon`. The ~800 lines of legacy dark-theme code are gone.
- The KPI strip IS the summary (number = rows with that value; verified for 16 checks at 4 screen sizes, visible rows only).
  Appointments strip: Appointments / Arrived / Expected / Late. Vehicle Status: Vehicles / On time / Delayed / Ready for pickup.
  Board: Status (WIP / Yet to start / Done / Bay free) and Time (On time / Delayed).
- Fit rule kept at 1080p: Board 31/31 and Vehicle Status 22/22 on one screen; Appointments 38 -> 2 even pages.
- Changes of behaviour: lounge no longer has a "Workshop Board" button (only Works Manager has "Open Lounge View"; before, the TV link could
  still reach the board through that button); Delayed chip reads "Delayed +25m" (no "PTD CROSSED"); Login username has no pre-filled ID.
- Open: exact fonts/colours were taken from screenshots; the Figma link would allow exact tokens.

## VERSIONS (user asks "give me version 1 / 2 / 3" -> send the matching HTML from `versions/`)
- **Version 1** = dark BU tables, live 23 Nov 2026 (commit `dac90a5`)  -> `versions/Version-1-dark-tables.html`
- **Version 2** = light Service Transformation tables, live 24-25 Nov (commit `e7fd6cd`) -> `versions/Version-2-light-tables.html`
- **Version 3** = OEM redesign, live from 25 Nov = current `main` (commit `fd89054`) -> `versions/Version-3-OEM-design.html`
- Rebuild any of them: `scripts/build-version.sh 1|2|3` (needs `npm install` once). Open the HTML from a computer in Chrome/Edge, not inside Teams.
- Older still: the original card UI (AI Studio export) is commit `be7fe86`; it needs its car images from the internet, so there is no HTML for it.
- GitHub refuses tag pushes from this environment (HTTP 403), so versions are kept as files + commit ids, not tags.

## LIVE since 2026-11-25: OEM-style redesign (from branch `feature/oem-tv-redesign`)
- BU rejected the table look. New design per the user's spec (this OVERRIDES earlier BU asks: bay table from the paper, "no tile view",
  "Late" status, KPI-summary-above-table, light theme). Domain logic, sandbox data, login, timers and build are unchanged.
- **Customer Lounge** (dark navy, TV): header TATA MOTORS | Service Transformation, CUSTOMER LOUNGE badge, date + clock, gear icon only.
  All controls (screen, department, auto-switch + prev/next, chime, refresh info, switch to Works Manager, sign out) are in the gear drawer.
  3 KPI cards (Ready for Delivery / Vehicles In Service / Today's Appointments). One carousel changes page every 15 s:
  Vehicle Status pages, then Appointments pages (rows fill the card; pages are even). Connected 5-step track
  Received - Job Card - In Bay - Washing - Ready; Est. ready time ("READY NOW" / time / "SOON"); statuses Ready for Delivery / Washing / In Progress.
  Customers never see delay wording or +Xm. Names "Rajesh K. V.", plates "MH 01 EK 9921". Bottom ticker announces ready vehicles with the advisor.
  Appointments statuses: Arrived / Expected / On Way (On Way = not here yet, due within 15 min or past the slot; replaces "Late").
- **Workshop Control Board** (slate/light): header with bay-group pills, Exceptions First toggle, Lounge View, clock; KPI bar (Active WIP, Yet to Start,
  Completed, Free Bays, On Time, Approval Hold, Delayed); grid of bay cards grouped S1/S2/S3 (or flat, delayed -> hold -> on time -> done -> free
  when Exceptions First is on). Card: bay, technician, state badge, plate, model/job, SA, elapsed vs planned bar, plan times.
  Estimate hold = new `hold` flag on `BayJob` (sandbox: bodyshop job waiting for estimate approval).
- Screen fit: 1920x1080 and 1280x720: no horizontal scroll, no page scroll, all 31 cards visible. At heights <= 820 px the cards are compact
  (SA and plan lines move to the hover tooltip; "ESTIMATE HOLD" shortens to "HOLD" below 1500 px width).
- Code: `src/screens/LoungeScreen.tsx` + `lounge/` (StepTrack, Ticker, SettingsDrawer), `WorksManagerScreen.tsx` + `workshop/BayCard.tsx`,
  `format.ts` (plate / name formatting), customer and card rules in `logic.ts`. Removed: DataTable, KpiStrip, PillGroup, AppHeader, Pill, WorksManagerBoard.
- Tests run (browser, 1920x1080 and 1280x720): 60 checks incl. KPI = visible rows over all pages, no delay words in 6-hour-later run, exceptions order,
  role switching, standalone HTML with blocked storage / blocked scripts / phone. `npm run standalone` -> `standalone/Tata-Service-Status-Portal.html`.
- Open: "Final Inspection" is not a stage in the data (Washing is shown instead); On Way rule and "SOON" wording to confirm with BU;
  On Time KPI counts bays running to plan (done bays are under Completed, holds under Approval Hold).

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
