/**
 * Mock win/pick rates for V1.
 * Real source (scraped or computed from battle logs) planned for V1.5.
 * Values are based on community tier lists and approximate to real meta.
 */

import type { GameModeId } from "./types";

interface BrawlerStats {
  winRate: number;
  pickRate: number;
  /** Per-mode delta applied on top of winRate when filtering by mode */
  modeModifiers: Partial<Record<Exclude<GameModeId, "all">, number>>;
}

export const MOCK_STATS: Record<string, BrawlerStats> = {
  // ── S tier ──────────────────────────────────────────────────────────────
  Angelo:    { winRate: 0.585, pickRate: 0.094, modeModifiers: { bounty: +0.03, knockout: +0.025, gemGrab: +0.01 } },
  Maisie:    { winRate: 0.578, pickRate: 0.071, modeModifiers: { bounty: +0.04, heist: +0.02, brawlBall: -0.02 } },
  Melodie:   { winRate: 0.572, pickRate: 0.058, modeModifiers: { gemGrab: +0.03, brawlBall: +0.02, heist: +0.01 } },
  Cordelius: { winRate: 0.564, pickRate: 0.042, modeModifiers: { gemGrab: +0.025, heist: +0.02, brawlBall: +0.01 } },
  Kit:       { winRate: 0.558, pickRate: 0.038, modeModifiers: { gemGrab: +0.03, hotZone: +0.02, duoShowdown: +0.04 } },
  Charlie:   { winRate: 0.551, pickRate: 0.047, modeModifiers: { hotZone: +0.035, heist: +0.015, gemGrab: +0.01 } },

  // ── A tier ──────────────────────────────────────────────────────────────
  Spike:     { winRate: 0.546, pickRate: 0.112, modeModifiers: { gemGrab: +0.025, hotZone: +0.02, brawlBall: -0.01 } },
  Leon:      { winRate: 0.541, pickRate: 0.089, modeModifiers: { heist: +0.03, soloShowdown: +0.035, gemGrab: +0.01 } },
  Sandy:     { winRate: 0.538, pickRate: 0.065, modeModifiers: { hotZone: +0.04, gemGrab: +0.03, brawlBall: +0.02 } },
  Buzz:      { winRate: 0.534, pickRate: 0.076, modeModifiers: { heist: +0.04, brawlBall: +0.03, gemGrab: -0.01 } },
  Chester:   { winRate: 0.531, pickRate: 0.048, modeModifiers: { soloShowdown: +0.04, bounty: +0.02, gemGrab: +0.01 } },
  Buster:    { winRate: 0.527, pickRate: 0.059, modeModifiers: { gemGrab: +0.03, hotZone: +0.025, knockout: +0.02 } },
  Draco:     { winRate: 0.524, pickRate: 0.044, modeModifiers: { heist: +0.035, brawlBall: +0.025, gemGrab: -0.01 } },
  Otis:      { winRate: 0.521, pickRate: 0.052, modeModifiers: { heist: +0.03, hotZone: +0.02, gemGrab: +0.01 } },

  // ── B tier ──────────────────────────────────────────────────────────────
  Crow:      { winRate: 0.513, pickRate: 0.068, modeModifiers: { soloShowdown: +0.04, duoShowdown: +0.03, gemGrab: -0.01 } },
  Tara:      { winRate: 0.511, pickRate: 0.054, modeModifiers: { gemGrab: +0.025, hotZone: +0.02, heist: +0.01 } },
  Gene:      { winRate: 0.508, pickRate: 0.062, modeModifiers: { gemGrab: +0.04, hotZone: +0.02, bounty: +0.01 } },
  Max:       { winRate: 0.506, pickRate: 0.071, modeModifiers: { heist: +0.03, gemGrab: +0.025, brawlBall: +0.02 } },
  Mortis:    { winRate: 0.503, pickRate: 0.085, modeModifiers: { heist: +0.045, brawlBall: +0.04, gemGrab: -0.02 } },
  Surge:     { winRate: 0.501, pickRate: 0.049, modeModifiers: { heist: +0.035, hotZone: +0.025, gemGrab: +0.01 } },
  Piper:     { winRate: 0.499, pickRate: 0.058, modeModifiers: { bounty: +0.055, knockout: +0.035, brawlBall: -0.04 } },
  Amber:     { winRate: 0.497, pickRate: 0.043, modeModifiers: { heist: +0.04, hotZone: +0.03, bounty: +0.01 } },
  Meg:       { winRate: 0.494, pickRate: 0.039, modeModifiers: { heist: +0.04, brawlBall: +0.025, gemGrab: +0.01 } },
  Colette:   { winRate: 0.491, pickRate: 0.047, modeModifiers: { heist: +0.05, brawlBall: +0.02, gemGrab: +0.01 } },

  // ── C tier ──────────────────────────────────────────────────────────────
  Shelly:    { winRate: 0.484, pickRate: 0.142, modeModifiers: { brawlBall: +0.025, soloShowdown: +0.02, gemGrab: -0.01 } },
  Brock:     { winRate: 0.481, pickRate: 0.078, modeModifiers: { bounty: +0.04, heist: +0.03, brawlBall: -0.03 } },
  Emz:       { winRate: 0.478, pickRate: 0.055, modeModifiers: { hotZone: +0.03, gemGrab: +0.02, brawlBall: -0.015 } },
  Lola:      { winRate: 0.476, pickRate: 0.041, modeModifiers: { gemGrab: +0.02, hotZone: +0.015, bounty: +0.01 } },
  Squeak:    { winRate: 0.474, pickRate: 0.038, modeModifiers: { heist: +0.04, hotZone: +0.025, brawlBall: -0.02 } },
  Nita:      { winRate: 0.472, pickRate: 0.063, modeModifiers: { heist: +0.02, brawlBall: +0.015, soloShowdown: +0.01 } },
  Jessie:    { winRate: 0.469, pickRate: 0.051, modeModifiers: { heist: +0.03, gemGrab: +0.02, bounty: +0.01 } },
  Colt:      { winRate: 0.467, pickRate: 0.067, modeModifiers: { bounty: +0.035, heist: +0.02, brawlBall: -0.025 } },
  Bo:        { winRate: 0.464, pickRate: 0.044, modeModifiers: { bounty: +0.04, soloShowdown: +0.03, brawlBall: -0.01 } },
  Penny:     { winRate: 0.462, pickRate: 0.036, modeModifiers: { heist: +0.035, siege: +0.04, gemGrab: +0.015 } },
  Darryl:    { winRate: 0.459, pickRate: 0.042, modeModifiers: { brawlBall: +0.04, heist: +0.03, bounty: -0.025 } },
  Sam:       { winRate: 0.457, pickRate: 0.033, modeModifiers: { brawlBall: +0.035, heist: +0.03, bounty: -0.03 } },
  Mandy:     { winRate: 0.455, pickRate: 0.029, modeModifiers: { bounty: +0.05, knockout: +0.03, brawlBall: -0.04 } },

  // ── D tier ──────────────────────────────────────────────────────────────
  Bull:      { winRate: 0.448, pickRate: 0.072, modeModifiers: { brawlBall: +0.06, heist: +0.055, bounty: -0.05 } },
  El_Primo:  { winRate: 0.442, pickRate: 0.059, modeModifiers: { brawlBall: +0.05, heist: +0.04, bounty: -0.045 } },
  Poco:      { winRate: 0.439, pickRate: 0.048, modeModifiers: { gemGrab: +0.025, duoShowdown: +0.035, heist: +0.01 } },
  Rosa:      { winRate: 0.435, pickRate: 0.038, modeModifiers: { brawlBall: +0.045, heist: +0.03, bounty: -0.04 } },
  Barley:    { winRate: 0.432, pickRate: 0.042, modeModifiers: { heist: +0.04, hotZone: +0.03, bounty: +0.01 } },
  Tick:      { winRate: 0.428, pickRate: 0.035, modeModifiers: { heist: +0.04, hotZone: +0.025, brawlBall: -0.02 } },
  "8-Bit":   { winRate: 0.423, pickRate: 0.028, modeModifiers: { heist: +0.055, siege: +0.04, brawlBall: -0.035 } },
  Jacky:     { winRate: 0.419, pickRate: 0.031, modeModifiers: { brawlBall: +0.04, heist: +0.035, bounty: -0.04 } },
  Gale:      { winRate: 0.416, pickRate: 0.024, modeModifiers: { hotZone: +0.03, gemGrab: +0.02, bounty: -0.01 } },
  Frank:     { winRate: 0.412, pickRate: 0.027, modeModifiers: { heist: +0.05, brawlBall: +0.03, bounty: -0.045 } },
  Bibi:      { winRate: 0.409, pickRate: 0.033, modeModifiers: { brawlBall: +0.05, heist: +0.03, bounty: -0.04 } },
  Lou:       { winRate: 0.406, pickRate: 0.022, modeModifiers: { hotZone: +0.035, gemGrab: +0.025, heist: -0.01 } },
};

