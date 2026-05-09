/**
 * Fetch a player profile from Supercell (from your whitelisted home IP)
 * and store it in Vercel KV so the Vercel site can display it.
 *
 * Usage:  node scripts/cache-player.mjs GQCUGP28
 *         node scripts/cache-player.mjs "#GQCUGP28"
 */

import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envLines = readFileSync(resolve(__dirname, "../.env.local"), "utf8").split("\n");
for (const line of envLines) {
  const [key, ...rest] = line.split("=");
  if (key && rest.length) {
    process.env[key.trim()] = rest.join("=").trim().replace(/^["']|["']$/g, "");
  }
}

const BS_API_BASE = "https://api.brawlstars.com/v1";
const KV_URL      = process.env.KV_REST_API_URL;
const KV_TOKEN    = process.env.KV_REST_API_TOKEN;
const API_KEY     = process.env.BRAWL_STARS_API_KEY;

if (!KV_URL || !KV_TOKEN) { console.error("Missing KV credentials in .env.local"); process.exit(1); }
if (!API_KEY)             { console.error("Missing BRAWL_STARS_API_KEY");           process.exit(1); }

const rawTag = process.argv[2];
if (!rawTag) { console.error("Usage: node scripts/cache-player.mjs <TAG>"); process.exit(1); }

const tag     = "#" + rawTag.replace(/^#/, "").toUpperCase();
const encoded = encodeURIComponent(tag);
const kvKey   = `brawl:player:${tag.replace("#", "")}`;

async function kvSet(key, value) {
  await fetch(`${KV_URL}/set/${key}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${KV_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(JSON.stringify(value)),
  });
}

console.log(`[cache-player] Fetching ${tag} from Supercell...`);

const [playerRes, battleRes] = await Promise.all([
  fetch(`${BS_API_BASE}/players/${encoded}`, { headers: { Authorization: `Bearer ${API_KEY}` } }),
  fetch(`${BS_API_BASE}/players/${encoded}/battlelog`, { headers: { Authorization: `Bearer ${API_KEY}` } }),
]);

if (!playerRes.ok) {
  console.error(`[cache-player] Supercell returned ${playerRes.status} — check the tag or your API key`);
  process.exit(1);
}

const [player, battleLog] = await Promise.all([
  playerRes.json(),
  battleRes.ok ? battleRes.json() : Promise.resolve({ items: [] }),
]);

const payload = {
  player,
  battles:     battleLog.items ?? [],
  cachedAt:    new Date().toISOString(),
};

await kvSet(kvKey, payload);
console.log(`[cache-player] ✓ Cached ${player.name} (${tag}) → KV key "${kvKey}"`);
console.log(`[cache-player]   Trophies: ${player.trophies} · Brawlers: ${player.brawlers.length} · Battles: ${payload.battles.length}`);
console.log(`[cache-player]   Visit: https://brawlmeta-one.vercel.app/player/${tag.replace("#", "")}`);
