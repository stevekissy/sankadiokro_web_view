import Link from "next/link";
import { requireProfile } from "@/lib/auth";
import { adminGetReservations, adminGetReservation, findConflicts } from "@/lib/admin-data";
import { updateReservationStatus } from "@/app/actions/admin";
import { Card, PageTitle, StatusPill, Empty, Textarea, Input } from "@/components/admin/ui";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { formatDateFr, cn } from "@/lib/utils";
import { RESERVATION_STATUS_LABELS, type ReservationStatus } from "@/lib/types";
import { AlertTriangle, Check, X, CalendarClock, RotateCcw, Phone, Mail } from "lucide-react";

const FILTERS: { value: ReservationStatus | "all"; label: string }[] = [
  { value: "pending", label: "En attente" },
  { value: "counter_proposed", label: "Autre date proposée" },
  { value: "confirmed", label: "Confirmées" },
  { value: "refused", label: "Refusées" },
  { value: "cancelled", label: "Annulées" },
  { value: "all", label: "Toutes" },
];

export default async function ReservationsAdmin({ searchParams }: { searchParams: Promise<{ status?: string; id?: string }> }) {
  await requireProfile();
  const sp = await searchParams;
  const status = (FILTERS.some((f) => f.value === sp.status) ? sp.status : "pending") as ReservationStatus | "all";
  const [list, selected] = await Promise.all([adminGetReservations(status), sp.id ? adminGetReservation(sp.id) : Promise.resolve(null)]);
  const conflicts = selected ? await findConflicts(selected.roomId, selected.eventDate, selected.startTime, selected.endTime, selected.id) : [];

  return (
    <>
      <PageTitle title="Demandes de réservation" description="Acceptez, refusez ou proposez une autre date. Les doubles réservations confirmées sont bloquées automatiquement." />
      <div className="mb-5 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <Link key={f.value} href={`/admin/reservations?status=${f.value}`} className={cn("rounded-full px-3.5 py-1.5 text-xs font-semibold", status === f.value ? "bg-forest text-white" : "bg-white text-ink hover:bg-forest/10")}>
            {f.label}
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <Card title={`${list.length} demande(s)`}>
          {list.length ? (
            <ul className="divide-y divide-ink/5">
              {list.map((r) => (
                <li key={r.id}>
                  <Link href={`/admin/reservations?status=${status}&id=${r.id}`} className={cn("block rounded-xl px-3 py-3 transition hover:bg-cream", selected?.id === r.id && "bg-cream ring-2 ring-gold")}>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold">{r.fullName}</p>
                        <p className="font-mono text-[11px] text-ink-soft">{r.reference}</p>
                      </div>
                      <StatusPill status={r.status} />
                    </div>
                    <p className="mt-1 text-xs text-ink-soft">{r.eventType} · {formatDateFr(r.eventDate + "T00:00:00")} · {r.startTime}–{r.endTime} · {r.guests} inv.</p>
                    <p className="text-xs text-ink-soft">{r.roomName ?? "Sans préférence"}</p>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <Empty>Aucune demande dans cette catégorie.</Empty>
          )}
        </Card>

        <div className="space-y-6">
          {selected ? (
            <>
              <Card title={`Demande ${selected.reference}`} description={`Reçue le ${formatDateFr(selected.createdAt, { hour: "2-digit", minute: "2-digit" })}`}>
                <div className="mb-4 flex items-center gap-3">
                  <StatusPill status={selected.status} />
                  <span className="text-xs text-ink-soft">{RESERVATION_STATUS_LABELS[selected.status]}</span>
                </div>
                <dl className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
                  <div><dt className="text-xs text-ink-soft">Client</dt><dd className="font-semibold">{selected.fullName}</dd></div>
                  <div><dt className="text-xs text-ink-soft">Contact</dt><dd className="flex flex-col"><a href={`tel:${selected.phone}`} className="inline-flex items-center gap-1 text-forest hover:underline"><Phone className="h-3 w-3" />{selected.phone}</a><a href={`mailto:${selected.email}`} className="inline-flex items-center gap-1 text-forest hover:underline"><Mail className="h-3 w-3" />{selected.email}</a></dd></div>
                  <div><dt className="text-xs text-ink-soft">Salle</dt><dd>{selected.roomName ?? "Sans préférence"}</dd></div>
                  <div><dt className="text-xs text-ink-soft">Événement</dt><dd>{selected.eventType}</dd></div>
                  <div><dt className="text-xs text-ink-soft">Date & horaire</dt><dd className="font-semibold">{formatDateFr(selected.eventDate + "T00:00:00", { weekday: "long" })} · {selected.startTime}–{selected.endTime}</dd></div>
                  <div><dt className="text-xs text-ink-soft">Invités</dt><dd>{selected.guests}</dd></div>
                  {selected.specialNeeds && <div className="sm:col-span-2"><dt className="text-xs text-ink-soft">Besoins particuliers</dt><dd className="whitespace-pre-line">{selected.specialNeeds}</dd></div>}
                  {selected.message && <div className="sm:col-span-2"><dt className="text-xs text-ink-soft">Message</dt><dd className="whitespace-pre-line">{selected.message}</dd></div>}
                  {selected.proposedDate && <div className="sm:col-span-2 rounded-xl bg-blue-50 p-3"><dt className="text-xs text-blue-800">Date proposée par le restaurant</dt><dd className="font-semibold text-blue-900">{formatDateFr(selected.proposedDate + "T00:00:00", { weekday: "long" })} · {selected.proposedStartTime}–{selected.proposedEndTime}</dd></div>}
                  {selected.adminNote && <div className="sm:col-span-2"><dt className="text-xs text-ink-soft">Note interne / message envoyé</dt><dd className="whitespace-pre-line">{selected.adminNote}</dd></div>}
                </dl>
                {conflicts.length > 0 && (
                  <p className="mt-4 flex items-start gap-2 rounded-xl bg-red-50 p-3 text-sm text-red-800">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" /> Conflit : la salle est déjà confirmée sur ce créneau ({conflicts.map((c) => `${c.reference} ${c.startTime}–${c.endTime}`).join(", ")}). Proposez une autre date.
                  </p>
                )}
              </Card>

              <Card title="Traiter la demande" description="Le client est notifié par e-mail à chaque changement de statut.">
                <form action={updateReservationStatus} className="space-y-4">
                  <input type="hidden" name="id" value={selected.id} />
                  <Textarea label="Message au client / note (facultatif)" name="adminNote" defaultValue={selected.adminNote} rows={3} hint="Ce texte est inclus dans l'e-mail envoyé au client." />
                  {selected.proposedDate && (
                    <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="useProposed" className="accent-forest" defaultChecked /> Confirmer sur la date proposée ({selected.proposedDate} {selected.proposedStartTime}–{selected.proposedEndTime})</label>
                  )}
                  <div className="flex flex-wrap gap-2">
                    <button type="submit" name="action" value="confirm" disabled={conflicts.length > 0 && !selected.proposedDate} className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-40"><Check className="h-4 w-4" /> Accepter</button>
                    <button type="submit" name="action" value="refuse" className="inline-flex items-center gap-1.5 rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"><X className="h-4 w-4" /> Refuser</button>
                    {selected.status !== "pending" && <button type="submit" name="action" value="pending" className="inline-flex items-center gap-1.5 rounded-full bg-ink/10 px-4 py-2 text-sm font-semibold hover:bg-ink/20"><RotateCcw className="h-4 w-4" /> Remettre en attente</button>}
                    {selected.status === "confirmed" && <ConfirmButton message="Annuler cette réservation confirmée ?" className="rounded-full bg-ink/10 px-4 py-2 text-sm"><input type="hidden" name="action" value="cancel" />Annuler la réservation</ConfirmButton>}
                  </div>
                  <details className="rounded-xl border border-ink/10 p-4">
                    <summary className="cursor-pointer text-sm font-semibold"><CalendarClock className="mr-1 inline h-4 w-4" /> Proposer une autre date</summary>
                    <div className="mt-3 grid gap-3 sm:grid-cols-3">
                      <Input label="Date" name="proposedDate" type="date" defaultValue={selected.proposedDate} />
                      <Input label="Début" name="proposedStartTime" type="time" defaultValue={selected.proposedStartTime ?? selected.startTime} />
                      <Input label="Fin" name="proposedEndTime" type="time" defaultValue={selected.proposedEndTime ?? selected.endTime} />
                    </div>
                    <button type="submit" name="action" value="propose" className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">Envoyer la proposition</button>
                  </details>
                </form>
              </Card>
            </>
          ) : (
            <Card><Empty>Sélectionnez une demande pour la traiter.</Empty></Card>
          )}
        </div>
      </div>
    </>
  );
}
