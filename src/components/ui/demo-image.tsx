import Image from "next/image";
import { cn } from "@/lib/utils";
import { Camera } from "lucide-react";

/**
 * Affiche une image réelle si l'URL est renseignée ; sinon un visuel de
 * démonstration clairement identifié (aucune fausse photo).
 */
export function DemoImage({
  src,
  alt,
  className,
  label = "Photo à ajouter",
  sizes = "(max-width: 768px) 100vw, 50vw",
  priority,
  tone = "forest",
}: {
  src?: string | null;
  alt: string;
  className?: string;
  label?: string;
  sizes?: string;
  priority?: boolean;
  tone?: "forest" | "gold" | "cream";
}) {
  if (src) {
    return (
      <div className={cn("relative overflow-hidden", className)}>
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
      </div>
    );
  }
  const tones = {
    forest: "from-forest via-forest-light to-forest-dark text-white/80",
    gold: "from-gold via-gold-light to-gold-dark text-ink/70",
    cream: "from-cream-dark via-cream to-cream-dark text-forest/70",
  };
  return (
    <div className={cn("relative flex items-center justify-center overflow-hidden bg-gradient-to-br", tones[tone], className)} role="img" aria-label={`${alt} (visuel de démonstration)`}>
      <div className="absolute inset-0 pattern-kente opacity-60" />
      <div className="relative flex flex-col items-center gap-2 px-4 text-center">
        <Camera className="h-7 w-7 opacity-70" aria-hidden />
        <span className="text-xs font-semibold uppercase tracking-wider opacity-80">{label}</span>
      </div>
      <span className="absolute left-3 top-3 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-800">Démo</span>
    </div>
  );
}
