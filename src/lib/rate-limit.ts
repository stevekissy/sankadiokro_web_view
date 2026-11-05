import "server-only";
import { headers } from "next/headers";

/**
 * Limiteur simple en mémoire (par instance serveur). Suffisant pour protéger
 * les formulaires contre les soumissions abusives ; à compléter par un
 * service dédié (Upstash, Vercel WAF...) en cas de fort trafic.
 */
const buckets = new Map<string, number[]>();

export async function getClientIp(): Promise<string> {
  const h = await headers();
  return (
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    h.get("cf-connecting-ip") ||
    "unknown"
  );
}

export async function rateLimit(scope: string, limit: number, windowMs: number): Promise<{ ok: boolean; retryAfterSec: number }> {
  const ip = await getClientIp();
  const key = `${scope}:${ip}`;
  const now = Date.now();
  const hits = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  if (hits.length >= limit) {
    const retryAfterSec = Math.ceil((windowMs - (now - hits[0])) / 1000);
    return { ok: false, retryAfterSec };
  }
  hits.push(now);
  buckets.set(key, hits);
  if (buckets.size > 5000) {
    // nettoyage grossier
    for (const [k, v] of buckets) if (v.every((t) => now - t > windowMs)) buckets.delete(k);
  }
  return { ok: true, retryAfterSec: 0 };
}

/** Vérifie le champ pot-de-miel et le délai minimal de remplissage. */
export function antiSpamCheck(formData: FormData, minSeconds = 3): boolean {
  const honey = String(formData.get("website") ?? "");
  if (honey.trim() !== "") return false;
  const started = Number(formData.get("form_started_at") ?? 0);
  if (started && Date.now() - started < minSeconds * 1000) return false;
  return true;
}
