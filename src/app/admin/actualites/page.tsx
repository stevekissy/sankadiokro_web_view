import { requireProfile } from "@/lib/auth";
import { adminGetPosts } from "@/lib/admin-data";
import { savePost, deletePost } from "@/app/actions/admin";
import { Card, PageTitle, Input, Textarea, Select, Checkbox, Details, Empty } from "@/components/admin/ui";
import { ImageUpload } from "@/components/admin/image-upload";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import type { Post } from "@/lib/types";

const toLocal = (iso: string | null) => (iso ? new Date(iso).toISOString().slice(0, 16) : "");

function PostForm({ p }: { p?: Post }) {
  return (
    <form action={savePost} className="grid gap-4 md:grid-cols-2">
      {p && <input type="hidden" name="id" value={p.id} />}
      <Input label="Titre" name="title" defaultValue={p?.title} required />
      <Select label="Type" name="kind" defaultValue={p?.kind ?? "promotion"} options={[{ value: "promotion", label: "Promotion" }, { value: "actualite", label: "Actualité" }]} />
      <Textarea label="Contenu" name="body" defaultValue={p?.body} className="md:col-span-2" rows={4} required />
      <div className="md:col-span-2"><ImageUpload name="imageUrl" label="Visuel (facultatif)" defaultValue={p?.imageUrl} folder="actualites" /></div>
      <Input label="Début d'affichage" name="startsAt" type="datetime-local" defaultValue={toLocal(p?.startsAt ?? null)} />
      <Input label="Fin d'affichage" name="endsAt" type="datetime-local" defaultValue={toLocal(p?.endsAt ?? null)} />
      <Checkbox label="Publié" name="active" defaultChecked={p?.active ?? false} hint="Visible sur la page d'accueil pendant la période indiquée." />
      <div className="md:col-span-2"><Button type="submit" size="sm">{p ? "Enregistrer" : "Publier"}</Button></div>
    </form>
  );
}

export default async function PostsAdmin() {
  await requireProfile();
  const list = await adminGetPosts();
  return (
    <>
      <PageTitle title="Promotions & actualités" description="Annoncez vos offres et nouveautés sur la page d'accueil." />
      <Card title="Nouvelle publication" className="mb-6"><PostForm /></Card>
      <Card title={`Publications (${list.length})`}>
        {list.length ? (
          <ul className="space-y-2">
            {list.map((p) => (
              <li key={p.id}>
                <Details summary={<span className="flex items-center gap-2">{p.title}<span className="rounded-full bg-gold/20 px-2 py-0.5 text-[10px] font-bold text-gold-dark">{p.kind === "promotion" ? "Promo" : "Actu"}</span>{p.active ? <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">Publié</span> : <span className="rounded-full bg-ink/10 px-2 py-0.5 text-[10px] font-bold">Brouillon</span>}</span>}>
                  <PostForm p={p} />
                  <form action={deletePost} className="mt-3"><input type="hidden" name="id" value={p.id} /><ConfirmButton message="Supprimer cette publication ?"><Trash2 className="h-3.5 w-3.5" /> Supprimer</ConfirmButton></form>
                </Details>
              </li>
            ))}
          </ul>
        ) : (
          <Empty>Aucune publication.</Empty>
        )}
      </Card>
    </>
  );
}
