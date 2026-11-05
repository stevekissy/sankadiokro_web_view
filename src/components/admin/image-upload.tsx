"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import { uploadImage } from "@/app/actions/upload";

/** Champ image : téléversement vers Supabase Storage ou URL collée. Le résultat est stocké dans un input caché/visible `name`. */
export function ImageUpload({ name, label = "Image", defaultValue, folder = "divers", hint }: { name: string; label?: string; defaultValue?: string | null; folder?: string; hint?: string }) {
  const [url, setUrl] = useState(defaultValue ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setError(null);
    const fd = new FormData();
    fd.set("file", file);
    fd.set("folder", folder);
    const res = await uploadImage(fd);
    setBusy(false);
    if (res.ok) setUrl(res.url);
    else setError(res.error);
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <div>
      <span className="label">{label}</span>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <div className="relative h-28 w-40 shrink-0 overflow-hidden rounded-xl border border-ink/10 bg-cream">
          {url ? <Image src={url} alt="" fill sizes="160px" className="object-cover" unoptimized /> : <div className="flex h-full items-center justify-center text-xs text-ink-soft">Aucune image</div>}
        </div>
        <div className="flex-1 space-y-2">
          <input type="url" name={name} value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://… (URL de l'image)" className="input" />
          <div className="flex flex-wrap items-center gap-2">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-forest px-4 py-2 text-xs font-semibold text-white hover:bg-forest-light">
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
              {busy ? "Téléversement…" : "Téléverser une image"}
              <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/avif" className="sr-only" onChange={onFile} disabled={busy} />
            </label>
            {url && (
              <button type="button" onClick={() => setUrl("")} className="inline-flex items-center gap-1 rounded-full px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50">
                <Trash2 className="h-4 w-4" /> Retirer
              </button>
            )}
          </div>
          {hint && <p className="text-xs text-ink-soft">{hint}</p>}
          {error && <p className="text-xs font-medium text-red-600" role="alert">{error}</p>}
        </div>
      </div>
    </div>
  );
}
