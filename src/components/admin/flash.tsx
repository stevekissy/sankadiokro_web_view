"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, XCircle, X } from "lucide-react";

export function Flash() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const ok = params.get("ok");
  const err = params.get("err");
  const [visible, setVisible] = useState(Boolean(ok || err));

  useEffect(() => {
    setVisible(Boolean(ok || err));
    if (!ok && !err) return;
    const t = setTimeout(() => {
      setVisible(false);
      const next = new URLSearchParams(params.toString());
      next.delete("ok");
      next.delete("err");
      router.replace(next.size ? `${pathname}?${next}` : pathname, { scroll: false });
    }, 6000);
    return () => clearTimeout(t);
  }, [ok, err, params, pathname, router]);

  if (!visible || (!ok && !err)) return null;
  const isErr = Boolean(err);
  return (
    <div role={isErr ? "alert" : "status"} className={`mb-5 flex items-start gap-3 rounded-xl px-4 py-3 text-sm ${isErr ? "bg-red-50 text-red-800" : "bg-emerald-50 text-emerald-900"}`}>
      {isErr ? <XCircle className="mt-0.5 h-4 w-4 shrink-0" /> : <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />}
      <span className="flex-1">{err ?? ok}</span>
      <button type="button" onClick={() => setVisible(false)} aria-label="Fermer"><X className="h-4 w-4" /></button>
    </div>
  );
}
