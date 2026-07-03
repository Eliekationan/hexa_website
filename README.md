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
- `src/lib/contact.ts` — schéma de validation et envoi du formulaire de contact (`sendContactMessage` : seul point à modifier pour brancher un vrai provider email).

## Référence

Voir `CLAUDE.md` (stack et étapes imposées) et `SPECS.md` (comportement détaillé et critères d'acceptation par fonctionnalité).
