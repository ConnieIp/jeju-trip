# Implementation Plan: Transport Indicator on Timeline

## Overview

Replace the full-card rendering of transport stops on the schedule timeline with a compact inline indicator. Instead of showing transport as a regular StopCard (with badge, title, time range), transport stops now appear as a small icon + duration pill between the surrounding activity cards on the timeline. Clicking the icon reveals a popover with more detail.

## Requirements

1. Transport stops should NOT render as full cards — they should be compact inline elements on the timeline
2. Each transport indicator shows a **type-specific icon** (drive, walk, bus, ferry, taxi, bike) and a **duration** (e.g. "~30 mins")
3. The icon is determined by the transport mode — auto-detected from title/description keywords, or explicitly set via a `transportMode` field
4. Clicking the icon opens a **popover** showing the transport mode label, title, duration, and any notes
5. The ActivityForm should allow selecting a transport mode when creating/editing a transport stop
6. Edit/delete hover actions remain available on transport indicators (for authenticated users)

## Files Changed

### `trip/src/data/types.ts`
- Added `TransportMode` type: `'drive' | 'walk' | 'bus' | 'ferry' | 'taxi' | 'bike'`
- Added optional `transportMode?: TransportMode` field to `ScheduleStop` interface

### `trip/src/components/schedule/TransportIndicator.tsx` (new)
- Compact timeline component for transport stops
- Uses the same 3-column grid layout (`74px | 16px | 1fr`) as `TimelineRow` for alignment
- Renders a small timeline dot and connector line (matching existing timeline visual language)
- Shows a pill button with:
  - SVG icon for the detected/configured transport mode
  - Duration text from `stop.description`
- Click toggles a popover with: mode icon + label, title, duration, notes
- Click-outside closes the popover (via `mousedown` event listener)
- Edit/delete buttons appear on hover (same pattern as `StopCard`)
- Auto-detection logic in `detectTransportMode()`:
  - Checks explicit `transportMode` field first
  - Falls back to keyword matching in title + description:
    - "ferry", "渡輪", "boat", "ship" → ferry
    - "walk" → walk
    - "bus" → bus
    - "bike", "cycle" → bike
    - "taxi", "cab" → taxi
    - Default → drive

### `trip/src/pages/SchedulePage.tsx`
- Imported `TransportIndicator`
- In the regular stops rendering loop, transport stops (`stop.type === 'transport'`) now render as `<TransportIndicator>` instead of `<TimelineRow>`
- All other stop types continue to render as `<TimelineRow>` unchanged
- Edit/delete callbacks and `isLast` logic passed through identically

### `trip/src/components/schedule/ActivityForm.tsx`
- Imported `TransportMode` type
- Added `TRANSPORT_MODES` constant with all 6 mode options
- Added `selectedType` state to track the current type selection
- When type is `'transport'`, a "Transport Mode" dropdown appears below the type selector
- `handleSubmit` includes `transportMode` in the produced `ScheduleStop` when type is transport
- `handleSpotSelect` also updates `selectedType` when a spot is chosen

## Design Notes

- Transport indicator uses the same grid columns and connector line positioning as `TimelineRow` so the timeline remains visually continuous
- The pill uses `bg-teal-light/50 border border-teal/20 text-teal-dark` for a subtle but distinct look that differentiates from full cards
- SVG icons are inline (no external icon library dependency), styled with `currentColor` to inherit the teal color scheme
- Popover uses `bg-card border border-border rounded-[12px] shadow-[0_8px_24px_#15323a1a]` matching the card shadow spec from `ui-design-guideline.md`
- Responsive: grid columns collapse to `48px | 12px | 1fr` at `max-[640px]` breakpoint, matching `TimelineRow`

## Verification

- [x] TypeScript compiles with no errors (`tsc --noEmit` exits 0)
- [x] Dev server serves the app without errors
- [ ] Visual check: transport indicators appear between activity cards on the timeline
- [ ] Visual check: clicking indicator opens popover with details
- [ ] Visual check: clicking outside closes popover
- [ ] Visual check: edit/delete buttons appear on hover (authenticated)
- [ ] Visual check: transport mode dropdown appears in ActivityForm when type is Transport
- [ ] Visual check: auto-detected icons match transport titles (Drive → car, 渡輪 → ferry, etc.)
