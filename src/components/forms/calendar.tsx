"use client";
import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { addMonths, eachDayOfInterval, endOfMonth, endOfWeek, format, isBefore, isSameDay, isSameMonth, startOfDay, startOfMonth, startOfWeek } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";

export function Calendar({ value, onChange, minDate }: { value: string | null; onChange: (iso: string) => void; minDate?: Date }) {
  const selected = value ? new Date(value + "T00:00:00") : null;
  const [month, setMonth] = useState<Date>(startOfMonth(selected ?? new Date()));
  const min = startOfDay(minDate ?? new Date());

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(month), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(month), { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  }, [month]);

  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-3 sm:p-4" role="group" aria-label="Calendrier de sélection de la date">
      <div className="mb-3 flex items-center justify-between">
        <button type="button" onClick={() => setMonth((m) => addMonths(m, -1))} className="rounded-full p-2 hover:bg-cream" aria-label="Mois précédent" disabled={isBefore(endOfMonth(addMonths(month, -1)), min)}>
          <ChevronLeft className="h-5 w-5" />
        </button>
        <p className="font-display text-lg font-semibold capitalize text-forest">{format(month, "MMMM yyyy", { locale: fr })}</p>
        <button type="button" onClick={() => setMonth((m) => addMonths(m, 1))} className="rounded-full p-2 hover:bg-cream" aria-label="Mois suivant">
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold uppercase tracking-wider text-ink-soft">
        {["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"].map((d) => (
          <span key={d} className="py-1">{d}</span>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1">
        {days.map((day) => {
          const disabled = isBefore(day, min);
          const isSel = selected ? isSameDay(day, selected) : false;
          const inMonth = isSameMonth(day, month);
          return (
            <button
              key={day.toISOString()}
              type="button"
              disabled={disabled}
              onClick={() => onChange(format(day, "yyyy-MM-dd"))}
              aria-pressed={isSel}
              aria-label={format(day, "EEEE d MMMM yyyy", { locale: fr })}
              className={cn(
                "aspect-square rounded-xl text-sm font-medium transition",
                !inMonth && "text-ink/30",
                disabled ? "cursor-not-allowed text-ink/20" : "hover:bg-forest/10",
                isSel && "bg-forest text-white hover:bg-forest",
                isSameDay(day, new Date()) && !isSel && "ring-2 ring-gold",
              )}
            >
              {format(day, "d")}
            </button>
          );
        })}
      </div>
    </div>
  );
}
