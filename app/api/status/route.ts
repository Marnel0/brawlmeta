import { NextResponse } from "next/server";
import { readStore } from "@/lib/stats-store";

export async function GET() {
  const kvUrl   = process.env.KV_REST_API_URL;
  const kvToken = process.env.KV_REST_API_TOKEN;
  const apiKey  = process.env.BRAWL_STARS_API_KEY;

  const store = await readStore().catch(() => null);

  return NextResponse.json({
    env: {
      KV_REST_API_URL:   kvUrl   ? "✅ set" : "❌ missing",
      KV_REST_API_TOKEN: kvToken ? "✅ set" : "❌ missing",
      BRAWL_STARS_API_KEY: apiKey ? "✅ set" : "❌ missing",
    },
    kv: store
      ? {
          status:       "✅ connected + data found",
          totalBattles: store.totalBattles,
          totalPlayers: store.totalPlayers,
          lastUpdated:  store.lastUpdated,
          brawlersInGlobal: Object.keys(store.modes.global ?? {}).length,
          modesTracked: Object.keys(store.modes).length,
        }
      : { status: "❌ no data yet (KV empty or not connected)" },
  });
}
