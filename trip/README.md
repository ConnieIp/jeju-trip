# Jeju Trip Web App

A React + TypeScript web application showcasing a 6-day Jeju island trip itinerary.

## Setup

1. Install dependencies:
```bash
cd trip
npm install
```

2. Build the data (parses markdown from /docs into JSON):
```bash
npm run build:data
```

3. Start the dev server:
```bash
npm run dev
```

4. Open http://localhost:5173 in your browser

## Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

- `src/components/` - Reusable UI components
- `src/pages/` - Page components (Schedule, Spots, Detail)
- `src/data/` - Data types and loaders
- `scripts/build-data.ts` - Markdown to JSON parser

## Pages

- **Schedule** (`/`) - Overview of the 6-day itinerary with daily timelines
- **Saved Spots** (`/spots`) - Complete list of all attractions, restaurants, and cafes with search/filter
- **Spot Detail** (`/spot/:slug`) - Individual spot details with photos, hours, directions

## Design

The design matches the Figma prototype at `/reference/prototype/` with:
- Warm cream background (#ede8df)
- Teal and amber accents
- Card-based UI with 16px radius
- Responsive layout (1200px max-width)
