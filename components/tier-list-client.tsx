"use client";

import { useState, useMemo, useCallback, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FilterBar } from "./filter-bar";
import { TierRow } from "./tier-row";
import { SkeletonTierRow } from "./skeleton-card";
import type { Brawler, GameModeId, Rarity, TierLabel } from "@/lib/types";
import { winRateToTier } from "@/lib/utils";

const TIER_ORDER: TierLabel[] = ["S", "A", "B", "C", "D"];

interface TierListClientProps {
  initialBrawlers: Brawler[];
}

export function TierListClient({ initialBrawlers }: TierListClientProps) {
  const [brawlers, setBrawlers] = useState<Brawler[]>(initialBrawlers);
  const [mode, setMode] = useState<GameModeId>("all");
  const [rarity, setRarity] = useState<Rarity | null>(null);
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleModeChange = useCallback(
    async (newMode: GameModeId) => {
      setMode(newMode);
      if (newMode === "all") {
        startTransition(() => setBrawlers(initialBrawlers));
        return;
      }
      try {
        const res = await fetch(`/api/brawlers?mode=${newMode}`);
        const data: Brawler[] = await res.json();
        startTransition(() => setBrawlers(data));
      } catch {
        startTransition(() => setBrawlers(initialBrawlers));
      }
    },
    [initialBrawlers]
  );

  const filtered = useMemo(() => {
    let list = brawlers;
    if (rarity) list = list.filter((b) => b.rarity === rarity);
    if (search)
      list = list.filter((b) =>
        b.name.toLowerCase().includes(search.toLowerCase())
      );
    return list;
  }, [brawlers, rarity, search]);

  const byTier = useMemo(() => {
    const groups: Record<TierLabel, Brawler[]> = {
      S: [],
      A: [],
      B: [],
      C: [],
      D: [],
    };
    filtered.forEach((b) => {
      const tier = winRateToTier(b.winRate);
      groups[tier].push(b);
    });
    return groups;
  }, [filtered]);

  const totalVisible = filtered.length;

  return (
    <div className="flex flex-col gap-8">
      {/* Filter bar */}
      <div className="bg-brand-paper border-2 border-brand-ink rounded-2xl shadow-cartoon p-6">
        <FilterBar
          mode={mode}
          rarity={rarity}
          search={search}
          onModeChange={handleModeChange}
          onRarityChange={setRarity}
          onSearchChange={setSearch}
        />
      </div>

      {/* Results meta */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-brand-ink/50 font-medium">
          {totalVisible} brawler{totalVisible !== 1 ? "s" : ""} shown
          {mode !== "all" && (
            <span className="text-brand-ink font-bold ml-1">
              · {mode} meta
            </span>
          )}
        </p>
        <div className="flex items-center gap-2 text-xs text-brand-ink/40">
          <span className="w-2 h-2 rounded-full bg-brand-green inline-block" />
          Win rate · Pick rate
        </div>
      </div>

      {/* Tier rows */}
      {isPending ? (
        <div className="flex flex-col gap-10">
          {TIER_ORDER.map((t) => (
            <SkeletonTierRow key={t} />
          ))}
        </div>
      ) : totalVisible === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-24 text-brand-ink/40"
        >
          <p className="font-display text-4xl mb-2">🔍</p>
          <p className="font-bold text-lg">No brawlers found</p>
          <p className="text-sm mt-1">Try a different search or filter</p>
        </motion.div>
      ) : (
        <motion.div layout className="flex flex-col gap-10">
          <AnimatePresence mode="popLayout">
            {TIER_ORDER.map((tier) =>
              byTier[tier].length > 0 ? (
                <TierRow
                  key={`${tier}-${mode}`}
                  tier={tier}
                  brawlers={byTier[tier]}
                />
              ) : null
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
