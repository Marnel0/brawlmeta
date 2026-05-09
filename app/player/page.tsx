import type { Metadata } from "next";
import { PlayerSearchBar } from "@/components/player-search-bar";

export const metadata: Metadata = {
  title: "Player search",
  description: "Search any Brawl Stars player by tag. See their stats, battle history, and brawler collection.",
};

export default function PlayerSearchPage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 py-20">
      <div className="w-full max-w-xl text-center">
        <div className="text-7xl mb-6">🔍</div>
        <h1 className="font-display text-5xl md:text-6xl text-brand-ink mb-3 leading-none">
          Find a player
        </h1>
        <p className="text-brand-ink/50 text-lg mb-10 max-w-md mx-auto">
          Enter a Brawl Stars player tag to see their stats, battle history, and full brawler collection.
        </p>
        <PlayerSearchBar />
        <p className="mt-5 text-brand-ink/30 text-sm">
          Example: <span className="font-mono bg-brand-paper border border-brand-ink/20 px-2 py-0.5 rounded-lg">#2PP00</span>
          <span className="mx-2">·</span>
          Tags are case-insensitive
        </p>
      </div>
    </div>
  );
}
