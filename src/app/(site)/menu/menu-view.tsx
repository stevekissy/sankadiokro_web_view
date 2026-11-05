"use client";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { DishCard } from "@/components/sections/dish-card";
import { cn } from "@/lib/utils";
import type { Dish, MenuCategory } from "@/lib/types";

export function MenuView({ categories, dishes }: { categories: MenuCategory[]; dishes: Dish[] }) {
  const [active, setActive] = useState<string>("all");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return dishes.filter((d) => (active === "all" || d.categoryId === active) && (!needle || d.name.toLowerCase().includes(needle) || d.description?.toLowerCase().includes(needle)));
  }, [dishes, active, q]);

  const grouped = categories
    .map((c) => ({ category: c, items: filtered.filter((d) => d.categoryId === c.id) }))
    .filter((g) => g.items.length > 0);

  return (
    <div>
      <div className="sticky top-18 z-30 -mx-4 bg-cream/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="scrollbar-none -mx-1 flex gap-2 overflow-x-auto px-1 pb-1" role="tablist" aria-label="Catégories du menu">
            <button type="button" role="tab" aria-selected={active === "all"} onClick={() => setActive("all")} className={cn("shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition", active === "all" ? "bg-forest text-white" : "bg-white text-ink hover:bg-forest/10")}>
              Tout
            </button>
            {categories.map((c) => (
              <button key={c.id} type="button" role="tab" aria-selected={active === c.id} onClick={() => setActive(c.id)} className={cn("shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition", active === c.id ? "bg-forest text-white" : "bg-white text-ink hover:bg-forest/10")}>
                {c.name}
              </button>
            ))}
          </div>
          <label className="relative block md:w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" aria-hidden />
            <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher un plat…" className="input pl-9" aria-label="Rechercher un plat" />
          </label>
        </div>
      </div>

      {grouped.length === 0 && <p className="py-16 text-center text-ink-soft">Aucun plat ne correspond à votre recherche.</p>}

      {grouped.map(({ category, items }) => (
        <section key={category.id} id={category.slug} className="scroll-mt-40 py-10">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-semibold text-forest md:text-3xl">{category.name}</h2>
              {category.description && <p className="mt-1 text-sm text-ink-soft">{category.description}</p>}
            </div>
            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-ink-soft">{items.length} plat{items.length > 1 ? "s" : ""}</span>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((d) => (
              <DishCard key={d.id} dish={d} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
