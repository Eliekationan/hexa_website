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

## Scripts

- `npm run dev` — serveur de développement
- `npm run build` — build de production
- `npm run start` — sert le build de production
- `npm run lint` — ESLint
- `npm run type-check` — vérification TypeScript
- `npm run format` / `npm run format:check` — Prettier

## Structure

- `src/app/` — pages et routes (App Router), y compris `/api/contact` et les fichiers SEO (`sitemap.ts`, `robots.ts`, `manifest.ts`, `opengraph-image.tsx`).
- `src/components/ui/` — primitives (Button, Card, Badge, SectionHeading).
- `src/components/layout/` — Header, Footer, menu mobile.
- `src/components/sections/` — sections de la page d'accueil et de la page contact.
- `src/components/icons/` — icônes SVG et logo.
- `src/data/` — contenu du site (services, technologies, statistiques, processus, projets, témoignages, FAQ, mentions légales).
- `src/lib/site-config.ts` — configuration globale du site (coordonnées, navigation, réseaux sociaux, textes de sections).
- `src/lib/contact.ts` — schéma de validation et orchestration de l'envoi du formulaire de contact (`sendContactMessage`).
- `src/lib/email.ts` — envoi de l'email de notification via Resend.
- `src/lib/supabase.ts` — archivage des messages en base via Supabase (voir `supabase/schema.sql`).

## Référence

Voir `CLAUDE.md` (stack et étapes imposées) et `SPECS.md` (comportement détaillé et critères d'acceptation par fonctionnalité).
