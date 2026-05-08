# Reference analysis — Brawlify and adjacent gaming sites

## What Brawlify is

Brawlify is the dominant Brawl Stars stats / companion site. It pulls data from the official Supercell API and surfaces:
- All 104 brawlers with stats, gadgets, star powers, skins
- Live map rotation with current + upcoming events
- Tier lists per map (best brawlers by win rate / pick rate)
- Player tracker by tag (battle history, trophy graphs)
- Leaderboards by country / club
- Notifications for events

URL: https://brawlify.com — pages of interest for V1: `/brawlers`, `/maps`, individual brawler pages like `/brawlers/16000028/`.

## What Brawlify does well (KEEP these patterns)

1. **Two metrics rule the meta.** Win rate + pick rate. Don't dilute with 8 metrics — players know these two and trust them.
2. **Live data feel.** Stats update continuously. The site claims "real-time from millions of battles" — even if our refresh is hourly, frame it as live.
3. **Map → tier list drill-down.** Click a map, see the brawler ranking for THAT map. This is the killer interaction we must replicate.
4. **Rarity-based organization.** Brawlers grouped by rarity tier (Starter / Rare / Super Rare / Epic / Mythic / Legendary / Ultra Legendary). Visually distinct rarities help players parse 104 brawlers.
5. **Tag system.** Brawler IDs (e.g. `16000028`), player tags (e.g. `#2Q08JC0P8`), club tags — everything has a stable identifier. Use the same tags for our routes.

## What Brawlify does badly (FIX these)

1. **Visual cheapness.** Default rounded gray cards, generic Bootstrap-era feel, no design point of view. Looks like a fan project, not a product.
2. **Ad clutter.** Multiple ad slots per page break flow and visual hierarchy. We have ZERO ads in V1.
3. **Information density without breathing room.** Stats stacked on stats, no whitespace, no rhythm. Eyes don't know where to land.
4. **Static UX.** No animation, no transitions, instant snap on every interaction. Feels like a 2015 site.
5. **Dense navigation.** Many top-level nav items (Brawlers, Maps, Players, Clubs, Leaderboards, Tier List, etc.). Cognitive overload.
6. **Inconsistent typography.** Headings, body, numbers all feel like default browser fonts. No type system.
7. **Mobile parity but not mobile-first.** The Android app is praised for being cleaner than the website — telling.

## Adjacent gaming sites — what to steal

### Supercell.com / brawlstars.com (official)
- Saturated yellow + bright color palette → our `brand.yellow` and saturated tokens
- Bold display type, lots of attitude in copy
- Generous whitespace despite playful style — "premium cartoon" benchmark

### Riot Games / League of Legends Champions page
- Champion cards with role tags + difficulty meters → analog for our brawler cards
- Hover state reveals splash art animation → analog for our motion
- Filter bar with multi-select chips that animate → exactly what we want for the tier list

### Duolingo (web product)
- Flat saturated colors with thick borders + offset shadows = our exact direction
- Mascot-driven personality, but disciplined typography
- Buttons feel "pressable" — the tactile hover state we're cloning

### Linear / Vercel marketing
- Editorial typography control, kinetic motion, dark-mode discipline
- We don't go dark, but we steal their motion craft and component density

## Reverse-engineered rules (extracted from above)

These are **always/never** rules that govern our V1:

- **Always** show win rate + pick rate as the two primary stats. Both visible without hover.
- **Always** make the tier list filterable by mode (Gem Grab, Brawl Ball, etc.) and rarity. Filters animate the grid via `motion.layout`.
- **Always** allow drill-down: click a map → see the tier list specific to that map.
- **Always** organize the brawler grid by rarity tier with visually distinct sections (rarity color band/border).
- **Always** use the official Supercell brawler IDs in URLs (`/brawlers/16000028`) for SEO + bookmarkability.
- **Always** treat motion as a feature: filters, hovers, page transitions all animate via Framer Motion.
- **Always** use the cartoon-premium design system rules (thick borders, offset shadows, saturated palette, sentence case).

- **Never** show ads.
- **Never** clutter the top nav. V1 has 2 nav links: Tier List, Maps. That's it.
- **Never** display more than 6-8 brawler cards per row, even on ultrawide. Readability over density.
- **Never** mix more than 4 colors in a single viewport (chromatic discipline).
- **Never** use spinners, default-Bootstrap components, or stock gaming-site templates.
- **Never** copy Brawlify's IA verbatim. We pick the 2 best features, do them better, ignore the rest.
- **Never** add a player-tracker, leaderboard, or club page in V1. Ship the 2 features. Resist scope creep.

## Data fields we need from the API

Minimum viable schema for V1:

**Brawler (`/brawlers` endpoint):**
- `id`, `name`, `rarity`, `class` (Damage Dealer / Tank / Controller / etc.)
- `starPowers[]`, `gadgets[]`
- Image URL (sourced from CDN, not API directly)

**Win/pick rates:** NOT in the official API. Two options:
- (a) Mock with realistic data for V1, plan to scrape Brawlify's stats endpoint for V1.5
- (b) Compute from a sample of `/players/{tag}/battlelog` calls — too rate-limited for now

→ **Decision: V1 ships with mocked but realistic stats**, swap to real source in V1.5. Document this clearly in the codebase.

**Events (`/events/rotation`):**
- Current map rotation, mode, slot, end time
- Use this directly — official endpoint, low rate limit cost

## What good looks like (visual benchmark)

If we open our finished site next to Brawlify and screenshot both pages: the difference must be obvious to anyone, including non-gamers. If they have to squint to tell which is "the better one," we failed.