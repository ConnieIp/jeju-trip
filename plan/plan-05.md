# Implementation Plan: User-Editable Spots (Supabase + Store-Interface Pattern)

## Overview

Allow users to **add new spots** and **edit / delete existing spot information** from the UI, with changes persisted in a hosted database (Supabase free tier), while the site stays 100% static on GitHub Pages.

Key design decision: all data access goes through a small **`SpotStore` interface**. The bundled JSON built from `docs/` remains the read-only **base layer**; Supabase stores only **user changes** (added spots, overrides, tombstones) as a **remote layer**. Frontend pages never import the Supabase SDK directly — they consume a merged, in-memory list via a React context. This keeps a future migration to an Express/Spring Boot + MongoDB backend a two-file swap (new store implementation + auth module), with zero page/component changes.

Auth (the most migration-coupled piece) is isolated in its own module. Writes are restricted by Supabase Row Level Security to an allowlist of editor emails; reads are public (matches the public site).

## Prerequisites (one-time, manual)

1. Create a Supabase project (free tier) → copy **Project URL** and **anon public key**.
2. Run the schema + RLS SQL below in the SQL editor.
3. Auth → URL Configuration → add redirect URLs:
   - `https://connieip.github.io/jeju-trip/`
   - `http://localhost:5173/`
4. Note: the anon key is public by design (it ships in the JS bundle); **RLS is the security boundary**. Never put the service-role key in the client.

### Schema + RLS (run in Supabase SQL editor)

```sql
create table public.spots (
  slug       text primary key,
  source     text not null default 'user' check (source in ('user', 'builtin')),
  deleted    boolean not null default false,
  data       jsonb,
  created_by uuid references auth.users (id),
  updated_at timestamptz not null default now()
);

alter table public.spots enable row level security;

-- Public read (anon key): the site is public, reads stay open.
create policy "public read"
  on public.spots for select
  using (true);

-- Only allowlisted editor emails may write. Replace with real emails.
create policy "editors insert"
  on public.spots for insert to authenticated
  with check (
    (auth.jwt() ->> 'email') in ('editor1@example.com', 'editor2@example.com')
  );

create policy "editors update"
  on public.spots for update to authenticated
  using (
    (auth.jwt() ->> 'email') in ('editor1@example.com', 'editor2@example.com')
  )
  with check (
    (auth.jwt() ->> 'email') in ('editor1@example.com', 'editor2@example.com')
  );

-- Intentionally NO delete policy: deletions are tombstones (deleted = true),
-- so nothing is ever hard-deleted and built-in data can always be restored.
```

## Data Model & Merge Semantics

`data` (jsonb) mirrors the existing `Spot` shape from `trip/src/data/types.ts` — no column-per-field mapping, so it maps 1:1 to a future MongoDB document `{ slug, source, deleted, data, createdBy, updatedAt }`.

| Remote row | Meaning | Merge behavior |
|---|---|---|
| `source='builtin'`, `data={...}` | Override of a bundled spot | `{ ...builtin, ...data }` (remote wins) |
| `source='builtin'`, `deleted=true` | Tombstone for a bundled spot | Built-in spot hidden everywhere |
| `source='user'`, `data={...full spot}` | User-added spot | Appended to list; slug is `user-<uuid>` (never collides with builtin slugs) |

- Overrides store the **full spot object** (simple, predictable). Tradeoff: if `docs/` base data is later updated in a deploy, the override shadows the new values — acceptable for v1; delta-storage is the alternative if this bites.
- No remote row → bundled data shows as-is. Deleting a user spot also writes a tombstone (uniform behavior).
- Mutable fields a user can edit: everything in `BaseSpot` + category-specific fields already present (hours, admission, bestTime, etc.).

## Files to Create

| File | Purpose |
|---|---|
| `trip/src/lib/supabaseClient.ts` | Single Supabase client instance from env vars |
| `trip/src/data/store/types.ts` | `SpotStore` interface |
| `trip/src/data/store/builtin.ts` | Base-layer store over existing generated JSON |
| `trip/src/data/store/supabase.ts` | Remote-layer store (only data file importing the SDK) |
| `trip/src/data/store/merge.ts` | Pure merge function (builtin + remote rows → display list) |
| `trip/src/data/SpotsProvider.tsx` | Context: `{ spots, loading, addSpot, updateSpot, removeSpot, resetSpot }` |
| `trip/src/auth/AuthContext.tsx` | `{ user, signInWithEmail, signOut }` — only auth module touching Supabase Auth |
| `trip/src/components/ui/SpotForm.tsx` | Add/edit form (fields per `BaseSpot` + category fields) |
| `trip/src/components/ui/ConfirmDialog.tsx` | Delete confirmation, styled per guideline |
| `trip/src/pages/SpotFormPage.tsx` | Routes for `/spot/new` and `/spot/:slug/edit` |
| `trip/.env.example` | Documents `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` |

`SpotStore` interface (the migration seam):

```ts
export interface SpotStore {
  listRemote(): Promise<RemoteSpot[]>
  create(spot: Spot, userId: string): Promise<void>
  update(slug: string, patch: Spot, userId: string): Promise<void>
  tombstone(slug: string, userId: string): Promise<void>
}
```

## Files to Modify

