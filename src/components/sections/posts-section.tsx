import { Megaphone } from "lucide-react";
import { Container, Section } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Badge } from "@/components/ui/badge";
import { DemoImage } from "@/components/ui/demo-image";
import { Stagger, StaggerItem } from "@/components/ui/reveal";
import { formatDateFr } from "@/lib/utils";
import type { Post } from "@/lib/types";

export function PostsSection({ posts }: { posts: Post[] }) {
  if (!posts.length) return null;
  return (
    <Section className="bg-white">
      <Container>
        <SectionHeading eyebrow="Actualités & promotions" title="En ce moment chez Sankadiokro" />
        <Stagger className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.slice(0, 3).map((p) => (
            <StaggerItem key={p.id}>
              <article className="flex h-full flex-col overflow-hidden rounded-3xl bg-cream shadow-card">
                <DemoImage src={p.imageUrl} alt={p.title} className="aspect-[16/9]" tone="gold" label="Visuel" />
                <div className="p-6">
                  <Badge tone={p.kind === "promotion" ? "gold" : "forest"}>
                    <Megaphone className="h-3 w-3" aria-hidden /> {p.kind === "promotion" ? "Promotion" : "Actualité"}
                  </Badge>
                  <h3 className="mt-3 font-display text-xl font-semibold text-forest">{p.title}</h3>
                  <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-ink-soft">{p.body}</p>
                  <p className="mt-3 text-xs text-ink-soft">{formatDateFr(p.createdAt)}</p>
                </div>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}
