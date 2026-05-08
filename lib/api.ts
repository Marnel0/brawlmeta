/**
 * Server-side API client.
 *
 * Data sources:
 *   - Brawler metadata (name, rarity, role, image): api.brawlapi.com/v1 (public)
 *   - Win/pick rates: computed from real battle logs via Supercell API rankings
 *     → samples 30 top players × 25 battles = ~4 500 data points, cached 1 h
 *     → falls back to mock-data.ts when IP is blocked or API unavailable
 *   - Event rotation: api.brawlstars.com/v1 (requires BRAWL_STARS_API_KEY)
 *
 * IP note: the Supercell key is IP-restricted. Add Vercel egress IPs in
 * the Supercell developer portal for production use.
 */

import type {
  Brawler,
  BrawlEvent,
  BrawlapiResponse,
  GameModeId,
  Rarity,
  SupercellEventItem,
} from "./types";
import { FALLBACK_BRAWLERS, getStats } from "./mock-data";
import { winRateToTier, MODE_META } from "./utils";
import { readStore, computeRatesFromStore } from "./stats-store";

const BRAWLAPI_BASE = "https://api.brawlapi.com/v1";
const BS_API_BASE   = "https://api.brawlstars.com/v1";

// ── Win rate computation from battle logs ─────────────────────────────────────

interface WinLoss { wins: number; losses: number; picks: number }

type ComputedRates = Record<string, { winRate: number; pickRate: number }>;

/**
 * Fetches battle logs from top-ranked players and aggregates real win/pick rates.
 *
 * Bias note: sampling top-ranked players inflates raw win rates (they win 60%+
 * overall). We remove this bias by normalising the mean to 50%, preserving the
 * relative ranking between brawlers while making the absolute values comparable
 * to what community tier lists show.
 *
 * Cache: rankings 24 h, individual battle logs 1 h via Next.js Data Cache.
 */
async function computeWinRates(
  apiKey: string,
  targetMode: string | null
): Promise<ComputedRates> {
  const SAMPLE_SIZE = 50;
  const MIN_GAMES   = 10; // minimum team battles to trust a win rate

  // 1. Fetch rankings from global + a few countries for diversity
  const regionCodes = ["global", "US", "FR", "KR", "BR"];
  const rankingFetches = regionCodes.map((region) =>
    fetch(`${BS_API_BASE}/rankings/${region}/players?limit=50`, {
      headers: { Authorization: `Bearer ${apiKey}` },
      next: { revalidate: 86_400 },
    })
      .then((r) => (r.ok ? r.json() : { items: [] }))
      .catch(() => ({ items: [] }))
  );
  const rankingResults = await Promise.all(rankingFetches);

  // Deduplicate players by tag across regions
  const seen = new Set<string>();
  const players: { tag: string }[] = [];
  for (const { items } of rankingResults) {
    for (const p of items ?? []) {
      if (!seen.has(p.tag)) { seen.add(p.tag); players.push(p); }
    }
  }

  // 2. Fetch battle logs in parallel (429s are silently skipped)
  const logs = await Promise.all(
    players.slice(0, SAMPLE_SIZE).map((p) =>
      fetch(`${BS_API_BASE}/players/${encodeURIComponent(p.tag)}/battlelog`, {
        headers: { Authorization: `Bearer ${apiKey}` },
        next: { revalidate: 3_600 },
      })
        .then((r) => (r.ok ? r.json() : { items: [] }))
        .catch(() => ({ items: [] }))
    )
  );

  // 3. Aggregate per brawler name (API returns ALL CAPS names)
  const stats: Record<string, WinLoss> = {};
  const ensure = (n: string) => { if (!stats[n]) stats[n] = { wins: 0, losses: 0, picks: 0 }; };

  for (const log of logs) {
    for (const item of (log.items ?? []) as {
      battle: {
        mode?: string; type?: string; result?: string;
        teams?: { tag: string; brawler: { name: string } }[][];
        players?: { tag: string; brawler: { name: string } }[];
      };
    }[]) {
      const b = item.battle;
      if (!b || b.type === "friendly") continue;
      if (targetMode && b.mode !== targetMode) continue;

      if (b.teams && b.result && b.result !== "draw") {
        const victory = b.result === "victory";
        b.teams.forEach((team, ti) => {
          const won = ti === 0 ? victory : !victory;
          team.forEach((player) => {
            const name = player?.brawler?.name;
            if (!name) return;
            ensure(name);
            stats[name].picks++;
            if (won) stats[name].wins++; else stats[name].losses++;
          });
        });
      } else if (b.players) {
        // Showdown: pick rate only
        b.players.forEach((player) => {
          const name = player?.brawler?.name;
          if (!name) return;
          ensure(name); stats[name].picks++;
        });
      }
    }
  }

  // 4. Filter to brawlers with enough team-battle samples
  const reliable = Object.entries(stats).filter(([, v]) => v.wins + v.losses >= MIN_GAMES);
  if (reliable.length < 5) return {}; // not enough data, fall back to mock

  // 5. Normalise: top players win ~60%+ overall. Centre the distribution at 50%
  //    so that absolute values match community expectations while ranking is preserved.
  const totalWL = reliable.reduce((s, [, v]) => s + v.wins + v.losses, 0);
  const weightedMean = reliable.reduce(
    (s, [, v]) => s + (v.wins / (v.wins + v.losses)) * ((v.wins + v.losses) / totalWL),
    0
  );
  const offset = 0.5 - weightedMean;

  const totalPicks = Object.values(stats).reduce((s, v) => s + v.picks, 0);

  return Object.fromEntries(
    reliable.map(([name, v]) => {
      const raw = v.wins / (v.wins + v.losses);
      return [
        name,
        {
          winRate:  Math.min(0.70, Math.max(0.35, raw + offset)),
          pickRate: totalPicks > 0 ? v.picks / totalPicks : 0,
        },
      ];
    })
  );
}

