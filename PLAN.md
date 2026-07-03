# PLAN — Site HEXA

Environnement vérifié : Node v22.9.0, npm 10.8.3 (pas de pnpm/yarn disponible → npm utilisé).

Référence fonctionnelle : `SPECS.md` (critères d'acceptation par fonctionnalité F1–F13).
Référence process/stack : `CLAUDE.md`.

Un commit est créé après chaque étape validée (case cochée).

## Étapes

- [x] 1. Scaffolding Next.js 15 + TypeScript + Tailwind 4, ESLint/Prettier, structure de dossiers, git init.
- [x] 2. Design system : variables CSS de la palette, typographie Inter, composant Logo SVG, primitives UI (Button, Card, SectionHeading, Badge).
- [x] 3. Layout : Header fixe avec effet au scroll, menu mobile, Footer complet.
- [x] 4. Données : tous les fichiers de `src/data/` (services, technologies, stats, process, projets, témoignages, FAQ) et `src/lib/site-config.ts`.
- [x] 5. Sections de la page d'accueil, une par une : Hero (fond hexagonal animé), Services (Agentique mise en avant + animation d'agents), Stats animées, Technologies, Processus, Réalisations, Témoignages, FAQ.
- [x] 6. Page /contact : formulaire validé (zod + react-hook-form) + API route, coordonnées, carte.
- [x] 7. SEO : metadata, sitemap, robots, manifest, JSON-LD, favicon, image OG.
- [ ] 8. Passe finale : accessibilité, responsive (360/768/1024/1440), prefers-reduced-motion, nettoyage.
- [ ] 9. Validation : build, tsc, lint — corriger jusqu'à ce que tout passe (et repasser sur les CA de SPECS.md).

## Notes

- Git a été initialisé correctement dans `hexa_website/` (un `.git` vide avait été trouvé par erreur à la racine du profil Windows et a été supprimé après confirmation utilisateur).
- Aucune identité graphique (couleurs précises, contenu texte réel de l'entreprise) n'étant fournie dans CLAUDE.md/SPECS.md au-delà de « palette primaire/accent », des choix de design raisonnables seront faits et documentés au fil des étapes.
- Palette choisie (étape 2) : thème sombre unique — fond `#05060a`, surfaces `#0b0e18`/`#121629`, primaire violet-indigo `#6d5efc`, accent cyan `#22d3ee`. Tokens exposés en variables CSS (`src/app/globals.css`) et mappés via `@theme inline` pour Tailwind 4. Typographie : Inter (`next/font/google`).
- Étape 3 a nécessité d'anticiper deux fichiers de l'étape 4 (`src/lib/site-config.ts` complet, `src/data/services.ts`) car le Header et le Footer ne peuvent pas être conformes à F13 (« aucun texte en dur ») sans ces données. L'étape 4 restante couvre les fichiers de données non encore créés (technologies, stats, process, projects, testimonials, faq) ainsi que `src/data/legal.ts` (déjà créé, page `/mentions-legales` fonctionnelle).
- Layout vérifié visuellement via Playwright headless (desktop 1440px + mobile 375px) : effet de scroll du header sans bordure ni fond au repos, glassmorphism + bordure au scroll, menu mobile plein écran avec piège de focus (Tab cycle, Escape ferme, focus restauré), footer 4 colonnes avec année dynamique. Aucune erreur console.
- Étape 5 : les 8 sections ont été construites une par une (Hero, Services, Stats, Technologies, Processus, Réalisations, Témoignages, FAQ) et ajoutées dans `src/app/page.tsx`. Ajout de `siteConfig.hero` et `siteConfig.sections.*` pour garder tout le texte des titres de section hors des composants (F13). Chaque section vérifiée individuellement via Playwright headless (desktop/tablette/mobile, hover, clavier, reduced-motion) puis passe complète sur 360/768/1024/1440 sans overflow horizontal, scroll-spy fonctionnel sur toutes les sections, 0 erreur console.
- Bug détecté et corrigé pendant la vérification : `useReducedMotion()` (framer-motion) est résolu de façon synchrone côté client mais vaut `null`/`false` au premier rendu serveur, donc brancher directement les valeurs `initial`/`exit` des `motion.div` dessus (Technologies, Projects, Process) provoquait un hydration mismatch React. Correctif : `initial`/`exit` restent des valeurs constantes, seule la durée de la `transition` est mise à 0 en reduced-motion.
- Étape 6 : schéma zod partagé + `sendContactMessage` (log serveur uniquement, seul point à changer pour un vrai provider email) dans `src/lib/contact.ts` ; route `POST /api/contact` avec revalidation zod, honeypot (ignoré silencieusement, réponse 200), rate limiting en mémoire (5 req/min/IP → 429) ; formulaire RHF + zodResolver avec états idle/loading/success/error et compteur de caractères ; page `/contact` avec coordonnées (site-config.ts), réseaux sociaux et carte OpenStreetMap lazy-loadée avec placeholder. Vérifié : POST direct malformé → 400 avec messages par champ, honeypot → 200 sans envoi réel, 6e requête/minute → 429, formulaire testé dans le navigateur (erreurs de validation, chargement, succès, reset). Build/lint/type-check OK.
- Étape 7 : metadata racine enrichie (title template `%s — HEXA`, OpenGraph, Twitter card, canonical, metadataBase depuis `siteConfig.url`), JSON-LD `Organization` injecté dans le layout, `sitemap.ts` (/, /contact, /mentions-legales), `robots.ts` (autorise tout sauf /api/), `manifest.ts`, favicon `icon.svg` (hexagone de marque, remplace le favicon.ico générique de create-next-app) et image OG dynamique (`opengraph-image.tsx` via next/og, prérendue statiquement). Bug corrigé : les pages `/contact` et `/mentions-legales` fixaient leur propre `— HEXA` en plus du template racine, produisant un titre dupliqué (« Contact — HEXA — HEXA ») ; corrigé en ne mettant que le nom de la page dans `title`. Vérifié via requêtes directes : sitemap.xml, robots.txt, manifest.webmanifest, icon.svg, opengraph-image (PNG 1200×630) et JSON-LD tous corrects ; titres de page corrects après correction.
