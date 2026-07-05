# PLAN — Blog HEXA

Branche : `feature/blog` (créée à partir de `main`). Commits après chaque étape validée, **aucun push** (règle explicite de l'utilisateur).

Objectif : publier un article par jour pour générer du trafic organique. Stockage des articles dans Supabase (déjà utilisé pour `contact_messages`), rédaction assistée par IA via une interface d'administration protégée, publication manuelle (l'IA prépare des brouillons, jamais de publication automatique sans relecture).

## Étapes

- [ ] 1. Modèle de données : migration `supabase/migrations/xxx_blog.sql` créant la table `blog_posts` (slug, title, excerpt, content markdown, cover_image_url, tags, status draft/published, published_at, seo_title, seo_description, created_at, updated_at) + RLS (lecture publique des articles publiés uniquement, écriture réservée à la clé service_role).
- [ ] 2. Authentification admin : Supabase Auth (email/password, compte unique), middleware Next.js protégeant `/admin/**`, page de connexion.
- [ ] 3. Interface d'administration : `/admin/blog` (liste brouillons/publiés), création/édition/suppression, éditeur markdown avec prévisualisation (react-hook-form + zod).
- [ ] 4. Génération IA de brouillons : route API appelant l'API Claude (Anthropic) pour produire titre + extrait + contenu + tags à partir d'un sujet donné ; bouton dédié dans l'éditeur, résultat toujours en statut `draft`.
- [ ] 5. Automatisation quotidienne (optionnelle) : Vercel Cron générant chaque jour un brouillon à partir d'une liste de sujets SEO prédéfinis, laissé en `draft` pour relecture — jamais publié automatiquement.
- [ ] 6. Pages publiques : `/blog` (liste paginée, filtres par tag), `/blog/[slug]` (article rendu, temps de lecture, articles liés), lien Blog dans Header/Footer.
- [ ] 7. SEO : metadata dynamique par article, `sitemap.ts` mis à jour (articles publiés), JSON-LD `BlogPosting`, image OG dynamique par article, flux RSS.
- [ ] 8. Validation : build, tsc, lint — corriger jusqu'à ce que tout passe ; test manuel de bout en bout (générer un brouillon IA → relire → publier → vérifier `/blog`, sitemap, JSON-LD).

## Dépendances nouvelles (validées avec l'utilisateur)

- `react-markdown` + `remark-gfm` (rendu markdown)
- `@supabase/ssr` (session Auth côté App Router)
- `reading-time` (temps de lecture)
- Clé API Anthropic (`ANTHROPIC_API_KEY`) pour la génération de brouillons

## Notes

- Aucun `git push` ne sera exécuté à aucune étape ; les commits restent locaux sur `feature/blog` jusqu'à instruction contraire de l'utilisateur.
