import Link from "next/link";
import { Users, Check } from "lucide-react";
import { DemoImage } from "@/components/ui/demo-image";
import { DemoBadge } from "@/components/ui/badge";
import { buttonClasses } from "@/components/ui/button";
import { formatFcfa } from "@/lib/utils";
import type { Room } from "@/lib/types";

export function RoomCard({ room, establishmentName }: { room: Room; establishmentName?: string }) {
  const price = formatFcfa(room.priceFcfa);
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-card">
      <DemoImage src={room.photos[0]} alt={room.name} className="aspect-[16/10]" label="Photo de la salle à ajouter" tone="cream" />
      <div className="flex flex-1 flex-col p-6">
        {establishmentName && <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-dark">{establishmentName}</p>}
        <h3 className="mt-1 font-display text-xl font-semibold text-forest">{room.name}</h3>
        {room.description && <p className="mt-2 text-sm leading-relaxed text-ink-soft">{room.description}</p>}

        <dl className="mt-4 grid gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-gold-dark" aria-hidden />
            <dt className="sr-only">Capacité</dt>
            <dd>{room.capacity ? `Jusqu'à ${room.capacity} personnes` : "Capacité à préciser"}</dd>
          </div>
          {room.equipment.length > 0 && (
            <div>
              <dt className="mb-1.5 font-semibold text-ink">Équipements</dt>
              <dd className="flex flex-wrap gap-1.5">
                {room.equipment.map((e) => (
                  <span key={e} className="inline-flex items-center gap-1 rounded-full bg-cream px-2.5 py-1 text-xs">
                    <Check className="h-3 w-3 text-forest" aria-hidden /> {e}
                  </span>
                ))}
              </dd>
            </div>
          )}
          {room.conditions && (
            <div>
              <dt className="font-semibold text-ink">Conditions</dt>
              <dd className="text-ink-soft">{room.conditions}</dd>
            </div>
          )}
        </dl>

        <div className="mt-5 flex items-center justify-between gap-3 border-t border-ink/5 pt-4">
          <div>
            {price ? (
              <p className="font-bold text-forest">
                {price} {room.priceNote && <span className="text-xs font-normal text-ink-soft">({room.priceNote})</span>}
              </p>
            ) : (
              <p className="text-sm font-semibold text-ink-soft">{room.priceNote ?? "Tarif sur devis"}</p>
            )}
            {room.isDemo && <DemoBadge className="mt-1" />}
          </div>
          <Link href={`/salles-evenements?salle=${room.id}#reservation`} className={buttonClasses("gold", "sm")}>
            Demander une réservation
          </Link>
        </div>
      </div>
    </article>
  );
}
