import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function Badge({ children, className, tone = "gold" }: { children: ReactNode; className?: string; tone?: "gold" | "forest" | "neutral" | "demo" | "success" | "danger" | "warning" }) {
  const tones = {
    gold: "bg-gold/15 text-gold-dark",
    forest: "bg-forest/10 text-forest",
    neutral: "bg-ink/5 text-ink-soft",
    demo: "bg-amber-100 text-amber-800 border border-amber-300",
    success: "bg-emerald-100 text-emerald-800",
    danger: "bg-red-100 text-red-800",
    warning: "bg-amber-100 text-amber-800",
  };
  return <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold", tones[tone], className)}>{children}</span>;
}

/** Signale clairement un contenu de démonstration à remplacer. */
export function DemoBadge({ label = "Démo — à renseigner", className }: { label?: string; className?: string }) {
  return (
    <Badge tone="demo" className={className} aria-label="Contenu de démonstration">
      {label}
    </Badge>
  );
}
