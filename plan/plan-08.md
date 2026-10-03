# Implementation Plan: Weather API Integration

## Overview
Integrate weather forecast data for the Jeju trip dates (10/25 - 10/30) using the MeteoSource API, displaying conditions alongside the schedule to help travelers prepare for each day.

## Current State
- `trip/src/hooks/useWeather.ts` — Custom hook fetching daily forecast from MeteoSource
- `trip/src/pages/SchedulePage.tsx` — Displays weather in header card and day selector cards
- API key is hardcoded in the hook (needs to move to env)

## Files to Modify
1. `trip/.env.local` / `trip/.env.production` — Add `VITE_WEATHER_API_KEY`
2. `trip/src/hooks/useWeather.ts` — Read key from env, add caching, improve error handling
3. `trip/src/pages/SchedulePage.tsx` — Refine weather display, add per-day forecast strip
4. `trip/src/components/schedule/WeatherCard.tsx` (new) — Extract weather display into reusable component

## Implementation Steps

### Step 1: Move API Key to Environment Variables
- Add `VITE_WEATHER_API_KEY=jkmax4r1ifh5eo12w33jp9stt1wxh2f26p4nfqe4` to `.env.local` and `.env.production`
- Update `useWeather.ts` to read from `import.meta.env.VITE_WEATHER_API_KEY`
- Remove hardcoded key from source

### Step 2: Improve the useWeather Hook
- Add response caching with `sessionStorage` to avoid redundant API calls during the same browsing session
- Cache key: `weather-cache-${JEJU_LAT}-${JEJU_LON}` with TTL of 1 hour
- Add retry logic (1 retry after 2s on failure)
- Return typed `WeatherData` map keyed by ISO date string
- Add `refetch()` function for manual refresh

### Step 3: Extract WeatherCard Component
- Create `trip/src/components/schedule/WeatherCard.tsx`
- Props: `weather: DailyWeather | null`, `loading: boolean`, `label?: string`
- Displays: weather icon (emoji), condition text, high/low temp, precipitation info
- Shows "Forecast" vs "Today's weather" label based on context
- Follows design tokens from `ui-design-guideline.md`:
  - Container: `bg-card border border-border rounded-[14px] p-3`
  - Temp text: `text-[15px] font-bold`
  - Muted text: `text-muted text-[11px]`

### Step 4: Enhance SchedulePage Weather Display
- Replace inline weather card markup with `<WeatherCard>` component
- Add a horizontal 5-day forecast strip below the day selector showing mini weather cards for each trip day
- Each mini card: date, weather icon, high temp — tappable to select that day
- Show precipitation probability when > 0

### Step 5: Add Weather to DayDetailPage
- Import `useWeather` in `DayDetailPage.tsx`
- Show a compact weather summary at the top of each day's detail view
- Format: icon + condition + temp range + precipitation note

## Design Notes
- Weather icons use emoji mapping (☀️ 🌤️ ⛅ 🌥️ ☁️ 🌧️ 🌦️ ⛈️ 🌨️)
- Reference prototype: weather card in schedule page header area
- Key design tokens:
  - `bg-card` (#FFFFFF), `border-border` (#E5E5E5), `rounded-[14px]`
  - `text-teal-dark` (#2B6B63) for forecast label
  - `text-amber` (#D4A853) for accent dots
  - `text-muted` (#999999) for secondary text
- Responsive: weather strip scrolls horizontally on mobile (< 640px)

## API Details
- Provider: MeteoSource (free tier)
- Endpoint: `https://www.meteosource.com/api/v1/free/point`
- Params: `lat=33.4996&lon=126.5312&sections=daily`
- Returns 8-day daily forecast (covers trip + buffer)
- Rate limit: 500 calls/day on free tier — well within needs

## Verification
- [ ] API key loaded from env, not hardcoded in source
- [ ] Weather loads on SchedulePage for each trip day
- [ ] Weather card shows correct icon, temp range, precipitation
- [ ] Day selector cards show weather icons
- [ ] Weather loads on DayDetailPage
- [ ] Caching works — second page load doesn't re-fetch
- [ ] Graceful fallback when API fails (shows "not available" message)
- [ ] Responsive layout works on mobile (horizontal scroll)
- [ ] No console errors on load
