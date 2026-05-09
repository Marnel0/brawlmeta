export type Rarity =
  | "Starting Brawler"
  | "Rare"
  | "Super Rare"
  | "Epic"
  | "Mythic"
  | "Legendary"
  | "Ultra Legendary";

export type TierLabel = "S" | "A" | "B" | "C" | "D";

export type GameModeId =
  | "gemGrab"
  | "brawlBall"
  | "heist"
  | "bounty"
  | "siege"
  | "soloShowdown"
  | "duoShowdown"
  | "knockout"
  | "hotZone"
  | "wipeout"
  | "duels"
  | "trioShowdown"
  | "tagTeam"
  | "airHockey"
  | "brawlArena"
  | "brawlBall5V5"
  | "deathmatch"
  | "knockout5V5"
  | "all";

export interface Brawler {
  id: number;
  name: string;
  rarity: Rarity;
  role: string;
  /** Borderless portrait from Brawlify CDN */
  imageUrl: string;
  /** 0.0–1.0 — mocked in V1, real data in V1.5 */
  winRate: number;
  /** 0.0–1.0 — mocked in V1, real data in V1.5 */
  pickRate: number;
  tier: TierLabel;
}

export interface GameMode {
  id: GameModeId;
  name: string;
  color: string;
}

export interface BrawlEvent {
  id: number;
  mode: GameModeId;
  modeName: string;
  modeColor: string;
  map: string;
  /** ISO 8601 */
  startTime: string;
  /** ISO 8601 */
  endTime: string;
  slotId: number;
  /** Map thumbnail from Brawlify CDN — may be undefined for unknown maps */
  mapImageUrl?: string;
}

// Shape returned by api.brawlapi.com/v1/brawlers
export interface BrawlapiResponse {
  list: BrawlapiItem[];
}

export interface BrawlapiItem {
  id: number;
  name: string;
  released: boolean;
  imageUrl2: string; // borderless portrait
  class: { id: number; name: string };
  rarity: { id: number; name: string; color: string };
}

// Shape returned by api.brawlstars.com/v1/events/rotation
// The API returns a direct array (not wrapped in { items: [...] })
export interface SupercellEventItem {
  startTime: string; // compact ISO 8601: "20260508T080000.000Z"
  endTime: string;
  slotId: number;
  event: {
    id: number;
    mode: string;
    modeId?: number;
    map: string;
  };
}

// ── Player profile ────────────────────────────────────────────────────────────

export interface PlayerBrawlerGear { id: number; name: string; level: number }
export interface PlayerBrawlerItem { id: number; name: string }

export interface PlayerBrawler {
  id: number;
  name: string;
  power: number;
  rank: number;
  trophies: number;
  highestTrophies: number;
  gears: PlayerBrawlerGear[];
  starPowers: PlayerBrawlerItem[];
  gadgets: PlayerBrawlerItem[];
}

export interface PlayerProfile {
  tag: string;
  name: string;
  nameColor: string;
  icon: { id: number };
  trophies: number;
  highestTrophies: number;
  expLevel: number;
  expPoints: number;
  "3vs3Victories": number;
  soloVictories: number;
  duoVictories: number;
  club?: { tag: string; name: string };
  brawlers: PlayerBrawler[];
}

export interface BattleParticipant {
  tag: string;
  name: string;
  brawler: { id: number; name: string; power: number; trophies: number };
}

export interface BattleLogEntry {
  battleTime: string;
  event: { id: number; mode: string; map: string };
  battle: {
    mode: string;
    type: string;
    result?: "victory" | "defeat" | "draw";
    duration?: number;
    trophyChange?: number;
    starPlayer?: BattleParticipant;
    teams?: BattleParticipant[][];
    players?: (BattleParticipant & { rank?: number })[];
  };
}

// ── Vercel KV stats accumulation (Option C) ───────────────────────────────────

/** Per-brawler win/loss/pick counters — compact keys to save KV bytes */
export interface BrawlerWinLoss {
  w: number; // wins
  l: number; // losses (team battles only)
  p: number; // picks (all modes including showdown)
}

/**
 * Shape stored under the single KV key "brawl:stats".
 * modes.global aggregates all team battle modes.
 * modes[modeId] stores per-mode breakdowns.
 */
export interface StatsStore {
  v: number;              // schema version (currently 1)
  lastUpdated: string;    // ISO 8601 timestamp of last cron run
  totalBattles: number;   // cumulative team battles processed
  totalPlayers: number;   // cumulative unique players processed
  modes: {
    global: Record<string, BrawlerWinLoss>;
    [mode: string]: Record<string, BrawlerWinLoss>;
  };
}
