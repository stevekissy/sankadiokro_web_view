import { Apple, Play } from "lucide-react";
import { cn } from "@/lib/utils";

function StoreButton({ href, top, bottom, icon, className }: { href: string | null; top: string; bottom: string; icon: React.ReactNode; className?: string }) {
  const inner = (
    <>
      {icon}
      <span className="flex flex-col items-start leading-none">
        <span className="text-[10px] font-medium uppercase tracking-wider opacity-80">{top}</span>
        <span className="text-base font-semibold">{bottom}</span>
      </span>
    </>
  );
  const cls = cn(
    "inline-flex min-w-[180px] items-center gap-3 rounded-2xl border px-5 py-3 transition-all",
    href ? "border-ink bg-ink text-white hover:-translate-y-0.5 hover:shadow-lg" : "cursor-not-allowed border-ink/15 bg-white/60 text-ink/50",
    className,
  );
  if (!href) {
    return (
      <span className={cls} aria-disabled title="Lien à configurer dans l'administration">
        {inner}
      </span>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
      {inner}
    </a>
  );
}

export function StoreButtons({ appStoreUrl, playStoreUrl, className }: { appStoreUrl: string | null; playStoreUrl: string | null; className?: string }) {
  const none = !appStoreUrl && !playStoreUrl;
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="flex flex-wrap gap-3">
        <StoreButton href={appStoreUrl} top={appStoreUrl ? "Télécharger sur" : "Bientôt sur"} bottom="App Store" icon={<Apple className="h-7 w-7" aria-hidden />} />
        <StoreButton href={playStoreUrl} top={playStoreUrl ? "Disponible sur" : "Bientôt sur"} bottom="Google Play" icon={<Play className="h-6 w-6 fill-current" aria-hidden />} />
      </div>
      {none && <p className="text-xs text-ink-soft">Les liens de téléchargement seront activés dès la publication de l&apos;application sur chaque plateforme.</p>}
    </div>
  );
}
