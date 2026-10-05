# Implementation Plan: Photo Upload & Management in Spot Edit Page

## Overview

Replace the plain textarea for photo URLs in the SpotForm with an interactive photo management component. Users can upload photos from their device, see thumbnails of existing photos, reorder them, and delete them.

## Current State

- `SpotForm.tsx` has a simple `<textarea name="photos">` where users manually type bucket-relative paths
- Photos are stored as bucket-relative paths (e.g., `attraction/udo-1.jpg`) in the `photos: string[]` array
- Supabase Storage bucket `photos` is public
- `photoUrl()` helper converts bucket paths to public URLs for display

## Target State

- Photo section shows existing photos as thumbnails with reorder/delete controls
- A file upload area lets users pick images from their device
- Uploaded files go directly to Supabase Storage under `{category}/` prefix
- After upload, the bucket-relative path is added to the photos list
- Users can drag to reorder or click delete on existing photos

## Files to Create

### `trip/src/components/ui/PhotoUploader.tsx` (new)
- Receives `photos: string[]` and `onChange: (photos: string[]) => void` and `category: Category`
- Renders a grid of photo thumbnails (existing + newly uploaded)
- Each thumbnail has:
  - Preview image (via `photoUrl()`)
  - Delete button (X overlay)
  - Drag handle or arrow buttons for reordering
- File input area at the bottom (click to browse or drag-and-drop)
- Upload progress indicator per file
- Uploads to Supabase Storage: `{category}/{slug-or-uuid}-{timestamp}.jpg`
- After successful upload, calls `onChange` with updated paths array
- Max 6 photos

### `trip/src/lib/uploadPhoto.ts` (new)
- `uploadPhoto(file: File, category: string): Promise<string>` — uploads a single file to Supabase Storage
- Generates unique filename: `{category}/{crypto.randomUUID()}.jpg`
- Returns bucket-relative path (e.g., `attraction/abc-123.jpg`)
- Uses Supabase client with anon key (user must be authenticated)

## Files to Modify

### `trip/src/components/ui/SpotForm.tsx`
- Replace the photos `<textarea>` with `<PhotoUploader>`
- Manage photos as state instead of reading from FormData
- Pass `category` to PhotoUploader (reactive to category dropdown changes)
- On form submit, merge photos state into the spot object

### `trip/src/pages/SpotFormPage.tsx`
- No changes needed (already passes `initial` and handles submit)

## Supabase Storage Policy

For client-side uploads to work with the anon key, a storage policy is needed:
- Allow authenticated users to upload to the `photos` bucket
- Allow public read access (already set via public bucket)
- SQL: `CREATE POLICY "Authenticated users can upload photos" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'photos');`

## Design Notes

- Thumbnails are 100x100px with `object-cover`, rounded corners matching card style
- Delete button: small red X in top-right corner of thumbnail
- Reorder: left/right arrow buttons below each thumbnail
- Upload area: dashed border, camera icon, "Upload photos" text
- Upload progress: thin progress bar under each uploading thumbnail
- Grid: 4 columns on desktop, 3 on tablet, 2 on mobile
- Existing photos show full preview; uploading photos show a loading overlay

## Verification

- [ ] TypeScript compiles with no errors
- [ ] Existing photos display as thumbnails in edit mode
- [ ] Can delete a photo (removed from list)
- [ ] Can reorder photos (arrows change order)
- [ ] Can upload new photos (file picker → uploads to Supabase Storage → thumbnail appears)
- [ ] Uploaded photo paths are bucket-relative format
- [ ] Form submit saves updated photos array
- [ ] Works for both new spot creation and editing existing spots
