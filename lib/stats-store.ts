/**
 * Vercel KV adapter for the accumulative battle-stats store.
 *
 * Single key "brawl:stats" holds all aggregated win/loss/pick data.
 * Read: normalise and compute rates at read time.
 * Write: merge new counts additively (never overwrite).
 */

import { kv } from "@vercel/kv";
import type { BrawlerWinLoss, StatsStore } from "./types";

const KV_KEY = "brawl:stats";
const SCHEMA_VERSION = 1;
const MIN_BATTLES = 100; // minimum totalBattles before we trust the store

export async function readStore(): Promise<StatsStore | null> {
  try {
    let raw = await kv.get<StatsStore | string>(KV_KEY);
    // Local script stores a double-encoded string — unwrap it
    if (typeof raw === "string") {
      try { raw = JSON.parse(raw) as StatsStore; } catch { return null; }
    }
    if (!raw || (raw as StatsStore).v !== SCHEMA_VERSION || (raw as StatsStore).totalBattles < MIN_BATTLES) return null;
    return raw as StatsStore;
  } catch {
    return null;
  }
}

export async function mergeStore(patch: Omit<StatsStore, "v" | "lastUpdated">): Promise<void> {
  const existing = await kv.get<StatsStore>(KV_KEY);
  const base: StatsStore = existing ?? {
    v: SCHEMA_VERSION,
    lastUpdated: new Date().toISOString(),
    totalBattles: 0,
    totalPlayers: 0,
    modes: { global: {} },
  };

  base.totalBattles += patch.totalBattles;
  base.totalPlayers += patch.totalPlayers;
  base.lastUpdated = new Date().toISOString();

  for (const [mode, brawlers] of Object.entries(patch.modes)) {
    if (!base.modes[mode]) base.modes[mode] = {};
    for (const [name, delta] of Object.entries(brawlers)) {
      const cur = base.modes[mode][name] ?? { w: 0, l: 0, p: 0 };
      base.modes[mode][name] = {
        w: cur.w + delta.w,
        l: cur.l + delta.l,
        p: cur.p + delta.p,
      };
    }
  }

  await kv.set(KV_KEY, base);
}

/**
 * Normalises KV counters into win/pick rates for a given mode.
 * Applies the same top-player bias correction as the real-time computation:
 * shifts the weighted mean to 50%.
 */
export function computeRatesFromStore(
  store: StatsStore,
  mode: string | null
): Record<string, { winRate: number; pickRate: number }> {
  const bucket = mode && store.modes[mode] ? store.modes[mode] : store.modes.global;
  const MIN_GAMES = 20;

  const reliable = Object.entries(bucket).filter(
    ([, v]) => v.w + v.l >= MIN_GAMES
  ) as [string, BrawlerWinLoss][];

  if (reliable.length < 5) return {};

  const totalWL = reliable.reduce((s, [, v]) => s + v.w + v.l, 0);
  const weightedMean = reliable.reduce(
    (s, [, v]) => s + (v.w / (v.w + v.l)) * ((v.w + v.l) / totalWL),
    0
  );
  const offset = 0.5 - weightedMean;

  const totalPicks = Object.values(bucket).reduce((s, v) => s + v.p, 0);

  return Object.fromEntries(
    reliable.map(([name, v]) => {
      const raw = v.w / (v.w + v.l);
      return [
        name,
        {
          winRate:  Math.min(0.70, Math.max(0.35, raw + offset)),
          pickRate: totalPicks > 0 ? v.p / totalPicks : 0,
        },
      ];
    })
  );
}
