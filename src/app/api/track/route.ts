import { NextResponse, type NextRequest } from "next/server";
import { createHash } from "node:crypto";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

/** Enregistre une vue de page anonyme : chemin + empreinte journalière non réversible. */
export async function POST(req: NextRequest) {
  try {
    const { path, referrer } = (await req.json()) as { path?: string; referrer?: string | null };
    if (!path || typeof path !== "string" || path.length > 200 || path.startsWith("/admin")) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }
    const admin = createSupabaseAdminClient();
    if (!admin) return NextResponse.json({ ok: true, stored: false });

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "0";
    const ua = req.headers.get("user-agent") ?? "";
    const day = new Date().toISOString().slice(0, 10);
    const salt = process.env.CRON_SECRET ?? "sankadiokro";
    const visitorHash = createHash("sha256").update(`${salt}|${ip}|${ua}|${day}`).digest("hex").slice(0, 32);

    await admin.from("page_views").insert({ path, visitor_hash: visitorHash, referrer: referrer ? String(referrer).slice(0, 300) : null });
    return NextResponse.json({ ok: true, stored: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
