"use server";
import { createHash } from "node:crypto";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { contactSchema, zodErrors, type FieldErrors } from "@/lib/validation";
import { antiSpamCheck, getClientIp, rateLimit } from "@/lib/rate-limit";
import { adminEmail, kv, layout, sendEmail, escapeHtml } from "@/lib/email";

export type ContactState = { ok: boolean; errors?: FieldErrors; message?: string };

export async function submitContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  if (!antiSpamCheck(formData)) return { ok: false, message: "Votre message n'a pas pu être envoyé. Veuillez réessayer." };
  const rl = await rateLimit("contact", 5, 60 * 60 * 1000);
  if (!rl.ok) return { ok: false, message: `Trop de messages envoyés. Réessayez dans ${Math.ceil(rl.retryAfterSec / 60)} minute(s).` };

  const parsed = contactSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return { ok: false, errors: zodErrors(parsed.error), message: "Veuillez corriger les champs indiqués." };
  const d = parsed.data;

  const admin = createSupabaseAdminClient();
  if (admin) {
    const ip = await getClientIp();
    const ipHash = createHash("sha256").update(`${process.env.CRON_SECRET ?? "skd"}|${ip}`).digest("hex").slice(0, 32);
    const { error } = await admin.from("contact_messages").insert({
      full_name: d.fullName,
      phone: d.phone || null,
      email: d.email,
      subject: d.subject,
      message: d.message,
      client_ip_hash: ipHash,
    });
    if (error) {
      console.error("Insertion contact", error);
      return { ok: false, message: "Une erreur est survenue. Veuillez réessayer." };
    }
  } else {
    console.info("[DÉMO] Message de contact reçu (non persisté).", d);
  }

  const details = kv([
    ["Nom", d.fullName],
    ["Téléphone", d.phone || null],
    ["E-mail", d.email],
    ["Objet", d.subject],
    ["Message", d.message],
  ]);
  await sendEmail({
    to: d.email,
    subject: "Nous avons bien reçu votre message — Sankadiokro",
    html: layout("Merci pour votre message", `<p>Bonjour ${escapeHtml(d.fullName)},</p><p>Nous avons bien reçu votre message et vous répondrons dans les meilleurs délais.</p>${details}`),
  });
  const to = adminEmail();
  if (to) {
    await sendEmail({ to, replyTo: d.email, subject: `[Contact] ${d.subject}`, html: layout("Nouveau message depuis le site", details) });
  }
  return { ok: true, message: "Merci ! Votre message a bien été envoyé. Nous vous répondrons rapidement." };
}
