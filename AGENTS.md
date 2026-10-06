# Jeju Trip Web App

A React + TypeScript web app to display the Jeju island trip plan and information.

## Project Overview

This project creates a React + TypeScript web application showcasing a 6-day Jeju island trip (10/25 - 10/30) with self-driving itinerary.

## Prototype

**All implementation must refer to the prototype under `/reference/prototype/` and the design guideline at `ui-design-guideline.md`.**

The prototype contains the design reference:
- `reference/prototype/index.html` - Main HTML structure
- `reference/prototype/index.css` - Styles
- `reference/prototype/index.js` - Interactions
- `reference/prototype/assets/` - Design assets
- `reference/prototype/figma-renders/` - Figma design renders
- `reference/prototype/extracted.html` - Extracted HTML reference

**IMPORTANT**: Before implementing any UI component or page, **read `ui-design-guideline.md`** for:
- Complete design token reference (colors, typography, spacing, radii)
- Component specifications (Header, DayTabs, StopCard, PlaceCard, etc.)
- Layout patterns (page shell, two-column layout, grids)
- Responsive breakpoints (980px tablet, 640px mobile)
- Interactive states (hover, active, selected)
- Icon system and shadow specifications

Full prototype details: `reference/prototype/README.md`

## Page Structure

1. **Schedule Page** - Overview of the 6-day itinerary with daily summaries
2. **Spot List Page** - Complete list of all attractions, restaurants, and cafes
3. **Detail Pages** - Individual pages for each day's schedule with full details

## Data Sources

- `reference/schedule.txt` - Daily itinerary with times, routes, and activities
- `reference/spot.txt` - Detailed information about spots, restaurants, and cafes
- `docs/` - Structured markdown data for all trip content (attractions, restaurants, cafes, etc.)

## Data Management

**IMPORTANT: All trip data is stored in Supabase database, NOT seeded from files.**

### Database-First Approach

1. **DO NOT seed data** unless explicitly instructed by the user
2. **Data already exists** in the Supabase database - query it directly from the DB
3. **When updating data**, update the Supabase database directly
4. **Before ANY data change** (insert, update, delete), you MUST:
   - Backup the affected table data to `/db_backup/` folder first
   - Use filename pattern: `{table_name}_{YYYY-MM-DD_HH-MM-SS}.json`
   - Include all rows from the table being modified

### Backup Procedure

Before modifying any data in the database:

```bash
# Create backup directory if it doesn't exist
mkdir -p /db_backup

# Backup format: {table_name}_{timestamp}.json
# Example: attractions_2026-10-05_14-30-00.json
```

**Backup must include:**
- All rows from the table being modified
- Timestamp of backup
- Clear filename indicating which table and when

### Why This Matters

- Prevents accidental data loss
- Allows rollback if changes cause issues
- Maintains data integrity
- User has explicitly requested this workflow

**NEVER skip the backup step when making database changes.**

## Project Structure

```
jeju-trip/
├── ui-design-guideline.md  # Design tokens, component specs, layout patterns (READ BEFORE UI WORK)
├── reference/              # Raw trip data, prototype, and information
│   ├── schedule.txt        # Daily itinerary
│   ├── spot.txt            # Spot details
│   └── prototype/          # Design prototype (MUST refer to for implementation)
│       ├── index.html
│       ├── index.css
│       ├── index.js
│       ├── assets/
│       ├── figma-renders/
│       └── extracted.html
├── plan/                   # Implementation plans (MUST create before coding)
│   ├── plan-01.md          # First implementation plan
│   ├── plan-02.md          # Second implementation plan
│   └── plan-NN.md          # Subsequent plans (increment number)
├── docs/                   # Structured markdown content
│   ├── accommodation.md
│   ├── schedule/
│   │   └── schedule.md
│   ├── attraction/         # Attraction details by region
│   │   ├── east/           # udo, seongsan-ilchulbong, seongeup, sangumbul
│   │   ├── north/          # dongmun-market, dodu-rainbow-coastal-road, jeju-art-museum
│   │   ├── west/           # 981-park, arte-museum, camellia-hill, hallim-cactus-village,
│   │   │                   # hyeopjae-beach, itami-jun-museum, osulloc-tea-museum
│   │   ├── south/          # perfume-museum
│   │   └── central/        # camellia-forest, hye-ri
│   ├── restaurant/         # Restaurant details by region
│   │   ├── east/           # pigalhoeok
│   │   ├── north/          # annyeong-jeonbok, giho-hoejip, ige-bapdoduk,
│   │   │                   # jeju-yukuro, sukseongdo, tongkeun-jang-eo
│   │   ├── west/           # dun-she-dun, hallaso-gopchang, jeju-bonyeon, manwol-sutbul-gui
│   │   ├── south/          # nogorok
│   │   └── central/
│   ├── cafe/               # Cafe details by region
│   │   ├── east/           # dalkom-ajae, mou-moon
│   │   ├── north/          # the-berlin
│   │   ├── west/           # album-oedo, assisi, flowave, haejigae, saebil-cafe
│   │   ├── south/          # gyulkkot-darak, vadada
│   │   └── central/
│   ├── bakery/             # Bakery details by region
│   │   ├── east/           # audrant-bakery, london-bagel-museum
│   │   └── ...
│   ├── souvenir/           # Souvenir shop details by region
│   │   ├── north/          # my-jeju-gift
│   │   └── ...
│   └── photos/             # Photos for attractions, cafes, restaurants, accommodation
│       ├── attraction/
│       ├── cafe/
│       ├── restaurant/
│       └── accommodation/
└── trip/                   # React + TypeScript app code (to be built)
```

