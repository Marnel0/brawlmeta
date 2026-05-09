import { NextResponse } from "next/server";

export async function GET() {
  const ip = await fetch("https://api.ipify.org?format=json").then((r) => r.json());
  return NextResponse.json(ip);
}
