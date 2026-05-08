import { cn } from "@/lib/utils";
import { TIER_COLOR } from "@/lib/utils";
import type { TierLabel } from "@/lib/types";

const TIER_BG: Record<TierLabel, string> = {
  S: "#FEE2E2",
  A: "#FFEDD5",
  B: "#FEF9C3",
  C: "#DBEAFE",
  D: "#F1F5F9",
};

interface TierBadgeProps {
  tier: TierLabel;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: "w-7 h-7 text-sm",
  md: "w-10 h-10 text-xl",
  lg: "w-14 h-14 text-3xl",
};

export function TierBadge({ tier, size = "md", className }: TierBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full border-2 border-brand-ink font-display font-bold leading-none",
        sizes[size],
        className
      )}
      style={{
        backgroundColor: TIER_BG[tier],
        color: TIER_COLOR[tier],
        boxShadow: "2px 2px 0 0 #0F0F14",
      }}
    >
      {tier}
    </span>
  );
}
