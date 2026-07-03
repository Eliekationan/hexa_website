# PLAN — Site HEXA

Environnement vérifié : Node v22.9.0, npm 10.8.3 (pas de pnpm/yarn disponible → npm utilisé).

Référence fonctionnelle : `SPECS.md` (critères d'acceptation par fonctionnalité F1–F13).
Référence process/stack : `CLAUDE.md`.

Un commit est créé après chaque étape validée (case cochée).

## Étapes

- [x] 1. Scaffolding Next.js 15 + TypeScript + Tailwind 4, ESLint/Prettier, structure de dossiers, git init.
- [x] 2. Design system : variables CSS de la palette, typographie Inter, composant Logo SVG, primitives UI (Button, Card, SectionHeading, Badge).
- [x] 3. Layout : Header fixe avec effet au scroll, menu mobile, Footer complet.
- [ ] 4. Données : tous les fichiers de `src/data/` (services, technologies, stats, process, projets, témoignages, FAQ) et `src/lib/site-config.ts`.
- [ ] 5. Sections de la page d'accueil, une par une : Hero (fond hexagonal animé), Services (Agentique mise en avant + animation d'agents), Stats animées, Technologies, Processus, Réalisations, Témoignages, FAQ.
- [ ] 6. Page /contact : formulaire validé (zod + react-hook-form) + API route, coordonnées, carte.
- [ ] 7. SEO : metadata, sitemap, robots, manifest, JSON-LD, favicon, image OG.
- [ ] 8. Passe finale : accessibilité, responsive (360/768/1024/1440), prefers-reduced-motion, nettoyage.
- [ ] 9. Validation : build, tsc, lint — corriger jusqu'à ce que tout passe (et repasser sur les CA de SPECS.md).

## Notes

- Git a été initialisé correctement dans `hexa_website/` (un `.git` vide avait été trouvé par erreur à la racine du profil Windows et a été supprimé après confirmation utilisateur).
- Aucune identité graphique (couleurs précises, contenu texte réel de l'entreprise) n'étant fournie dans CLAUDE.md/SPECS.md au-delà de « palette primaire/accent », des choix de design raisonnables seront faits et documentés au fil des étapes.
- Palette choisie (étape 2) : thème sombre unique — fond `#05060a`, surfaces `#0b0e18`/`#121629`, primaire violet-indigo `#6d5efc`, accent cyan `#22d3ee`. Tokens exposés en variables CSS (`src/app/globals.css`) et mappés via `@theme inline` pour Tailwind 4. Typographie : Inter (`next/font/google`).
- Étape 3 a nécessité d'anticiper deux fichiers de l'étape 4 (`src/lib/site-config.ts` complet, `src/data/services.ts`) car le Header et le Footer ne peuvent pas être conformes à F13 (« aucun texte en dur ») sans ces données. L'étape 4 restante couvre les fichiers de données non encore créés (technologies, stats, process, projects, testimonials, faq) ainsi que `src/data/legal.ts` (déjà créé, page `/mentions-legales` fonctionnelle).
- Layout vérifié visuellement via Playwright headless (desktop 1440px + mobile 375px) : effet de scroll du header sans bordure ni fond au repos, glassmorphism + bordure au scroll, menu mobile plein écran avec piège de focus (Tab cycle, Escape ferme, focus restauré), footer 4 colonnes avec année dynamique. Aucune erreur console.
