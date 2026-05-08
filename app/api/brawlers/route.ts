import { NextRequest } from "next/server";
import { fetchBrawlers } from "@/lib/api";
import type { GameModeId } from "@/lib/types";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const mode = (searchParams.get("mode") ?? null) as Exclude<
    GameModeId,
    "all"
  > | null;

  const brawlers = await fetchBrawlers(mode);

  return Response.json(brawlers, {
    headers: {
      "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600",
    },
  });
}
