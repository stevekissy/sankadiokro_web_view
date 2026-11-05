import Link from "next/link";
import { Info } from "lucide-react";

export function DemoBanner() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 bg-amber-50/95 px-4 py-2 text-center text-xs text-amber-900 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.2)] backdrop-blur">
      <Info className="mr-1 inline h-3.5 w-3.5" aria-hidden />
      Site en <strong>mode démonstration</strong> : les contenus marqués « Démo » sont à compléter. Connectez Supabase pour activer l&apos;administration.{" "}
      <Link href="/admin" className="font-semibold underline">
        Ouvrir l&apos;administration
      </Link>
    </div>
  );
}
