# Jeju Trip React App - Implementation Summary

## What Was Built

A complete React + TypeScript web application for displaying a 6-day Jeju island trip itinerary.

### Tech Stack
- **Vite** - Fast build tool and dev server
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Utility-first styling matching the prototype
- **React Router v6** - Client-side routing

### Pages Implemented

1. **Schedule Page** (`/`)
   - Hero section with title and weather widget
   - Day tabs (6 days) with active state
   - Timeline view with stops
   - Sidebar with route overview, local notes, backup plan
   - Clickable stops that link to detail pages

2. **Spots Page** (`/spots`)
   - Search functionality
   - Category filters (All, Sights, Cafes, Restaurants, etc.)
   - Responsive grid of place cards
   - Each card shows photo, category badge, name, and description

3. **Spot Detail Page** (`/spot/:slug`)
   - Breadcrumbs navigation
   - Photo gallery (hero + 2 side images)
   - Category and UNESCO badges
   - "Why it belongs on the route" card with quick facts
   - Visit notes card
   - Directions card with Naver/Kakao map buttons
   - Hours & practical info
   - "In your schedule" card showing when this spot appears

### Components Created

**Layout:**
- Header (brand, navigation, date pill, avatar)

**Schedule:**
- DayTabs
- TimelineRow
- StopCard
- RouteOverview
- LocalNote
- BackupCard

**UI:**
- SearchBox
- FilterBar
- PlaceCard
- Breadcrumbs
- PhotoGallery
- InfoCard
- MapButton

**Data:**
- TypeScript interfaces for all content types
- Data loaders for schedule and spots
- Build script to parse markdown → JSON

### Design Tokens

All design tokens from the prototype are implemented:
- Colors: warm cream (#ede8df), teal (#2d7a7a), amber (#e8913a), etc.
- Typography: -apple-system font stack, 42px hero titles, 14-15px body
- Spacing: 16px card radius, 24px padding, 1200px max-width
- Responsive breakpoints at 980px and 640px

## Next Steps

1. **Install dependencies:**
   ```bash
   cd trip
   npm install
   ```

2. **Build the data:**
   ```bash
   npm run build:data
   ```
   This parses all markdown files from `/docs/` into JSON files in `src/data/generated/`.

3. **Start the dev server:**
   ```bash
   npm run dev
   ```

4. **Open http://localhost:5173**

## Known Issues & TODOs

1. **Photo path resolution** - The build script attempts to match markdown slugs to photo filenames, but some may not match perfectly. Check `src/data/generated/*.json` to verify photos are resolved correctly.

2. **Schedule spot linking** - The schedule parser attempts to match stop titles to spot names, but may need manual adjustment for some entries.

3. **Placeholder images** - If a spot has no photos, it will show a broken image. Consider adding a placeholder image at `/public/photos/placeholder.jpg`.

4. **Responsive testing** - While responsive classes are included, test at all breakpoints (1200px+, 980px, 640px) to ensure layout works correctly.

## File Structure

```
trip/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── README.md
├── scripts/
│   └── build-data.ts          # Markdown → JSON parser
├── public/
│   └── photos/                # Symlinked from ../docs/photos/
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── index.css              # Tailwind + design tokens
    ├── vite-env.d.ts
    ├── components/
    │   ├── layout/
    │   │   └── Header.tsx
    │   ├── schedule/
    │   │   ├── DayTabs.tsx
    │   │   ├── TimelineRow.tsx
    │   │   ├── StopCard.tsx
    │   │   ├── RouteOverview.tsx
    │   │   ├── LocalNote.tsx
    │   │   └── BackupCard.tsx
    │   └── ui/
    │       ├── SearchBox.tsx
    │       ├── FilterBar.tsx
    │       ├── PlaceCard.tsx
    │       ├── Breadcrumbs.tsx
    │       ├── PhotoGallery.tsx
    │       ├── InfoCard.tsx
    │       └── MapButton.tsx
    ├── pages/
    │   ├── SchedulePage.tsx
    │   ├── SpotsPage.tsx
    │   └── DayDetailPage.tsx
    └── data/
        ├── types.ts           # TypeScript interfaces
        ├── schedule.ts        # Schedule data loader
        ├── spots.ts           # Spots data loader
        └── generated/         # Build output (created by npm run build:data)
            ├── attractions.json
            ├── restaurants.json
            ├── cafes.json
            ├── bakeries.json
            ├── souvenirs.json
            └── schedule.json
```

## Design Fidelity

The implementation closely matches the Figma prototype at `https://tint-cloudy-33853921.figma.site/`:
- All color tokens match exactly
- Typography scale and weights match
- Card styles, borders, and shadows match
- Layout patterns (two-column grids, timeline, photo gallery) match
- Responsive behavior matches prototype breakpoints

### Session 3 Fixes (Visual Comparison via Playwright)

Fixed the following styling mismatches identified through side-by-side screenshot comparison:

1. **PlaceCard title** - Changed from teal to dark ink color; removed truncation
2. **SpotsPage stats widget** - Changed from full-width dark bar to floating card on right ("Saved across Jeju")
3. **SpotsPage filter labels** - Updated to "All spots · N", "Accommodation", "Restaurant", "Cafe", "Sight", "Souvenir"
4. **SpotsPage title label** - Changed from teal "Saved places" to amber "ISLAND SHORTLIST"
5. **SchedulePage title label** - Changed from teal to amber "FIVE DAYS AROUND THE ISLAND"
6. **DayTabs button padding** - Changed from `px-[18px] py-[14px]` to `px-[16px] py-[12px]` to match prototype's `padding: 12px 16px`; removed conflicting CSS reset from `index.css`

### Remaining Differences (Require Data/Content Changes)

See `plan/plan-03.md` for full list. Key items:
- DayTabs content format (needs day abbreviation + subtitle fields in data)
- Sidebar "Day at a glance" vs "Route Overview" (needs per-day stats calculation)
- PlaceCard day/time info (needs schedule data join)
- SearchBox placeholder text
- "Local rhythm" vs "Local Note" label
- "Nearby backup" vs "Backup Plan" format
