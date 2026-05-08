import { fetchEvents } from "@/lib/api";

export async function GET() {
  const events = await fetchEvents();

  return Response.json(events, {
    headers: {
      "Cache-Control": "public, s-maxage=900, stale-while-revalidate=1800",
    },
  });
}
