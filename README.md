# Site officiel — Restaurant Sankadiokro

Site vitrine premium (Next.js 15, TypeScript, Tailwind CSS 4, Supabase, Resend) pour **Restaurant Sankadiokro**, Abidjan.

> « Sankadiokro, le goût authentique de chez nous. » · « Plus tu manges, plus tu économises. »

## Pages

| Page | URL | Contenu |
| --- | --- | --- |
| Accueil | `/` | Hero immersif, spécialités, avantages, application, établissements, avis, promos |
| Notre restaurant | `/notre-restaurant` | Histoire, valeurs |
| Notre menu | `/menu` | Galerie des plats par catégorie, recherche, prix FCFA (si renseignés), bouton « Commander dans l'application » |
| Application mobile | `/application` | Maquettes de smartphones, fonctionnalités, boutons App Store / Google Play (actifs uniquement si les liens officiels sont renseignés) |
| Salles & événements | `/salles-evenements` | Types d'événements, galerie des salles, formulaire de demande avec calendrier et numéro de référence |
| Galerie | `/galerie` | Grille filtrable + visionneuse |
| Nos établissements | `/etablissements`, `/etablissements/[slug]` | Fiches Yopougon Millionnaire et Cocody Saint-Jean |
| Contact | `/contact` | Formulaire, coordonnées, WhatsApp |
| Confidentialité | `/confidentialite` | Politique de confidentialité |
| Administration | `/admin` | Tableau de bord sécurisé |

## Démarrage rapide (mode démonstration)

```bash
npm install
npm run dev
```

Ouvrez http://localhost:3000. Sans Supabase, le site tourne avec des **contenus de démonstration clairement marqués « Démo »** (aucun prix, adresse, téléphone ou lien inventé). L'administration est consultable en aperçu sur `/admin` (hors production).

## Mise en production

### 1. Supabase

1. Créez un projet sur https://supabase.com.
2. Dans *SQL Editor*, exécutez le contenu de [`supabase/schema.sql`](supabase/schema.sql) (tables, RLS, bucket `media`, données de base).
3. Dans *Authentication → Users*, créez votre compte administrateur, puis exécutez :
   ```sql
   update public.profiles set role = 'admin' where email = 'votre@email.ci';
   ```
4. Copiez `.env.example` vers `.env.local` et renseignez :
   - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (serveur uniquement, jamais exposée au navigateur)

### 2. E-mails transactionnels (Resend)

Renseignez `RESEND_API_KEY`, `EMAIL_FROM` (domaine vérifié) et `ADMIN_NOTIFICATION_EMAIL`. Les clients reçoivent un accusé de réception ; le restaurant une notification à chaque demande et à chaque changement de statut.

### 3. Déploiement

Compatible Vercel, Netlify, ou tout hébergeur Node.js :

```bash
npm run build && npm start
```

Définissez `NEXT_PUBLIC_SITE_URL` (ex. `https://sankadiokro.ci`) pour le sitemap, les métadonnées et les e-mails.

## Administration

Rôles : **administrateur** (tout) et **gestionnaire** (contenus et demandes).

- Réservations : accepter / refuser / proposer une autre date, blocage des doubles réservations confirmées (contrainte d'exclusion PostgreSQL + vérification serveur).
- Menu : catégories, plats, photos, prix FCFA, disponibilité, spécialités.
- Salles, établissements (adresse, horaires, téléphone, Google Maps, photos), galerie, avis (publication uniquement avec autorisation), promotions & actualités.
- Paramètres : textes d'accueil, liens App Store / Google Play, numéro WhatsApp, coordonnées, réseaux sociaux, captures d'écran de l'application.
- Utilisateurs & rôles, journal des actions, statistiques de fréquentation anonymes.

## Sécurité

- Clés secrètes côté serveur uniquement (`server-only`).
- Row Level Security sur toutes les tables ; écritures publiques via le serveur après validation (zod), limitation de débit et pot-de-miel.
- Middleware protégeant `/admin`, en-têtes de sécurité, journalisation des actions.

## Structure

```
src/app/(site)       pages publiques
src/app/admin        administration
src/app/actions      server actions (réservations, contact, admin, upload)
src/components       UI, sections, formulaires, admin
src/lib              types, contenu, Supabase, e-mail, SEO, validation
supabase/schema.sql  schéma de base de données
```
