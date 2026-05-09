import { kv } from "@vercel/kv";
import type { PlayerProfile, BattleLogEntry } from "./types";

const BS_API_BASE = "https://api.brawlstars.com/v1";

export interface PlayerData {
  player: PlayerProfile;
  battles: BattleLogEntry[];
  cachedAt?: string;
}

/** Read a player profile cached by scripts/cache-player.mjs */
async function readFromKV(tag: string): Promise<PlayerData | null> {
  try {
    const kvKey = `brawl:player:${tag.replace("#", "").toUpperCase()}`;
    let raw = await kv.get<PlayerData | string>(kvKey);
    if (typeof raw === "string") {
      try { raw = JSON.parse(raw) as PlayerData; } catch { return null; }
    }
    return raw ?? null;
  } catch {
    return null;
  }
}

/** Fetch live from Supercell (only works when called from a whitelisted IP) */
async function fetchLive(tag: string): Promise<PlayerData | null> {
  const apiKey = process.env.BRAWL_STARS_API_KEY_OPEN ?? process.env.BRAWL_STARS_API_KEY;
  if (!apiKey) return null;

  const encoded = encodeURIComponent("#" + tag.replace(/^#/, "").toUpperCase());
  try {
    const [playerRes, battleRes] = await Promise.all([
      fetch(`${BS_API_BASE}/players/${encoded}`, {
        headers: { Authorization: `Bearer ${apiKey}` },
        next: { revalidate: 300 },
      }),
      fetch(`${BS_API_BASE}/players/${encoded}/battlelog`, {
        headers: { Authorization: `Bearer ${apiKey}` },
        next: { revalidate: 300 },
      }),
    ]);
    if (!playerRes.ok) {
      console.error(`[player-api] Supercell ${playerRes.status} for ${tag}`);
      return null;
    }
    const [player, battleLog] = await Promise.all([
      playerRes.json() as Promise<PlayerProfile>,
      battleRes.ok ? battleRes.json() : Promise.resolve({ items: [] }),
    ]);
    return { player, battles: battleLog.items ?? [] };
  } catch {
    return null;
  }
}

/**
 * Priority:
 *  1. KV cache (written by scripts/cache-player.mjs from whitelisted home IP)
 *  2. Live Supercell fetch (works only if caller's IP is whitelisted — local dev)
 */
export async function fetchPlayerProfile(rawTag: string): Promise<PlayerData | null> {
  const tag = rawTag.replace(/^#/, "").toUpperCase();

  const cached = await readFromKV(tag);
  if (cached) return cached;

  return fetchLive(tag);
}