// ── Brawler metadata ──────────────────────────────────────────────────────────

async function fetchBrawlerMeta() {
  try {
    const res = await fetch(`${BRAWLAPI_BASE}/brawlers`, {
      next: { revalidate: 3_600 },
    });
    if (res.ok) {
      const data: BrawlapiResponse = await res.json();
      return data.list
        .filter((b) => b.released)
        .map((b) => ({
          id: b.id,
          name: b.name,            // ALL CAPS as returned by brawlapi.com
          rarity: b.rarity.name as Rarity,
          role: b.class.name,
          imageUrl: b.imageUrl2,   // borderless portrait
        }));
    }
  } catch { /* fall through */ }

  return FALLBACK_BRAWLERS.map((b) => ({
    id: b.id,
    name: b.name.toUpperCase(),
    rarity: b.rarity as Rarity,
    role: b.role,
    imageUrl: `https://cdn.brawlify.com/brawlers/borderless/${b.id}.png`,
  }));
}

// ── Public: fetch brawlers with real win rates ────────────────────────────────

export async function fetchBrawlers(
  mode: Exclude<GameModeId, "all"> | null = null
): Promise<Brawler[]> {
  const [meta, apiKey] = [await fetchBrawlerMeta(), process.env.BRAWL_STARS_API_KEY];

  // ── Priority 1: Vercel KV accumulated store ───────────────────────────────
  let computed: ComputedRates = {};
  try {
    const store = await readStore();
    if (store) {
      computed = computeRatesFromStore(store, mode);
      if (Object.keys(computed).length > 10) {
        console.log(`[api] Using KV store (${store.totalBattles} battles)`);
      } else {
        computed = {};
      }
    }
  } catch (err) {
    console.warn("[api] KV read failed:", (err as Error).message);
  }

  // ── Priority 2: Real-time computation (if KV not warm yet) ───────────────
  if (Object.keys(computed).length === 0 && apiKey) {
    try {
      computed = await computeWinRates(apiKey, mode);
    } catch (err) {
      console.warn("[api] Win-rate computation failed, using mock:", (err as Error).message);
    }
  }

  const usedComputed = Object.keys(computed).length > 10;

  return meta.map((b) => {
    // brawlapi.com returns names in ALL CAPS (e.g. "SHELLY")
    const key = b.name.toUpperCase();
    if (usedComputed && computed[key]) {
      const { winRate, pickRate } = computed[key];
      return { ...b, winRate, pickRate, tier: winRateToTier(winRate) };
    }
    // Fallback: mock data (mixed-case lookup — getStats handles normalisation)
    const mockName = b.name.charAt(0) + b.name.slice(1).toLowerCase();
    const { winRate, pickRate } = getStats(mockName, mode);
    return { ...b, winRate, pickRate, tier: winRateToTier(winRate) };
  });
}

