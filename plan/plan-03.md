# Implementation Plan: Visual Comparison & Style Fixes (Session 3)

## Overview

This session used Playwright to take side-by-side screenshots of the Figma prototype and localhost, then fixed the most visible styling mismatches. The prototype is hosted at `https://tint-cloudy-33853921.figma.site/`.

## What Was Done

### Session 3A: Initial Style Fixes

1. **PlaceCard title color** (`trip/src/components/ui/PlaceCard.tsx`)
   - Changed title color from `text-teal` to `text-ink` to match prototype (dark text, not teal)
   - Removed `truncate` class so full titles display without ellipsis

2. **SpotsPage filter labels** (`trip/src/pages/SpotsPage.tsx`)
   - Updated FILTERS array: `['All spots', 'Accommodation', 'Restaurant', 'Cafe', 'Sight', 'Souvenir']`
   - Updated FILTER_MAP keys to match
   - Active filter shows count: "All spots · 42"
   - Active state uses `bg-dark-card` instead of `bg-teal-dark`

3. **SpotsPage stats widget** (`trip/src/pages/SpotsPage.tsx`)
   - Moved from full-width dark bar below title to floating card in header row (right side)
   - Changed label from "Saved places / Across 5 regions" to "Saved across Jeju / N already in your schedule"
   - Matches prototype's floating card layout

4. **SpotsPage title label** (`trip/src/pages/SpotsPage.tsx`)
   - Changed from teal "Saved places" to amber "ISLAND SHORTLIST" with amber dot
   - Matches prototype's amber section label

5. **SchedulePage title label** (`trip/src/pages/SchedulePage.tsx`)
   - Changed from teal "Five days around the island" to amber "FIVE DAYS AROUND THE ISLAND"
   - Matches prototype's amber section label

6. **Responsive verification**
   - Took screenshots at 375px (mobile) and 768px (tablet) for all 3 pages
   - Confirmed responsive breakpoints work correctly

### Session 3B: Additional Style Fixes

7. **SearchBox placeholder** (`trip/src/components/ui/SearchBox.tsx`)
   - Changed from "Search places..." to "Search a place, neighborhood, or craving..."
   - Matches prototype placeholder text

8. **LocalNote label and icon** (`trip/src/components/schedule/LocalNote.tsx`)
   - Changed from "Local Note" to "Local rhythm" with sun icon
   - Matches prototype label and icon

9. **BackupCard label and format** (`trip/src/components/schedule/BackupCard.tsx`)
   - Changed from "BACKUP PLAN" / "Rainy Day Option" to "NEARBY BACKUP" / "Bunker de Lumières →"
   - Matches prototype label and link format

10. **SpotsPage count label** (`trip/src/pages/SpotsPage.tsx`)
    - Changed from "42 places" to "42 saved spots"
    - Added "Sorted by Trip order" text on right
    - Matches prototype count label format

11. **DayTabs active state** (`trip/src/components/schedule/DayTabs.tsx` + `SchedulePage.tsx`)
    - Active day now shows "週日 · DAY 1" format instead of just date
    - Matches prototype's "FRI · DAY 2" format

12. **RouteOverview → Day at a glance** (`trip/src/components/schedule/RouteOverview.tsx`)
    - Changed title from "Route Overview" to "Day at a glance"
    - Changed icon from map pin to settings/sliders
    - Added `driveTime` and `distance` props
    - Changed stats labels from "DAYS" / "DRIVE" to "DRIVE" / "DISTANCE"
    - Updated `DaySchedule` type to include `driveTime` and `distance` fields
    - Updated `schedule.json` with drive time and distance values for each day

13. **DayTabs button padding** (`trip/src/components/schedule/DayTabs.tsx` + `trip/src/pages/SchedulePage.tsx`)
    - Changed from `px-[18px] py-[14px]` to `px-[16px] py-[12px]` to match prototype
    - Prototype specifies `padding: 12px 16px` (12px vertical, 16px horizontal)
    - Removed CSS reset `* { padding: 0; }` from `index.css` that was overriding Tailwind utilities
    - Tailwind v4 includes its own reset in base layer, manual reset was conflicting

## Files Modified

- `trip/src/components/ui/PlaceCard.tsx` — title color + truncation
- `trip/src/components/ui/SearchBox.tsx` — placeholder text
- `trip/src/components/schedule/DayTabs.tsx` — active state label, button padding
- `trip/src/components/schedule/LocalNote.tsx` — label + icon
- `trip/src/components/schedule/BackupCard.tsx` — label + format
- `trip/src/components/schedule/RouteOverview.tsx` — title, icon, stats
- `trip/src/pages/SpotsPage.tsx` — filters, stats widget, title label, count label
- `trip/src/pages/SchedulePage.tsx` — title label, day tabs active state, button padding, RouteOverview props
- `trip/src/data/types.ts` — added driveTime + distance to DaySchedule
- `trip/src/data/generated/schedule.json` — added driveTime + distance values
- `trip/src/index.css` — removed CSS reset that was overriding Tailwind utilities

## Remaining Differences (Require Data/Content Changes)

### 1. DayTabs content format (partial fix applied)
- **Prototype**: day abbreviation (THU, FRI) + date (Oct 15) + subtitle (Arrival · Jeju City)
- **Localhost**: Active day shows "週日 · DAY 1", inactive shows date (10/25)
- **Status**: Active state format fixed. Full format (day abbr + date + subtitle) requires data structure changes

### 2. Timeline stop cards
- **Prototype**: Each stop has image (150×106 landscape), category badge, title, description, right-side context text (Sunrise window, Window seat saved), arrow icon
- **Localhost**: StopCard exists but Day 1 has no stops to display
- **Status**: Need to verify StopCard matches prototype for days with stops (Day 2+)

### 3. Detail page photo gallery
- **Prototype**: Shows actual photos in gallery grid
- **Localhost**: Shows "No photos available" placeholder
- **Status**: Need to add photos to `docs/photos/` and link in spot data

### 4. PlaceCard day/time info
- **Prototype**: Shows "Day 2 · 06:30" at bottom of card with calendar icon
- **Localhost**: No day/time info shown
- **Status**: Requires joining spot data with schedule data

### 5. PlaceCard description format
- **Prototype**: "Sunrise peak · Open 07:00–19:00" (short description + hours)
- **Localhost**: Shows `features[0]` which is longer Chinese text
- **Status**: Need to add short description field to spot data

## Verification

- [x] Build passes (`npm run build`)
- [x] Playwright screenshots taken at desktop (1440px), tablet (768px), mobile (375px)
- [x] PlaceCard title color matches prototype (dark, not teal)
- [x] SpotsPage stats widget is floating card on right
- [x] SpotsPage filter labels match prototype
- [x] Section labels use amber color (ISLAND SHORTLIST, FIVE DAYS AROUND THE ISLAND)
- [x] SearchBox placeholder matches prototype
- [x] LocalNote shows "Local rhythm" with sun icon
- [x] BackupCard shows "NEARBY BACKUP" with link format
- [x] SpotsPage count label shows "saved spots" + "Sorted by Trip order"
- [x] DayTabs active state shows "DAY N" format
- [x] DayTabs button padding matches prototype (12px vertical, 16px horizontal)
- [x] RouteOverview shows "Day at a glance" with settings icon and DRIVE/DISTANCE stats
- [ ] DayTabs full content format (day abbr + date + subtitle)
- [ ] Timeline stop cards verified for days with stops
- [ ] PlaceCard shows day/time info
- [ ] Detail page photo gallery populated
