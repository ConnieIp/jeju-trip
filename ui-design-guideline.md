# Jeju Trip - UI Design Guideline

**Source**: Figma prototype (https://www.figma.com/make/GkNnNIb69ff512E6kkqa3O/Jeju-Trip-Information-Page)  
**Published site**: https://tint-cloudy-33853921.figma.site  
**Last updated**: 2026-10-01

---

## 1. Design Tokens

### Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--bg` | `#ede8df` | Page background (warm cream) |
| `--card` | `#ffffff` | Card backgrounds |
| `--ink` | `#1a2e35` | Primary text, headings, active states |
| `--ink-light` | `#3d5a63` | Body text |
| `--muted` | `#6b7f85` | Secondary text, labels, placeholders |
| `--teal` | `#2d7a7a` | Primary accent, Sight badge, Naver button |
| `--teal-dark` | `#1a5c5c` | Best light badge, active nav text |
| `--teal-light` | `#e8f4f0` | Active nav background, time badge bg |
| `--amber` | `#e8913a` | UNESCO badge, avatar, quote border |
| `--amber-light` | `#fef3e2` | UNESCO badge bg, Day badge bg, local note bg |
| `--yellow` | `#f5c518` | Kakao Map button |
| `--border` | `#d5d0c8` | Card borders, dividers |

**Category-specific colors** (from Figma render):
- Sight: `#2d7a7a` (teal) on white
- Cafe: `#fef3c7` bg with `#92400e` text
- Restaurant: `#dcfce7` bg with `#166534` text
- Accommodation: `#f3e8ff` bg with `#6b21a8` text
- Souvenir: `#ffe4e6` bg with `#9f1239` text

### Typography

**Font Family**:
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif;
```

**Type Scale**:

| Element | Size | Weight | Line Height | Letter Spacing |
|---------|------|--------|-------------|----------------|
| Hero title | 42-46px | 800 | 1.08-1.15 | -1 to -1.5px |
| Section heading (h2) | 20-28px | 700 | 1.2 | -0.3px |
| Card heading | 18-19px | 700 | 1.1 | - |
| Body text | 14-15px | 400 | 1.6-1.7 | - |
| Small text | 12-13px | 400-500 | 1.45-1.55 | - |
| Labels/captions | 11-12px | 500-600 | 1.4 | 0.5px |
| Micro text | 10px | 500-600 | 1.4 | 0.5px |

**Font weights**:
- Regular: 400
- Medium: 500
- Semi Bold: 600
- Bold: 700
- Extra Bold: 800 (hero only)

### Spacing & Radii

**Border Radius**:
- Cards: `16px` (primary), `20px` (stop cards), `22px` (large cards)
- Buttons/pills: `10px` (small), `13px` (medium), `14px` (search), `20px` (pills)
- Circular: `50%` (avatar, dots)
- Small elements: `6px`, `8px`

**Spacing Scale**:
- Page padding: `32px` (desktop), `18px` (tablet), `14px` (mobile)
- Card padding: `24px` (large), `20px` (medium), `18px` (compact), `14px` (small)
- Section gaps: `32px` (major), `24px` (medium), `18px` (small), `12px` (tight)
- Element gaps: `8px`, `10px`, `12px`, `14px`, `16px`

**Layout**:
- Page max-width: `1200px` (desktop), `760px` (tablet)
- Sidebar width: `360px` (detail), `320px` (day layout)
- Grid columns: 4 (desktop), 2 (tablet), 1 (mobile)

---

## 2. Component Specifications

### Header

**Structure**:
```
┌─────────────────────────────────────────────────────────────┐
│ [Logo] JEJU / in between    [Schedule] [Saved] [Notes]  [Date] [Avatar] │
│            TRIP FIELD NOTES                                  │
└─────────────────────────────────────────────────────────────┘
```

**Styles**:
- Height: `78px` (desktop), `68px` (mobile)
- Background: `#ffffff`
- Border-bottom: `1px solid #dce3e1`
- Position: `sticky`, `top: 0`, `z-index: 20`
- Padding: `0 max(40px, 50% - 655px)` (desktop), `0 18px` (tablet), `10px 14px` (mobile)

**Brand**:
- Logo: `34px × 34px`
- Title: `17px`, bold, `-0.3px` letter-spacing
- Subtitle: `10px`, medium, `#6e7e82`, `1.5px` letter-spacing
- Gap: `10px`

**Navigation**:
- Button padding: `10px 16px`
- Border-radius: `999px` (pill)
- Default: `#6e7e82`, medium weight
- Active: `#0e5267`, semi-bold, background `#ddeef1`
- Gap: `8px`

**Trip Controls**:
- Date pill: `#f5f3ee` bg, `9px 14px` padding, `12px` semi-bold
- Avatar: `38px × 38px`, `#fff0df` bg, `#f28b2e` text, `12px` bold

### Hero Section

**Schedule Hero**:
- Padding: `48px 32px` (top/bottom)
- Grid: `1fr auto` (title + weather)
- Gap: `28px`

**Library Hero**:
- Padding: `48px 32px 34px`
- Flex: `space-between`, `align-items: flex-end`
- Gap: `40px`

**Eyebrow**:
- Color: `#15718a`
- Font: `12px`, bold, uppercase
- Icon: `7px × 7px`
- Margin-bottom: `12px`

**Hero Title**:
- Font: `46px`, bold, `1.08` line-height, `-1.5px` letter-spacing
- Max-width: `650px`

**Lede**:
- Color: `#6e7e82`
- Font: `15px`, `1.55` line-height
- Max-width: `580px`
- Margin-top: `14px`

### Weather Widget

**Structure**:
```
┌──────────────────────────────────────┐
│ [icon] Mostly clear · 19°C           │
│        Sunrise 06:39 · Pack light    │
└──────────────────────────────────────
```

**Styles**:
- Background: `#ffffff`
- Border: `1px solid #dce3e1`
- Border-radius: `14px`
- Padding: `12px 16px`
- Icon: `22px × 22px`
- Temp: `12px`, flex column, `2px` gap
- Note: `11px`, `#6e7e82`

### Day Tabs

**Grid**: `repeat(5, 1fr)`, gap `10px`

**Button**:
- Height: `92px`
- Padding: `14px 18px`
- Background: `#ffffff`
- Border: `1px solid #dce3e1`
- Border-radius: `14px`
- Text-align: left
- Flex-direction: column, gap `5px`

**Content**:
- Day label: `11px`, bold, uppercase, `#6e7e82`
- Date: `20px`, bold
- Description: `11px`, `#9eaaa9`

**Active State**:
- Background: `#16303a`
- Border-color: `#16303a`
- Text: `#ffffff`
- Day label: `#f28b2e`
- Description: `#c9d7d9`

### Timeline

**Row Structure**:
```
[Time] [Dot] [Stop Card]
 74px   16px   1fr
```

**Time**:
- Text-align: right
- Padding-top: `18px`
- Time: `15px`, bold
- Duration: `10px`, `#9eaaa9`, margin-top `3px`

**Route Dot**:
- Width/height: `11px`
- Border: `3px solid #16809a`
- Background: `#ffffff`
- Border-radius: `50%`
- Margin-top: `8px`
- Z-index: `1`

**Connector Line** (between rows):
- Width: `1px`
- Background: `#98c1c8`
- Position: absolute, `left: 94px`
- Top: `16px`, bottom: `-22px`

### Stop Card

**Styles**:
- Min-height: `134px`
- Padding: `14px`
- Background: `#ffffff`
- Border: `1px solid #dce3e1`
- Border-radius: `20px`
- Box-shadow: `0 8px 24px #15323a0d`
- Gap: `18px`

**Image**:
- Width: `150px`, height: `106px`
- Border-radius: `15px`
- Object-fit: cover

**Content**:
- Category badge + label: flex, space-between
- Title: `19px`, `#0e5267`
- Description: `12px`, `#6e7e82`

### Category Badge

**Base**:
- Display: inline-flex
- Padding: `7px 12px`
- Border-radius: `999px`
- Font: `12px`, semi-bold
- Line-height: `1`

**Variants**:
- Sight: `#0e5267` text, `#ddeef1` bg, `1px solid #dce3e1` border
- Cafe/Restaurant/Souvenir: `#f28b2e` text, `#fff0df` bg

### Place Card (Library Grid)

**Card**:
- Background: `#ffffff`
- Border: `1px solid #dce3e1`
- Border-radius: `22px`
- Overflow: hidden
- Box-shadow: `0 8px 24px #15323a12`

**Photo**:
- Height: `180px`
- Position: relative

**Bookmark Button**:
- Position: absolute, top `14px`, right `14px`
- Width/height: `34px`
- Background: `#ffffffe8`
- Border-radius: `50%`

**Info**:
- Padding: `18px`
- Flex-direction: column, gap `12px`

**Meta**:
- Font: `11px`, `#9eaaa9`
- Flex: space-between

**Title**:
- Font: `19px`, `1.1` line-height
- Color: `#0e5267`

**Description**:
- Font: `12px`, `1.45` line-height
- Color: `#6e7e82`
- Margin: `-7px 0 0`

**Scheduled**:
- Border-top: `1px solid #dce3e1`
- Padding-top: `10px`
- Font: `11px`
- Icon: `14px × 14px`
- Muted variant: `#9eaaa9`

### Search Box

**Styles**:
- Height: `54px`
- Padding: `0 18px`
- Background: `#ffffff`
- Border: `1px solid #dce3e1`
- Border-radius: `14px`
- Gap: `12px`

**Input**:
- Font: `14px`
- Color: `#233a42`
- Placeholder: `#9eaaa9`

**Kbd**:
- Padding: `5px 9px`
- Background: `#f5f3ee`
- Border-radius: `8px`
- Font: `10px`, `#6e7e82`

### Filter Buttons

**Base**:
- Padding: `7px 12px`
- Background: `#f5f3ee`
- Border: `1px solid #dce3e1`
- Border-radius: `999px`
- Font: `12px`, semi-bold, `#6e7e82`

**Selected**:
- Background: `#16303a`
- Border-color: `#16303a`
- Color: `#ffffff`

### Detail Page Components

#### Breadcrumbs
- Font: `11px`, `#6e7e82`
- Gap: `12px`
- Button: `#0e5267`, semi-bold

#### Detail Title
- Title: `46px`, bold, `14px` margin-bottom, `8px` margin-top
- Heritage badge: `#f28b2e` text, `#fff0df` bg, `7px 10px` padding, `11px` semi-bold
- Address: `12px`, `#6e7e82`, gap `8px`

#### Action Buttons
- Padding: `13px 16px`
- Background: `#ffffff`
- Border: `1px solid #dce3e1`
- Border-radius: `13px`
- Font: `12px`, semi-bold
- Gap: `8px`

#### Gallery

**Layout**:
- Grid: `2fr 0.92fr`
- Height: `430px`
- Gap: `14px`

**Hero Photo**:
- Position: relative
- Border-radius: `22px`
- Overflow: hidden

**Best Light Badge**:
- Position: absolute, bottom `14px`, left `16px`
- Background: `#143843e0`
- Color: `#ffffff`
- Padding: `8px 11px`
- Border-radius: `999px`
- Font: `10px`

**Side Photos**:
- Flex-direction: column, gap `14px`
- Each: `calc(50% - 7px)` height
- Border-radius: `22px`

**Photo Count**:
- Position: absolute, bottom `10px`, right `14px`
- Background: `#ffffff`
- Color: `#16303a`
- Padding: `6px 10px`
- Border-radius: `16px`
- Font: `12px`

#### Info Card

**Base**:
- Background: `#ffffff`
- Border: `1px solid #dce3e1`
- Border-radius: `22px`
- Padding: `24px`

**Heading**:
- Font: `20px`, bold
- Icon: `18px × 18px`
- Gap: `10px`

**Description**:
- Font: `13px`, `1.65` line-height
- Color: `#233a42`

#### Quick Facts

**Grid**: `repeat(3, 1fr)`, gap `8px`

**Item**:
- Background: `#f5f3ee`
- Border-radius: `14px`
- Padding: `12px`
- Grid: `auto 1fr`, gap `2px 8px`

**Label**: `9px`, `#6e7e82`  
**Value**: `11px`, bold

#### Notes Card

**List**:
- Padding-left: `18px`
- Font: `12px`, `1.6` line-height
- Margin: `8px 0`
- Marker: `#15718a`

**Blockquote**:
- Background: `#fff0df`
- Border-radius: `14px`
- Padding: `14px`
- Font: `12px`
- Gap: `9px`

#### Directions Card

**Styles**:
- Background: `#143843`
- Color: `#ffffff`
- Border-radius: `22px`
- Padding: `20px`

**Heading**: Flex, space-between  
**Description**: `11px`, `#afc2c7`, margin `6px 0 14px`

**Buttons**:
- Height: `46px`
- Border-radius: `13px`
- Font: `12px`, semi-bold
- Gap: `8px`
- Naver: `#16809a` bg
- Kakao: `#ffe500` bg, `#16303a` text

#### Practical Info

**Padding**: `20px`

**DL**:
- Margin: `14px 0`
- Font: `11px`
- Row: flex, space-between, padding `6px 0`
- DT: `#6e7e82`
- DD: semi-bold

**HR**: `1px solid #dce3e1`, margin `14px 0`

**Info Row**:
- Gap: `12px`
- Icon-wrap: `34px × 34px`
- Label: `9px`, `#6e7e82`, `0.5px` letter-spacing
- Value: `11px`, `1.35` line-height

#### In Schedule Card

**Header**: Flex, space-between  
**Day Badge**: `#f28b2e` text, `#fff0df` bg, `6px 10px` padding, `10px`

**Body**:
- Gap: `12px`
- Time: `#0e5267` text, `#ddeef1` bg, `10px` padding, `11px` font
- Title: `11px`
- Subtitle: `12px`, `#6e7e82`, margin-top `3px`

#### Route Overview (Sidebar)

**Styles**:
- Background: `#143843`
- Color: `#ffffff`
- Border-radius: `22px`
- Overflow: hidden
- Box-shadow: `0 8px 24px #15323a14`

**Image**: `190px` height, `100%` width, object-fit cover

**Content Padding**: `20px`

**Header**: Flex, space-between, `17px` font, icon `18px`

**Stats Grid**: Flex, space-between, margin-top `14px`
- DT: `16px`, bold
- DD: `10px`, `#9db6bc`

#### Local Note

**Styles**:
- Background: `#fff0df`
- Border-radius: `22px`
- Padding: `20px`
- Font: `12px`

**Title**: `13px`, bold, margin-bottom `6px`  
**Text**: `12px`, `1.55` line-height, `#233a42`, margin-top `12px`

#### Backup Card

**Styles**:
- Background: `#ffffff`
- Border: `1px solid #dce3e1`
- Border-radius: `22px`
- Padding: `20px`
- Flex-direction: column, gap `7px`

**Label**: `10px`, `#6e7e82`  
**Title**: `15px`, `#0e5267`  
**Description**: `11px`, `#9eaaa9`

---

## 3. Layout Patterns

### Page Shell

```css
.page-shell {
  width: min(1310px, 100% - 80px);
  margin-inline: auto;
}
```

### Two-Column Layout (Day/Detail)

```css
.day-layout, .detail-grid {
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 34px;
  align-items: start;
}
```

### Grid Layouts

**Place Grid** (Library):
```css
.place-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 32px 18px;
}
```

**Day Tabs**:
```css
.day-tabs {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
}
```

**Quick Facts**:
```css
.quick-facts {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}
```

---

## 4. Responsive Breakpoints

### Tablet (≤980px)

- Page shell: `min(100% - 36px, 760px)`
- Place grid: `repeat(2, 1fr)`
- Day layout, detail grid: single column
- Sidebar: `grid-template-columns: 1fr 1fr`
- Route overview, directions: `grid-row: span 2`
- Detail side: `grid-template-columns: 1fr 1fr`

### Mobile (≤640px)

- Page shell: `calc(100% - 28px)`
- Header: flex-wrap, auto height, min-height `68px`
- Brand subtitle, trip controls: hidden
- Nav: order 3, full width, centered, margin-top `8px`
- Nav buttons: `7px 10px` padding, `11px` font
- Hero titles: `34px`
- Place grid: single column
- Day tabs: flex, overflow-x auto, min-width `150px`
- Timeline: `48px 12px 1fr` columns, gap `7px`
- Stop card: `10px` padding, `112px` min-height, image `82px × 82px`
- Stop title: `15px`, description: `10px`
- Gallery: `2fr 1fr` rows, single column
- Quick facts: single column
- Info card padding: `18px`

---

## 5. Interactive States

### Buttons

**Default**:
- Cursor: pointer
- Background: transparent or specified
- Border: as specified
- Color: as specified

**Hover**: (implicit from design)
- Slight opacity change or background shift

**Active/Selected**:
- Background: `#16303a` or `#ddeef1`
- Color: `#ffffff` or `#0e5267`
- Font-weight: semi-bold (600)

### Cards

**Default**:
- Border: `1px solid #dce3e1`
- Box-shadow: `0 8px 24px #15323a0d` or `#15323a12`

**Hover**: (implicit)
- Cursor: pointer (for clickable cards)
- Slight elevation increase

### Links

- Color: `#0e5267`
- Text-decoration: none
- Hover: underline (implicit)

---

## 6. Icon System

**Standard Size**: `16px × 16px`  
**Small**: `14px × 14px`, `15px × 15px`  
**Medium**: `18px × 18px`, `19px × 19px`  
**Large**: `22px × 22px`, `24px × 24px`, `34px × 34px`

**Icon Class**:
```css
.icon {
  flex: none;
  width: 16px;
  height: 16px;
  display: block;
}
```

---

## 7. Shadows

**Card Shadow**:
```css
box-shadow: 0 8px 24px #15323a12;
/* or */
box-shadow: 0 8px 24px #15323a0d;
```

**Route Overview Shadow**:
```css
box-shadow: 0 8px 24px #15323a14;
```

---

## 8. Transitions & Animations

**Implicit from design**:
- Smooth transitions on hover states
- No explicit animation durations specified in prototype
- Assume `200-300ms` ease for interactive elements

---

## 9. Accessibility Notes

**Color Contrast**:
- Primary text (`#1a2e35`) on white: AAA
- Secondary text (`#6b7f85`) on white: AA
- Teal (`#2d7a7a`) on white: AA
- Amber (`#e8913a`) on `#fef3e2`: Check contrast ratio

**Focus States**:
- Not explicitly defined in prototype
- Recommend: `outline: 2px solid #2d7a7a`, `outline-offset: 2px`

**Keyboard Navigation**:
- Search: `⌘K` shortcut
- All interactive elements should be keyboard accessible

---

## 10. Implementation Checklist

### Must-Have
- [ ] All color tokens implemented as CSS variables
- [ ] Typography scale matches design tokens
- [ ] Responsive breakpoints at 980px and 640px
- [ ] Card border-radius: 16px, 20px, 22px variants
- [ ] Pill/border-radius: 10px, 14px, 20px, 999px variants
- [ ] Page max-width: 1200px with proper padding
- [ ] Sticky header with proper z-index
- [ ] All interactive states (hover, active, selected)

### Should-Have
- [ ] Smooth transitions on interactive elements
- [ ] Proper focus states for accessibility
- [ ] Icon system with consistent sizing
- [ ] Shadow system for elevation

### Nice-to-Have
- [ ] Animation on page transitions
- [ ] Loading states for async content
- [ ] Error states for failed operations

---

## 11. File References

**Prototype Files**:
- `reference/prototype/index.html` - Main HTML structure
- `reference/prototype/index.css` - Tailwind CSS styles
- `reference/prototype/index.js` - React SPA bundle
- `reference/prototype/extracted.html` - Static HTML with corrected tokens
- `reference/prototype/figma-renders/slide-1-2.png` - High-res detail page render
- `reference/prototype/assets/` - 47 image/SVG files

**Key Visual Reference**:
- `figma-renders/slide-1-2.png` (3.9MB) - Best visual reference for detail page

---

## 12. Notes

- Prototype dates: Oct 15–19, 2026
- Actual trip dates: Oct 25–30, 2026
- Design uses Inter font family (Bold, Medium, Regular, Semi Bold)
- All measurements from Figma render are authoritative
- Color values corrected from actual Figma render (slide-1-2.png)
