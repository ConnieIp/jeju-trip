# Jeju Trip React App Implementation Plan

## Context

Build a React + TypeScript web application to display a 6-day Jeju island trip itinerary. The app will showcase the schedule, all attractions/restaurants/cafes, and detailed information for each location. The design must match the Figma prototype at `/reference/prototype/` pixel-for-pixel.

**Why now:** The project has comprehensive markdown documentation and a complete design prototype, but no application code exists. The `/trip/` directory is empty and ready for implementation.

## Tech Stack

- **Build Tool:** Vite (fast HMR, native ESM, excellent TypeScript support)
- **Framework:** React 18 + TypeScript (strict mode)
- **Routing:** React Router v6 (declarative routes, dynamic params for day details)
- **Styling:** Tailwind CSS v4 (matches prototype exactly, utility-first)
- **Data:** Build-time markdown parsing → JSON modules (zero runtime overhead, type-safe)

**Rationale:** The prototype is a React SPA with Tailwind CSS. Matching the tech stack eliminates translation errors and ensures design fidelity. Vite is simpler than Next.js for this static content site.

## Project Structure

```
trip/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.ts
├── postcss.config.js
├── public/
│   └── photos/              # Symlinked from ../docs/photos/
├── scripts/
│   └── build-data.ts        # Markdown → JSON parser
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css            # Tailwind + design tokens
│   ├── data/
│   │   ├── types.ts         # TypeScript interfaces
│   │   ├── schedule.ts      # Generated schedule data
│   │   ├── spots.ts         # Generated spots data
│   │   └── generated/       # Build output (gitignored)
│   ├── components/
│   │   ├── layout/          # Header, PageShell, Footer
│   │   ├── ui/              # CategoryBadge, InfoCard, PlaceCard, etc.
│   │   └── schedule/        # DayTabs, TimelineRow, StopCard, etc.
│   ├── pages/
│   │   ├── SchedulePage.tsx
│   │   ├── SpotsPage.tsx
│   │   └── DayDetailPage.tsx
│   ├── hooks/
│   │   ├── useSpots.ts      # Filter/search logic
│   │   └── useSchedule.ts   # Day selection logic
│   └── utils/
│       ├── photo.ts         # Photo path resolution
│       └── format.ts        # Date/time formatting
└── .gitignore
```

## Implementation Phases

### Phase 1: Project Scaffolding

1. Initialize Vite + React + TypeScript in `/trip/`
2. Install dependencies: `react-router-dom`, `tailwindcss`, `@tailwindcss/vite`, `gray-matter`, `marked`
3. Configure Tailwind v4 with design tokens from `extracted.html`:
   - Colors: `#ede8df` (bg), `#1a2e35` (ink), `#2d7a7a` (teal), `#e8913a` (amber), etc.
   - Typography: -apple-system font stack, 42px hero titles, 14-15px body
   - Spacing: 16px card radius, 24px padding, 1200px max-width
4. Set up directory structure
5. Symlink `../docs/photos/` to `public/photos/`

### Phase 2: Data Pipeline

Build `scripts/build-data.ts` to parse markdown → JSON:

**Markdown Parser Logic:**
- Split by `## ` headers
- Parse `## 基本資訊` section: extract `- key：value` bullet lists (Chinese colon)
- Parse tables (opening hours), nested lists (hiking routes), links
- Resolve photo paths using naming convention: `{slug}-{1|2|3}.jpg`
- Handle slug mismatches (e.g., `camellia-forest.md` → `dongbaek-forest-{1,2,3}.jpg`)

**Output Files:**
- `generated/attractions.json`, `restaurants.json`, `cafes.json`, `bakeries.json`, `souvenirs.json`, `accommodations.json`
- `generated/schedule.json` (6 days with time-blocked stops)
- `generated/slug-map.json` (markdown slug → photo directory mapping)

**TypeScript Interfaces:**
```typescript
interface BaseSpot {
  slug: string;
  name: string;
  nameZh?: string;
  nameKo?: string;
  category: 'attraction' | 'restaurant' | 'cafe' | 'bakery' | 'souvenir';
  region: 'east' | 'north' | 'west' | 'south' | 'central';
  address?: string;
  features: string[];
  photos: string[];
  // ... optional fields vary by category
}

interface DaySchedule {
  day: number;
  date: string;
  title: string;
  route: string;
  stops: ScheduleStop[];
  accommodation?: { name: string; slug: string };
}
```

### Phase 3: Layout and Navigation

1. Build `Header` component (brand logo, nav tabs, date pill, avatar)
2. Build `PageShell` (max-width 1200px, centered, 32px padding)
3. Set up React Router with 3 routes:
   - `/` → SchedulePage
   - `/spots` → SpotsPage
   - `/day/:dayNumber` → DayDetailPage (or `/spot/:slug` for individual spots)
4. Wire up navigation between pages

### Phase 4: Schedule Page

Build the schedule overview page matching the prototype:

