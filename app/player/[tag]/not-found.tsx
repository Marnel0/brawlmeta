import Link from "next/link";
import { PlayerSearchBar } from "@/components/player-search-bar";

export default function PlayerNotFound() {
  return (
    <div className="max-w-xl mx-auto px-6 py-24 text-center">
      <div className="text-6xl mb-6">😵</div>
      <h1 className="font-display text-4xl text-brand-ink mb-3">Player not found</h1>
      <p className="text-brand-ink/50 mb-8">
        This tag doesn&apos;t exist, or the Brawl Stars API is temporarily unavailable.
        Double-check the tag and try again.
      </p>
      <PlayerSearchBar />
      <Link href="/player" className="block mt-4 text-sm text-brand-ink/40 hover:text-brand-ink transition-colors">
        ← Back to search
      </Link>
    </div>
  );
}
