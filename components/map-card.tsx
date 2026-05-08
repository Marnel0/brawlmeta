"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Clock, ChevronRight } from "lucide-react";
import { cn, formatTimeRemaining } from "@/lib/utils";
import type { BrawlEvent } from "@/lib/types";

interface MapCardProps {
  event: BrawlEvent;
  selected?: boolean;
  onClick: () => void;
}

export function MapCard({ event, selected = false, onClick }: MapCardProps) {
  return (
    <motion.button
      onClick={onClick}
      layout
      whileHover={{ y: -4, transition: { duration: 0.15 } }}
      whileTap={{ scale: 0.97 }}
      className={cn(
        "group w-full text-left rounded-2xl border-2 border-brand-ink overflow-hidden transition-all duration-200",
        selected
          ? "shadow-[6px_6px_0_0_#FFCC00] translate-x-[2px] translate-y-[2px]"
          : "shadow-cartoon hover:shadow-[6px_6px_0_0_#0F0F14]"
      )}
    >
      {/* Map thumbnail */}
      <div className="relative w-full aspect-[4/3] bg-brand-sand overflow-hidden">
        {event.mapImageUrl ? (
          <Image
            src={event.mapImageUrl}
            alt={event.map}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            unoptimized
            onError={(e) => {
              // Fallback to a colored placeholder on image load error
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : null}
        {/* Mode badge overlay */}
        <div className="absolute top-2 left-2">
          <span
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border-2 border-brand-ink text-[10px] font-bold text-white"
            style={{ backgroundColor: event.modeColor }}
          >
            {event.modeName}
          </span>
        </div>
        {/* Selected indicator */}
        {selected && (
          <div className="absolute inset-0 bg-brand-yellow/20 flex items-center justify-center">
            <div className="bg-brand-yellow border-2 border-brand-ink rounded-full px-3 py-1 text-xs font-bold">
              Viewing
            </div>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3 bg-brand-paper flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-heading font-bold text-sm text-brand-ink truncate leading-snug">
            {event.map}
          </p>
          <div className="flex items-center gap-1 mt-0.5 text-brand-ink/50">
            <Clock size={11} />
            <span className="text-[11px] tabular-nums">
              {formatTimeRemaining(event.endTime)}
            </span>
          </div>
        </div>
        <ChevronRight
          size={16}
          className={cn(
            "flex-shrink-0 mt-0.5 transition-transform duration-150",
            selected ? "rotate-90 text-brand-yellow" : "text-brand-ink/30 group-hover:text-brand-ink"
          )}
        />
      </div>
    </motion.button>
  );
}
