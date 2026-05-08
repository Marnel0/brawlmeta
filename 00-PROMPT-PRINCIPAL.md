I want to **build a premium Brawl Stars stats site focused on two killer features — an interactive Tier List and a live Map Rotation with meta brawlers** so that **Brawl Stars players prefer my site over Brawlify because it looks 10x more beautiful, feels native to the game's universe, and makes the data fun to explore (not just functional).**

First, read these files completely before responding:

- **`AGENTS.md`** — my standards, audience, constraints, landmines, success criteria
- **`design-system.md`** — cartoon-premium visual language, tokens, components, motion rules
- **`reference.md`** — Brawlify analysis + reverse-engineered rules from adjacent gaming sites

Here is a reference to what I want to achieve:

Brawlify (https://brawlify.com), specifically their `/brawlers` tier list and `/maps` rotation pages. I want feature parity on those two pages, but a complete visual + UX overhaul. Detailed analysis in `reference.md`.

Here's what makes this reference work (and what doesn't):

**Keep from Brawlify:**
- Always show win rate + pick rate as the two core meta signals
- Always update data continuously from real battles (live feel matters)
- Always let users click a map to drill into the tier list for THAT map
- Always organize brawlers by rarity tier with clear hierarchy

**Fix from Brawlify:**
- Never let UI density kill discovery — Brawlify crams, we breathe
- Never use generic gaming-site UI (gray cards, stock fonts, ad clutter)
- Never show stats as flat tables when charts/comparisons/animations would do better
- Never neglect motion — Brawl Stars is kinetic, the site must feel alive

**Cartoon-premium rules I always enforce:**
- Always use thick black borders (2-3px), offset flat shadows (`4px 4px 0 #000`), saturated-but-controlled palette
- Always sentence case in copy — except tier letters (S/A/B/C/D) and brawler names
- Always animate state changes (filter, tier reorder, map switch) with Framer Motion — never instant snaps
- Always design desktop-first at 1440px, then adapt mobile
- Never use gradients, glassmorphism, or neon (rejected direction)
- Never use Comic Sans or fake-comic fonts — premium cartoon = clean geometric sans (Lilita One, Fredoka, or similar)

Here's what I need for my version:

### SUCCESS BRIEF

**Type of output + length:** A Next.js 15 + Tailwind + shadcn/ui + Framer Motion web app on Vercel. Two complete feature pages (Tier List + Map Rotation), one shared design system, one landing page funneling to both. ~8-12 components, 3 routes, Brawl Stars API integration via my Supercell key.

**Recipient's reaction:** A Brawl Stars player lands and within 2 seconds thinks "this is way nicer than Brawlify." They get pulled into filtering, drilling into maps, bookmark it. A recruiter/dev seeing the portfolio thinks "this person ships polished work, design choices are intentional."

**Does NOT sound like:**
- Generic AI SaaS dashboard
- Cheap ad-cluttered fan-site tracker
- Stale Bootstrap gaming wiki
- Comic Sans / dollar-store cartoon
- Over-skeuomorphic copy of the game UI

**Success means:**
- Both pages objectively more beautiful and more usable than Brawlify's
- Non-players can still appreciate the design quality (portfolio criterion)
- Lighthouse > 90, perfect desktop, graceful mobile
- Code clean enough to extend (player tracker, leaderboards) in V2

My context file contains my standards, constraints, landmines, audience. **Read it fully before starting. If you're about to break one of my rules, stop and tell me.**

---

**DO NOT start executing yet.** Instead, ask me clarifying questions step by step.

Before you write anything, list the **3 rules from my context file that matter most for this task.**

Then give me your **execution plan (5 steps maximum).** Only begin work once we've aligned.