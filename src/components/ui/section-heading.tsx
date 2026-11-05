import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
  light,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  className?: string;
  light?: boolean;
}) {
  return (
    <div className={cn("mb-10 md:mb-14", align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl", className)}>
      {eyebrow && (
        <span className={cn("mb-3 inline-block text-xs font-semibold uppercase tracking-[0.2em]", light ? "text-gold-light" : "text-gold-dark")}>
          {eyebrow}
        </span>
      )}
      <h2 className={cn("font-display text-3xl font-semibold leading-tight text-balance md:text-4xl lg:text-5xl", light ? "text-white" : "text-forest")}>
        {title}
      </h2>
      {description && <p className={cn("mt-4 text-base leading-relaxed md:text-lg", light ? "text-white/80" : "text-ink-soft")}>{description}</p>}
    </div>
  );
}
