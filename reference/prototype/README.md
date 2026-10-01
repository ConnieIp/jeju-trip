# Figma Prototype Extraction

Source: https://www.figma.com/make/GkNnNIb69ff512E6kkqa3O/Jeju-Trip-Information-Page
Published site: https://tint-cloudy-33853921.figma.site

## Extraction Methods Used

1. **Figma REST API** (primary) - Used personal access token to render slides as PNG images
   - `slide-1-2.png` - Full Detail page render (3.9MB, high quality) ← **main reference**
   - `slide-1-3.png` - Header bar component
   - `slide-1-4.png` - Brand logo component

2. **Published site scrape** - Downloaded compiled React bundle + assets from figma.site
   - `index.js` - React SPA bundle (contains all data and component logic)
   - `index.css` - Stylesheet
   - `assets/` - 47 image/SVG files (photos and icons)

3. **Static HTML reconstruction** - `extracted.html` shows all 3 views with corrected design tokens from the Figma render

## Design Tokens (from Figma render)

### Colors
| Token | Value | Usage |
|-------|-------|-------|
| `--bg` | `#ede8df` | Page background (warm cream) |
| `--card` | `#ffffff` | Card backgrounds |
| `--ink` | `#1a2e35` | Primary text, headings |
| `--ink-light` | `#3d5a63` | Body text |
| `--muted` | `#6b7f85` | Secondary text, labels |
| `--teal` | `#2d7a7a` | Primary accent, Sight badge, Naver button |
| `--teal-dark` | `#1a5c5c` | Best light badge |
| `--teal-light` | `#e8f4f0` | Active nav, time badge bg |
| `--amber` | `#e8913a` | UNESCO badge, avatar, quote border |
| `--amber-light` | `#fef3e2` | UNESCO badge bg, Day badge bg |
| `--yellow` | `#f5c518` | Kakao Map button |
| `--border` | `#d5d0c8` | Card borders, dividers |

### Typography
- Font: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif
- Hero title: 42px, font-weight 800, letter-spacing -1px
- Card headings: 18px, font-weight 700
- Body text: 14-15px, line-height 1.6-1.7
- Small/labels: 11-12px, font-weight 500-600

### Spacing & Radii
- Card border-radius: 16px
- Button/pill border-radius: 10px (sm), 20px (pills)
- Page max-width: ~1200px
- Page padding: 32px
- Card padding: 24px

## App Structure

3 views navigated via header tabs:

### 1. Schedule Page
- Hero: "A slow lap of Jeju, one coast at a time."
- Weather widget: "Mostly clear · 19°C"
- 5 day tabs (Oct 15-19, 2026)
- Day 2 detail: timeline with 5 stops + sidebar

### 2. Saved Spots (Library) Page
- Hero: "Places worth pulling over for."
- Search bar with ⌘K shortcut
- Category filters: All, Accommodation, Restaurant, Cafe, Sight, Souvenir
- Grid of 8 spot cards with photos, bookmarks, schedule info

### 3. Detail Page (Seongsan Ilchulbong)
- Breadcrumbs: Saved spots > Sights > Seongsan Ilchulbong
- Category + UNESCO badge
- Photo gallery (hero + 2 side images)
- "Why it belongs on the route" card with quick facts
- "Visit notes & remarks" card with tips + quote
- Sidebar: Directions (Naver/Kakao buttons), Hours & practical info, In your schedule

## Data: Saved Spots

| Name | Category | Location | Note | Schedule |
|------|----------|----------|------|----------|
| Seongsan Ilchulbong | Sight | Seongsan · East Jeju | Sunrise peak · Open 07:00–19:00 | Day 2 · 06:30 |
| O'sulloc Tea Museum | Sight | Andeok · West Jeju | Tea fields · Open 09:00–18:00 | Day 4 · 10:00 |
| Dongmun Traditional Market | Souvenir | Jeju City | Night market · Open until 21:00 | Day 5 · 11:15 |
| Cafe Gongbech | Cafe | Gujwa · East Jeju | Ocean view · Open 10:00–18:00 | Day 2 · 09:10 |
| Gozip Dol Wooluck | Restaurant | Seongsan · East Jeju | Braised rockfish · Last order 19:30 | Day 2 · 12:45 |
| Haevichi Hotel & Resort | Accommodation | Pyoseon · South Jeju | Ocean room · Check-in 15:00 | Day 2 · Overnight |
| Jeongbang Waterfall | Sight | Seogwipo | Sea-fall trail · Open 09:00–17:20 | Day 3 · 14:30 |
| Myeongjin Jeonbok | Restaurant | Gujwa · East Jeju | Abalone stone pot rice · 09:30–20:00 | Not scheduled |

## Files

| File | Description |
|------|-------------|
| `extracted.html` | Static HTML with all 3 views, corrected design tokens |
| `figma-renders/slide-1-2.png` | **High-res Figma render of Detail page** ← best visual reference |
| `index.js` | Compiled React bundle (data + logic reference) |
| `index.css` | Original stylesheet |
| `assets/` | 47 photos and SVG icons |

## Note

Prototype dates: Oct 15–19, 2026. Actual trip: Oct 25–30, 2026.
