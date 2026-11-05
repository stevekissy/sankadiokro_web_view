"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Envoie une vue de page anonyme (sans cookie, sans donnée personnelle). */
export function PageViewTracker() {
  const pathname = usePathname();
  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;
    const body = JSON.stringify({ path: pathname, referrer: document.referrer || null });
    try {
      if (navigator.sendBeacon) {
        navigator.sendBeacon("/api/track", new Blob([body], { type: "application/json" }));
      } else {
        fetch("/api/track", { method: "POST", body, headers: { "Content-Type": "application/json" }, keepalive: true });
      }
    } catch {
      /* silencieux */
    }
  }, [pathname]);
  return null;
}
