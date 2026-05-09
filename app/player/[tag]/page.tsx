import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { fetchPlayerProfile } from "@/lib/player-api";
import { PlayerHero } from "@/components/player-hero";
import { BattleLog } from "@/components/battle-log";
import { BrawlerCollection } from "@/components/brawler-collection";
import { PlayerSearchBar } from "@/components/player-search-bar";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const { tag } = await params;
  const data = await fetchPlayerProfile(tag);
  if (!data) return { title: "Player not found" };
  return {
    title: `${data.player.name} — ${data.player.trophies.toLocaleString()} trophies`,
    description: `${data.player.name}'s Brawl Stars profile. Win rate, battle log, and ${data.player.brawlers.length} brawlers.`,
  };
}

export default async function PlayerProfilePage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  const data = await fetchPlayerProfile(tag);
  if (!data) notFound();
  const { player, battles } = data;

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Search bar at top for quick re-search */}
      <div className="max-w-md mb-8">
        <PlayerSearchBar size="sm" />
      </div>

      {/* Hero — avatar, name, trophies, win rate */}
      <PlayerHero player={player} battles={battles} cachedAt={data.cachedAt} />

      {/* Battle log */}
      <section className="mt-10">
        <h2 className="font-display text-3xl text-brand-ink mb-4">
          Battle log
          <span className="font-heading text-lg text-brand-ink/30 ml-3 font-normal">
            last {battles.length}
          </span>
        </h2>
        <BattleLog battles={battles} playerTag={player.tag} />
      </section>

      {/* Brawler collection */}
      <section className="mt-14">
        <h2 className="font-display text-3xl text-brand-ink mb-4">
          Brawlers
          <span className="font-heading text-lg text-brand-ink/30 ml-3 font-normal">
            {player.brawlers.length}
          </span>
        </h2>
        <BrawlerCollection brawlers={player.brawlers} />
      </section>
    </div>
  );
}
