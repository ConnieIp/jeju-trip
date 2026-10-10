# Implementation Plan: Separate `schedule_day` Table (One Record Per Day)

## Overview

Currently the entire trip schedule (`{ overview, days: DaySchedule[] }`) is stored as a single
JSON blob in the `schedule` table (row `id='default'`). Every schedule edit rewrites the whole
blob. This change splits per-day data into a new `schedule_day` table with **one record per day**
(6 rows), so each day is fetched, read, and updated independently. The trip-level `overview`
stays in the existing `schedule` table.

## Current State

- `schedule` table: 1 row (`id='default'`), `data` jsonb = `{ overview, days[] }`
- `trip/src/data/ScheduleProvider.tsx` fetches/writes the whole blob
- All schedule edits in `SchedulePage.tsx` are already day-scoped (`d.day === activeDay`)
- Backup taken: `db_backup/schedule_2026-10-10_15-31-12.json` (all rows, pre-migration)

## New Table Design

Table name: `schedule_day` (snake_case, consistent with Postgres/Supabase conventions and the
existing `schedule` / `spots` / `notes` tables). Follows the project's established jsonb pattern
(`spots.data`, `schedule.data`): one `data` column holding the full `DaySchedule` object, plus a
`day` key column for ordering and per-row targeting.

```sql
create table if not exists public.schedule_day (
  day int primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);
```

- RLS enabled with anon+authenticated SELECT/INSERT/UPDATE policies, mirroring how the app uses
  the `schedule` table today (anon key read/write).
- 6 rows seeded: `day` = 1..6, `data` = full `DaySchedule` JSON extracted from the backup.
- The legacy `schedule` row is **not modified** (no destructive change; old deployments keep
  working; rollback is trivial).

## Files to Create/Modify

| File | Change |
|---|---|
| `trip/migrations/create-schedule-day-table.sql` | NEW — idempotent DDL + RLS + seed inserts (run by user in Supabase dashboard SQL editor) |
| `trip/src/data/ScheduleProvider.tsx` | Fetch days from `schedule_day` (sorted by `day`), overview from `schedule`; `updateSchedule` upserts only changed day rows |
| `trip/scripts/update-schedule.mjs` | Push `generated/schedule.json` days into `schedule_day` + overview into `schedule` (keeps DB-sync tooling coherent) |
| `plan/plan-16.md` | This plan |

## Implementation Steps

1. Write `migrations/create-schedule-day-table.sql`: create table, enable RLS + policies, insert
   the 6 day rows (generated from the backup JSON), all statements idempotent
   (`if not exists`, `on conflict (day) do update`).
2. Update `ScheduleProvider.tsx`:
   - `fetchSchedule`: parallel fetch of `schedule` (overview) + `schedule_day` (days), compose
     `TripSchedule`.
   - `updateSchedule`: diff next vs prev days (JSON compare by `day`), upsert only changed rows
     into `schedule_day`; update `schedule.data` only if `overview` changed.
3. Update `scripts/update-schedule.mjs` to target the new tables.
4. Typecheck + production build.

## Design Notes

- No legacy fallback in the provider — clean switch; the migration is a single copy-paste step in
  the Supabase dashboard (no DDL access from API keys / no Supabase CLI installed).
- Keep the same fire-and-forget write style the provider uses today.
- `updateSchedule` signature unchanged — pages need no changes.

## Verification

- [x] Backup exists in `db_backup/` before any DB change
- [ ] Migration SQL is idempotent (re-runnable without duplication)
- [ ] `npm run build` passes (typecheck + bundle)
- [ ] Dev server renders schedule pages (data appears after user runs the migration SQL)
- [ ] Day edits persist to the correct `schedule_day` row only
