import { requireProfile } from "@/lib/auth";
import { adminGetTestimonials } from "@/lib/admin-data";
import { saveTestimonial, deleteTestimonial } from "@/app/actions/admin";
import { Card, PageTitle, Input, Textarea, Select, Checkbox, Details, Empty } from "@/components/admin/ui";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { Button } from "@/components/ui/button";
import { Stars } from "@/components/ui/stars";
import { Trash2 } from "lucide-react";
import type { Testimonial } from "@/lib/types";

function TestimonialForm({ t }: { t?: Testimonial }) {
  return (
    <form action={saveTestimonial} className="grid gap-4 md:grid-cols-2">
      {t && <input type="hidden" name="id" value={t.id} />}
      <Input label="Nom du client" name="author" defaultValue={t?.author} required />
      <Select label="Note" name="rating" defaultValue={String(t?.rating ?? 5)} options={[5, 4, 3, 2, 1].map((n) => ({ value: String(n), label: `${n} / 5` }))} />
      <Textarea label="Commentaire" name="comment" defaultValue={t?.comment} className="md:col-span-2" required />
      <Input label="Date de l'avis" name="reviewDate" type="date" defaultValue={t?.date ?? new Date().toISOString().slice(0, 10)} />
      <Input label="Source" name="source" defaultValue={t?.source} placeholder="Google, Facebook, sur place…" />
      <Checkbox label="Le client a autorisé la publication" name="consent" defaultChecked={t?.consent ?? false} hint="Obligatoire pour publier. Aucun faux avis." />
      <Checkbox label="Publié sur le site" name="published" defaultChecked={t?.published ?? false} />
      <div className="md:col-span-2"><Button type="submit" size="sm">{t ? "Enregistrer" : "Ajouter l'avis"}</Button></div>
    </form>
  );
}

export default async function TestimonialsAdmin() {
  await requireProfile();
  const list = await adminGetTestimonials();
  return (
    <>
      <PageTitle title="Avis clients" description="Saisissez uniquement de véritables avis, avec l'autorisation de publication du client." />
      <Card title="Ajouter un avis" className="mb-6"><TestimonialForm /></Card>
      <Card title={`Avis (${list.length})`}>
        {list.length ? (
          <ul className="space-y-2">
            {list.map((t) => (
              <li key={t.id}>
                <Details summary={<span className="flex flex-wrap items-center gap-2">{t.author}<Stars rating={t.rating} />{t.published ? <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">Publié</span> : <span className="rounded-full bg-ink/10 px-2 py-0.5 text-[10px] font-bold">Brouillon</span>}{!t.consent && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">Sans autorisation</span>}</span>}>
                  <TestimonialForm t={t} />
                  <form action={deleteTestimonial} className="mt-3"><input type="hidden" name="id" value={t.id} /><ConfirmButton message="Supprimer cet avis ?"><Trash2 className="h-3.5 w-3.5" /> Supprimer</ConfirmButton></form>
                </Details>
              </li>
            ))}
          </ul>
        ) : (
          <Empty>Aucun avis enregistré.</Empty>
        )}
      </Card>
    </>
  );
}
