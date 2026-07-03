Lis attentivement CLAUDE.md : il définit la stack, l'architecture, l'identité graphique, le contenu et les critères de validation du site HEXA.

Vérifie d'abord les versions de Node et du gestionnaire de paquets disponibles, puis initialise le projet avec la stack imposée.

Crée ensuite un fichier PLAN.md découpant le travail en étapes dans cet ordre :

1. Scaffolding Next.js 15 + TypeScript + Tailwind 4, configuration ESLint/Prettier, structure de dossiers, git init.
2. Design system : variables CSS de la palette, typographie Inter, composant Logo SVG, primitives UI (Button, Card, SectionHeading, Badge).
3. Layout : Header fixe avec effet au scroll, menu mobile, Footer complet.
4. Données : tous les fichiers de `src/data/` (services, technologies, stats, process, projets, témoignages, FAQ) et `src/lib/site-config.ts`.
5. Sections de la page d'accueil, une par une : Hero (avec fond hexagonal animé), Services (Agentique mise en avant avec son animation d'agents), Stats animées, Technologies, Processus, Réalisations, Témoignages, FAQ.
6. Page /contact : formulaire validé (zod + react-hook-form) + API route, coordonnées, carte.
7. SEO : metadata, sitemap, robots, manifest, JSON-LD, favicon, image OG.
8. Passe finale : accessibilité, responsive (360/768/1024/1440), prefers-reduced-motion, nettoyage.
9. Validation : build, tsc, lint — corriger jusqu'à ce que tout passe.

Exécute ensuite le plan étape par étape, en cochant PLAN.md et en committant après chaque étape. Ne me demande confirmation que pour une dépendance non listée dans CLAUDE.md. Ne t'arrête que lorsque les critères de validation de CLAUDE.md sont tous verts.

- Le comportement détaillé de chaque fonctionnalité est défini dans SPECS.md : c'est la référence. En cas de doute sur un comportement, applique SPECS.md ; ne termine une fonctionnalité que lorsque tous ses critères d'acceptation sont cochés.