| File | Change |
|---|---|
| `trip/package.json` | Add `@supabase/supabase-js` |
| `trip/src/App.tsx` | Wrap with `AuthProvider` + `SpotsProvider`; add routes `/spot/new`, `/spot/:slug/edit` |
| `trip/src/pages/SpotsPage.tsx` | Replace `allSpots` import with `useSpots()`; add "Add spot" button |
| `trip/src/pages/SchedulePage.tsx` | Replace `allSpots` import with `useSpots()` |
| `trip/src/pages/DayDetailPage.tsx` | Replace `getSpotBySlug` with `useSpots()` lookup; add Edit / Delete actions on spot detail |
| `trip/src/components/layout/Header.tsx` | Sign-in / sign-out affordance (small, unobtrusive) |
| `trip/src/components/ui/PlaceCard.tsx` | Optional small "Added" / "Edited" badge (reuse guideline pill styles) |
| `trip/src/vite-env.d.ts` | Type the two `VITE_*` env vars |
| `.github/workflows/deploy.yml` | Pass env vars to the build step from repo **Variables** |

No changes to `scripts/build-data.ts` or the `docs/` pipeline — the base layer keeps building exactly as today.

## Implementation Steps

1. **Supabase setup** — create project, run SQL, configure redirect URLs (manual, see Prerequisites).
2. **Dependency + env** — `npm i @supabase/supabase-js` in `trip/`; create `trip/.env.local` with URL + anon key (already covered by root `.gitignore`); type vars in `vite-env.d.ts`.
3. **Store abstraction** — implement `types.ts`, `builtin.ts`, `supabase.ts` (list/create/update/tombstone; on insert set `onConflict: 'slug'` for upsert semantics since edits to builtin spots create the override row on first write).
4. **Merge module** — pure `mergeSpots(builtin, remote)` handling the three cases above.
5. **SpotsProvider** — render immediately from builtin (offline-safe), fetch remote async, merge; mutations are optimistic with rollback on error; expose `loading` + actions. If remote fetch fails, fall back to builtin-only silently (console.warn).
6. **Page swap** — migrate the three pages to `useSpots()`. Verify UI is pixel-identical when the DB has no rows.
7. **Auth** — `AuthContext` with magic-link email sign-in; explicit PKCE flow (`flowType: 'pkce'` — supabase-js defaults to implicit, whose hash-based tokens would conflict with `HashRouter`; PKCE uses `?code=` query param instead); gate Add/Edit/Delete buttons behind signed-in state (RLS still enforces server-side). Show a "view-only" hint for signed-out users.
8. **Form + CRUD UI** — `SpotFormPage` for add/edit (validation: name required; category/region from fixed lists); Delete → `ConfirmDialog` → tombstone; for builtin spots, offer "Reset to original" (remove override row is not possible without a delete policy → implement reset as writing `data` equal to the builtin values back, or skip in v1; simplest v1: edit-only, no reset).
9. **CI wiring** — GitHub repo → Settings → Secrets and variables → Actions → add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as **Variables**; reference them in the build step env.
10. **Deploy + end-to-end test** on the Pages URL.

Implementation order note: steps 2–6 deliver persistence for reads; test them in local dev before starting auth (step 7), so RLS-blocked writes are the only variable during auth testing.

## Design Notes (UI)

- **Read `ui-design-guideline.md` before writing any UI** — use its tokens for inputs, buttons, badges, and dialogs. No new colors or ad-hoc radii.
- Reuse existing patterns: `SearchBox` styling for text inputs, `FilterBar` chip pattern for category/region pickers, `InfoCard`/`PlaceCard` card conventions for the form layout, two-column page shell per guideline at desktop widths.
- New UI stays minimal: one form page, one confirm dialog, an "Add spot" button on `/spots`, Edit/Delete actions on the spot detail view, sign-in in Header.
- Photos for user spots are **URL fields only** in v1 (no uploads); empty `photos` renders the existing empty-gallery state.

## Out of Scope (v1)

- Realtime sync (`postgres_changes`) — last-write-wins is fine for a small group; note Supabase supports it later without schema changes.
- Photo uploads via Supabase Storage.
- Bulk-migrating builtin data into the DB (bundled base layer stays).
- Conflict resolution / edit history.

## Future Migration Note (Express/Spring + MongoDB)

- Write `apiStore.ts` implementing the same `SpotStore` via `fetch('/api/spots')`; swap one line in `SpotsProvider`. Pages/components unchanged.
- Replace `auth/` internals with JWT endpoints (sign-in, refresh, `getToken`); the rest of the app only calls the module's exported API.
- Data export: each DB row maps 1:1 to a Mongo document — no transformation needed.
- Rule that keeps this cheap: **no `@supabase/supabase-js` imports outside `lib/supabaseClient.ts`, `data/store/supabase.ts`, and `auth/`.**

## Verification

- [ ] `npm run build` passes; site renders builtin-only (no crash) when Supabase is unreachable or env vars are absent
- [ ] Local dev: add spot → appears on `/spots` and persists across reload; edit a builtin spot → override appears on list, schedule, and detail views; delete → hidden everywhere after reload
- [ ] RLS check with `curl` using the anon key from the bundle: insert/update are rejected when signed out
- [ ] Magic-link sign-in works from both `http://localhost:5173/` and the Pages URL; non-allowlisted email can sign in but writes are rejected
- [ ] `/spot/new` and `/spot/:slug/edit` routes work under HashRouter on the deployed Pages URL
- [ ] Build-data pipeline unaffected: `npm run build:data` output unchanged
- [ ] No Supabase SDK import outside the three allowed files (grep check)


database password: JEJUTrip2026
postgresql://postgres:[PASSWORD]@db.jhevadkvoccebqbxuqyc.supabase.co:5432/postgres