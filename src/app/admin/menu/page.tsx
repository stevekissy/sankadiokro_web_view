import { requireProfile } from "@/lib/auth";
import { adminGetMenu } from "@/lib/admin-data";
import { saveCategory, deleteCategory, saveDish, deleteDish } from "@/app/actions/admin";
import { Card, PageTitle, Input, Textarea, Select, Checkbox, Details, Empty } from "@/components/admin/ui";
import { ImageUpload } from "@/components/admin/image-upload";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { Button } from "@/components/ui/button";
import { formatFcfa } from "@/lib/utils";
import { Trash2 } from "lucide-react";
import type { Dish, MenuCategory } from "@/lib/types";

function DishForm({ dish, categories }: { dish?: Dish; categories: MenuCategory[] }) {
  return (
    <form action={saveDish} className="grid gap-4 md:grid-cols-2">
      {dish && <input type="hidden" name="id" value={dish.id} />}
      <Input label="Nom du plat" name="name" defaultValue={dish?.name} required />
      <Select label="Catégorie" name="categoryId" defaultValue={dish?.categoryId ?? categories[0]?.id} options={categories.map((c) => ({ value: c.id, label: c.name }))} />
      <Textarea label="Description" name="description" defaultValue={dish?.description} className="md:col-span-2" />
      <Input label="Prix (FCFA)" name="priceFcfa" type="number" min={0} step={50} defaultValue={dish?.priceFcfa} hint="Laissez vide si le prix n'est pas encore défini : aucun prix ne sera affiché." />
      <Input label="Ordre d'affichage" name="sortOrder" type="number" defaultValue={dish?.sortOrder ?? 0} />
      <div className="md:col-span-2"><ImageUpload name="imageUrl" label="Photo du plat" defaultValue={dish?.imageUrl} folder="plats" /></div>
      <Checkbox label="Disponible" name="available" defaultChecked={dish?.available ?? true} />
      <Checkbox label="Spécialité mise en avant" name="featured" defaultChecked={dish?.featured ?? false} hint="Affichée sur la page d'accueil." />
      <div className="md:col-span-2"><Button type="submit" size="sm">{dish ? "Enregistrer" : "Ajouter le plat"}</Button></div>
    </form>
  );
}

export default async function MenuAdmin() {
  await requireProfile();
  const { categories, dishes } = await adminGetMenu();
  return (
    <>
      <PageTitle title="Menu & plats" description="Ajoutez vos plats, leurs photos et leurs prix en FCFA. Les prix non renseignés ne sont jamais inventés." />

      <Card title="Ajouter un plat" className="mb-6">
        {categories.length ? <DishForm categories={categories} /> : <Empty>Créez d'abord une catégorie.</Empty>}
      </Card>

      <div className="space-y-4">
        {categories.map((c) => {
          const items = dishes.filter((d) => d.categoryId === c.id);
          return (
            <Card key={c.id} title={`${c.name} (${items.length})`} description={c.description ?? undefined}>
              <Details summary="Modifier la catégorie" className="mb-4">
                <form action={saveCategory} className="grid gap-3 md:grid-cols-4">
                  <input type="hidden" name="id" value={c.id} />
                  <Input label="Nom" name="name" defaultValue={c.name} required />
                  <Input label="Slug" name="slug" defaultValue={c.slug} />
                  <Input label="Description" name="description" defaultValue={c.description} />
                  <Input label="Ordre" name="sortOrder" type="number" defaultValue={c.sortOrder} />
                  <div className="flex items-center gap-2 md:col-span-4">
                    <Button type="submit" size="sm">Enregistrer</Button>
                  </div>
                </form>
                <form action={deleteCategory} className="mt-2">
                  <input type="hidden" name="id" value={c.id} />
                  <ConfirmButton message={`Supprimer la catégorie « ${c.name} » et tous ses plats ?`}><Trash2 className="h-3.5 w-3.5" /> Supprimer la catégorie</ConfirmButton>
                </form>
              </Details>
              {items.length ? (
                <ul className="space-y-2">
                  {items.map((d) => (
                    <li key={d.id}>
                      <Details summary={<span className="flex flex-wrap items-center gap-2">{d.name}{d.featured && <span className="rounded-full bg-gold/20 px-2 py-0.5 text-[10px] font-bold text-gold-dark">★ Spécialité</span>}{!d.available && <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700">Indisponible</span>}<span className="ml-auto text-xs text-ink-soft">{formatFcfa(d.priceFcfa) ?? "Prix non renseigné"}</span></span>}>
                        <DishForm dish={d} categories={categories} />
                        <form action={deleteDish} className="mt-3">
                          <input type="hidden" name="id" value={d.id} />
                          <ConfirmButton message={`Supprimer « ${d.name} » ?`}><Trash2 className="h-3.5 w-3.5" /> Supprimer ce plat</ConfirmButton>
                        </form>
                      </Details>
                    </li>
                  ))}
                </ul>
              ) : (
                <Empty>Aucun plat dans cette catégorie.</Empty>
              )}
            </Card>
          );
        })}
      </div>

      <Card title="Nouvelle catégorie" className="mt-6">
        <form action={saveCategory} className="grid gap-3 md:grid-cols-4">
          <Input label="Nom" name="name" required placeholder="Ex. Boissons" />
          <Input label="Description" name="description" />
          <Input label="Ordre" name="sortOrder" type="number" defaultValue={categories.length + 1} />
          <div className="flex items-end"><Button type="submit" size="sm">Créer</Button></div>
        </form>
      </Card>
    </>
  );
}
