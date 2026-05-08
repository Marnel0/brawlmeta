# Project context — Brawl Stars stats site

## Who I am, who this is for

- I'm a developer building this as a **portfolio + audience + learning** project simultaneously. All three matter equally.
- Primary user: **Brawl Stars players** (mostly mobile, ages 12-30) who currently use Brawlify and want better. Secondary: **recruiters / fellow developers** who'll see this in my portfolio.
- I'm vibe-coding this in **Cursor / Claude Code**, taking my time (no deadline). Quality > speed.

## What I'm building

- **V1 scope (locked):** two features only — interactive Tier List + Map Rotation with meta brawlers. Plus a landing page tying them together.
- **V2 (later, do not build now):** player tracker by tag, leaderboards, club pages, notifications.
- **Stack (locked):** Next.js 15 (App Router), TypeScript, Tailwind CSS, shadcn/ui, Framer Motion, deployed on Vercel.
- **Data source:** official Brawl Stars API (Supercell developer portal). Key stored in `.env.local` as `BRAWL_STARS_API_KEY`. All API calls server-side via Next.js Route Handlers — never expose the key client-side.

## My standards (the bar)

- Visual quality is THE differentiator. If it doesn't look noticeably better than Brawlify, the project failed.
- "Cartoon premium" = neo-brutalism done with taste. Thick borders, flat offset shadows, saturated palette, generous whitespace. NOT cheap, NOT skeuomorphic, NOT Comic Sans.
- Motion is not optional. Every state change is animated (Framer Motion). Hover states have weight. Drag-and-drop in the tier list feels juicy.
- Desktop-first at 1440px is the hero experience. Mobile is supported but designed second — it's V1.5, not V1 day-one.
- Code quality: TypeScript strict, components in `/components`, server logic in `/lib`, API routes in `/app/api`. Clean enough to extend in V2.

## Constraints

- I have a Supercell API key but it's **rate-limited and IP-restricted**. Vercel functions need the production IPs whitelisted in the Supercell developer portal — handle this gracefully (cache responses, fallback to mock data in dev).
- No backend database in V1. Use Vercel KV or simple in-memory caching with revalidation if needed.
- No paid services beyond Vercel free tier.
- Brawler artwork (PNGs) is not in the official API — source from Brawlify's CDN or Supercell's asset URLs. Document where assets come from.

## Landmines (things that have killed similar projects)

- ⚠️ **Building V2 features now.** Player tracker is tempting. DO NOT add it. Two features, done excellently, beats five mediocre ones.
- ⚠️ **Forgetting that this is a Brawl Stars site.** It must FEEL like Brawl Stars — bright, fun, energetic — while being premium. Sterile minimalism kills the vibe.
- ⚠️ **Mobile bloat.** Don't add mobile-specific complexity in V1. Use Tailwind breakpoints, ship desktop-perfect, mobile-acceptable.
- ⚠️ **Ad clutter.** Brawlify monetizes with ads. We DO NOT. Clean experience always.
- ⚠️ **Copying Brawlify's IA.** Their navigation is busy. We have one nav with two links: Tier List, Maps. That's it.
- ⚠️ **Generic "AI gaming site" output.** If a component looks like it could come from any random gaming template, reject it. Every choice should feel intentional.

## Success criteria (concrete)

- ✅ Two pages built, both visually + functionally better than Brawlify's equivalents
- ✅ Lighthouse > 90 on both (Performance, Accessibility, Best Practices)
- ✅ Live data from Supercell API working in production
- ✅ Animations smooth (60fps) on a mid-range laptop
- ✅ Deployable to Vercel in one command, public URL shareable
- ✅ A friend who plays Brawl Stars says "yeah this is better than Brawlify"
- ✅ A friend who's a designer says "the design choices are tasteful, not random"

## Stop and check with me before:

- Adding any feature beyond Tier List + Map Rotation + Landing
- Introducing a new dependency not in the stack above
- Making any "creative" choice that breaks the design system
- Spending more than 30 min stuck — surface it, don't burn time