// ── Events ────────────────────────────────────────────────────────────────────

const MODE_NAME_MAP: Record<string, string> = {
  gemGrab: "Gem Grab", brawlBall: "Brawl Ball", heist: "Heist",
  bounty: "Bounty", siege: "Siege", soloShowdown: "Solo Showdown",
  duoShowdown: "Duo Showdown", knockout: "Knockout", hotZone: "Hot Zone",
  wipeout: "Wipeout", duels: "Duels", trioShowdown: "Trio Showdown",
};

// Brawlify CDN: map thumbnails keyed by event ID
// Confirmed: https://cdn.brawlify.com/maps/regular/{eventId}.png
function mapImageUrl(eventId: number): string {
  return `https://cdn.brawlify.com/maps/regular/${eventId}.png`;
}

// Supercell compact ISO 8601 → standard ISO: "20260508T080000.000Z" → "2026-05-08T08:00:00.000Z"
function parseSupercellDate(raw: string): string {
  const m = raw.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})\.(\d+)Z$/);
  if (!m) return raw;
  return `${m[1]}-${m[2]}-${m[3]}T${m[4]}:${m[5]}:${m[6]}.${m[7]}Z`;
}

export async function fetchEvents(): Promise<BrawlEvent[]> {
  const apiKey = process.env.BRAWL_STARS_API_KEY;
  if (!apiKey) return MOCK_EVENTS;

  try {
    const res = await fetch(`${BS_API_BASE}/events/rotation`, {
      headers: { Authorization: `Bearer ${apiKey}` },
      next: { revalidate: 1_800 },
    });
    if (!res.ok) return MOCK_EVENTS;

    const data: SupercellEventItem[] = await res.json();
    if (!Array.isArray(data)) return MOCK_EVENTS;

    return data.map((item) => {
      const modeId = item.event.mode as Exclude<GameModeId, "all">;
      const meta   = MODE_META[modeId];
      return {
        id:        item.event.id,
        mode:      modeId,
        modeName:  meta?.name ?? MODE_NAME_MAP[modeId] ?? item.event.mode,
        modeColor: meta?.color ?? "#6B7280",
        map:       item.event.map,
        startTime: parseSupercellDate(item.startTime),
        endTime:   parseSupercellDate(item.endTime),
        slotId:    item.slotId,
        mapImageUrl: mapImageUrl(item.event.id),
      };
    });
  } catch (err) {
    console.error("[api] fetchEvents error:", err);
    return MOCK_EVENTS;
  }
}

// ── Fallback mock events (real IDs from 2026-05-09 rotation) ─────────────────

const now = new Date();
const h = (hrs: number) => new Date(now.getTime() + hrs * 3_600_000).toISOString();

export const MOCK_EVENTS: BrawlEvent[] = [
  { id: 15001053, mode: "brawlBall",    modeName: "Brawl Ball",     modeColor: "#22C55E", map: "Sidetrack",        startTime: now.toISOString(), endTime: h(20), slotId: 1, mapImageUrl: mapImageUrl(15001053) },
  { id: 15000950, mode: "soloShowdown", modeName: "Solo Showdown",  modeColor: "#EC4899", map: "Feast or Famine",  startTime: now.toISOString(), endTime: h(16), slotId: 2, mapImageUrl: mapImageUrl(15000950) },
  { id: 15000010, mode: "gemGrab",      modeName: "Gem Grab",       modeColor: "#A855F7", map: "Gem Fort",         startTime: now.toISOString(), endTime: h(14), slotId: 3, mapImageUrl: mapImageUrl(15000010) },
  { id: 15000019, mode: "heist",        modeName: "Heist",          modeColor: "#EF4444", map: "Safe Zone",        startTime: now.toISOString(), endTime: h(12), slotId: 4, mapImageUrl: mapImageUrl(15000019) },
  { id: 15000951, mode: "duoShowdown",  modeName: "Duo Showdown",   modeColor: "#EC4899", map: "Feast or Famine",  startTime: now.toISOString(), endTime: h(10), slotId: 5, mapImageUrl: mapImageUrl(15000951) },
  { id: 15001210, mode: "knockout",     modeName: "Knockout",       modeColor: "#EF4444", map: "Opening Move",     startTime: now.toISOString(), endTime: h(8),  slotId: 6, mapImageUrl: mapImageUrl(15001210) },
];
