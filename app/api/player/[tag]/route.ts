import { NextRequest, NextResponse } from "next/server";
import { fetchPlayerProfile } from "@/lib/player-api";

export const runtime = "nodejs";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ tag: string }> }
) {
  const { tag } = await params;
  const data = await fetchPlayerProfile(tag);
  if (!data) return NextResponse.json({ error: "Player not found" }, { status: 404 });
  return NextResponse.json(data);
}
