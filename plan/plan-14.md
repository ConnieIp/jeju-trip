# Implementation Plan: Korean + English Addresses on All Spots Page

## Overview

Every spot card on the All Spots page should show both the Korean (도로명) and English address. The UI already supports this (`PlaceCard` renders `addressKo` + `addressEn` lines), but the underlying data is missing for most spots — only attractions have both fields; restaurants, cafes, bakeries, and souvenirs carry a legacy Chinese-only `address` (or nothing).

## Current State

- `PlaceCard.tsx` renders `📍 {addressKo || address}` plus `{addressEn}` — correct once data exists.
- Data pipeline: `docs/{category}/{region}/*.md` → `npm run build:data` → `trip/src/data/generated/*.json` → `npm run seed:spots` (Supabase upsert) → app.
- Docs convention: `- 韓文地址：` and `- 英文地址：` keys (used by populated attraction docs). Legacy `- 地址：` holds mixed Chinese/English text.
- Spots missing both fields (need research): annyeong-jeonbok, giho-hoejip, jeju-yukuro, suksseongdo, hallaso-gopchang, manwol-sutbul-gui, nogorok, mou-moon, the-berlin, gyulkkot-darak, vadada, london-bagel-museum.
- Spots with only a legacy Chinese/lot address (need conversion + verification): chilseong-ro, eho-teawoo-beach, yeondong-market, maeil-olle-market (ko only), geumdot-seongsan-black-pork, pigalhoeok, ige-bapdoduk, tongkeun-jang-eo, dun-she-dun, jeju-bonyeon, dalkom-ajae, album-oedo, assisi, comma, flowave, haejigae, saebil-cafe, audrant-bakery, coo-jeju, my-jeju-gift.

## Files to Modify

- `docs/restaurant/{east,north,west,south}/*.md` — replace `地址` with `韓文地址` + `英文地址`
- `docs/cafe/{east,north,west,south}/*.md` — same
- `docs/bakery/{east,north}/*.md` — same
- `docs/souvenir/north/my-jeju-gift.md` — same
- `docs/attraction/{north,south}/{chilseong-ro,eho-teawoo-beach,yeondong-market,maeil-olle-market}.md` — add missing `韓文地址`/`英文地址`

No app code changes needed (UI already renders both).

## Implementation Steps

1. Research correct Korean road-name addresses (도로명주소) and English romanizations for all spots listed above (web search, verify against Naver/Kakao/official sources).
2. Update docs markdown files: replace `- 地址：` lines with `- 韓文地址：` and `- 英文地址：`; add missing keys to attraction docs.
3. Run `npm run build:data` in `trip/` to regenerate JSON.
4. Run `npm run seed:spots` to upsert into Supabase.
5. Verify in the app.

## Design Notes

- No UI changes; existing `PlaceCard` two-line address layout stands (Korean line primary, English line secondary).
- Keep Korean format consistent with existing attraction data: `제주특별자치도 제주시/서귀포시 …로 N`, floor as `N층`.
- Keep English format consistent: `N Road-name, eup/myeon-dong, Jeju-si/Seogwipo-si, Jeju-do`.
- Legacy Chinese `地址` values are dropped once ko/en are in place.

## Verification

- [ ] All 49 generated spot JSON entries have `addressKo` and `addressEn`
- [ ] Seed script succeeds
- [ ] All Spots page shows both address lines on every card
- [ ] Spot detail page still renders address + map buttons correctly
