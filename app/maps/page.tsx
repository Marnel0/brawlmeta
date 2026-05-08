import { Suspense } from "react";
import type { Metadata } from "next";
import { fetchEvents } from "@/lib/api";
import { MapsClient } from "@/components/maps-client";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Map rotation",
  description:
    "Current Brawl Stars map rotation with live timers. Click any map to see the best brawlers and meta picks for that mode.",
};

export const revalidate = 900; // ISR: refresh every 15 min

async function MapsData() {
  const events = await fetchEvents();
  return <MapsClient initialEvents={events} />;
}

export default function MapsPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Page header */}
      <div className="mb-10">
        <h1 className="font-display text-5xl md:text-6xl text-brand-ink mb-3 leading-none">
          Map rotation
        </h1>
        <p className="text-brand-ink/50 text-lg max-w-2xl">
          Every active event, with time remaining. Click any map to reveal the
          tier list for that mode — see exactly who to pick.
        </p>
        <div className="mt-3 flex items-center gap-2 text-xs text-brand-ink/30">
          <span className="w-2 h-2 rounded-full bg-brand-blue inline-block animate-pulse" />
          Rotation synced from official Brawl Stars API
        </div>
      </div>

      {/* Maps + drill-down (streamed) */}
      <Suspense
        fallback={
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[4/3] border-2 border-brand-ink/20 border-0" />
            ))}
          </div>
        }
      >
        <MapsData />
      </Suspense>
    </div>
  );
}