**Components:**
- `ScheduleHero`: eyebrow ("Five days around the island"), title, weather widget
- `DayTabs`: 6 horizontal tabs (Oct 25-30) with active state
- `TimelineRow`: time label (right-aligned) + route dot + stop card
- `StopCard`: horizontal card with photo thumbnail, category badge, title, description
- Sidebar: `RouteOverview` (dark card with stats), `LocalNote` (amber card), `BackupCard`

**Layout:** Two-column grid (1fr + 320px sidebar), collapses at 980px

**Interactions:**
- Day tab click switches active day timeline
- Stop card click navigates to detail page

### Phase 5: Spots Page

Build the spot list/library page:

**Components:**
- `LibraryHero`: title ("Places worth pulling over for"), collection summary card
- `SearchBox`: search input with Cmd+K shortcut hint
- `FilterBar`: category filter pills (All, Sights, Cafes, Restaurants, etc.)
- `PlaceCard`: photo (160px height) + bookmark button + category badge + title + description + schedule indicator

**Layout:** 4-column responsive grid (→ 2 cols at 980px, → 1 col at 640px)

**Interactions:**
- Search filters spots by name/description
- Category filter shows/hides by type
- Place card click navigates to detail page

### Phase 6: Detail Pages

Build individual spot detail pages:

**Components:**
- `Breadcrumbs`: Saved spots > Category > Spot name
- `DetailTitle`: category badge + UNESCO badge (if applicable) + title (42px/800 weight) + address + Share/Saved buttons
- `PhotoGallery`: 2-column grid (hero 2/3 width + 2 stacked side images), 430px height
- `WhyCard`: description + 3 quick-fact pills (time needed, trail, entry fee)
- `NotesCard`: bullet list + amber blockquote
- `DirectionsCard`: dark background + Naver Map button (teal) + Kakao Map button (yellow)
- `PracticalInfoCard`: hours table, contact, parking, weather note
- `InScheduleCard`: day badge + time badge + date

**Layout:** Two-column (main content + 380px sidebar), collapses at 980px

### Phase 7: Responsive and Polish

1. Test all breakpoints: 1200px+ (desktop), 980px (tablet), 640px (mobile)
2. Fix responsive issues:
   - Sidebar moves below main content at 980px
   - Grids collapse: 4→2→1 columns
   - Day tabs become horizontal scroll at 640px
   - Gallery stacks vertically at 640px
3. Add hover states and transitions
4. Verify all photo paths resolve correctly
5. Cross-check design against Figma renders in `reference/prototype/figma-renders/`

### Phase 8: Data Completeness

1. Verify all 45 markdown files parse correctly
2. Handle edge cases (missing fields, unusual formats)
3. Build slug mapping for photo name mismatches
4. Add fallback images for spots without photos
5. Test all internal links between pages

## Key Technical Challenges

### 1. Markdown Parsing Without Frontmatter

**Problem:** Markdown files use `## 基本資訊` sections with Chinese-colon bullet lists instead of YAML frontmatter.

**Solution:** Custom parser that:
- Splits by `## ` headers
- Parses `- key：value` lines with regex
- Handles tables, nested lists, links
- Uses state machine approach for varying section formats

### 2. Photo Filename Mismatches

**Problem:** Photo filenames don't always match markdown slugs (e.g., `camellia-forest.md` → `dongbaek-forest-{1,2,3}.jpg`).

**Solution:** Generate `slug-map.json` during build:
- List all photo directories
- Match to markdown slugs using fuzzy matching or manual mapping
- Store mapping in generated data

### 3. Schedule-Spot Linking

**Problem:** Schedule stops reference spots by name, but spot data uses slugs.

**Solution:** During build:
- Create name-to-slug index from all parsed spots
- Resolve each schedule stop's title against this index
- Attach `slug` field to each `ScheduleStop`

## Critical Files

- `/reference/prototype/extracted.html` — Design reference with corrected CSS tokens
- `/reference/prototype/index.css` — Tailwind v4 stylesheet (21KB)
- `/docs/schedule/schedule.md` — Master itinerary (6 days)
- `/docs/attraction/east/seongsan-ilchulbong.md` — Complex attraction example (UNESCO, hiking, hours table)
- `/docs/photos/` — 60+ photos organized by category

## Verification

1. **Build verification:** Run `npm run build` and verify all markdown files parse without errors
2. **Visual verification:** Compare each page against Figma renders in `reference/prototype/figma-renders/`
3. **Responsive verification:** Test at 1200px, 980px, and 640px breakpoints
4. **Data verification:** Verify all 17 attractions, 12 restaurants, 10 cafes, 2 bakeries, 1 souvenir, 3 accommodations render correctly
5. **Navigation verification:** Test all links between schedule → spots → detail pages
6. **Photo verification:** Verify all photos load correctly (check slug mapping)

## Success Criteria

- All 3 page types render correctly (Schedule, Spots, Detail)
- Design matches prototype pixel-for-pixel
- All 45 markdown files parse and display correctly
- Responsive at all 3 breakpoints
- Navigation works between all pages
- Photos load for all spots
- Build completes without errors
