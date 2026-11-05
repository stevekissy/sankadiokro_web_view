-- =====================================================================
--  RESTAURANT SANKADIOKRO — Schéma Supabase
--  À exécuter dans l'éditeur SQL de votre projet Supabase.
-- =====================================================================
create extension if not exists "pgcrypto";
create extension if not exists btree_gist;

-- ---------- Profils & rôles ----------
create type public.user_role as enum ('admin', 'manager');

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  role public.user_role not null default 'manager',
  created_at timestamptz not null default now()
);

-- Création automatique du profil à l'inscription (rôle "manager" par défaut).
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', ''))
  on conflict (id) do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users for each row execute procedure public.handle_new_user();

create or replace function public.current_role_is(required public.user_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and (p.role = 'admin' or p.role = required)
  );
$$;

-- ---------- Paramètres du site (une seule ligne) ----------
create table if not exists public.site_settings (
  id int primary key default 1 check (id = 1),
  hero_title text,
  hero_subtitle text,
  hero_image_url text,
  slogan_main text default 'Sankadiokro, le goût authentique de chez nous.',
  slogan_loyalty text default 'Plus tu manges, plus tu économises.',
  app_store_url text,
  play_store_url text,
  whatsapp_number text,
  contact_email text,
  contact_phone text,
  about_text text,
  facebook_url text,
  instagram_url text,
  tiktok_url text,
  updated_at timestamptz not null default now()
);
insert into public.site_settings (id) values (1) on conflict do nothing;

