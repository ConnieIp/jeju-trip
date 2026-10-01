# Implementation Plan: Fix Style Mismatches with Prototype

## Overview

The React app's styles diverge significantly from the Figma prototype. The root cause is that the theme tokens in `index.css` and many component-level Tailwind classes use incorrect values. The `ui-design-guideline.md` also contains some values that don't match the actual prototype CSS. This plan fixes all three: theme tokens, component styles, and the design guideline document.

## Source of Truth

The prototype CSS at `reference/prototype/index.css` (compiled from Figma) is the authoritative source. Key values extracted directly from it:

| Token | Prototype Value | Current App Value | Current Guideline Value |
|-------|----------------|-------------------|------------------------|
| Background | `#f5f3ee` | `#ede8df` | `#ede8df` |
| Root color | `#16303a` | `#1a2e35` | `#1a2e35` |
| Muted text | `#6e7e82` | `#6b7f85` | `#6b7f85` |
| Teal (dark) | `#0e5267` | `#2d7a7a` | `#2d7a7a` |
| Teal (mid) | `#15718a` / `#16809a` | — | — |
| Teal light | `#ddeef1` | `#e8f4f0` | `#e8f4f0` |
| Amber | `#f28b2e` | `#e8913a` | `#e8913a` |
| Amber light | `#fff0df` | `#fef3e2` | `#fef3e2` |
| Border | `#dce3e1` | `#d5d0c8` | `#d5d0c8` |
| Card radius | `22px` | `16px` | `16px` |
| Stop card radius | `20px` | `16px` | `20px` |
| Pill radius | `999px` | `20px` | `20px` |
| Max width | `min(1310px, 100% - 80px)` | `1200px` | `1200px` |
| Font | Inter (via Figma CDN) | System fonts | System fonts |

## Files to Modify

### 1. `trip/src/index.css` — Theme tokens
### 2. `trip/src/components/layout/Header.tsx`
### 3. `trip/src/components/schedule/DayTabs.tsx`
### 4. `trip/src/components/schedule/StopCard.tsx`
### 5. `trip/src/components/schedule/TimelineRow.tsx`
### 6. `trip/src/components/schedule/RouteOverview.tsx`
### 7. `trip/src/components/schedule/LocalNote.tsx`
### 8. `trip/src/components/schedule/BackupCard.tsx`
### 9. `trip/src/components/ui/SearchBox.tsx`
### 10. `trip/src/components/ui/FilterBar.tsx`
### 11. `trip/src/components/ui/PlaceCard.tsx`
### 12. `trip/src/components/ui/Breadcrumbs.tsx`
### 13. `trip/src/components/ui/PhotoGallery.tsx`
### 14. `trip/src/components/ui/InfoCard.tsx`
### 15. `trip/src/pages/SchedulePage.tsx`
### 16. `trip/src/pages/SpotsPage.tsx`
### 17. `trip/src/pages/DayDetailPage.tsx`
### 18. `ui-design-guideline.md` — Update to match prototype

## Implementation Steps

### Step 1: Fix theme tokens in `index.css`

Update `@theme` block with correct prototype values:

```css
@theme {
  --color-bg: #f5f3ee;
  --color-card: #ffffff;
  --color-ink: #16303a;
  --color-ink-light: #233a42;
  --color-muted: #6e7e82;
  --color-teal: #0e5267;
  --color-teal-mid: #15718a;
  --color-teal-bright: #16809a;
  --color-teal-dark: #16303a;
  --color-teal-light: #ddeef1;
  --color-amber: #f28b2e;
  --color-amber-light: #fff0df;
  --color-yellow: #ffe500;
  --color-border: #dce3e1;
  --color-dark-card: #143843;
  --color-muted-light: #9eaaa9;
  --color-sidebar-muted: #afc2c7;
  --color-connector: #98c1c8;

  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif;

  --radius-card: 22px;
  --radius-card-sm: 20px;
  --radius-pill: 999px;
  --radius-pill-sm: 14px;
  --radius-photo: 15px;
}
```

Add Inter font import via Google Fonts (or use the Figma CDN `@font-face` rules).

### Step 2: Fix Header component

- Border-bottom: `#dce3e1`
- Nav button active: bg `#ddeef1`, text `#0e5267`
- Date pill: bg `#f5f3ee`
- Avatar: bg `#fff0df`, text `#f28b2e`

