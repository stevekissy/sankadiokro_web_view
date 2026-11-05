"use client";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, X, ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { GALLERY_CATEGORIES, type GalleryItem } from "@/lib/types";

export function GalleryView({ items }: { items: GalleryItem[] }) {
  const [filter, setFilter] = useState<string>("all");
  const [index, setIndex] = useState<number | null>(null);

  const visible = useMemo(() => items.filter((i) => filter === "all" || i.category === filter), [items, filter]);
  const counts = useMemo(() => Object.fromEntries(GALLERY_CATEGORIES.map((c) => [c.value, items.filter((i) => i.category === c.value).length])), [items]);

  const close = useCallback(() => setIndex(null), []);
  const prev = useCallback(() => setIndex((i) => (i === null ? null : (i - 1 + visible.length) % visible.length)), [visible.length]);
  const next = useCallback(() => setIndex((i) => (i === null ? null : (i + 1) % visible.length)), [visible.length]);

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [index, close, prev, next]);

  return (
    <div>
      <div className="scrollbar-none -mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:justify-center sm:px-0" role="tablist" aria-label="Filtrer la galerie">
        <button type="button" role="tab" aria-selected={filter === "all"} onClick={() => setFilter("all")} className={cn("shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition", filter === "all" ? "bg-forest text-white" : "bg-white text-ink hover:bg-forest/10")}>
          Tout ({items.length})
        </button>
        {GALLERY_CATEGORIES.map((c) => (
          <button key={c.value} type="button" role="tab" aria-selected={filter === c.value} onClick={() => setFilter(c.value)} className={cn("shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition", filter === c.value ? "bg-forest text-white" : "bg-white text-ink hover:bg-forest/10")}>
            {c.label} ({counts[c.value]})
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <div className="mx-auto mt-10 max-w-lg rounded-3xl border border-dashed border-gold/60 bg-white p-10 text-center">
          <ImageOff className="mx-auto h-10 w-10 text-gold" aria-hidden />
          <p className="mt-3 font-display text-xl font-semibold text-forest">Galerie en préparation</p>
          <p className="mt-2 text-sm text-ink-soft">Les photos des plats, des salles et des événements seront ajoutées par le restaurant depuis l&apos;administration. Aucune image d&apos;illustration fictive n&apos;est affichée.</p>
        </div>
      ) : (
        <motion.ul layout className="mt-8 columns-2 gap-4 md:columns-3 lg:columns-4 [&>li]:mb-4">
          <AnimatePresence>
            {visible.map((item, i) => (
              <motion.li key={item.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="break-inside-avoid">
                <button type="button" onClick={() => setIndex(i)} className="group relative block w-full overflow-hidden rounded-2xl bg-white shadow-card focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gold/50" aria-label={`Agrandir : ${item.caption ?? "photo"}`}>
                  <Image src={item.imageUrl} alt={item.caption ?? "Photo Sankadiokro"} width={600} height={800} sizes="(max-width: 768px) 50vw, 25vw" className="h-auto w-full object-cover transition duration-500 group-hover:scale-105" />
                  {item.caption && <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 pb-3 pt-8 text-left text-sm font-medium text-white opacity-0 transition group-hover:opacity-100">{item.caption}</span>}
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      )}

      <AnimatePresence>
        {index !== null && visible[index] && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4" role="dialog" aria-modal="true" aria-label="Visionneuse de photos" onClick={close}>
            <button type="button" onClick={close} className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20" aria-label="Fermer">
              <X className="h-6 w-6" />
            </button>
            <button type="button" onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 md:left-6" aria-label="Photo précédente">
              <ChevronLeft className="h-7 w-7" />
            </button>
            <button type="button" onClick={(e) => { e.stopPropagation(); next(); }} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 md:right-6" aria-label="Photo suivante">
              <ChevronRight className="h-7 w-7" />
            </button>
            <motion.figure key={visible[index].id} initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-h-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
              <Image src={visible[index].imageUrl} alt={visible[index].caption ?? "Photo Sankadiokro"} width={1600} height={1200} sizes="100vw" className="max-h-[80vh] w-auto rounded-2xl object-contain" />
              {visible[index].caption && <figcaption className="mt-3 text-center text-sm text-white/80">{visible[index].caption}</figcaption>}
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
