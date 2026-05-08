import Link from "next/link";
import { ArrowRight, TrendingUp, Map, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchBrawlers } from "@/lib/api";
import { TIER_COLOR, formatWinRate } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BrawlMeta — The beautiful Brawl Stars stats site",
};

export default async function HomePage() {
  // Fetch top 6 brawlers for the hero preview
  const brawlers = await fetchBrawlers(null);
  const top6 = brawlers
    .sort((a, b) => b.winRate - a.winRate)
    .slice(0, 6);

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="text-center mb-20">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border-2 border-brand-ink bg-brand-yellow shadow-cartoon-xs mb-8 text-xs font-bold uppercase tracking-wider">
          <Zap size={12} />
          Live meta data · updated hourly
        </div>

        <h1 className="font-display text-6xl md:text-7xl lg:text-8xl text-brand-ink leading-none mb-6">
          Know the meta.
          <br />
          <span className="text-brand-yellow [text-shadow:3px_3px_0_#0F0F14]">
            Win more.
          </span>
        </h1>

        <p className="text-brand-ink/60 text-xl max-w-xl mx-auto mb-10 font-medium leading-relaxed">
          The most beautiful Brawl Stars stats site. Tier lists, map rotation,
          and real win rates — all in one place.
        </p>

        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Button asChild size="lg">
            <Link href="/tier-list" className="flex items-center gap-2">
              <TrendingUp size={18} />
              Tier list
              <ArrowRight size={16} />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/maps" className="flex items-center gap-2">
              <Map size={18} />
              Map rotation
            </Link>
          </Button>
        </div>
      </section>

      {/* ── Top brawlers preview ─────────────────────────────── */}
      <section className="mb-20">
        <div className="flex items-baseline gap-3 mb-6">
          <h2 className="font-display text-2xl text-brand-ink">
            Top brawlers right now
          </h2>
          <span className="text-sm text-brand-ink/40">Global win rate</span>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {top6.map((brawler, i) => (
            <div
              key={brawler.id}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl border-2 border-brand-ink bg-brand-paper shadow-cartoon hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-cartoon-pressed transition-all duration-150"
            >
              {/* Rank */}
              <span className="text-xs font-bold text-brand-ink/30">#{i + 1}</span>
              {/* Portrait placeholder area */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={brawler.imageUrl}
                alt={brawler.name}
                className="w-16 h-16 object-contain"
              />
              <div className="text-center">
                <p className="font-heading font-bold text-sm leading-tight truncate max-w-full">
                  {brawler.name}
                </p>
                <p
                  className="text-sm font-bold tabular-nums"
                  style={{ color: TIER_COLOR[brawler.tier] }}
                >
                  {formatWinRate(brawler.winRate)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <Button asChild variant="outline" size="sm">
            <Link href="/tier-list">View full tier list →</Link>
          </Button>
        </div>
      </section>

      {/* ── Feature cards ─────────────────────────────────────── */}
      <section className="grid md:grid-cols-2 gap-6">
        <FeatureCard
          href="/tier-list"
          icon={<TrendingUp size={28} />}
          color="#FFCC00"
          title="Interactive tier list"
          description="Filter by game mode, rarity, or brawler name. Watch rankings update in real time as the meta shifts. Animated, always current."
          cta="Explore tier list"
        />
        <FeatureCard
          href="/maps"
          icon={<Map size={28} />}
          color="#2EB872"
          title="Map rotation + meta"
          description="See every active event with time remaining. Click any map to instantly see the best brawlers for that mode."
          cta="View map rotation"
        />
      </section>

      {/* ── Footer note ────────────────────────────────────────── */}
      <footer className="mt-24 pt-8 border-t-2 border-brand-ink/10 text-center">
        <p className="text-xs text-brand-ink/30">
          BrawlMeta is not affiliated with Supercell. Brawl Stars is a trademark of Supercell.
          Win/pick rates are community estimates — real data in V1.5.
        </p>
      </footer>
    </div>
  );
}

function FeatureCard({
  href,
  icon,
  color,
  title,
  description,
  cta,
}: {
  href: string;
  icon: React.ReactNode;
  color: string;
  title: string;
  description: string;
  cta: string;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col gap-4 p-8 rounded-2xl border-2 border-brand-ink bg-brand-paper shadow-cartoon hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-cartoon-pressed transition-all duration-150"
    >
      <div
        className="w-14 h-14 rounded-2xl border-2 border-brand-ink flex items-center justify-center shadow-cartoon-xs"
        style={{ backgroundColor: color }}
      >
        {icon}
      </div>
      <div>
        <h3 className="font-display text-xl text-brand-ink mb-2">{title}</h3>
        <p className="text-brand-ink/60 text-sm leading-relaxed">{description}</p>
      </div>
      <div className="mt-auto flex items-center gap-2 text-sm font-bold text-brand-ink group-hover:gap-3 transition-all duration-150">
        {cta} <ArrowRight size={16} />
      </div>
    </Link>
  );
}