create table if not exists public.app_screenshots (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  caption text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ---------- Établissements ----------
create table if not exists public.establishments (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  district text,
  address text,
  phone text,
  whatsapp text,
  email text,
  maps_url text,
  description text,
  hours jsonb not null default '[]'::jsonb,
  photos jsonb not null default '[]'::jsonb,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

insert into public.establishments (slug, name, district, sort_order) values
  ('yopougon-millionnaire', 'Sankadiokro — Yopougon Millionnaire', 'Yopougon Millionnaire, Abidjan', 1),
  ('cocody-saint-jean', 'Sankadiokro — Cocody Saint-Jean', 'Cocody Saint-Jean, Abidjan', 2)
on conflict (slug) do nothing;

-- ---------- Menu ----------
create table if not exists public.menu_categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  sort_order int not null default 0
);

insert into public.menu_categories (slug, name, description, sort_order) values
  ('grillades', 'Grillades', 'Cuites au feu de bois, marinées aux épices de chez nous.', 1),
  ('soupes', 'Soupes traditionnelles', 'Mijotées longuement, servies bien chaudes.', 2),
  ('kedjenou', 'Kédjénou', 'Le plat emblématique ivoirien, cuit à l''étouffée dans son jus.', 3),
  ('accompagnements', 'Accompagnements', 'Préparés chaque jour pour accompagner vos plats.', 4),
  ('specialites', 'Spécialités de la maison', 'Les créations signature de Sankadiokro.', 5)
on conflict (slug) do nothing;

create table if not exists public.dishes (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.menu_categories(id) on delete cascade,
  name text not null,
  description text,
  price_fcfa int check (price_fcfa is null or price_fcfa >= 0),
  image_url text,
  available boolean not null default true,
  featured boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- Plats de base (sans prix : à renseigner dans l'administration)
insert into public.dishes (category_id, name, description, featured, sort_order)
select c.id, d.name, d.description, d.featured, d.sort_order
from (values
  ('grillades', 'Poulet braisé', 'Poulet mariné, braisé lentement au feu de bois.', true, 1),
  ('grillades', 'Pintade braisée', 'Pintade fermière grillée, chair tendre et goût prononcé.', true, 2),
  ('grillades', 'Carpe braisée', 'Carpe fraîche farcie aux épices, braisée.', false, 3),
  ('grillades', 'Capitaine braisé', 'Le roi des poissons de lagune, braisé à la perfection.', true, 4),
  ('grillades', 'Mâchoiron braisé', 'Poisson de lagune à la chair fondante.', false, 5),
  ('grillades', 'Lapin braisé', 'Lapin mariné et grillé.', false, 6),
  ('soupes', 'Soupe de poisson', 'Bouillon parfumé au poisson frais.', false, 1),
  ('soupes', 'Soupe de pintade', 'Pintade mijotée dans un bouillon relevé.', false, 2),
  ('kedjenou', 'Kédjénou de poulet', 'Poulet cuit à l''étouffée avec légumes et épices.', true, 1),
  ('kedjenou', 'Kédjénou de pintade', 'La version pintade du plat emblématique.', false, 2),
  ('accompagnements', 'Attiéké', 'Semoule de manioc fraîche.', false, 1),
  ('accompagnements', 'Alloco', 'Bananes plantain frites.', false, 2),
  ('accompagnements', 'Foutou', 'Foutou banane ou igname.', false, 3),
  ('accompagnements', 'Riz', 'Riz blanc ou riz gras.', false, 4),
  ('accompagnements', 'Frites', 'Frites maison.', false, 5),
  ('accompagnements', 'Igname', 'Igname bouillie ou frite.', false, 6)
) as d(cat_slug, name, description, featured, sort_order)
join public.menu_categories c on c.slug = d.cat_slug
where not exists (select 1 from public.dishes);

-- ---------- Salles ----------
create table if not exists public.rooms (
  id uuid primary key default gen_random_uuid(),
  establishment_id uuid references public.establishments(id) on delete set null,
  name text not null,
  description text,
  capacity int,
  equipment jsonb not null default '[]'::jsonb,
  conditions text,
  price_fcfa int,
  price_note text,
  photos jsonb not null default '[]'::jsonb,
  active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- Salles de départ (sans tarif ni capacité : à compléter dans l'administration)
insert into public.rooms (establishment_id, name, description, equipment, conditions, price_note, sort_order)
select e.id, r.name, r.description, r.equipment::jsonb,
       'Conditions, acompte et tarifs communiqués sur devis après validation de la demande.',
       'Tarif sur devis', r.sort_order
from (values
  ('yopougon-millionnaire', 'Salle de réception — Yopougon',
   'Grande salle climatisée adaptée aux anniversaires, cérémonies familiales et réceptions privées.',
   '["Climatisation","Sonorisation","Tables et chaises","Service traiteur Sankadiokro"]', 1),
  ('cocody-saint-jean', 'Espace professionnel — Cocody Saint-Jean',
   'Espace privatisable pour réunions, séminaires et repas d''entreprise.',
   '["Climatisation","Écran de projection","Wi-Fi","Pause-café et déjeuner"]', 2)
) as r(slug, name, description, equipment, sort_order)
join public.establishments e on e.slug = r.slug
where not exists (select 1 from public.rooms);

-- ---------- Demandes de réservation ----------
create type public.reservation_status as enum ('pending', 'confirmed', 'refused', 'counter_proposed', 'cancelled');

create table if not exists public.reservation_requests (
  id uuid primary key default gen_random_uuid(),
  reference text unique not null,
  status public.reservation_status not null default 'pending',
  full_name text not null,
  phone text not null,
  email text not null,
  room_id uuid references public.rooms(id) on delete set null,
  room_name text,
  event_type text not null,
  event_date date not null,
  start_time time not null,
  end_time time not null,
  guests int not null check (guests > 0),
  special_needs text,
  message text,
  proposed_date date,
  proposed_start_time time,
  proposed_end_time time,
  admin_note text,
  client_ip_hash text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (end_time > start_time),
  -- Empêche deux réservations CONFIRMÉES qui se chevauchent dans la même salle.
  constraint no_double_booking exclude using gist (
    room_id with =,
    tsrange((event_date + start_time), (event_date + end_time)) with &&
  ) where (status = 'confirmed' and room_id is not null)
);
create index if not exists reservation_requests_date_idx on public.reservation_requests(event_date);

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;
drop trigger if exists reservation_touch on public.reservation_requests;
create trigger reservation_touch before update on public.reservation_requests
  for each row execute procedure public.touch_updated_at();

-- ---------- Galerie ----------
create type public.gallery_category as enum ('plats', 'salles', 'evenements', 'ambiance', 'equipe');
create table if not exists public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  caption text,
  category public.gallery_category not null default 'plats',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ---------- Témoignages (uniquement de vrais avis autorisés) ----------
create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  author text not null,
  rating int not null check (rating between 1 and 5),
  comment text not null,
  review_date date not null default current_date,
  published boolean not null default false,
  consent boolean not null default false,
  source text,
  created_at timestamptz not null default now()
);

-- ---------- Promotions & actualités ----------
create type public.post_kind as enum ('promotion', 'actualite');
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  image_url text,
  kind public.post_kind not null default 'actualite',
  active boolean not null default false,
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz not null default now()
);

-- ---------- Messages de contact ----------
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text,
  email text not null,
  subject text not null,
  message text not null,
  handled boolean not null default false,
  client_ip_hash text,
  created_at timestamptz not null default now()
);

-- ---------- Journal des actions ----------
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid,
  actor_email text,
  action text not null,
  entity text not null,
  entity_id text,
  details jsonb,
  created_at timestamptz not null default now()
);

-- ---------- Statistiques de fréquentation (anonymes) ----------
create table if not exists public.page_views (
  id bigint generated always as identity primary key,
  path text not null,
  visitor_hash text,
  referrer text,
  created_at timestamptz not null default now()
);
create index if not exists page_views_created_idx on public.page_views(created_at);

-- =====================================================================
--  SÉCURITÉ : Row Level Security
--  Les écritures publiques passent toujours par le serveur (clé service),
--  après validation et limitation de débit.
-- =====================================================================
alter table public.profiles enable row level security;
alter table public.site_settings enable row level security;
alter table public.app_screenshots enable row level security;
alter table public.establishments enable row level security;
alter table public.menu_categories enable row level security;
alter table public.dishes enable row level security;
alter table public.rooms enable row level security;
alter table public.reservation_requests enable row level security;
alter table public.gallery_items enable row level security;
alter table public.testimonials enable row level security;
alter table public.posts enable row level security;
alter table public.contact_messages enable row level security;
alter table public.audit_logs enable row level security;
alter table public.page_views enable row level security;

-- Lecture publique des contenus vitrine
create policy "public read settings" on public.site_settings for select using (true);
create policy "public read screenshots" on public.app_screenshots for select using (true);
create policy "public read establishments" on public.establishments for select using (true);
create policy "public read categories" on public.menu_categories for select using (true);
create policy "public read dishes" on public.dishes for select using (true);
create policy "public read rooms" on public.rooms for select using (true);
create policy "public read gallery" on public.gallery_items for select using (true);
create policy "public read testimonials" on public.testimonials for select using (published and consent);
create policy "public read posts" on public.posts for select using (active);

-- Profils : chacun lit le sien ; les admins lisent tout
create policy "read own profile" on public.profiles for select using (auth.uid() = id or public.current_role_is('admin'));
create policy "admin manage profiles" on public.profiles for update using (public.current_role_is('admin'));

-- Gestionnaires et administrateurs : gestion des contenus
create policy "staff write settings" on public.site_settings for update using (public.current_role_is('manager'));
create policy "staff write screenshots" on public.app_screenshots for all using (public.current_role_is('manager'));
create policy "staff write establishments" on public.establishments for all using (public.current_role_is('manager'));
create policy "staff write categories" on public.menu_categories for all using (public.current_role_is('manager'));
create policy "staff write dishes" on public.dishes for all using (public.current_role_is('manager'));
create policy "staff write rooms" on public.rooms for all using (public.current_role_is('manager'));
create policy "staff write gallery" on public.gallery_items for all using (public.current_role_is('manager'));
create policy "staff write testimonials" on public.testimonials for all using (public.current_role_is('manager'));
create policy "staff write posts" on public.posts for all using (public.current_role_is('manager'));
create policy "staff read reservations" on public.reservation_requests for select using (public.current_role_is('manager'));
create policy "staff update reservations" on public.reservation_requests for update using (public.current_role_is('manager'));
create policy "staff read messages" on public.contact_messages for select using (public.current_role_is('manager'));
create policy "staff update messages" on public.contact_messages for update using (public.current_role_is('manager'));
create policy "admin read audit" on public.audit_logs for select using (public.current_role_is('admin'));
create policy "staff read stats" on public.page_views for select using (public.current_role_is('manager'));
-- Aucune politique d'insertion publique : les insertions passent par la clé service côté serveur.

-- =====================================================================
--  STOCKAGE : bucket public "media" pour les photos
-- =====================================================================
insert into storage.buckets (id, name, public) values ('media', 'media', true)
on conflict (id) do nothing;

create policy "public read media" on storage.objects for select using (bucket_id = 'media');
create policy "staff upload media" on storage.objects for insert with check (bucket_id = 'media' and public.current_role_is('manager'));
create policy "staff update media" on storage.objects for update using (bucket_id = 'media' and public.current_role_is('manager'));
create policy "staff delete media" on storage.objects for delete using (bucket_id = 'media' and public.current_role_is('manager'));

-- =====================================================================
--  PREMIER ADMINISTRATEUR
--  1. Créez l'utilisateur dans Authentication > Users (ou via la page de connexion).
--  2. Puis exécutez :  update public.profiles set role = 'admin' where email = 'votre@email.ci';
-- =====================================================================
