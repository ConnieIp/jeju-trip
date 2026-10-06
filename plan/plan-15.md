# Implementation Plan: Island Notes

## Overview
Build a notes feature for the "Island notes" tab. After login, users can create, edit, and delete text notes with a title and content body. URLs in note content are auto-detected and rendered as clickable links.

## Database

### New table: `notes`
| Column | Type | Notes |
|---|---|---|
| `id` | uuid, PK, default gen_random_uuid() | |
| `title` | text, not null | |
| `content` | text, not null | |
| `created_by` | uuid, references auth.users(id), not null | |
| `created_at` | timestamptz, default now() | |
| `updated_at` | timestamptz, default now() | |

RLS: users can CRUD only their own notes (`created_by = auth.uid()`).

## Files to Create/Modify

### New files
- `trip/src/data/notesStore.ts` — CRUD operations for notes table
- `trip/src/pages/NotesPage.tsx` — Notes list page with add/edit/delete
- `trip/src/components/ui/NoteCard.tsx` — Card component for displaying a note
- `trip/src/components/ui/NoteForm.tsx` — Form modal for creating/editing a note

### Modified files
- `trip/src/App.tsx` — Add `/notes` route

## Implementation Steps

1. **Create SQL migration** for `notes` table (provide SQL for user to run in Supabase dashboard)
2. **Create `notesStore.ts`** — `listNotes()`, `createNote()`, `updateNote()`, `deleteNote()`
3. **Create `NoteCard.tsx`** — Displays title, content with URL auto-linking, edit/delete buttons
4. **Create `NoteForm.tsx`** — Modal form with title + content fields
5. **Create `NotesPage.tsx`** — List view, search, add button, auth-gated
6. **Update `App.tsx`** — Add route for `/notes`
7. **URL detection** — Regex to find URLs in content, render as clickable `<a>` tags

## Design Notes
- Follow existing page layout pattern (SpotsPage): max-width container, header with badge, card grid
- Use existing Modal and ConfirmDialog components
- Auth-gated: show sign-in prompt for unauthenticated users
- Card style: `bg-card border border-border rounded-card` with shadow
- Typography: match existing design tokens

## Verification
- [ ] Notes list loads for authenticated users
- [ ] Can create a note with title and content
- [ ] Can edit an existing note
- [ ] Can delete a note with confirmation
- [ ] URLs in content render as clickable links
- [ ] Unauthenticated users see sign-in prompt
- [ ] Responsive layout works on mobile
