import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function PageTitle({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 className="font-display text-2xl font-semibold text-forest md:text-3xl">{title}</h1>
        {description && <p className="mt-1 text-sm text-ink-soft">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Card({ children, className, title, description }: { children: ReactNode; className?: string; title?: string; description?: string }) {
  return (
    <section className={cn("rounded-2xl border border-ink/5 bg-white p-5 shadow-sm md:p-6", className)}>
      {title && (
        <header className="mb-4">
          <h2 className="font-display text-lg font-semibold text-forest">{title}</h2>
          {description && <p className="mt-0.5 text-xs text-ink-soft">{description}</p>}
        </header>
      )}
      {children}
    </section>
  );
}

export function Input({ label, name, type = "text", defaultValue, placeholder, required, hint, className, ...rest }: { label: string; name: string; type?: string; defaultValue?: string | number | null; placeholder?: string; required?: boolean; hint?: string; className?: string } & Omit<React.InputHTMLAttributes<HTMLInputElement>, "defaultValue">) {
  return (
    <label className={cn("block", className)}>
      <span className="label">{label}{required && <span className="text-red-600"> *</span>}</span>
      <input name={name} type={type} defaultValue={defaultValue ?? ""} placeholder={placeholder} required={required} className="input" {...rest} />
      {hint && <span className="mt-1 block text-xs text-ink-soft">{hint}</span>}
    </label>
  );
}

export function Textarea({ label, name, defaultValue, rows = 3, hint, className, required }: { label: string; name: string; defaultValue?: string | null; rows?: number; hint?: string; className?: string; required?: boolean }) {
  return (
    <label className={cn("block", className)}>
      <span className="label">{label}{required && <span className="text-red-600"> *</span>}</span>
      <textarea name={name} defaultValue={defaultValue ?? ""} rows={rows} className="input" required={required} />
      {hint && <span className="mt-1 block text-xs text-ink-soft">{hint}</span>}
    </label>
  );
}

export function Select({ label, name, defaultValue, options, className, hint }: { label: string; name: string; defaultValue?: string | null; options: { value: string; label: string }[]; className?: string; hint?: string }) {
  return (
    <label className={cn("block", className)}>
      <span className="label">{label}</span>
      <select name={name} defaultValue={defaultValue ?? ""} className="input">
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      {hint && <span className="mt-1 block text-xs text-ink-soft">{hint}</span>}
    </label>
  );
}

export function Checkbox({ label, name, defaultChecked, hint }: { label: string; name: string; defaultChecked?: boolean; hint?: string }) {
  return (
    <label className="flex items-start gap-2.5 text-sm">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="mt-0.5 h-4 w-4 accent-forest" />
      <span>
        <span className="font-medium">{label}</span>
        {hint && <span className="block text-xs text-ink-soft">{hint}</span>}
      </span>
    </label>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return <p className="rounded-xl border border-dashed border-ink/15 px-4 py-8 text-center text-sm text-ink-soft">{children}</p>;
}

export function Details({ summary, children, open, className }: { summary: ReactNode; children: ReactNode; open?: boolean; className?: string }) {
  return (
    <details open={open} className={cn("group rounded-2xl border border-ink/10 bg-white", className)}>
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-semibold [&::-webkit-details-marker]:hidden">
        <span className="flex-1">{summary}</span>
        <span className="text-ink/40 transition group-open:rotate-180">▾</span>
      </summary>
      <div className="border-t border-ink/5 px-4 py-4">{children}</div>
    </details>
  );
}

export function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: "bg-amber-100 text-amber-800",
    confirmed: "bg-emerald-100 text-emerald-800",
    refused: "bg-red-100 text-red-800",
    counter_proposed: "bg-blue-100 text-blue-800",
    cancelled: "bg-ink/10 text-ink-soft",
  };
  const labels: Record<string, string> = {
    pending: "En attente",
    confirmed: "Confirmée",
    refused: "Refusée",
    counter_proposed: "Autre date proposée",
    cancelled: "Annulée",
  };
  return <span className={cn("inline-block rounded-full px-2.5 py-1 text-xs font-semibold", map[status] ?? "bg-ink/10")}>{labels[status] ?? status}</span>;
}
