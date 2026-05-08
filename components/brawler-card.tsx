"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { RARITY_COLOR, RARITY_LABEL_COLOR, formatWinRate, formatPickRate } from "@/lib/utils";
import type { Brawler } from "@/lib/types";

interface BrawlerCardProps {
  brawler: Brawler;
  className?: string;
}

export function BrawlerCard({ brawler, className }: BrawlerCardProps) {
  const rarityBg = RARITY_COLOR[brawler.rarity] ?? "#e2e8f0";
  const rarityText = RARITY_LABEL_COLOR[brawler.rarity] ?? "#0F0F14";

  return (
    <motion.div
      layout
      layoutId={`brawler-${brawler.id}`}
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.88 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3, transition: { duration: 0.15 } }}
      className={cn(
        "group relative flex flex-col rounded-2xl border-2 border-brand-ink bg-brand-paper overflow-hidden cursor-default",
        "shadow-cartoon hover:shadow-[6px_6px_0_0_#0F0F14] transition-shadow duration-150",
        className
      )}
    >
      {/* Rarity accent bar */}
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{ backgroundColor: rarityBg }}
      />

      {/* Portrait */}
      <div className="relative w-full aspect-square bg-brand-sand overflow-hidden">
        <Image
          src={brawler.imageUrl}
          alt={brawler.name}
          fill
          sizes="(max-width: 768px) 140px, 160px"
          className="object-contain object-bottom transition-transform duration-200 group-hover:scale-105"
          unoptimized
        />
      </div>

      {/* Info */}
      <div className="px-2 py-2 flex flex-col gap-0.5">
        <p className="font-heading font-bold text-sm text-brand-ink truncate leading-tight">
          {brawler.name}
        </p>
        <div className="flex items-center justify-between gap-1">
          <span
            className="stat text-xs font-bold tabular-nums"
            style={{ color: winRateColor(brawler.winRate) }}
          >
            {formatWinRate(brawler.winRate)}
          </span>
          <span className="stat text-xs text-brand-ink/50 tabular-nums">
            {formatPickRate(brawler.pickRate)}
          </span>
        </div>
      </div>

      {/* Rarity tooltip on hover */}
      <div
        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-0.5 rounded-full border border-brand-ink text-[10px] font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none z-10"
        style={{ backgroundColor: rarityBg, color: rarityText }}
      >
        {brawler.rarity}
      </div>
    </motion.div>
  );
}

function winRateColor(rate: number): string {
  if (rate >= 0.57) return "#E63946";
  if (rate >= 0.535) return "#F97316";
  if (rate >= 0.505) return "#2EB872";
  if (rate >= 0.475) return "#1D7FBC";
  return "#94A3B8";
}
