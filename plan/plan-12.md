# Implementation Plan: Upload Photos to Supabase Storage

## Overview

Migrate photo storage from local static files (served via symlink) to Supabase Storage. Photos will be uploaded to a Supabase Storage bucket and served from Supabase's CDN, removing the dependency on local file serving.

## Current Architecture

- Photos stored as JPG files in `docs/photos/{category}/`
- Symlink `trip/public/photos -> ../../docs/photos` serves them statically via Vite
- Photo paths like `/photos/attraction/udo-1.jpg` stored in database JSONB
- `photoUrl.ts` prepends Vite base URL to generate runtime URLs

## Target Architecture

- Photos uploaded to Supabase Storage bucket named `photos`
- Photo paths stored as `attraction/udo-1.jpg` (bucket-relative) in database
- `photoUrl.ts` generates Supabase Storage public URLs from bucket paths
- Upload script `upload-photos.ts` handles bulk upload to Supabase Storage

## Files to Create

### `trip/scripts/upload-photos.ts` (new)
- Script to upload all photos from `docs/photos/` to Supabase Storage `photos` bucket
- Uses Supabase service role key for upload permissions
- Creates bucket if it doesn't exist (or uses existing)
- Walks `docs/photos/{category}/` directories
- Uploads each file as `{category}/{filename}` (e.g., `attraction/udo-1.jpg`)
- Skips files that already exist (idempotent) unless `--force` flag passed
- Reports progress and summary

## Files to Modify

### `trip/src/lib/photoUrl.ts`
- Remove Vite base URL logic
- Import Supabase client
- Generate public URL via `supabase.storage.from('photos').getPublicUrl(path)`
- Fallback for empty paths unchanged

### `trip/scripts/build-data.ts`
- `resolvePhotosAsync()` now stores paths as `category/filename.jpg` (no leading `/photos/` prefix)
- Change from `/photos/${category}/${photoName}` to `${category}/${photoName}`

### `trip/src/hooks/useCoverPhoto.ts`
- Update fallback from `/photos/placeholder.jpg` to `placeholder.jpg` (bucket-relative)

### `trip/src/pages/SchedulePage.tsx`
- Update `accommodationPhotos` mapping from `/photos/accommodation/...` to `accommodation/...`

### `trip/package.json`
- Add `upload:photos` script: `tsx scripts/upload-photos.ts`

## Design Notes

- Supabase Storage bucket `photos` should be created as a **public** bucket so images can be served without auth
- The `getPublicUrl()` method returns a CDN-backed URL, no signed URLs needed
- Upload script uses service role key (server-side only) — same pattern as `seed-supabase.ts`
- Runtime code uses anon key (client-safe) — same Supabase client as existing code
- Photo paths in DB change from `/photos/attraction/udo-1.jpg` to `attraction/udo-1.jpg`

## Verification

- [ ] Run `npm run upload:photos` — all ~114 photos uploaded to Supabase Storage
- [ ] Verify photos accessible via Supabase public URLs in browser
- [ ] Run `npm run build:data` — generated JSON contains bucket-relative paths
- [ ] Run `npm run seed` — database updated with new paths
- [ ] Run `npm run dev` — app displays photos correctly from Supabase Storage
- [ ] Check PhotoGallery, PlaceCard, StopCard, AccommodationCard all render photos
- [ ] TypeScript compiles with no errors (`tsc --noEmit` exits 0)
