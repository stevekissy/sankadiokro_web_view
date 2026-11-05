import { DemoImage } from "@/components/ui/demo-image";
import { Badge, DemoBadge } from "@/components/ui/badge";
import { formatFcfa } from "@/lib/utils";
import type { Dish } from "@/lib/types";

export function DishCard({ dish, compact }: { dish: Dish; compact?: boolean }) {
  const price = formatFcfa(dish.priceFcfa);
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-soft">
      <div className="relative">
        <DemoImage src={dish.imageUrl} alt={dish.name} className={compact ? "aspect-[4/3]" : "aspect-[5/4]"} label="Photo du plat à ajouter" tone={dish.featured ? "gold" : "forest"} />
        {dish.featured && (
          <Badge tone="gold" className="absolute right-3 top-3 bg-white/90 shadow">
            ★ Spécialité
          </Badge>
        )}
        {!dish.available && (
          <div className="absolute inset-0 flex items-center justify-center bg-ink/60 text-sm font-semibold text-white">Indisponible aujourd&apos;hui</div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-lg font-semibold text-forest">{dish.name}</h3>
          {price ? (
            <span className="shrink-0 rounded-full bg-forest/10 px-3 py-1 text-sm font-bold text-forest">{price}</span>
          ) : !dish.isDemo ? (
            <span className="shrink-0 text-xs font-medium text-ink-soft">Prix dans l&apos;app</span>
          ) : null}
        </div>
        {dish.description && <p className="mt-2 text-sm leading-relaxed text-ink-soft">{dish.description}</p>}
        {dish.isDemo && !price && <DemoBadge label="Prix à renseigner" className="mt-3 self-start" />}
      </div>
    </article>
  );
}
