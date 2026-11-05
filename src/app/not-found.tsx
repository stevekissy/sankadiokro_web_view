import Link from "next/link";
import { buttonClasses } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-4 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-dark">Erreur 404</p>
      <h1 className="mt-3 font-display text-4xl font-semibold text-forest">Page introuvable</h1>
      <p className="mt-3 max-w-md text-ink-soft">La page que vous cherchez n&apos;existe pas ou a été déplacée.</p>
      <Link href="/" className={buttonClasses("primary", "md", "mt-8")}>
        Retour à l&apos;accueil
      </Link>
    </div>
  );
}