/** Resolve stats for a brawler name, falling back to a seeded default */
export function getStats(
  name: string,
  mode: Exclude<GameModeId, "all"> | null
): { winRate: number; pickRate: number } {
  // Normalize name (API uses "El Primo", mock uses "El_Primo")
  const key = name.replace(/ /g, "_");
  const stat = MOCK_STATS[key] ?? MOCK_STATS[name];

  if (!stat) {
    // Seed a deterministic default so unknown brawlers aren't all identical
    const seed =
      name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % 100;
    return { winRate: 0.46 + seed * 0.001, pickRate: 0.02 + seed * 0.0003 };
  }

  const modifier = mode ? (stat.modeModifiers[mode] ?? 0) : 0;
  return {
    winRate: Math.min(0.7, Math.max(0.3, stat.winRate + modifier)),
    pickRate: stat.pickRate,
  };
}

/** Fallback brawler roster when brawlapi.com is unavailable */
export const FALLBACK_BRAWLERS: Array<{
  id: number;
  name: string;
  rarity: string;
  role: string;
}> = [
  { id: 16000000, name: "Shelly",    rarity: "Starting Brawler", role: "Damage Dealer" },
  { id: 16000001, name: "Nita",      rarity: "Starting Brawler", role: "Damage Dealer" },
  { id: 16000002, name: "Colt",      rarity: "Starting Brawler", role: "Damage Dealer" },
  { id: 16000003, name: "Bull",      rarity: "Starting Brawler", role: "Tank" },
  { id: 16000004, name: "Jessie",    rarity: "Starting Brawler", role: "Controller" },
  { id: 16000005, name: "Brock",     rarity: "Starting Brawler", role: "Marksman" },
  { id: 16000006, name: "El Primo",  rarity: "Starting Brawler", role: "Tank" },
  { id: 16000007, name: "Barley",    rarity: "Starting Brawler", role: "Artillery" },
  { id: 16000008, name: "Poco",      rarity: "Starting Brawler", role: "Support" },
  { id: 16000009, name: "Rosa",      rarity: "Starting Brawler", role: "Tank" },
  { id: 16000010, name: "Darryl",    rarity: "Super Rare",       role: "Tank" },
  { id: 16000011, name: "Penny",     rarity: "Super Rare",       role: "Artillery" },
  { id: 16000012, name: "Jacky",     rarity: "Super Rare",       role: "Tank" },
  { id: 16000013, name: "Gale",      rarity: "Super Rare",       role: "Support" },
  { id: 16000014, name: "Frank",     rarity: "Rare",             role: "Tank" },
  { id: 16000015, name: "Tick",      rarity: "Rare",             role: "Controller" },
  { id: 16000016, name: "8-Bit",     rarity: "Rare",             role: "Damage Dealer" },
  { id: 16000017, name: "Emz",       rarity: "Rare",             role: "Controller" },
  { id: 16000018, name: "Lou",       rarity: "Super Rare",       role: "Controller" },
  { id: 16000019, name: "Bo",        rarity: "Rare",             role: "Controller" },
  { id: 16000020, name: "Bibi",      rarity: "Epic",             role: "Damage Dealer" },
  { id: 16000021, name: "Squeak",    rarity: "Mythic",           role: "Controller" },
  { id: 16000022, name: "Buzz",      rarity: "Super Rare",       role: "Assassin" },
  { id: 16000023, name: "Griff",     rarity: "Rare",             role: "Damage Dealer" },
  { id: 16000024, name: "Gus",       rarity: "Super Rare",       role: "Support" },
  { id: 16000025, name: "Buster",    rarity: "Epic",             role: "Controller" },
  { id: 16000026, name: "Sam",       rarity: "Epic",             role: "Assassin" },
  { id: 16000027, name: "Mandy",     rarity: "Epic",             role: "Marksman" },
  { id: 16000028, name: "Maisie",    rarity: "Epic",             role: "Marksman" },
  { id: 16000029, name: "Hank",      rarity: "Epic",             role: "Tank" },
  { id: 16000030, name: "Cordelius", rarity: "Mythic",           role: "Assassin" },
  { id: 16000031, name: "Charlie",   rarity: "Mythic",           role: "Controller" },
  { id: 16000032, name: "Mico",      rarity: "Mythic",           role: "Assassin" },
  { id: 16000033, name: "Chuck",     rarity: "Mythic",           role: "Damage Dealer" },
  { id: 16000034, name: "Melodie",   rarity: "Mythic",           role: "Damage Dealer" },
  { id: 16000035, name: "Lily",      rarity: "Mythic",           role: "Assassin" },
  { id: 16000036, name: "Clancy",    rarity: "Mythic",           role: "Damage Dealer" },
  { id: 16000037, name: "Angelo",    rarity: "Mythic",           role: "Marksman" },
  { id: 16000038, name: "Kit",       rarity: "Mythic",           role: "Support" },
  { id: 16000039, name: "Draco",     rarity: "Legendary",        role: "Tank" },
  { id: 16000040, name: "Kenji",     rarity: "Legendary",        role: "Assassin" },
  { id: 16000041, name: "Juju",      rarity: "Legendary",        role: "Support" },
  { id: 16000042, name: "Chester",   rarity: "Legendary",        role: "Damage Dealer" },
  { id: 16000043, name: "Otis",      rarity: "Legendary",        role: "Controller" },
  { id: 16000044, name: "Lola",      rarity: "Legendary",        role: "Damage Dealer" },
  { id: 16000045, name: "Fang",      rarity: "Mythic",           role: "Assassin" },
  { id: 16000046, name: "Amber",     rarity: "Legendary",        role: "Damage Dealer" },
  { id: 16000047, name: "Leon",      rarity: "Legendary",        role: "Assassin" },
  { id: 16000048, name: "Spike",     rarity: "Legendary",        role: "Controller" },
  { id: 16000049, name: "Crow",      rarity: "Legendary",        role: "Assassin" },
  { id: 16000050, name: "Sandy",     rarity: "Legendary",        role: "Controller" },
  { id: 16000051, name: "Meg",       rarity: "Legendary",        role: "Tank" },
  { id: 16000052, name: "Surge",     rarity: "Mythic",           role: "Damage Dealer" },
  { id: 16000053, name: "Colette",   rarity: "Epic",             role: "Damage Dealer" },
  { id: 16000054, name: "Tara",      rarity: "Mythic",           role: "Controller" },
  { id: 16000055, name: "Gene",      rarity: "Mythic",           role: "Support" },
  { id: 16000056, name: "Max",       rarity: "Mythic",           role: "Support" },
  { id: 16000057, name: "Mortis",    rarity: "Mythic",           role: "Assassin" },
  { id: 16000058, name: "Piper",     rarity: "Epic",             role: "Marksman" },
  { id: 16000059, name: "Pam",       rarity: "Epic",             role: "Support" },
];
