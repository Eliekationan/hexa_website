# PLAN — Blog HEXA

Branche : `feature/blog` (créée à partir de `main`). Commits après chaque étape validée, **aucun push** (règle explicite de l'utilisateur).

Objectif : publier un article par jour pour générer du trafic organique. Stockage des articles dans Supabase (déjà utilisé pour `contact_messages`), rédaction assistée par IA via une interface d'administration protégée, publication manuelle (l'IA prépare des brouillons, jamais de publication automatique sans relecture).

## Étapes

- [x] 1. Modèle de données : table `blog_posts` ajoutée à `supabase/schema.sql` (slug, title, excerpt, content markdown, cover_image_url, tags, status draft/published, published_at, seo_title, seo_description, created_at, updated_at) + RLS (lecture publique des articles publiés uniquement ; écriture toujours via service_role, comme `contact_messages`) ; `src/lib/blog.ts` (types + CRUD serveur : `getPublishedPosts`, `getPublishedPostBySlug`, `getAllPostsAdmin`, `getPostByIdAdmin`, `createPost`, `updatePost`, `deletePost`, `generateUniqueSlug`).
- [x] 2. Authentification admin : Supabase Auth (email/password, compte unique), middleware Next.js protégeant `/admin/**`, page de connexion.
- [x] 3. Interface d'administration : `/admin/blog` (liste brouillons/publiés), création/édition/suppression, éditeur markdown avec prévisualisation (react-hook-form + zod).
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
- Étape 2 : `@supabase/ssr` ajouté. `src/lib/auth/server.ts` (client lié aux cookies, Server Components/Actions) et `src/lib/auth/middleware.ts` (rafraîchissement de session + redirection) sont distincts de `src/lib/supabase.ts` (clé service_role, sans session, utilisé par le CRUD du blog). `middleware.ts` protège `/admin/:path*`. Route group `src/app/admin/(dashboard)/` pour le chrome (nav + déconnexion), page `/admin/login` en dehors du groupe. `export const dynamic = "force-dynamic"` posé sur le layout du dashboard : sans ça, `next build` tente de prérendre `/admin/blog` statiquement et échoue si les variables d'env Supabase Auth ne sont pas encore configurées.
  - Un serveur `next dev` laissé tournant d'une session précédente (PID trouvé via `netstat`, port 3000) bloquait `.next/trace` et faisait échouer/pendre `npm run build` ; arrêté après confirmation de l'utilisateur.
  - Non vérifié en conditions réelles : `.env.local` a `SUPABASE_URL`/`SUPABASE_SERVICE_ROLE_KEY` (contact) mais pas encore `NEXT_PUBLIC_SUPABASE_URL`/`NEXT_PUBLIC_SUPABASE_ANON_KEY`, et aucun compte admin n'existe dans Supabase Auth. **Action utilisateur requise avant de pouvoir se connecter** : renseigner ces deux variables (clé anon, project settings > API) et créer un utilisateur dans Authentication > Users du dashboard Supabase. build/tsc/lint vérifiés verts, mais le flux de connexion complet n'a pas pu être testé de bout en bout faute de credentials.
  - Bug de sécurité trouvé et corrigé pendant le test manuel (`npm run build && npm run start` + `curl`) : le middleware laissait passer toute requête vers `/admin/**` sans redirection quand l'auth n'était pas configurée (pensé comme un confort de dev local, mais ça exposerait `/admin` sans protection si les variables d'env manquaient en production). Corrigé pour rediriger vers `/admin/login` dans ce cas, comme pour un utilisateur non connecté.
  - Bug trouvé et corrigé pendant le même test : `middleware.ts` avait été créé à la racine du repo au lieu de `src/middleware.ts` — avec un dossier `src/`, Next.js ignore silencieusement un middleware placé à la racine (aucune erreur, mais aucune protection non plus). Déplacé dans `src/`, confirmé par l'apparition de la ligne `ƒ Middleware` dans la sortie de `next build` (absente avant la correction) et par un test réel : `curl /admin/blog` répond désormais `307 -> /admin/login` tant qu'aucune session n'existe.
- Étape 3 : `react-markdown`/`remark-gfm`/`reading-time` ajoutés. `src/lib/blog-schema.ts` (zod partagé, `parseTags`), `src/app/admin/(dashboard)/blog/actions.ts` (Server Actions `createPostAction`/`updatePostAction`/`deletePostAction`, chacune vérifiant `getAdminUser()` avant d'écrire, `revalidatePath` sur `/admin/blog` et `/blog`), `PostForm.tsx` (RHF + zodResolver, bascule édition/prévisualisation Markdown), `DeletePostButton.tsx` (confirmation en deux temps), pages liste/`new`/`[id]/edit`. Classe utilitaire `.markdown-preview` ajoutée à `globals.css` (pas de plugin `@tailwindcss/typography`, réutilisable pour les pages publiques à l'étape 6).
