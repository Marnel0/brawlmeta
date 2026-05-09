"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import type { PlayerBrawler } from "@/lib/types";
import { cn } from "@/lib/utils";

type SortKey = "trophies" | "power" | "rank" | "name";

function powerColor(p: number): { bg: string; text: string } {
  if (p === 11) return { bg: "#FFCC00", text: "#0F0F14" };
  if (p >= 9)   return { bg: "#7E5BEF", text: "#fff" };
  if (p >= 6)   return { bg: "#1D7FBC", text: "#fff" };
  return           { bg: "#94A3B8", text: "#fff" };
}

function rankColor(r: number): string {
  if (r >= 30) return "#FFCC00";
  if (r >= 25) return "#E63946";
  if (r >= 20) return "#F97316";
  if (r >= 15) return "#7E5BEF";
  if (r >= 10) return "#1D7FBC";
  if (r >= 5)  return "#2EB872";
  return "#94A3B8";
}

export function BrawlerCollection({ brawlers }: { brawlers: PlayerBrawler[] }) {
  const [sort, setSort] = useState<SortKey>("trophies");

  const sorted = [...brawlers].sort((a, b) => {
    if (sort === "trophies") return b.trophies - a.trophies;
    if (sort === "power")    return b.power - a.power;
    if (sort === "rank")     return b.rank - a.rank;
    return a.name.localeCompare(b.name);
  });

  const maxTrophies = sorted[0]?.trophies ?? 1;

  const sortOptions: { key: SortKey; label: string }[] = [
    { key: "trophies", label: "🏆 Trophies" },
    { key: "power",    label: "⚡ Power" },
    { key: "rank",     label: "📊 Rank" },
    { key: "name",     label: "🔤 Name" },
  ];

  return (
    <div>
      {/* Sort bar */}
      <div className="flex gap-2 mb-5 flex-wrap items-center">
        <span className="text-brand-ink/40 text-sm font-heading">Sort:</span>
        {sortOptions.map((opt) => (
          <button
            key={opt.key}
            onClick={() => setSort(opt.key)}
            className={cn(
              "px-3 py-1.5 rounded-xl border-2 font-heading font-semibold text-sm transition-all",
              sort === opt.key
                ? "bg-brand-ink text-brand-cream border-brand-ink shadow-cartoon"
                : "bg-brand-paper text-brand-ink/60 border-brand-ink/20 hover:border-brand-ink/50"
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-9 gap-3">
        {sorted.map((brawler, i) => {
          const pc = powerColor(brawler.power);
          const isMaxPower = brawler.power === 11;
          return (
            <motion.div
              key={brawler.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: Math.min(i * 0.015, 0.5) }}
              className={cn(
                "group bg-brand-paper border-2 border-brand-ink rounded-2xl shadow-cartoon overflow-hidden",
                "hover:-translate-y-1 hover:shadow-[4px_6px_0_0_#0F0F14] transition-all cursor-default",
                isMaxPower && "ring-2 ring-brand-yellow ring-offset-1"
              )}
            >
              {/* Portrait */}
              <div className="relative bg-brand-cream h-[72px] overflow-hidden">
                <Image
                  src={`https://cdn.brawlify.com/brawlers/borderless/${brawler.id}.png`}
                  alt={brawler.name}
                  width={80}
                  height={72}
                  className="object-contain object-bottom w-full h-full group-hover:scale-110 transition-transform duration-200"
                />
                {/* Power level badge */}
                <div
                  className="absolute top-1 right-1 w-5 h-5 rounded-md border border-brand-ink/50 flex items-center justify-center text-[10px] font-bold font-heading shadow-sm"
                  style={{ backgroundColor: pc.bg, color: pc.text }}
                >
                  {brawler.power}
                </div>
              </div>

              {/* Info */}
              <div className="px-2 pt-1.5 pb-2">
                <div className="font-heading text-[9px] font-semibold text-brand-ink/60 truncate leading-none mb-1">
                  {brawler.name}
                </div>
                <div className="flex items-center justify-between gap-1">
                  <span className="font-display text-sm text-brand-ink leading-none">
                    {brawler.trophies >= 1000
                      ? (brawler.trophies / 1000).toFixed(1) + "k"
                      : brawler.trophies}
                  </span>
                  <span
                    className="text-[9px] font-bold font-heading leading-none"
                    style={{ color: rankColor(brawler.rank) }}
                  >
                    R{brawler.rank}
                  </span>
                </div>
                {/* Trophy bar */}
                <div className="mt-1.5 h-1 bg-brand-ink/10 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-brand-yellow"
                    style={{ width: `${(brawler.trophies / maxTrophies) * 100}%` }}
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
