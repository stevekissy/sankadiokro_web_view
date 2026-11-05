"use client";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function ConfirmButton({ children, message = "Confirmer la suppression ?", className, variant = "danger" }: { children: ReactNode; message?: string; className?: string; variant?: "danger" | "neutral" }) {
  return (
    <button
      type="submit"
      onClick={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
      className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition", variant === "danger" ? "text-red-600 hover:bg-red-50" : "text-ink-soft hover:bg-cream", className)}
    >
      {children}
    </button>
  );
}
