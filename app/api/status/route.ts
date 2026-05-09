import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

export async function GET() {
  const kvUrl   = process.env.KV_REST_API_URL;
  const kvToken = process.env.KV_REST_API_TOKEN;
  const apiKey  = process.env.BRAWL_STARS_API_KEY;

  let rawKv: unknown = null;
  let kvError: string | null = null;

  try {
    rawKv = await kv.get("brawl:stats");
  } catch (e) {
    kvError = (e as Error).message;
  }

  // Also try direct REST call to Upstash to bypass @vercel/kv serialization
  let directResult: unknown = null;
  if (kvUrl && kvToken) {
    try {
      const res = await fetch(`${kvUrl}/get/brawl:stats`, {
        headers: { Authorization: `Bearer ${kvToken}` },
      });
      directResult = await res.json();
    } catch { /* ignore */ }
  }

  return NextResponse.json({
    env: {
      KV_REST_API_URL:     kvUrl   ? "set" : "MISSING",
      KV_REST_API_TOKEN:   kvToken ? "set" : "MISSING",
      BRAWL_STARS_API_KEY: apiKey  ? "set" : "MISSING",
    },
    kv_via_vercel_pkg: rawKv ?? null,
    kv_error: kvError,
    kv_direct_rest: directResult,
  });
}
