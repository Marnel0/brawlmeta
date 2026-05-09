import type { PlayerProfile, BattleLogEntry } from "./types";

const BS_API_BASE = "https://api.brawlstars.com/v1";

export async function fetchPlayerProfile(rawTag: string): Promise<{
  player: PlayerProfile;
  battles: BattleLogEntry[];
} | null> {
  const apiKey = process.env.BRAWL_STARS_API_KEY;
  if (!apiKey) return null;

  const tag = "#" + rawTag.replace(/^#/, "").toUpperCase();
  const encoded = encodeURIComponent(tag);

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

    if (!playerRes.ok) return null;

    const [player, battleLog] = await Promise.all([
      playerRes.json() as Promise<PlayerProfile>,
      battleRes.ok ? battleRes.json() : Promise.resolve({ items: [] }),
    ]);

    return { player, battles: battleLog.items ?? [] };
  } catch {
    return null;
  }
}
