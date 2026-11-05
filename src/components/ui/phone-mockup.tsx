import Image from "next/image";
import { cn } from "@/lib/utils";
import { Smartphone } from "lucide-react";

export function PhoneMockup({ src, alt, className, caption }: { src?: string | null; alt: string; className?: string; caption?: string | null }) {
  return (
    <figure className={cn("relative mx-auto w-[220px] sm:w-[250px]", className)}>
      <div className="relative aspect-[9/19] rounded-[2.6rem] border-[6px] border-ink bg-ink p-1.5 shadow-2xl shadow-forest/30">
        <div className="absolute left-1/2 top-2 z-10 h-5 w-24 -translate-x-1/2 rounded-full bg-ink" />
        <div className="relative h-full w-full overflow-hidden rounded-[2rem] bg-white">
          {src ? (
            <Image src={src} alt={alt} fill sizes="250px" className="object-cover" />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-b from-forest to-forest-dark px-5 text-center text-white">
              <Image src="/images/logo-sankadiokro.png" alt="" width={72} height={72} className="rounded-2xl" />
              <Smartphone className="h-6 w-6 opacity-70" aria-hidden />
              <p className="text-xs font-medium leading-snug opacity-80">Capture d&apos;écran de l&apos;application à ajouter depuis l&apos;administration</p>
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-800">Démo</span>
            </div>
          )}
        </div>
      </div>
      {caption && <figcaption className="mt-3 text-center text-sm text-ink-soft">{caption}</figcaption>}
    </figure>
  );
}
