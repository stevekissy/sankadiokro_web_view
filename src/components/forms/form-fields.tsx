"use client";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Field({ label, name, error, children, required, hint, className }: { label: string; name: string; error?: string; children: ReactNode; required?: boolean; hint?: string; className?: string }) {
  return (
    <div className={className}>
      <label htmlFor={name} className="label">
        {label} {required && <span className="text-red-600" aria-hidden>*</span>}
      </label>
      {children}
      {hint && !error && <p className="mt-1 text-xs text-ink-soft">{hint}</p>}
      {error && (
        <p id={`${name}-error`} className="mt-1 text-xs font-medium text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

/** Champs anti-spam invisibles : pot-de-miel + horodatage. */
export function AntiSpamFields() {
  const [started, setStarted] = useState(0);
  useEffect(() => setStarted(Date.now()), []);
  return (
    <>
      <input type="hidden" name="form_started_at" value={started} />
      <div className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden" aria-hidden>
        <label htmlFor="website">Ne pas remplir</label>
        <input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
    </>
  );
}

export function FormAlert({ tone, children }: { tone: "success" | "error"; children: ReactNode }) {
  return (
    <div role={tone === "error" ? "alert" : "status"} className={cn("rounded-2xl px-4 py-3 text-sm", tone === "success" ? "bg-emerald-50 text-emerald-900" : "bg-red-50 text-red-800")}>
      {children}
    </div>
  );
}
