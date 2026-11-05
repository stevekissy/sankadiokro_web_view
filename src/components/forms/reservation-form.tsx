"use client";
import { useActionState, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CalendarCheck, CheckCircle2, Loader2 } from "lucide-react";
import { submitReservation, type ReservationState } from "@/app/actions/reservations";
import { EVENT_TYPES, type Establishment, type Room } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Calendar } from "./calendar";
import { AntiSpamFields, Field, FormAlert } from "./form-fields";
import { formatDateFr } from "@/lib/utils";

const initial: ReservationState = { ok: false };

export function ReservationForm({ rooms, establishments }: { rooms: Room[]; establishments: Establishment[] }) {
  const [state, action, pending] = useActionState(submitReservation, initial);
  const params = useSearchParams();
  const [date, setDate] = useState<string | null>(null);
  const [roomId, setRoomId] = useState<string>(params.get("salle") ?? "");
  useEffect(() => {
    const s = params.get("salle");
    if (s) setRoomId(s);
  }, [params]);

  const err = state.errors ?? {};

  if (state.ok && state.reference) {
    return (
      <div className="rounded-3xl bg-white p-8 text-center shadow-card md:p-12">
        <CheckCircle2 className="mx-auto h-14 w-14 text-forest" aria-hidden />
        <h3 className="mt-4 font-display text-2xl font-semibold text-forest">Demande envoyée</h3>
        <p className="mt-2 text-ink-soft">Votre demande a été enregistrée sous la référence</p>
        <p className="mt-2 font-mono text-2xl font-bold tracking-wider text-ink">{state.reference}</p>
        <p className="mt-3 inline-block rounded-full bg-amber-100 px-4 py-1.5 text-sm font-semibold text-amber-800">Statut : {state.status}</p>
        <p className="mx-auto mt-6 max-w-md text-sm text-ink-soft">
          <strong>Important :</strong> cette demande ne constitue pas une réservation définitive. Notre équipe vous contactera pour la confirmer, la modifier ou vous proposer une autre date.
          {state.emailSent ? " Un accusé de réception vous a été envoyé par e-mail." : " Conservez précieusement votre numéro de référence."}
        </p>
        {!state.stored && <p className="mt-4 text-xs text-amber-700">Mode démonstration : la demande n&apos;a pas été enregistrée en base de données (Supabase non configuré).</p>}
      </div>
    );
  }

  return (
    <form action={action} className="relative space-y-6 rounded-3xl bg-white p-6 shadow-card md:p-10" noValidate>
      <AntiSpamFields />
      {state.message && !state.ok && <FormAlert tone="error">{state.message}</FormAlert>}

      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Nom et prénom" name="fullName" required error={err.fullName}>
          <input id="fullName" name="fullName" className="input" autoComplete="name" required aria-invalid={!!err.fullName} />
        </Field>
        <Field label="Numéro de téléphone" name="phone" required error={err.phone}>
          <input id="phone" name="phone" type="tel" className="input" autoComplete="tel" placeholder="+225 07 00 00 00 00" required aria-invalid={!!err.phone} />
        </Field>
        <Field label="Adresse e-mail" name="email" required error={err.email} className="md:col-span-2">
          <input id="email" name="email" type="email" className="input" autoComplete="email" required aria-invalid={!!err.email} />
        </Field>
        <Field label="Salle ou établissement souhaité" name="roomId" error={err.roomId}>
          <select id="roomId" name="roomId" className="input" value={roomId} onChange={(e) => setRoomId(e.target.value)}>
            <option value="">Sans préférence</option>
            {rooms.map((r) => {
              const e = establishments.find((x) => x.id === r.establishmentId);
              return (
                <option key={r.id} value={r.id}>
                  {r.name}{e ? ` — ${e.district}` : ""}
                </option>
              );
            })}
          </select>
        </Field>
        <Field label="Type d'événement" name="eventType" required error={err.eventType}>
          <select id="eventType" name="eventType" className="input" required defaultValue="">
            <option value="" disabled>Choisir…</option>
            {EVENT_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Date souhaitée" name="eventDate" required error={err.eventDate} hint={date ? `Date choisie : ${formatDateFr(date + "T00:00:00", { weekday: "long" })}` : "Sélectionnez une date dans le calendrier."}>
          <input type="hidden" id="eventDate" name="eventDate" value={date ?? ""} />
          <Calendar value={date} onChange={setDate} />
        </Field>
        <div className="grid content-start gap-5">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Heure de début" name="startTime" required error={err.startTime}>
              <input id="startTime" name="startTime" type="time" className="input" required defaultValue="12:00" />
            </Field>
            <Field label="Heure de fin" name="endTime" required error={err.endTime}>
              <input id="endTime" name="endTime" type="time" className="input" required defaultValue="18:00" />
            </Field>
          </div>
          <Field label="Nombre d'invités" name="guests" required error={err.guests}>
            <input id="guests" name="guests" type="number" min={1} max={5000} className="input" required placeholder="Ex. 50" />
          </Field>
          <Field label="Besoins particuliers" name="specialNeeds" error={err.specialNeeds} hint="Décoration, sonorisation, menu spécifique, gâteau…">
            <textarea id="specialNeeds" name="specialNeeds" className="input min-h-24" rows={3} />
          </Field>
        </div>
      </div>

      <Field label="Message complémentaire" name="message" error={err.message}>
        <textarea id="message" name="message" className="input min-h-28" rows={4} />
      </Field>

      <div>
        <label className="flex items-start gap-3 text-sm">
          <input type="checkbox" name="consent" className="mt-1 h-4 w-4 rounded border-ink/30 accent-forest" required />
          <span>
            J&apos;accepte que mes informations soient utilisées pour traiter ma demande, conformément à la{" "}
            <a href="/confidentialite" className="font-semibold text-forest underline" target="_blank">politique de confidentialité</a>.
          </span>
        </label>
        {err.consent && <p className="mt-1 text-xs font-medium text-red-600" role="alert">{err.consent}</p>}
      </div>

      <div className="rounded-2xl bg-cream px-4 py-3 text-sm text-ink-soft">
        <strong className="text-ink">Bon à savoir :</strong> votre demande sera enregistrée avec le statut « En attente de confirmation ». Elle ne constitue pas une réservation définitive avant validation par le restaurant.
      </div>

      <Button type="submit" variant="gold" size="lg" disabled={pending} className="w-full md:w-auto">
        {pending ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden /> : <CalendarCheck className="h-5 w-5" aria-hidden />}
        {pending ? "Envoi en cours…" : "Envoyer ma demande de réservation"}
      </Button>
    </form>
  );
}
