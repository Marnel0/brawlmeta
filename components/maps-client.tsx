"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, TrendingUp } from "lucide-react";
import { MapCard } from "./map-card";
import { TierRow } from "./tier-row";
import { SkeletonTierRow } from "./skeleton-card";
import type { Brawler, BrawlEvent, TierLabel } from "@/lib/types";
import { winRateToTier } from "@/lib/utils";

const TIER_ORDER: TierLabel[] = ["S", "A", "B", "C", "D"];

interface MapsClientProps {
  initialEvents: BrawlEvent[];
}

export function MapsClient({ initialEvents }: MapsClientProps) {
  const [selectedEvent, setSelectedEvent] = useState<BrawlEvent | null>(null);
  const [mapBrawlers, setMapBrawlers] = useState<Brawler[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSelectMap = useCallback(async (event: BrawlEvent) => {
    if (selectedEvent?.id === event.id) {
      setSelectedEvent(null);
      setMapBrawlers([]);
      return;
    }

    setSelectedEvent(event);
    setLoading(true);

    try {
      const res = await fetch(`/api/brawlers?mode=${event.mode}`);
      const data: Brawler[] = await res.json();
      setMapBrawlers(data);
    } catch {
      setMapBrawlers([]);
    } finally {
      setLoading(false);
    }
  }, [selectedEvent]);

  const byTier = TIER_ORDER.reduce(
    (acc, tier) => {
      acc[tier] = mapBrawlers.filter(
        (b) => winRateToTier(b.winRate) === tier
      );
      return acc;
    },
    {} as Record<TierLabel, Brawler[]>
  );

  return (
    <div className="flex flex-col gap-10">
      {/* Map rotation grid */}
      <section>
        <div className="flex items-baseline gap-3 mb-6">
          <h2 className="font-display text-2xl text-brand-ink">
            Current rotation
          </h2>
          <span className="text-sm text-brand-ink/40 font-medium">
            {initialEvents.length} active events
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
          {initialEvents.map((event) => (
            <MapCard
              key={event.id}
              event={event}
              selected={selectedEvent?.id === event.id}
              onClick={() => handleSelectMap(event)}
            />
          ))}
        </div>
      </section>

      {/* Map drill-down tier list */}
      <AnimatePresence mode="wait">
        {selectedEvent && (
          <motion.section
            key={selectedEvent.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="border-2 border-brand-ink rounded-2xl bg-brand-paper shadow-cartoon overflow-hidden"
          >
            {/* Panel header */}
            <div
              className="flex items-center justify-between px-6 py-4 border-b-2 border-brand-ink"
              style={{ backgroundColor: selectedEvent.modeColor + "18" }}
            >
              <div className="flex items-center gap-3">
                <TrendingUp size={18} className="text-brand-ink/60" />
                <div>
                  <p className="font-display text-xl text-brand-ink leading-tight">
                    {selectedEvent.map}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span
                      className="inline-flex items-center px-2 py-0.5 rounded-full border border-brand-ink/30 text-[11px] font-bold text-white"
                      style={{ backgroundColor: selectedEvent.modeColor }}
                    >
                      {selectedEvent.modeName}
                    </span>
                    <span className="text-xs text-brand-ink/40">
                      Brawler meta for this map
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => { setSelectedEvent(null); setMapBrawlers([]); }}
                className="p-1.5 rounded-xl border-2 border-brand-ink bg-brand-paper hover:bg-brand-sand transition-colors shadow-cartoon-xs"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            {/* Tier list */}
            <div className="p-6 flex flex-col gap-8">
              {loading ? (
                TIER_ORDER.map((t) => <SkeletonTierRow key={t} />)
              ) : mapBrawlers.length === 0 ? (
                <div className="text-center py-16 text-brand-ink/40">
                  <p className="font-bold">No data available</p>
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {TIER_ORDER.map((tier) =>
                    byTier[tier].length > 0 ? (
                      <TierRow
                        key={tier}
                        tier={tier}
                        brawlers={byTier[tier]}
                      />
                    ) : null
                  )}
                </AnimatePresence>
              )}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* CTA when no map selected */}
      <AnimatePresence>
        {!selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-12 rounded-2xl border-2 border-dashed border-brand-ink/20"
          >
            <p className="text-4xl mb-2">👆</p>
            <p className="font-bold text-brand-ink/60">
              Click a map to see the brawler tier list for that mode
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
