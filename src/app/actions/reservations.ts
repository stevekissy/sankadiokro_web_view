"use server";
import { createHash } from "node:crypto";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getRooms, getEstablishments } from "@/lib/content";
import { reservationSchema, zodErrors, type FieldErrors } from "@/lib/validation";
import { antiSpamCheck, getClientIp, rateLimit } from "@/lib/rate-limit";
import { adminEmail, kv, layout, sendEmail, escapeHtml } from "@/lib/email";
import { env } from "@/lib/env";
import { formatDateFr, generateReference } from "@/lib/utils";
import { RESERVATION_STATUS_LABELS } from "@/lib/types";

export type ReservationState = {
  ok: boolean;
  reference?: string;
  status?: string;
  errors?: FieldErrors;
  message?: string;
  emailSent?: boolean;
  stored?: boolean;
};

export async function submitReservation(_prev: ReservationState, formData: FormData): Promise<ReservationState> {
  if (!antiSpamCheck(formData)) {
    return { ok: false, message: "Votre demande n'a pas pu être envoyée. Veuillez réessayer." };
  }
  const rl = await rateLimit("reservation", 5, 60 * 60 * 1000);
  if (!rl.ok) {
    return { ok: false, message: `Trop de demandes envoyées. Réessayez dans ${Math.ceil(rl.retryAfterSec / 60)} minute(s).` };
  }

  const raw = Object.fromEntries(formData.entries());
  const parsed = reservationSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, errors: zodErrors(parsed.error), message: "Veuillez corriger les champs indiqués." };
  }
  const d = parsed.data;

  const [rooms, establishments] = await Promise.all([getRooms(), getEstablishments()]);
  const room = rooms.find((r) => r.id === d.roomId) ?? null;
  const establishment = room ? establishments.find((e) => e.id === room.establishmentId) : null;
  const roomLabel = room ? `${room.name}${establishment ? ` (${establishment.district})` : ""}` : "Sans préférence";

  const reference = generateReference();
  const ip = await getClientIp();
  const ipHash = createHash("sha256").update(`${process.env.CRON_SECRET ?? "skd"}|${ip}`).digest("hex").slice(0, 32);

  let stored = false;
  const admin = createSupabaseAdminClient();
  if (admin) {
    const { error } = await admin.from("reservation_requests").insert({
      reference,
      status: "pending",
      full_name: d.fullName,
      phone: d.phone,
      email: d.email,
      room_id: room && !room.isDemo ? room.id : null,
      room_name: roomLabel,
      event_type: d.eventType,
      event_date: d.eventDate,
      start_time: d.startTime,
      end_time: d.endTime,
      guests: d.guests,
      special_needs: d.specialNeeds || null,
      message: d.message || null,
      client_ip_hash: ipHash,
    });
    if (error) {
      console.error("Insertion réservation", error);
      return { ok: false, message: "Une erreur est survenue lors de l'enregistrement. Veuillez réessayer ou nous contacter par téléphone." };
    }
    stored = true;
  } else {
    console.info(`[DÉMO] Demande de réservation ${reference} reçue (non persistée : Supabase non configuré).`, d);
  }

  const statusLabel = RESERVATION_STATUS_LABELS.pending;
  const details = kv([
    ["Référence", reference],
    ["Statut", statusLabel],
    ["Nom et prénom", d.fullName],
    ["Téléphone", d.phone],
    ["E-mail", d.email],
    ["Salle / établissement", roomLabel],
    ["Type d'événement", d.eventType],
    ["Date souhaitée", formatDateFr(d.eventDate + "T00:00:00")],
    ["Horaire", `${d.startTime} – ${d.endTime}`],
    ["Nombre d'invités", d.guests],
    ["Besoins particuliers", d.specialNeeds || null],
    ["Message", d.message || null],
  ]);

  const clientHtml = layout(
    "Nous avons bien reçu votre demande de réservation",
    `<p>Bonjour ${escapeHtml(d.fullName)},</p>
     <p>Merci pour votre demande. Elle a été enregistrée sous la référence <strong>${reference}</strong> avec le statut <strong>« ${statusLabel} »</strong>.</p>
     ${details}
     <p style="background:#FFF8EB;padding:12px 16px;border-radius:12px;border-left:4px solid #D5A547"><strong>Important :</strong> cette demande ne constitue pas une réservation définitive. Notre équipe vous recontactera pour la confirmer, la modifier ou vous proposer une autre date.</p>
     <p>À très bientôt chez Sankadiokro !</p>`,
  );
  const [clientRes, adminTo] = [await sendEmail({ to: d.email, subject: `Votre demande de réservation ${reference} — Sankadiokro`, html: clientHtml }), adminEmail()];
  if (adminTo) {
    await sendEmail({
      to: adminTo,
      replyTo: d.email,
      subject: `[Réservation] Nouvelle demande ${reference} — ${d.eventType} le ${d.eventDate}`,
      html: layout(
        "Nouvelle demande de réservation de salle",
        `${details}<p><a href="${env.siteUrl}/admin/reservations" style="display:inline-block;background:#174A35;color:#fff;padding:10px 18px;border-radius:999px;text-decoration:none;font-weight:bold">Traiter la demande</a></p>`,
      ),
    });
  }

  return { ok: true, reference, status: statusLabel, emailSent: clientRes.sent, stored };
}
