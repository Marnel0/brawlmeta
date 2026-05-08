/**
 * GET /api/cron/aggregate
 *
 * Protected cron endpoint — accumulates battle-log stats into Vercel KV.
 * Called by Vercel Cron (vercel.json) or GitHub Actions (.github/workflows/).
 *
 * Authorization: Bearer <CRON_SECRET> in the Authorization header.
 */

import { NextRequest, NextResponse } from "next/server";
import { mergeStore } from "@/lib/stats-store";
import type { BrawlerWinLoss, StatsStore } from "@/lib/types";

const BS_API_BASE = "https://api.brawlstars.com/v1";
const SAMPLE_SIZE = 100; // players per run — grows the dataset by ~2 500 battles/run

export const runtime = "nodejs";
export const maxDuration = 60; // seconds (Pro: up to 300)

export async function GET(req: NextRequest) {
  // ── Auth ────────────────────────────────────────────────────────────────────
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = req.headers.get("authorization");
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.BRAWL_STARS_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "BRAWL_STARS_API_KEY not set" }, { status: 500 });
  }

  // ── 1. Fetch rankings ───────────────────────────────────────────────────────
  const regionCodes = ["global", "US", "FR", "KR", "BR", "DE", "MX", "TR"];
  const rankingResults = await Promise.all(
    regionCodes.map((region) =>
      fetch(`${BS_API_BASE}/rankings/${region}/players?limit=200`, {
        headers: { Authorization: `Bearer ${apiKey}` },
        next: { revalidate: 0 }, // always fresh for the cron
      })
        .then((r) => (r.ok ? r.json() : { items: [] }))
        .catch(() => ({ items: [] }))
    )
  );

  const seen = new Set<string>();
  const players: { tag: string }[] = [];
  for (const { items } of rankingResults) {
    for (const p of items ?? []) {
      if (!seen.has(p.tag)) { seen.add(p.tag); players.push(p); }
    }
  }

  // ── 2. Fetch battle logs ────────────────────────────────────────────────────
  const logs = await Promise.all(
    players.slice(0, SAMPLE_SIZE).map((p) =>
      fetch(`${BS_API_BASE}/players/${encodeURIComponent(p.tag)}/battlelog`, {
        headers: { Authorization: `Bearer ${apiKey}` },
        next: { revalidate: 0 },
      })
        .then((r) => (r.ok ? r.json() : { items: [] }))
        .catch(() => ({ items: [] }))
    )
  );

  // ── 3. Aggregate ────────────────────────────────────────────────────────────
  const modes: StatsStore["modes"] = { global: {} };
  const ensure = (bucket: Record<string, BrawlerWinLoss>, name: string) => {
    if (!bucket[name]) bucket[name] = { w: 0, l: 0, p: 0 };
  };

  let totalBattles = 0;
  const uniquePlayers = new Set<string>();

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

      const mode = b.mode ?? "unknown";
      if (!modes[mode]) modes[mode] = {};

      if (b.teams && b.result && b.result !== "draw") {
        totalBattles++;
        const victory = b.result === "victory";
        b.teams.forEach((team, ti) => {
          const won = ti === 0 ? victory : !victory;
          team.forEach((player) => {
            const name = player?.brawler?.name;
            if (!name) return;
            if (player.tag) uniquePlayers.add(player.tag);

            ensure(modes.global, name);
            ensure(modes[mode], name);
            modes.global[name].p++;
            modes[mode][name].p++;
            if (won) {
              modes.global[name].w++;
              modes[mode][name].w++;
            } else {
              modes.global[name].l++;
              modes[mode][name].l++;
            }
          });
        });
      } else if (b.players) {
        // Showdown: pick rate only
        b.players.forEach((player) => {
          const name = player?.brawler?.name;
          if (!name) return;
          if (player.tag) uniquePlayers.add(player.tag);
          if (!modes[mode]) modes[mode] = {};
          ensure(modes.global, name);
          ensure(modes[mode], name);
          modes.global[name].p++;
          modes[mode][name].p++;
        });
      }
    }
  }

  // ── 4. Merge into KV ───────────────────────────────────────────────────────
  const patch: Omit<StatsStore, "v" | "lastUpdated"> = {
    totalBattles,
    totalPlayers: uniquePlayers.size,
    modes,
  };

  await mergeStore(patch);

  return NextResponse.json({
    ok: true,
    processed: { players: players.slice(0, SAMPLE_SIZE).length, battles: totalBattles, uniquePlayers: uniquePlayers.size },
  });
}
