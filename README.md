# HEXA

Site vitrine HEXA — ingénierie, conseil et développement web, mobile et agentique / IA.

## Stack

Next.js 15 (App Router) · TypeScript · Tailwind CSS 4 · Framer Motion · React Hook Form · Zod

## Démarrage

```bash
npm install
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

## Configuration du formulaire de contact

Sans configuration, les messages du formulaire sont uniquement loggés dans la
console du serveur (voir `src/lib/contact.ts`). Pour recevoir un email et
archiver les messages en base :

1. **Email (Resend)** : créer un compte sur [resend.com](https://resend.com),
   récupérer une clé API (Settings > API Keys). En production, vérifier votre
   domaine d'envoi (Domains) ; en développement, l'adresse
   `onboarding@resend.dev` fonctionne sans vérification.
2. **Base de données (Supabase)** : créer un projet sur
   [supabase.com](https://supabase.com), exécuter `supabase/schema.sql` dans
   l'éditeur SQL du projet (SQL Editor), puis récupérer l'URL du projet et la
   clé `service_role` (Project Settings > API).
3. Copier `.env.example` vers `.env.local` et renseigner les 4 variables
   (`RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `SUPABASE_URL`,
   `SUPABASE_SERVICE_ROLE_KEY`).

Chaque intégration se dégrade silencieusement (avec un avertissement dans les
logs serveur) si ses variables d'environnement sont absentes — le formulaire
continue de fonctionner même sans configuration.

## Configuration du blog

Le blog (`/blog`, `/admin/blog`) réutilise le même projet Supabase que le
formulaire de contact. Étapes de mise en service :

1. **Table `blog_posts`** : exécuter `supabase/schema.sql` (mis à jour) dans
   l'éditeur SQL du projet Supabase — il contient désormais aussi la table du
   blog et sa policy RLS.
2. **Authentification admin (Supabase Auth)** : dans Project Settings > API,
   récupérer la clé `anon` (publique) et l'URL du projet, puis renseigner
   `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Créer
   ensuite un compte admin dans Authentication > Users (pas d'inscription
   publique) — c'est ce compte qui permet de se connecter sur `/admin/login`.
3. **Génération de brouillons par IA (Anthropic)** : créer une clé API sur
   [console.anthropic.com](https://console.anthropic.com) et la renseigner
   dans `ANTHROPIC_API_KEY`. Utilisée par le bouton « Générer avec l'IA » de
   l'éditeur et par le cron quotidien.
4. **Cron quotidien (optionnel)** : `vercel.json` planifie un appel quotidien
   à `/api/cron/generate-draft`, qui génère un brouillon (jamais publié
   automatiquement) à partir d'un sujet de `src/data/blog-topics.ts`. Générer
   une valeur aléatoire pour `CRON_SECRET` et la renseigner à la fois en local
   et dans Vercel > Settings > Environment Variables (Vercel envoie alors
   automatiquement l'en-tête `Authorization: Bearer <CRON_SECRET>` sur les
   invocations planifiées). Sans cette variable, la route refuse toute requête
   (401) plutôt que de laisser passer.

L'IA ne publie jamais un article automatiquement : elle ne fait que remplir un
brouillon (statut `draft`), à relire et publier manuellement depuis
`/admin/blog`.

## Scripts

- `npm run dev` — serveur de développement
- `npm run build` — build de production
- `npm run start` — sert le build de production
- `npm run lint` — ESLint
- `npm run type-check` — vérification TypeScript
- `npm run format` / `npm run format:check` — Prettier

## Structure

- `src/app/` — pages et routes (App Router), y compris `/api/contact` et les fichiers SEO (`sitemap.ts`, `robots.ts`, `manifest.ts`, `opengraph-image.tsx`).
- `src/app/blog/` — pages publiques du blog (`/blog`, `/blog/[slug]`, image OG par article, flux RSS).
- `src/app/admin/` — interface d'administration du blog (`/admin/login`, `/admin/blog`), protégée par `src/middleware.ts`.
- `src/app/api/cron/generate-draft/` — route planifiée (`vercel.json`) qui génère un brouillon d'article par IA.
- `src/components/ui/` — primitives (Button, Card, Badge, SectionHeading).
- `src/components/layout/` — Header, Footer, menu mobile.
- `src/components/sections/` — sections de la page d'accueil et de la page contact.
- `src/components/blog/` — composants des pages publiques du blog (ArticleCard).
- `src/components/icons/` — icônes SVG et logo.
- `src/data/` — contenu du site (services, technologies, statistiques, processus, projets, témoignages, FAQ, mentions légales, sujets du blog).
- `src/lib/site-config.ts` — configuration globale du site (coordonnées, navigation, réseaux sociaux, textes de sections).
- `src/lib/contact.ts` — schéma de validation zod du formulaire de contact (sûr pour le client).
- `src/lib/contact-server.ts` — orchestration serveur de l'envoi (`sendContactMessage`), appelée uniquement par la route API.
- `src/lib/email.ts` — envoi de l'email de notification via Resend.
- `src/lib/supabase.ts` — archivage des messages en base via Supabase (voir `supabase/schema.sql`).
- `src/lib/blog.ts` / `src/lib/blog-schema.ts` — CRUD serveur et validation zod des articles de blog.
- `src/lib/auth/` — authentification admin (Supabase Auth) : client lié aux cookies, middleware, Server Actions de connexion/déconnexion.
- `src/lib/ai-draft.ts` — génération de brouillons d'articles via l'API Claude (Anthropic).

## Référence

Voir `CLAUDE.md` (stack et étapes imposées), `SPECS.md` (comportement détaillé et critères d'acceptation par fonctionnalité) et `DEPLOIEMENT.md` (analyse d'hébergement, coûts et manuel de mise en production).
