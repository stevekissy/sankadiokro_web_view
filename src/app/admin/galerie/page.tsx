import Image from "next/image";
import { requireProfile } from "@/lib/auth";
import { adminGetGallery } from "@/lib/admin-data";
import { saveGalleryItem, deleteGalleryItem } from "@/app/actions/admin";
import { Card, PageTitle, Input, Select, Empty } from "@/components/admin/ui";
import { ImageUpload } from "@/components/admin/image-upload";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { Button } from "@/components/ui/button";
import { GALLERY_CATEGORIES } from "@/lib/types";
import { Trash2 } from "lucide-react";

export default async function GalleryAdmin() {
  await requireProfile();
  const items = await adminGetGallery();
  const opts = GALLERY_CATEGORIES.map((c) => ({ value: c.value, label: c.label }));
  return (
    <>
      <PageTitle title="Galerie photos" description="Ajoutez, modifiez ou supprimez les photos des plats, salles, événements, ambiance et équipe (avec autorisation des personnes photographiées)." />
      <Card title="Ajouter une photo" className="mb-6">
        <form action={saveGalleryItem} className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2"><ImageUpload name="imageUrl" label="Image" folder="galerie" /></div>
          <Input label="Légende" name="caption" placeholder="Ex. Poulet braisé et attiéké" />
          <Select label="Catégorie" name="category" options={opts} />
          <Input label="Ordre" name="sortOrder" type="number" defaultValue={0} />
          <div className="flex items-end"><Button type="submit" size="sm">Ajouter</Button></div>
        </form>
      </Card>
      <Card title={`Photos (${items.length})`}>
        {items.length ? (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((g) => (
              <li key={g.id} className="overflow-hidden rounded-xl border border-ink/10">
                <div className="relative aspect-[4/3] bg-cream"><Image src={g.imageUrl} alt={g.caption ?? ""} fill sizes="300px" className="object-cover" unoptimized /></div>
                <form action={saveGalleryItem} className="space-y-2 p-3">
                  <input type="hidden" name="id" value={g.id} />
                  <input type="hidden" name="imageUrl" value={g.imageUrl} />
                  <Input label="Légende" name="caption" defaultValue={g.caption} />
                  <div className="grid grid-cols-2 gap-2">
                    <Select label="Catégorie" name="category" defaultValue={g.category} options={opts} />
                    <Input label="Ordre" name="sortOrder" type="number" defaultValue={g.sortOrder} />
                  </div>
                  <Button type="submit" size="sm" variant="outline">Enregistrer</Button>
                </form>
                <form action={deleteGalleryItem} className="px-3 pb-3"><input type="hidden" name="id" value={g.id} /><ConfirmButton message="Supprimer cette photo ?"><Trash2 className="h-3.5 w-3.5" /> Supprimer</ConfirmButton></form>
              </li>
            ))}
          </ul>
        ) : (
          <Empty>Aucune photo pour le moment.</Empty>
        )}
      </Card>
    </>
  );
}
