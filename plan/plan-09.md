# Implementation Plan: Nearby Backup Tagging

## Overview
Allow users to tag any spot as a "backup" for specific days. Tagged spots appear in the "NEARBY BACKUP" sidebar card on the Schedule page for the corresponding day.

## Data Model Change
- Add `backupFor?: number[]` to `BaseSpot` in `trip/src/data/types.ts`
- Array of day numbers (1-5) indicating which days this spot is a backup for

## Files to Modify

### 1. `trip/src/data/types.ts`
- Add `backupFor?: number[]` to `BaseSpot`

### 2. `trip/src/components/schedule/BackupCard.tsx`
- Replace hardcoded content with dynamic component
- Accept props: `spots: Spot[]` (spots filtered for current day's backup)
- Render a list of backup spots with name, category, and first feature
- Show empty state when no backups are tagged
- Each backup spot links to its detail page

### 3. `trip/src/pages/SchedulePage.tsx`
- Filter spots where `backupFor` includes `activeDay`
- Pass filtered spots to `BackupCard`

### 4. `trip/src/components/ui/SpotForm.tsx`
- Add "Backup for days" field with checkboxes for Day 1-5
- Parse checked days into `backupFor` number array on submit
- Pre-populate checkboxes from `initial?.backupFor` when editing

## Design Notes
- BackupCard keeps the same visual style (teal accent, card border)
- Each backup entry shows: category badge, name, first feature
- Clicking a backup entry navigates to `/spot/{slug}`
- Reference `ui-design-guideline.md` tokens for consistency

## Verification
- [ ] Tag a spot as backup for Day 1 via the form
- [ ] Verify it appears in the Nearby Backup card on Day 1 schedule
- [ ] Verify it does NOT appear on other days
- [ ] Verify clicking a backup spot navigates to its detail page
- [ ] Verify empty state when no spots are tagged as backup
- [ ] Verify editing a spot preserves existing backup tags
