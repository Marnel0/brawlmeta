import { Suspense } from "react";
import type { Metadata } from "next";
import { fetchBrawlers } from "@/lib/api";
import { TierListClient } from "@/components/tier-list-client";
import { SkeletonTierRow } from "@/components/skeleton-card";

export const metadata: Metadata = {
  title: "Tier list",
  description:
    "Ranked Brawl Stars tier list by win rate and pick rate. Filter by game mode and rarity. Always updated.",
};

export const revalidate = 1800; // ISR: refresh every 30 min

async function TierListData() {
  const brawlers = await fetchBrawlers(null);
  return <TierListClient initialBrawlers={brawlers} />;
}

export default function TierListPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Page header */}
      <div className="mb-10">
        <h1 className="font-display text-5xl md:text-6xl text-brand-ink mb-3 leading-none">
          Tier list
        </h1>
        <p className="text-brand-ink/50 text-lg max-w-2xl">
          Best brawlers ranked by win rate and pick rate. Filter by game mode
          to see the meta shift for each map type.
        </p>
        <div className="mt-3 flex items-center gap-2 text-xs text-brand-ink/30">
          <span className="w-2 h-2 rounded-full bg-brand-green inline-block animate-pulse" />
          Win/pick rates computed from real battle logs · top players · refreshed hourly
        </div>
      </div>

      {/* Tier list (streamed) */}
      <Suspense
        fallback={
          <div className="flex flex-col gap-10">
            <div className="bg-brand-paper border-2 border-brand-ink rounded-2xl shadow-cartoon p-6 h-40 animate-pulse" />
            {["S", "A", "B", "C", "D"].map((t) => (
              <SkeletonTierRow key={t} />
            ))}
          </div>
        }
      >
        <TierListData />
      </Suspense>
    </div>
  );
}
