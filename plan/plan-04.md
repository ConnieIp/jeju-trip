# Implementation Plan: GitHub Pages Deployment

## Overview
Deploy the existing React + Vite app to GitHub Pages as a static site.

## Changes Made

### 1. Vite Config — `trip/vite.config.ts`
- Added `base: '/jeju-trip/'` so asset paths are prefixed correctly for GitHub Pages

### 2. Router — `trip/src/main.tsx`
- Changed `BrowserRouter` → `HashRouter` for static hosting compatibility
- URLs work as `/#/`, `/#/spots`, `/#/spot/udo`, etc.

### 3. Photo Paths — `trip/src/lib/photoUrl.ts` (new)
- Created `photoUrl()` helper that prepends `import.meta.env.BASE_URL`
- Updated `PhotoGallery.tsx`, `StopCard.tsx`, `PlaceCard.tsx` to use it

### 4. Schedule Data — `trip/scripts/build-data.ts`
- Fixed regex to match schedule lines starting with `- ` (markdown list prefix)
- Added support for single-time entries (no end time)
- Schedule stops now correctly populated from `docs/schedule/schedule.md`

### 5. HTML Entry — `trip/index.html`
- Updated title to `濟州島旅行 — Jeju Trip`
- Set `lang="zh-HK"`
- Removed broken `/vite.svg` favicon reference

### 6. Build Scripts — `trip/package.json`
- `build` now runs `build:data` first, then `tsc` + `vite build`
- Added `deploy` script: `npm run build && gh-pages -d dist`

### 7. GitHub Actions — `.github/workflows/deploy.yml` (new)
- Triggers on push to `main`
- Builds data + app in `trip/` directory
- Deploys `trip/dist/` to GitHub Pages via official actions

## How to Deploy

### Automatic (on push to main)
Push to `main` → GitHub Actions builds and deploys automatically.

### Manual
```bash
cd trip
npm run deploy
```

## First-Time GitHub Pages Setup
1. Go to repo Settings → Pages
2. Under "Build and deployment" → Source: select **GitHub Actions**
3. Push to `main` — the workflow handles the rest

## Site URL
`https://connieip.github.io/jeju-trip/`

## Verification
- [x] `npm run build` succeeds
- [x] `dist/index.html` has `/jeju-trip/` prefixed assets
- [x] `dist/photos/` contains all photo directories
- [x] Schedule stops populated (17 attractions, 12 restaurants, 10 cafes, 2 bakeries, 1 souvenir)
- [x] HashRouter configured for static hosting
- [x] GitHub Actions workflow created
