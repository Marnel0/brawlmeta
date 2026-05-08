# Design system — Cartoon Premium

## Philosophy

We build the **cartoon vibe of Brawl Stars treated as a premium product.** Think: Supercell's official site, Duolingo's interface, Linear's craft — but applied to a Brawl Stars universe. Saturated, kinetic, fun, but with the typographic and spacing discipline of a real design system.

**The reference moodboard mental model:**
- Supercell.com (official Brawl Stars page) — for color saturation
- Duolingo (web + app) — for the "premium cartoon" balance
- Neo-brutalism done well (e.g. Gumroad, Cabana, Marc Lou's templates) — for the borders + offset shadows
- Apple Arcade marketing pages — for premium kinetic motion

## Color tokens

Define in `tailwind.config.ts` under `theme.extend.colors`:

```
brand: {
  yellow:   '#FFCC00'  // Primary accent (Brawl Stars yellow)
  red:      '#E63946'  // Tier S, alerts, hot maps
  blue:     '#1D7FBC'  // Info, modes
  green:    '#2EB872'  // Win rate positive
  purple:   '#7E5BEF'  // Legendary tier
  pink:     '#EC4899'  // Mythic / fun accents
  ink:      '#0F0F14'  // Borders + main text (NOT pure black)
  cream:    '#FFF8E7'  // Page background (NOT pure white)
  paper:    '#FFFFFF'  // Card backgrounds
  sand:     '#F5EFE0'  // Subtle surfaces
}
```

- Backgrounds are NEVER pure white (`#FFF`). Always `cream` (`#FFF8E7`) for warmth.
- Borders + text use `ink` (`#0F0F14`), never pure black — softer, less harsh.
- Tier colors map to ramps: S=red, A=amber, B=yellow, C=blue, D=gray.
- Rarity colors map: Starter=gray, Rare=green, Super Rare=blue, Epic=purple, Mythic=pink, Legendary=yellow, Ultra Legendary=red.

## Typography

- **Display / headings:** Lilita One or Fredoka (load via `next/font/google`). Bold, rounded, friendly. Used for h1, h2, brawler names, tier labels.
- **Body / UI:** Inter or system-ui. Clean, readable, neutral. Used for everything else.
- **Numbers / stats:** Use tabular-nums Tailwind class for win rates, pick rates. Optionally JetBrains Mono for tag inputs.
- Sizes (Tailwind): h1 `text-5xl md:text-6xl`, h2 `text-3xl`, h3 `text-xl`, body `text-base`, small `text-sm`.
- **Sentence case** in all copy. Exceptions: brawler names (as they appear in-game, often UPPERCASE), tier letters (S/A/B/C/D).
- No ALL CAPS for sentences. No fake-comic fonts. No Comic Sans, ever.

## Spacing & layout

- Container max-width: `max-w-7xl` (1280px).
- Section padding: `py-16 md:py-24`.
- Card internal padding: `p-6 md:p-8`.
- Grid gap: `gap-4` for tight grids, `gap-6` for cards, `gap-8` for sections.
- Border-radius: `rounded-2xl` for cards, `rounded-xl` for buttons/inputs, `rounded-full` for pills/avatars. Never `rounded-md`, never sharp corners.

## Borders & shadows (THE signature)

This is the cartoon-premium DNA. Apply consistently:

- **Borders:** every card, button, badge has `border-2 border-ink` (or 3px on hero elements).
- **Offset shadows (flat, no blur):** `shadow-[4px_4px_0_0_#0F0F14]` for cards, `shadow-[3px_3px_0_0_#0F0F14]` for buttons.
- **On hover:** the shadow shrinks AND the element nudges into the void (`hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#0F0F14]`). Feels tactile, like pressing a button.
- **NO drop-shadow blur, NO box-shadow with rgba softness.** Flat or nothing.
- **NO gradients.** Solid fills only. Tier indication uses a solid colored bar/badge, not a gradient.

## Components (shadcn/ui overrides)

Restyle every shadcn primitive to follow the rules above:

- **Button:** `border-2 border-ink rounded-xl shadow-[3px_3px_0_0_#0F0F14] font-bold` + the hover-press effect
- **Card:** `border-2 border-ink rounded-2xl shadow-[4px_4px_0_0_#0F0F14] bg-paper`
- **Badge:** `border-2 border-ink rounded-full px-3 py-1 font-bold text-xs uppercase tracking-wider`
- **Input:** `border-2 border-ink rounded-xl shadow-[2px_2px_0_0_#0F0F14] focus:shadow-[3px_3px_0_0_#FFCC00]`
- **Tabs / Toggle:** active state has full ink border + offset shadow, inactive is flat outline only

## Motion (Framer Motion)

Motion is a feature, not decoration. Rules:

- **Page enter:** stagger children with `initial={{ opacity: 0, y: 12 }}` → `animate={{ opacity: 1, y: 0 }}`, `staggerChildren: 0.04`.
- **Tier list filter:** `<AnimatePresence>` + `<motion.div layout>` for smooth reorder when filters change. Use `layoutId` on cards so they animate between positions.
- **Card hover:** scale `1.02` + shadow shrinks (the press effect from above).
- **Map rotation switch:** crossfade + slight slide (`x: 20 → 0`) between maps.
- **Loading states:** never spinner. Use skeleton cards with the same border + shadow as real cards.
- All transitions: `duration: 0.2-0.3s`, ease `[0.22, 1, 0.36, 1]` (custom cubic-bezier, feels snappy + bouncy).
- Performance: respect `prefers-reduced-motion`. Wrap animations in a check.

## Iconography

- **Lucide React** for UI icons (filter, search, chevron, etc.) — clean, geometric, matches the vibe.
- **Brawler portraits + map thumbnails:** sourced from Brawlify CDN or Supercell (document the URL pattern in the codebase).
- **Tier letters (S/A/B/C/D):** rendered as Lilita One inside circular badges with the appropriate tier color, ink border, offset shadow.

## Anti-patterns (do not do)

- ❌ Glassmorphism / frosted glass / backdrop-blur effects
- ❌ Neon glows, drop-shadow with color (`shadow-purple-500/50`)
- ❌ Mesh gradients, noise textures, abstract blobs
- ❌ Soft drop shadows (`shadow-md`, `shadow-lg` from default Tailwind)
- ❌ Pure white backgrounds, pure black borders
- ❌ Sharp corners on cards
- ❌ Spinners, throbbers, generic loaders
- ❌ Text in ALL CAPS for full sentences
- ❌ More than 4 colors visible in a single viewport (chromatic restraint)

## Mobile (V1.5)

Don't optimize aggressively. Just respect:
- Tailwind responsive prefixes (`md:`, `lg:`)
- Touch targets ≥ 44px
- Filter bars become bottom sheets on `< md`
- Tier list grid: 4 cols desktop → 2 cols mobile