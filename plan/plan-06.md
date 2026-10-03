# Migrate Spots & Schedule from Build Data to Supabase

## Context

Previously, all trip data (spots and schedule) was loaded from static JSON files generated at build time from markdown sources. The app has been migrated so that **Supabase is the sole source of truth** — the app fetches all data from the database at runtime.

Photos remain as static files served from `trip/public/photos/` (symlink to `docs/photos/`), referenced by URL paths stored in the spot data.

## Architecture

### Before
```
Markdown (docs/) → build-data.ts → generated/*.json → static imports → React components
                                         ↓ (optional merge)
                                      Supabase
```

### After
```
Markdown (docs/) → build-data.ts → generated/*.json → seed-supabase.ts → Supabase
                                                                      ↓
                                              React components ← fetch at runtime
```

## Database Schema

### `spots` table
| Column | Type | Notes |
|--------|------|-------|
| `slug` | text | Primary key |
| `source` | text | `'builtin'` or `'user'` |
| `deleted` | boolean | Soft-delete flag |
| `data` | jsonb | Full spot object (name, category, region, photos, features, etc.) |
| `created_by` | text | Supabase user ID |
| `updated_at` | timestamptz | Last modification |

### `schedule` table
| Column | Type | Notes |
|--------|------|-------|
| `id` | text | Primary key, default `'default'` |
| `data` | jsonb | Full TripSchedule object (overview, days, stops) |
| `updated_at` | timestamptz | Last modification |

## Implementation

### 1. Seed Script (`trip/scripts/seed-supabase.ts`)

- Loads env vars from `.env.local` using `dotenv`
- Reads all 5 generated spot JSON files + schedule.json
- Upserts spots into `spots` table with `source: 'builtin'`
- Upserts schedule into `schedule` table with `id: 'default'`
- Uses `SUPABASE_SERVICE_ROLE_KEY` for write access
- Run: `npm run seed`

### 2. SpotsProvider (`trip/src/data/SpotsProvider.tsx`)

- Removed static `builtinSpots` import
- Fetches all non-deleted spots from Supabase on mount
- Maps `RemoteSpot.data` → `Spot[]`
- Provides `addSpot`, `updateSpot`, `removeSpot` mutations (all go through Supabase)
- Shows empty state if Supabase env vars are missing

### 3. ScheduleProvider (`trip/src/data/ScheduleProvider.tsx`)

- New provider that fetches schedule from Supabase on mount
- Queries `schedule` table where `id = 'default'`
- Provides `schedule` and `loading` via context
- Wrapped in `App.tsx` alongside `SpotsProvider`

### 4. Supabase Store (`trip/src/data/store/supabase.ts`)

- `listRemote()` now filters `deleted != true`
- `create()`, `update()`, `tombstone()` unchanged

### 5. Page Updates

- `SchedulePage.tsx` — uses `useSchedule()` hook instead of static import
- `DayDetailPage.tsx` — uses `useSchedule()` hook, handles null schedule gracefully

### 6. Cleanup

Deleted files no longer needed:
- `trip/src/data/store/merge.ts` — merge logic obsolete
- `trip/src/data/store/builtin.ts` — builtin store unused
- `trip/src/data/spots.ts` — static spot imports removed
- `trip/src/data/schedule.ts` — static schedule import removed

### 7. Package.json Changes

- Added `seed` script: `tsx scripts/seed-supabase.ts`
- Removed `build:data` from `build` chain (no longer needed at build time)
- Added `dotenv` as devDependency

## Files Changed

| File | Action |
|------|--------|
| `trip/scripts/seed-supabase.ts` | Created |
| `trip/src/data/ScheduleProvider.tsx` | Created |
| `trip/src/data/SpotsProvider.tsx` | Rewritten (Supabase-first) |
| `trip/src/data/store/supabase.ts` | Modified (added deleted filter) |
| `trip/src/App.tsx` | Modified (added ScheduleProvider) |
| `trip/src/pages/SchedulePage.tsx` | Modified (uses useSchedule) |
| `trip/src/pages/DayDetailPage.tsx` | Modified (uses useSchedule) |
| `trip/package.json` | Modified (scripts + dotenv) |
| `trip/.env.example` | Modified (added SERVICE_ROLE_KEY) |
| `trip/src/data/store/merge.ts` | Deleted |
| `trip/src/data/store/builtin.ts` | Deleted |
| `trip/src/data/spots.ts` | Deleted |
| `trip/src/data/schedule.ts` | Deleted |

## Workflow

### Build & Deploy
```bash
npm run build    # tsc + vite build (no data generation needed)
npm run deploy   # build + gh-pages
```

### Update Data from Markdown
```bash
npm run build:data   # parse markdown → JSON
npm run seed         # push JSON to Supabase
```

### Environment Variables
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key   # seed script only
```
