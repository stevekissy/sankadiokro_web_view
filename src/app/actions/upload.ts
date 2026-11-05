"use server";
import { assertProfile, logAction } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const MAX_BYTES = 8 * 1024 * 1024;

export type UploadResult = { ok: true; url: string } | { ok: false; error: string };

/** Téléverse une image dans le bucket public "media" et renvoie son URL. */
export async function uploadImage(fd: FormData): Promise<UploadResult> {
  let profile;
  try {
    profile = await assertProfile("manager");
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
  const sb = createSupabaseAdminClient();
  if (!sb) return { ok: false, error: "Mode démonstration : le stockage d'images nécessite Supabase." };
  const file = fd.get("file");
  if (!(file instanceof File)) return { ok: false, error: "Aucun fichier." };
  if (!ALLOWED.includes(file.type)) return { ok: false, error: "Format accepté : JPG, PNG, WebP ou AVIF." };
  if (file.size > MAX_BYTES) return { ok: false, error: "Image trop lourde (8 Mo max)." };
  const folder = String(fd.get("folder") ?? "divers").replace(/[^a-z0-9-]/gi, "").toLowerCase() || "divers";
  const ext = file.type === "image/jpeg" ? "jpg" : file.type.split("/")[1];
  const name = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const buf = Buffer.from(await file.arrayBuffer());
  const { error } = await sb.storage.from("media").upload(name, buf, { contentType: file.type, cacheControl: "31536000", upsert: false });
  if (error) return { ok: false, error: error.message };
  const { data } = sb.storage.from("media").getPublicUrl(name);
  await logAction(profile, "media.upload", "storage", name, { size: file.size });
  return { ok: true, url: data.publicUrl };
}
