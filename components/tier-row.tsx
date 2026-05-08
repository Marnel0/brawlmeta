"use client";

import { AnimatePresence, motion } from "framer-motion";
import { TIER_COLOR } from "@/lib/utils";
import { TierBadge } from "./tier-badge";
import { BrawlerCard } from "./brawler-card";
import type { Brawler, TierLabel } from "@/lib/types";

interface TierRowProps {
  tier: TierLabel;
  brawlers: Brawler[];
}

const TIER_DESCRIPTIONS: Record<TierLabel, string> = {
  S: "Dominant — pick or ban",
  A: "Strong — consistently impactful",
  B: "Solid — good in the right hands",
  C: "Situational — map dependent",
  D: "Struggling — needs buffs",
};

export function TierRow({ tier, brawlers }: TierRowProps) {
  if (brawlers.length === 0) return null;

  return (
    <motion.section
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="flex gap-4 items-start"
    >
      {/* Tier label column */}
      <div className="flex-shrink-0 flex flex-col items-center gap-1 pt-1">
        <TierBadge tier={tier} size="lg" />
        <span
          className="text-[10px] font-bold uppercase tracking-wider text-center leading-tight max-w-[56px]"
          style={{ color: TIER_COLOR[tier] }}
        >
          {tier === "S" ? "OP" : tier === "A" ? "Strong" : tier === "B" ? "Good" : tier === "C" ? "OK" : "Weak"}
        </span>
      </div>

      {/* Divider */}
      <div
        className="w-1 self-stretch rounded-full flex-shrink-0"
        style={{ backgroundColor: TIER_COLOR[tier], opacity: 0.3 }}
      />

      {/* Cards grid */}
      <div className="flex-1">
        <p className="text-xs text-brand-ink/40 mb-2 font-medium">
          {TIER_DESCRIPTIONS[tier]} · {brawlers.length} brawler{brawlers.length !== 1 ? "s" : ""}
        </p>
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3">
          <AnimatePresence mode="popLayout">
            {brawlers
              .sort((a, b) => b.winRate - a.winRate)
              .map((brawler) => (
                <BrawlerCard key={brawler.id} brawler={brawler} />
              ))}
          </AnimatePresence>
        </div>
      </div>
    </motion.section>
  );
}
