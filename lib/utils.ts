import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { GameModeId, Rarity, TierLabel } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function winRateToTier(winRate: number): TierLabel {
  if (winRate >= 0.57) return "S";
  if (winRate >= 0.535) return "A";
  if (winRate >= 0.505) return "B";
  if (winRate >= 0.475) return "C";
  return "D";
}

export function formatWinRate(rate: number) {
  return `${(rate * 100).toFixed(1)}%`;
}

export function formatPickRate(rate: number) {
  if (rate < 0.001) return "<0.1%";
  return `${(rate * 100).toFixed(1)}%`;
}

export function formatTimeRemaining(endTime: string): string {
  const diff = new Date(endTime).getTime() - Date.now();
  if (diff <= 0) return "Ended";
  const h = Math.floor(diff / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  if (h >= 24) return `${Math.floor(h / 24)}d ${h % 24}h`;
  return `${h}h ${m}m`;
}

export const RARITY_COLOR: Record<Rarity, string> = {
  "Starting Brawler": "#B9EAFF",
  Rare: "#2EB872",
  "Super Rare": "#1D7FBC",
  Epic: "#7E5BEF",
  Mythic: "#EC4899",
  Legendary: "#FFCC00",
  "Ultra Legendary": "#E63946",
};

export const RARITY_LABEL_COLOR: Record<Rarity, string> = {
  "Starting Brawler": "#0F0F14",
  Rare: "#ffffff",
  "Super Rare": "#ffffff",
  Epic: "#ffffff",
  Mythic: "#ffffff",
  Legendary: "#0F0F14",
  "Ultra Legendary": "#ffffff",
};

export const TIER_COLOR: Record<TierLabel, string> = {
  S: "#E63946",
  A: "#F97316",
  B: "#FFCC00",
  C: "#1D7FBC",
  D: "#94A3B8",
};

export const TIER_BG: Record<TierLabel, string> = {
  S: "#FEE2E2",
  A: "#FFEDD5",
  B: "#FEF9C3",
  C: "#DBEAFE",
  D: "#F1F5F9",
};

export const MODE_META: Record<
  Exclude<GameModeId, "all">,
  { name: string; color: string; emoji: string }
> = {
  gemGrab:      { name: "Gem Grab",       color: "#A855F7", emoji: "💎" },
  brawlBall:    { name: "Brawl Ball",     color: "#22C55E", emoji: "⚽" },
  heist:        { name: "Heist",          color: "#EF4444", emoji: "💰" },
  bounty:       { name: "Bounty",         color: "#3B82F6", emoji: "⭐" },
  siege:        { name: "Siege",          color: "#F97316", emoji: "🔩" },
  soloShowdown: { name: "Solo Showdown",  color: "#EC4899", emoji: "💀" },
  duoShowdown:  { name: "Duo Showdown",   color: "#EC4899", emoji: "🤝" },
  knockout:     { name: "Knockout",       color: "#EF4444", emoji: "🥊" },
  hotZone:      { name: "Hot Zone",       color: "#F97316", emoji: "🔥" },
  wipeout:      { name: "Wipeout",        color: "#EF4444", emoji: "💥" },
  duels:        { name: "Duels",          color: "#A855F7", emoji: "⚔️" },
  trioShowdown: { name: "Trio Showdown",  color: "#EC4899", emoji: "👥" },
  tagTeam:      { name: "Tag Team",       color: "#F59E0B", emoji: "🏷️" },
  airHockey:    { name: "Air Hockey",     color: "#06B6D4", emoji: "🏒" },
  brawlArena:   { name: "Brawl Arena",    color: "#8B5CF6", emoji: "🏟️" },
  brawlBall5V5: { name: "Brawl Ball 5v5", color: "#16A34A", emoji: "⚽" },
  deathmatch:   { name: "Deathmatch",     color: "#DC2626", emoji: "☠️" },
  knockout5V5:  { name: "Knockout 5v5",   color: "#B91C1C", emoji: "🥊" },
};