## Tech Stack

- **Framework:** React
- **Language:** TypeScript
- **App location:** `trip/` folder

## Content Guidelines

### Attraction Markdown Files

When creating new attraction markdown files in `docs/attraction/`, include the following information:

**Required fields:**
- **Description** - Brief overview of the attraction
- **Address** - Full address in Korean and/or English
- **Opening hours** - Operating times, including any seasonal variations
- **Closing days** - Regular closure days (if any)
- **Admission fee** - Ticket prices (if applicable)
- **Contact/Phone** - Contact number (if available)

**Recommended fields:**
- **Region** - Which area of Jeju (east/west/north/south/central)
- **Visit duration** - Suggested time to spend
- **Highlights** - Key features or things to see
- **Tips** - Visitor tips, best times to visit, photo spots
- **Nearby spots** - Other attractions or restaurants nearby
- **Photos** - Link or reference to photos in `docs/photos/attraction/`

**Example structure:**
```markdown
# Attraction Name

## Description
Brief overview...

## Information
- **Address**: 제주시 ...
- **Hours**: 09:00 - 18:00
- **Closed**: Mondays
- **Admission**: Adults 2,000 KRW
- **Phone**: 064-xxx-xxxx

## Highlights
- Feature 1
- Feature 2

## Tips
Best time to visit...
```

## Development Workflow

### Implementation Planning (REQUIRED)

**Before implementing any feature or page in the `trip/` folder, you MUST:**

1. **Create an implementation plan** in the `plan/` folder
2. **Name the file** using the pattern `plan-NN.md` where NN is the next sequential number (e.g., `plan-01.md`, `plan-02.md`, `plan-03.md`)
3. **Check existing plans** to determine the next number
4. **Include in the plan:**
   - What feature/page you're implementing
   - Files to create or modify
   - Step-by-step implementation approach
   - Design considerations (refer to `ui-design-guideline.md` for tokens, component specs, and layout patterns)
   - Testing/verification steps

**Example plan structure:**
```markdown
# Implementation Plan: [Feature Name]

## Overview
Brief description of what will be implemented

## Files to Create/Modify
- `trip/src/components/...`
- `trip/src/pages/...`

## Implementation Steps
1. Step one
2. Step two
3. Step three

## Design Notes
- Reference prototype: [specific section]
- Key design tokens to use

## Verification
- [ ] Check 1
- [ ] Check 2
```

**No coding in `trip/` should begin until a plan is written.**

## Development

- All app code should be written in the `trip/` folder.
- Documentation and data files go in the `docs/` folder as markdown.
- **Every implementation must refer to the prototype under `/reference/prototype/`** for design, layout, and styling guidance.
- **Before writing any UI code, read `ui-design-guideline.md`** — it contains the authoritative design tokens, component specs, and layout patterns extracted from the Figma prototype. Do not guess color values, spacing, or border radii; look them up in the guideline.

### Pages to Implement

- Schedule overview page
- Spot list page
- Daily detail pages (Day 1 through Day 6)

## Trip Summary

- **Duration**: 6 days, 5 nights (10/25 - 10/30)
- **Style**: Self-driving, clockwise island tour
- **Accommodations**:
  - Nights 1-2: 舊左邑 (Gujo-ep) — Stay_stressless
  - Night 3: 西歸浦 (Seogwipo) — Hygge Hotel
  - Nights 4-5: RegentMarine The Blue Hotel (호텔 리젠트마린 더 블루)
