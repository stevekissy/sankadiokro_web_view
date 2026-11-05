import { Quote } from "lucide-react";
import { Stars } from "@/components/ui/stars";
import { formatDateFr } from "@/lib/utils";
import type { Testimonial } from "@/lib/types";

export function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <figure className="flex h-full flex-col rounded-3xl bg-white p-6 shadow-card">
      <Quote className="h-8 w-8 text-gold/60" aria-hidden />
      <blockquote className="mt-3 flex-1 text-base leading-relaxed text-ink">« {t.comment} »</blockquote>
      <figcaption className="mt-5 flex items-center justify-between gap-3 border-t border-ink/5 pt-4">
        <div>
          <p className="font-semibold text-forest">{t.author}</p>
          <p className="text-xs text-ink-soft">
            {formatDateFr(t.date)}
            {t.source ? ` · ${t.source}` : ""}
          </p>
        </div>
        <Stars rating={t.rating} />
      </figcaption>
    </figure>
  );
}
