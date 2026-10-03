# Implementation Plan: Flight, Activity & Accommodation Cards

## Overview

Add CRUD functionality for flight, activity (stop), and accommodation entries on the Schedule Page. Users can add new items via icon buttons, edit existing items via hover buttons on cards, and delete items with confirmation. All changes persist to Supabase. Flight and accommodation cards are only visible to logged-in users.

## Files Modified

### Data Layer
- `trip/src/data/types.ts` — Added `departureTerminal?` and `arrivalTerminal?` to `FlightInfo`; added `addressKo?`, `addressEn?`, `bookingUrl?` to `DaySchedule.accommodation`
- `trip/src/data/ScheduleProvider.tsx` — Added `updateSchedule()` method to context for optimistic updates + Supabase persistence (uses service role key for writes)

### New Components
- `trip/src/components/ui/Modal.tsx` — Generic modal dialog wrapper with close button
- `trip/src/components/schedule/ActivityForm.tsx` — Form for add/edit stops with saved-spot dropdown selector
- `trip/src/components/schedule/AccommodationForm.tsx` — Form for add/edit accommodation (name, slug, night, addressKo, addressEn, bookingUrl)
- `trip/src/components/schedule/FlightForm.tsx` — Form for add/edit flight (number, departure, arrival, times, terminals)
- `trip/scripts/update-accommodation.ts` — One-time script to seed accommodation data from `docs/accommodation.md`

### Modified Components
- `trip/src/components/schedule/AccommodationCard.tsx` — Removed Link navigation; added expandable detail panel (address + reservation link); added hover edit/delete buttons; accepts `addressKo`, `addressEn`, `bookingUrl` props
- `trip/src/components/schedule/FlightCard.tsx` — Added terminal display row; added hover edit/delete buttons; accepts `departureTerminal`, `arrivalTerminal` props
- `trip/src/components/schedule/StopCard.tsx` — Added hover edit/delete buttons via `onEdit`/`onDelete` props
- `trip/src/components/schedule/TimelineRow.tsx` — Passes `onEdit`/`onDelete` through to StopCard
- `trip/src/components/ui/PlaceCard.tsx` — Added address display (Korean primary, English secondary) on spot list cards

### Page
- `trip/src/pages/SchedulePage.tsx` — Full rewrite of timeline section:
  - Modal state machine for add/edit/delete flows
  - Three icon add buttons (activity +, accommodation bed, flight plane) — login-gated
  - Flight cards only render when logged in
  - Accommodation cards only render when logged in
  - Edit/delete on stop cards only pass handlers when logged in
  - Delete actions use ConfirmDialog

## Key Design Decisions

1. **Login gating**: Flight cards, accommodation cards, add buttons, and edit/delete buttons are hidden for non-authenticated users. Regular stop cards remain visible to all.
2. **Optimistic updates**: `updateSchedule()` applies changes to local state immediately, then persists to Supabase in the background.
3. **Service role key**: Database writes from scripts use `SUPABASE_SERVICE_ROLE_KEY` because RLS blocks anon key writes on the schedule table.
4. **Spot dropdown**: ActivityForm includes a dropdown of saved spots that auto-fills title, slug, type, and description fields.
5. **Bilingual addresses**: Both accommodations and spots support separate Korean (`addressKo`) and English (`addressEn`) address fields.
6. **Hover actions**: Edit (✎) and delete (✕) buttons appear on card hover using CSS `group-hover:opacity-100`.

## Database Updates Performed

- Accommodation data seeded from `docs/accommodation.md` (addresses, booking URLs, slugs)
- Flight data added: UO640 (HKG T2 → CJU, 15:25–19:10) and UO641 (CJU → HKG T2, 20:00–22:30)

## Verification

- [x] TypeScript compiles with no errors
- [x] Production build succeeds
- [x] Add buttons only show when logged in
- [x] Flight/accommodation cards hidden when not logged in
- [x] Edit/delete buttons hidden when not logged in
- [x] Activity form spot dropdown populates from saved spots
- [x] Accommodation card expands to show address + reservation link
- [x] Flight card shows terminal information
- [x] All CRUD operations persist to Supabase
