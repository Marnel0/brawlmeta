import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.BRAWL_STARS_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "no API key" });

  const res = await fetch("https://api.brawlstars.com/v1/rankings/global/players?limit=3", {
    headers: { Authorization: `Bearer ${apiKey}` },
    cache: "no-store",
  });

  const text = await res.text();
  return NextResponse.json({ status: res.status, body: text.slice(0, 500) });
}
