"use client";

import { Search, X } from "lucide-react";
import { motion } from "framer-motion";
import { cn, MODE_META, RARITY_COLOR } from "@/lib/utils";
import { Input } from "./ui/input";
import type { GameModeId, Rarity } from "@/lib/types";

const RARITIES: Rarity[] = [
  "Starting Brawler",
  "Rare",
  "Super Rare",
  "Epic",
  "Mythic",
  "Legendary",
  "Ultra Legendary",
];

const RARITY_SHORT: Record<Rarity, string> = {
  "Starting Brawler": "Starter",
  Rare: "Rare",
  "Super Rare": "S.Rare",
  Epic: "Epic",
  Mythic: "Mythic",
  Legendary: "Leg.",
  "Ultra Legendary": "Ultra",
};

interface FilterBarProps {
  mode: GameModeId;
  rarity: Rarity | null;
  search: string;
  onModeChange: (mode: GameModeId) => void;
  onRarityChange: (rarity: Rarity | null) => void;
  onSearchChange: (search: string) => void;
}

export function FilterBar({
  mode,
  rarity,
  search,
  onModeChange,
  onRarityChange,
  onSearchChange,
}: FilterBarProps) {
  const modeEntries = Object.entries(MODE_META) as [
    Exclude<GameModeId, "all">,
    (typeof MODE_META)[Exclude<GameModeId, "all">]
  ][];

  return (
    <div className="flex flex-col gap-4">
      {/* Search */}
      <div className="relative max-w-xs">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-ink/40 pointer-events-none"
        />
        <Input
          placeholder="Search brawler…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 pr-9"
        />
        {search && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-ink/40 hover:text-brand-ink transition-colors"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Mode filter */}
      <div className="flex flex-wrap gap-2">
        <ModeChip
          label="All modes"
          emoji="🎮"
          color="#FFCC00"
          active={mode === "all"}
          onClick={() => onModeChange("all")}
        />
        {modeEntries.map(([id, meta]) => (
          <ModeChip
            key={id}
            label={meta.name}
            emoji={meta.emoji}
            color={meta.color}
            active={mode === id}
            onClick={() => onModeChange(id)}
          />
        ))}
      </div>

      {/* Rarity filter */}
      <div className="flex flex-wrap gap-2">
        <RarityChip
          label="All rarities"
          color="#F5EFE0"
          active={rarity === null}
          onClick={() => onRarityChange(null)}
        />
        {RARITIES.map((r) => (
          <RarityChip
            key={r}
            label={RARITY_SHORT[r]}
            color={RARITY_COLOR[r]}
            active={rarity === r}
            onClick={() => onRarityChange(rarity === r ? null : r)}
          />
        ))}
      </div>
    </div>
  );
}

function ModeChip({
  label,
  emoji,
  color,
  active,
  onClick,
}: {
  label: string;
  emoji: string;
  color: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 border-brand-ink text-xs font-bold transition-all duration-150",
        active
          ? "translate-x-[2px] translate-y-[2px] shadow-cartoon-pressed"
          : "shadow-cartoon-xs hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-cartoon-pressed"
      )}
      style={{ backgroundColor: active ? color : "#FFFFFF" }}
    >
      <span>{emoji}</span>
      <span>{label}</span>
    </motion.button>
  );
}

function RarityChip({
  label,
  color,
  active,
  onClick,
}: {
  label: string;
  color: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "px-3 py-1 rounded-full border-2 border-brand-ink text-xs font-bold text-brand-ink transition-all duration-150",
        active
          ? "translate-x-[2px] translate-y-[2px] shadow-cartoon-pressed"
          : "shadow-cartoon-xs hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-cartoon-pressed"
      )}
      style={{ backgroundColor: active ? color : "#FFFFFF" }}
    >
      {label}
    </motion.button>
  );
}