### Step 3: Fix DayTabs

- Grid: `repeat(5, 1fr)`, gap `10px`
- Button height: `92px`, padding `14px 18px`, radius `14px`
- Active: bg `#16303a`, border `#16303a`, day label `#f28b2e`

### Step 4: Fix StopCard

- Photo: `150px × 106px` (landscape), radius `15px` (not `64×64` square)
- Card radius: `20px`, shadow: `0 8px 24px #15323a0d`
- Title color: `#0e5267`

### Step 5: Fix TimelineRow

- Grid: `74px 16px 1fr`, gap `12px`
- Dot: `11px`, border `3px solid #16809a`, bg white (not filled)
- Connector: `1px solid #98c1c8`

### Step 6: Fix RouteOverview

- Dark bg `#143843`, radius `22px`, shadow `0 8px 24px #15323a14`
- Image header: `190px` height
- Stats text: dt `16px` bold, dd `#9db6bc` `10px`

### Step 7: Fix LocalNote

- Background: `#fff0df` (not `#fef9c3`)
- Radius: `22px`

### Step 8: Fix PlaceCard (SpotsPage)

- Radius: `22px`, shadow: `0 8px 24px #15323a12` (always, not just hover)
- Photo height: `180px`
- Info padding: `18px`
- Category badge: Sight = `#0e5267` on `#ddeef1`; Cafe/Restaurant = `#f28b2e` on `#fff0df`

### Step 9: Fix SearchBox & FilterBar

- Search: radius `14px`, height `54px`
- Filter selected: bg `#16303a` (not `--color-ink`)
- kbd: bg `#f5f3ee`, radius `8px`

### Step 10: Fix SpotsPage

- Add collection summary dark bar (`#143843` bg with amber circle badge)
- Grid: `repeat(4, 1fr)`, gap `32px 18px`
- Max width: `min(1310px, 100% - 80px)`

### Step 11: Fix Breadcrumbs, PhotoGallery, InfoCard

- Breadcrumbs: `11px`, gap `12px`, link color `#0e5267`
- Gallery: radius `22px`, grid `2fr 0.92fr`, height `430px`
- InfoCard: radius `22px`, padding `24px`

### Step 12: Fix SchedulePage & DayDetailPage layout

- Page shell: `width: min(1310px, 100% - 80px)`
- Day layout: `1fr 360px`, gap `34px`
- Section padding-bottom: `72px`

### Step 13: Update `ui-design-guideline.md`

Update all token values to match the prototype's actual CSS. Key corrections:
- Background: `#f5f3ee` (not `#ede8df`)
- Ink: `#16303a` (not `#1a2e35`)
- Muted: `#6e7e82` (not `#6b7f85`)
- Teal: `#0e5267` (not `#2d7a7a`)
- Teal-dark: `#16303a` (not `#1a5c5c`)
- Teal-light: `#ddeef1` (not `#e8f4f0`)
- Amber: `#f28b2e` (not `#e8913a`)
- Amber-light: `#fff0df` (not `#fef3e2`)
- Border: `#dce3e1` (not `#d5d0c8`)
- Card radius: `22px` primary (not `16px`)
- Pill radius: `999px` (not `20px`)
- Max width: `min(1310px, 100% - 80px)` (not `1200px`)
- Font: Inter (not system fonts)
- Category badges: Sight = `#0e5267`/`#ddeef1`; Cafe/Restaurant/Souvenir = `#f28b2e`/`#fff0df`
- Add missing tokens: `--color-teal-mid: #15718a`, `--color-teal-bright: #16809a`, `--color-muted-light: #9eaaa9`, `--color-sidebar-muted: #afc2c7`, `--color-connector: #98c1c8`

## Verification

- [ ] Run `npm run dev` and visually compare each page against the Figma prototype
- [ ] Check colors match (background, text, accents, borders)
- [ ] Check typography (Inter font loads correctly)
- [ ] Check card radii and shadows
- [ ] Check StopCard photo is landscape `150×106`, not square thumbnail
- [ ] Check RouteOverview is dark card with image header
- [ ] Check day tabs active state uses `#16303a` bg with `#f28b2e` label
- [ ] Check timeline dots are hollow with teal border
- [ ] Check category badges use correct teal/amber palette
- [ ] Verify `ui-design-guideline.md` values all match prototype
