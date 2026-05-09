import Image from "next/image";
import type { PlayerProfile, BattleLogEntry } from "@/lib/types";

function nameColorToCss(raw: string): string {
  const cleaned = raw?.replace(/^0x[fF][fF]/i, "") ?? "";
  return cleaned ? `#${cleaned}` : "#0F0F14";
}

function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-brand-cream border-2 border-brand-ink rounded-xl px-3 py-2 text-center shadow-cartoon-sm">
      <div className="font-display text-2xl text-brand-ink leading-none">{value}</div>
      <div className="text-brand-ink/50 text-xs font-heading mt-0.5">{label}</div>
    </div>
  );
}

export function PlayerHero({
  player,
  battles,
  cachedAt,
}: {
  player: PlayerProfile;
  battles: BattleLogEntry[];
  cachedAt?: string;
}) {
  const nameColor = nameColorToCss(player.nameColor);
  const iconUrl = `https://cdn.brawlify.com/profile-icons/regular/${player.icon.id}.png`;

  const teamBattles = battles.filter(
    (b) => b.battle.result && b.battle.result !== "draw"
  );
  const wins = teamBattles.filter((b) => b.battle.result === "victory").length;
  const winRate =
    teamBattles.length > 0
      ? ((wins / teamBattles.length) * 100).toFixed(1) + "%"
      : null;
  const starCount = battles.filter(
    (b) => b.battle.starPlayer?.tag === player.tag
  ).length;

  return (
    <div className="bg-brand-paper border-2 border-brand-ink rounded-3xl shadow-cartoon overflow-hidden">
      {/* Top bar with nameColor accent */}
      <div className="h-2" style={{ backgroundColor: nameColor }} />

      <div className="p-6 md:p-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-24 h-24 rounded-2xl border-2 border-brand-ink shadow-cartoon overflow-hidden bg-brand-cream flex items-center justify-center">
              <Image
                src={iconUrl}
                alt={player.name}
                width={96}
                height={96}
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-2.5 -right-2.5 bg-brand-yellow border-2 border-brand-ink rounded-xl px-2 py-0.5 text-xs font-bold font-heading text-brand-ink shadow-cartoon-sm whitespace-nowrap">
              Lv {player.expLevel}
            </div>
          </div>

          {/* Name + meta */}
          <div className="flex-1 text-center sm:text-left">
            <h1
              className="font-display text-4xl md:text-5xl leading-none mb-1"
              style={{ color: nameColor }}
            >
              {player.name}
            </h1>
            <p className="text-brand-ink/40 font-mono text-sm mb-3">{player.tag}</p>
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
              {cachedAt && (
              <span className="bg-brand-cream border-2 border-brand-ink/20 rounded-xl px-3 py-1 text-xs font-heading text-brand-ink/40 shadow-cartoon-sm">
                🕐 Updated {new Date(cachedAt).toLocaleDateString()}
              </span>
            )}
            {player.club?.name && (
                <span className="bg-brand-cream border-2 border-brand-ink rounded-xl px-3 py-1 text-sm font-heading font-semibold text-brand-ink/70 shadow-cartoon-sm">
                  🏰 {player.club.name}
                </span>
              )}
              <span className="bg-brand-cream border-2 border-brand-ink rounded-xl px-3 py-1 text-sm font-heading font-semibold text-brand-ink/70 shadow-cartoon-sm">
                {player.brawlers.length} brawlers
              </span>
            </div>
          </div>

          {/* Trophy display */}
          <div className="text-center flex-shrink-0">
            <div className="font-display text-5xl text-brand-ink leading-none">
              🏆 {player.trophies.toLocaleString()}
            </div>
            <div className="text-brand-ink/40 text-sm mt-1 font-heading">
              Best: {player.highestTrophies.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatPill label="3v3 wins" value={player["3vs3Victories"].toLocaleString()} />
          <StatPill
            label="Showdown wins"
            value={(player.soloVictories + player.duoVictories).toLocaleString()}
          />
          {winRate && (
            <StatPill label={`Win rate (${teamBattles.length} games)`} value={winRate} />
          )}
          {starCount > 0 && (
            <StatPill label="⭐ Star player" value={String(starCount)} />
          )}
        </div>
      </div>
    </div>
  );
}
