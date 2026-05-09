"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import type { BattleLogEntry } from "@/lib/types";
import { MODE_META, cn } from "@/lib/utils";

function parseBS(raw: string): Date {
  const m = raw.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})/);
  if (!m) return new Date();
  return new Date(`${m[1]}-${m[2]}-${m[3]}T${m[4]}:${m[5]}:${m[6]}Z`);
}

function timeAgo(date: Date): string {
  const diff = Date.now() - date.getTime();
  const m = Math.floor(diff / 60_000);
  const h = Math.floor(m / 60);
  const d = Math.floor(h / 24);
  if (d > 0) return `${d}d ago`;
  if (h > 0) return `${h}h ago`;
  if (m > 0) return `${m}m ago`;
  return "just now";
}

function getPlayerBrawler(battle: BattleLogEntry["battle"], playerTag: string) {
  const tag = playerTag.replace("#", "");
  if (battle.teams) {
    for (const team of battle.teams)
      for (const p of team)
        if (p.tag.replace("#", "") === tag) return p.brawler;
  }
  if (battle.players) {
    const found = battle.players.find((p) => p.tag.replace("#", "") === tag);
    if (found) return found.brawler;
  }
  return null;
}

const SHOWDOWN_MODES = new Set([
  "soloShowdown", "duoShowdown", "trioShowdown",
]);

type Filter = "all" | "3v3" | "showdown";

export function BattleLog({
  battles,
  playerTag,
}: {
  battles: BattleLogEntry[];
  playerTag: string;
}) {
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = battles.filter((b) => {
    const mode = b.battle.mode ?? b.event.mode;
    if (filter === "3v3") return !SHOWDOWN_MODES.has(mode);
    if (filter === "showdown") return SHOWDOWN_MODES.has(mode);
    return true;
  });

  const tabs: { id: Filter; label: string }[] = [
    { id: "all", label: `All (${battles.length})` },
    { id: "3v3", label: "3v3" },
    { id: "showdown", label: "Showdown" },
  ];

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={cn(
              "px-4 py-2 rounded-xl border-2 font-heading font-semibold text-sm transition-all",
              filter === tab.id
                ? "bg-brand-ink text-brand-cream border-brand-ink shadow-cartoon"
                : "bg-brand-paper text-brand-ink/60 border-brand-ink/20 hover:border-brand-ink/50"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="flex flex-col gap-2">
        <AnimatePresence mode="popLayout">
          {filtered.map((entry, i) => {
            const mode = entry.event.mode ?? entry.battle.mode;
            const meta = MODE_META[mode as keyof typeof MODE_META];
            const brawler = getPlayerBrawler(entry.battle, playerTag);
            const result = entry.battle.result;
            const tc = entry.battle.trophyChange;
            const isStarPlayer = entry.battle.starPlayer?.tag === playerTag;
            const date = parseBS(entry.battleTime);

            const borderColor =
              result === "victory" ? "#2EB872"
              : result === "defeat" ? "#E63946"
              : "transparent";

            return (
              <motion.div
                key={`${entry.battleTime}-${i}`}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ delay: Math.min(i * 0.025, 0.4) }}
                className="bg-brand-paper border-2 border-brand-ink rounded-2xl shadow-cartoon p-4 flex items-center gap-4"
                style={{ borderLeftWidth: result ? 4 : 2, borderLeftColor: borderColor }}
              >
                {/* Mode emoji */}
                <div className="text-2xl w-8 text-center flex-shrink-0">
                  {meta?.emoji ?? "🎮"}
                </div>

                {/* Map + mode */}
                <div className="flex-1 min-w-0">
                  <div className="font-heading font-semibold text-sm text-brand-ink truncate">
                    {entry.event.map || meta?.name || mode}
                  </div>
                  <div className="text-xs text-brand-ink/40 mt-0.5 flex items-center gap-1">
                    {meta?.name ?? mode}
                    <span>·</span>
                    {timeAgo(date)}
                  </div>
                </div>

                {/* Brawler portrait */}
                {brawler && (
                  <div className="relative flex-shrink-0">
                    <div className="w-10 h-10 rounded-xl border-2 border-brand-ink overflow-hidden bg-brand-cream shadow-cartoon-sm">
                      <Image
                        src={`https://cdn.brawlify.com/brawlers/borderless/${brawler.id}.png`}
                        alt={brawler.name}
                        width={40}
                        height={40}
                        className="object-contain object-bottom w-full h-full"
                      />
                    </div>
                    {isStarPlayer && (
                      <span className="absolute -top-2 -right-2 text-sm leading-none">⭐</span>
                    )}
                  </div>
                )}

                {/* Result badge */}
                <div className={cn(
                  "flex-shrink-0 px-2.5 py-1 rounded-xl border-2 text-xs font-heading font-bold uppercase",
                  result === "victory" ? "bg-green-50 text-green-700 border-green-300"
                  : result === "defeat" ? "bg-red-50 text-red-600 border-red-300"
                  : "bg-gray-100 text-gray-500 border-gray-300"
                )}>
                  {result === "victory" ? "WIN"
                    : result === "defeat" ? "LOSE"
                    : result === "draw" ? "DRAW"
                    : "—"}
                </div>

                {/* Trophy change */}
                {tc !== undefined && (
                  <div className={cn(
                    "flex-shrink-0 font-heading font-bold text-sm w-10 text-right tabular-nums",
                    tc > 0 ? "text-green-600" : tc < 0 ? "text-red-500" : "text-gray-400"
                  )}>
                    {tc > 0 ? "+" : ""}{tc}
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="text-center text-brand-ink/30 py-16 font-heading text-lg">
            No battles found
          </div>
        )}
      </div>
    </div>
  );
}
