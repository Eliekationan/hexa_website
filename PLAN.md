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
- [x] 8. Passe finale : accessibilité, responsive (360/768/1024/1440), prefers-reduced-motion, nettoyage.
- [x] 9. Validation : build, tsc, lint — corriger jusqu'à ce que tout passe (et repasser sur les CA de SPECS.md).

## Notes

- Git a été initialisé correctement dans `hexa_website/` (un `.git` vide avait été trouvé par erreur à la racine du profil Windows et a été supprimé après confirmation utilisateur).
- Aucune identité graphique (couleurs précises, contenu texte réel de l'entreprise) n'étant fournie dans CLAUDE.md/SPECS.md au-delà de « palette primaire/accent », des choix de design raisonnables seront faits et documentés au fil des étapes.
- Palette choisie (étape 2) : thème sombre unique — fond `#05060a`, surfaces `#0b0e18`/`#121629`, primaire violet-indigo `#6d5efc` (ajusté en `#5c4fe0` à l'étape 8 pour le contraste), accent cyan `#22d3ee`. Tokens exposés en variables CSS (`src/app/globals.css`) et mappés via `@theme inline` pour Tailwind 4. Typographie : Inter (`next/font/google`).
- Étape 3 a nécessité d'anticiper deux fichiers de l'étape 4 (`src/lib/site-config.ts` complet, `src/data/services.ts`) car le Header et le Footer ne peuvent pas être conformes à F13 (« aucun texte en dur ») sans ces données. L'étape 4 restante couvre les fichiers de données non encore créés (technologies, stats, process, projects, testimonials, faq) ainsi que `src/data/legal.ts` (déjà créé, page `/mentions-legales` fonctionnelle).
- Layout vérifié visuellement via Playwright headless (desktop 1440px + mobile 375px) : effet de scroll du header sans bordure ni fond au repos, glassmorphism + bordure au scroll, menu mobile plein écran avec piège de focus (Tab cycle, Escape ferme, focus restauré), footer 4 colonnes avec année dynamique. Aucune erreur console.
- Étape 5 : les 8 sections ont été construites une par une (Hero, Services, Stats, Technologies, Processus, Réalisations, Témoignages, FAQ) et ajoutées dans `src/app/page.tsx`. Ajout de `siteConfig.hero` et `siteConfig.sections.*` pour garder tout le texte des titres de section hors des composants (F13). Chaque section vérifiée individuellement via Playwright headless (desktop/tablette/mobile, hover, clavier, reduced-motion) puis passe complète sur 360/768/1024/1440 sans overflow horizontal, scroll-spy fonctionnel sur toutes les sections, 0 erreur console.
- Bug détecté et corrigé pendant la vérification : `useReducedMotion()` (framer-motion) est résolu de façon synchrone côté client mais vaut `null`/`false` au premier rendu serveur, donc brancher directement les valeurs `initial`/`exit` des `motion.div` dessus (Technologies, Projects, Process) provoquait un hydration mismatch React. Correctif : `initial`/`exit` restent des valeurs constantes, seule la durée de la `transition` est mise à 0 en reduced-motion.
- Étape 6 : schéma zod partagé + `sendContactMessage` (log serveur uniquement, seul point à changer pour un vrai provider email) dans `src/lib/contact.ts` ; route `POST /api/contact` avec revalidation zod, honeypot (ignoré silencieusement, réponse 200), rate limiting en mémoire (5 req/min/IP → 429) ; formulaire RHF + zodResolver avec états idle/loading/success/error et compteur de caractères ; page `/contact` avec coordonnées (site-config.ts), réseaux sociaux et carte OpenStreetMap lazy-loadée avec placeholder. Vérifié : POST direct malformé → 400 avec messages par champ, honeypot → 200 sans envoi réel, 6e requête/minute → 429, formulaire testé dans le navigateur (erreurs de validation, chargement, succès, reset). Build/lint/type-check OK.
- Étape 7 : metadata racine enrichie (title template `%s — HEXA`, OpenGraph, Twitter card, canonical, metadataBase depuis `siteConfig.url`), JSON-LD `Organization` injecté dans le layout, `sitemap.ts` (/, /contact, /mentions-legales), `robots.ts` (autorise tout sauf /api/), `manifest.ts`, favicon `icon.svg` (hexagone de marque, remplace le favicon.ico générique de create-next-app) et image OG dynamique (`opengraph-image.tsx` via next/og, prérendue statiquement). Bug corrigé : les pages `/contact` et `/mentions-legales` fixaient leur propre `— HEXA` en plus du template racine, produisant un titre dupliqué (« Contact — HEXA — HEXA ») ; corrigé en ne mettant que le nom de la page dans `title`. Vérifié via requêtes directes : sitemap.xml, robots.txt, manifest.webmanifest, icon.svg, opengraph-image (PNG 1200×630) et JSON-LD tous corrects ; titres de page corrects après correction.
- Étape 8 : audit de contraste WCAG calculé précisément (script de vérification) sur toutes les paires texte/fond de la palette ; le seul point limite était le texte blanc sur `primary` (4.51:1, à la limite des 4.5:1 AA pour du texte normal, utilisé par les boutons et badges actifs) — primaire ajusté de `#6d5efc` à `#5c4fe0` (contraste blanc → 5.75:1), répercuté partout (`globals.css`, `icon.svg`, `opengraph-image.tsx`). Bug trouvé et corrigé : la page `/contact` n'avait aucun `<h1>` (son titre passait par `SectionHeading`, qui rend toujours un `<h2>`) ; ajout d'une prop `as` à `SectionHeading` pour permettre `as="h1"`. Ajout d'un lien d'évitement (« Aller au contenu principal ») ciblant `id="main-content"` sur le `<main>` de chaque page. Repasse complète des 3 pages (/, /contact, /mentions-legales) × 4 largeurs (360/768/1024/1440) et en reduced-motion : 0 débordement horizontal, exactement un `<h1>` par page, 0 erreur console. README.md réécrit pour décrire le projet HEXA (remplace le README générique de create-next-app) ; aucun `console.log`/TODO résiduel hors du point d'envoi volontaire dans `contact.ts`.
- Étape 9 (validation finale) : `npx prettier --check`, `npm run lint`, `npm run type-check` et `npm run build` passent tous sans erreur ni avertissement. Trois critères d'acceptation de SPECS.md non encore testés explicitement ont été vérifiés avant de cocher les cases : clic sur une ancre du header ne masque pas la section visée (vérifié position réelle vs hauteur du header), la carte de statistique ne bouge pas pendant le comptage (bounding box identique à trois instants), navigation clavier flèches gauche/droite du carrousel témoignages mobile. Toutes les 31 cases à cocher de `SPECS.md` (F1–F13) sont désormais cochées. Fumée finale sur le build de production réel (`npm run build` + `npm run start`, pas seulement `next dev`) : les 3 pages répondent 200 sans erreur console, et le parcours complet du formulaire de contact (remplissage → envoi → confirmation) fonctionne de bout en bout.

## Critères de validation (CLAUDE.md)

- `npm run build` : ✅ succès, 12 routes générées (dont 10 statiques, `/api/contact` et `/opengraph-image`… en fait `/opengraph-image` est statique, seule `/api/contact` est dynamique).
- `npm run type-check` (`tsc --noEmit`) : ✅ aucune erreur.
- `npm run lint` (ESLint) : ✅ aucune erreur ni avertissement.
- Tous les critères d'acceptation de `SPECS.md` (F1–F13) : ✅ cochés et vérifiés (voir notes étape par étape ci-dessus).

Le site est fonctionnellement complet selon CLAUDE.md et SPECS.md.
