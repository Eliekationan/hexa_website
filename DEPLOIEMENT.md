# Guide de mise en production — Site HEXA

Ce document répond à trois besoins :

1. **Analyser** les architectures et offres d'hébergement possibles pour ce projet.
2. **Recommander** la solution la plus optimale en coût, avec le budget total détaillé.
3. **Servir de manuel pas-à-pas** pour réaliser la mise en production.

> Prix vérifiés en juillet 2026. Les tarifs des hébergeurs changent régulièrement — reconfirmez les chiffres sur les pages officielles avant de vous engager. Taux de change indicatif : 1 USD ≈ 575 XOF (fluctuant).

---

## Résumé exécutif

**Recommandation : [Railway](https://railway.com) (application) + [Supabase](https://supabase.com) (base de données, palier gratuit) + [Resend](https://resend.com) (email, palier gratuit).**

| Poste                                  | Coût mensuel                          |
| -------------------------------------- | ------------------------------------- |
| Hébergement application (Railway)      | ~5 $ (≈ 2 900 XOF)                    |
| Base de données (Supabase, gratuit)    | 0 $                                   |
| Email transactionnel (Resend, gratuit) | 0 $                                   |
| Nom de domaine (amorti sur l'année)    | ~1 à 2 $                              |
| **Total**                              | **~6 à 7 $/mois (≈ 3 500–4 000 XOF)** |

Pourquoi ce choix plutôt qu'une option gratuite (Cloudflare) ou « tout-en-un » (Vercel) : voir la section 1.

---

## 1. Analyse des architectures possibles

Le site est un Next.js 15 (App Router) qui produit, au build, 10 pages statiques + **une seule route dynamique** : `POST /api/contact`. Cette route contient un point important pour le choix d'architecture :

```ts
// src/app/api/contact/route.ts
const requestLog = new Map<string, { count: number; windowStart: number }>();
```

Le anti-spam (5 soumissions/minute/IP) est stocké **en mémoire, dans le processus du serveur**. C'est volontaire et suffisant pour ce projet (voir SPECS.md F10 : « compteur en mémoire suffisant »), mais ça a une conséquence directe sur le choix d'hébergement :

| Architecture                                                                                                       | Le rate-limit en mémoire fonctionne-t-il correctement ?                                            |
| ------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------- |
| **Serveur Node persistant** (Railway, Render, VPS) — un seul processus qui tourne en continu                       | ✅ Oui, tel quel, aucun changement de code                                                         |
| **Serverless** (Vercel, Netlify Functions) — chaque requête peut être traitée par une instance différente/éphémère | ⚠️ Partiellement — chaque instance a son propre compteur, la limite de 5/min devient approximative |
| **Edge distribué** (Cloudflare Workers) — des centaines d'instances isolées dans le monde                          | ❌ Non fiable — le compteur ne persiste pas entre les requêtes                                     |

Ce n'est pas un problème de sécurité critique (c'est un formulaire de contact, pas un système de paiement), mais c'est un vrai compromis technique : partir sur du serverless/edge sans adapter le code revient à perdre une partie de la protection anti-spam qu'on a délibérément construite et testée.

**Trois familles d'architecture possibles :**

### A. Plateforme serverless/edge « tout-en-un » (Vercel, Netlify, Cloudflare)

- ✅ Déploiement zéro-configuration, HTTPS automatique, CDN mondial, aperçus de branches.
- ⚠️ Rate-limit à corriger (sauf sur Netlify Functions qui, comme Vercel, reste un cas intermédiaire).
- ⚠️ Vercel : palier gratuit interdit l'usage commercial (voir §2).

### B. Serveur Node persistant en PaaS (Railway, Render)

- ✅ Le code tourne exactement comme en local (`next start`), aucune adaptation nécessaire.
- ✅ Rate-limit en mémoire fonctionne comme prévu.
- ✅ Déploiement toujours simple (connecter le dépôt GitHub, quasi zéro-configuration).
- ➖ Légèrement plus cher qu'un palier gratuit serverless, mais reste très bon marché.

### C. VPS auto-géré (Hetzner, OVH)

- ✅ Le moins cher en calcul brut (~4–6 $/mois).
- ❌ Tout est manuel : mises à jour de sécurité de l'OS, reverse proxy (Nginx/Caddy), certificats TLS, supervision du processus (PM2/systemd), pipeline de déploiement à construire soi-même.
- Pertinent seulement si vous êtes à l'aise en administration système ou prévoyez d'héberger plusieurs projets sur la même machine.

**Conclusion** : pour ce projet (site vitrine + formulaire, trafic faible à modéré, équipe qui veut « suivre un manuel » plutôt que gérer un serveur), l'option B (Railway/Render) offre le meilleur équilibre coût/fiabilité/simplicité — et évite d'avoir à retoucher le code de rate-limiting déjà testé.

---

## 2. Comparatif des hébergeurs d'application

| Hébergeur                    | Palier gratuit                                                                                                                          | Entrée payante                                                                | Adapté à ce projet tel quel ?                                                                             |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| **Railway**                  | Non (crédit d'essai limité)                                                                                                             | **5 $/mois** (usage facturé au-delà si dépassé)                               | ✅ Oui — recommandé                                                                                       |
| **Render**                   | 750h/mois mais **mise en veille après 15 min d'inactivité** (mauvais pour un site pro : premier visiteur après une pause attend ~1 min) | **7 $/mois/service** pour rester actif en permanence                          | ✅ Oui — bonne alternative                                                                                |
| **Vercel**                   | Généreux (100 Go transfert, 1M requêtes/mois) **mais usage commercial interdit par les CGU du palier Hobby**                            | **20 $/mois/utilisateur** (palier Pro, obligatoire pour un site d'entreprise) | ✅ Oui, mais 3–4× plus cher que Railway pour ce cas d'usage                                               |
| **Netlify**                  | 300 crédits/mois (système de crédits, tous les sites sont mis en pause si le quota est dépassé)                                         | **20 $/mois** (illimité en membres, 3000 crédits)                             | ✅ Oui, coût similaire à Vercel Pro                                                                       |
| **Cloudflare Pages/Workers** | Très généreux (bande passante illimitée, 100k requêtes/jour)                                                                            | 5 $/mois si besoin de plus                                                    | ⚠️ Nécessite un adaptateur (`@opennextjs/cloudflare`) + corriger le rate-limit (Cloudflare KV ou Upstash) |
| **Hetzner VPS**              | Aucun                                                                                                                                   | **~4–6 $/mois** (CX22/CAX11)                                                  | ⚠️ Fonctionne, mais ops manuelles complètes à votre charge                                                |
| **OVH VPS**                  | Aucun                                                                                                                                   | **~4–6 $/mois**                                                               | ⚠️ Idem Hetzner ; pertinent si vous préférez un acteur francophone                                        |

### Le cas Cloudflare (option « coût quasi nul »)

Si la priorité absolue est le coût (0 $/mois d'hébergement quasi garanti pour ce trafic), Cloudflare Pages est objectivement l'option la moins chère. Le compromis : il faut migrer vers l'adaptateur `@opennextjs/cloudflare` et remplacer le rate-limit en mémoire par Cloudflare KV ou par [Upstash Redis](https://upstash.com) (palier gratuit : 500 000 commandes/mois, largement suffisant, avec un module de rate-limiting prêt à l'emploi `@upstash/ratelimit`). C'est une option valable si vous êtes prêt à ce travail d'adaptation supplémentaire — dites-le-moi et je peux préparer cette migration et vous rédiger le manuel correspondant.

**Ce guide détaille la voie Railway**, la plus simple à mettre en œuvre sans toucher au code.

---

## 3. Base de données et email

### Supabase (base de données)

Palier gratuit : 500 Mo de base, 5 Go de transfert sortant, 2 projets actifs — très largement suffisant pour stocker des messages de contact (quelques Ko par message).

**Point d'attention** : un projet gratuit **se met en pause après 7 jours sans requête**. Si personne ne remplit le formulaire pendant une semaine, la prochaine tentative d'écriture échouera jusqu'à ce que vous réactiviez le projet manuellement depuis le tableau de bord Supabase.

C'est atténué par la conception déjà en place : email (Resend) et base (Supabase) sont deux canaux **indépendants** (`Promise.allSettled` dans `src/lib/contact-server.ts`). Si Supabase est en pause, l'email de notification part quand même — vous ne perdez pas le contact, seulement son archivage en base pour cette période. Si le volume augmente au point où c'est gênant, le palier Pro (25 $/mois) supprime la mise en pause et ajoute des sauvegardes automatiques (absentes du palier gratuit).

### Resend (email)

Palier gratuit : 3000 emails/mois, plafond de 100/jour, 1 domaine vérifié. Pour un formulaire de contact d'un site vitrine, ce plafond ne sera atteint que si vous recevez plus de 100 messages en une seule journée — un excellent problème à avoir, qui justifierait à ce moment-là un palier payant (20–35 $/mois).

---

## 4. Nom de domaine

⚠️ **Le code utilise actuellement `https://hexa.ci` comme domaine indicatif** (dans `src/lib/site-config.ts`, champ `url`), utilisé partout : métadonnées SEO, sitemap, JSON-LD, image Open Graph. **Il faut le remplacer par votre vrai domaine avant la mise en production** (étape 7.6 du manuel).

| Option                          | Coût indicatif                                           | Remarque                                                                                                  |
| ------------------------------- | -------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `.ci` (Côte d'Ivoire)           | ~20–30 €/an selon le registrar (ex. EuroDNS, Netim, LWS) | Pas de restriction connue à l'enregistrement ; comparez plusieurs registrars, les tarifs varient beaucoup |
| `.com` via Cloudflare Registrar | **10,44 $/an**, prix coûtant sans marge                  | Le plus économique et transparent si `.com` convient                                                      |
| `.com` via Namecheap/Spaceship  | ~10 $/an                                                 | Alternative proche                                                                                        |

Si vous n'avez pas encore de domaine, décidez d'abord entre `.ci` (ancrage local fort) et `.com` (coût minimal, portée internationale), puis achetez-le avant l'étape 7.5.

---

## 5. Budget total récapitulatif

| Poste                    | Fournisseur retenu      | Coût                                     |
| ------------------------ | ----------------------- | ---------------------------------------- |
| Hébergement application  | Railway (Hobby)         | 5 $/mois                                 |
| Base de données          | Supabase (Free)         | 0 $/mois                                 |
| Email transactionnel     | Resend (Free)           | 0 $/mois                                 |
| Nom de domaine           | À votre choix (voir §4) | ~10–30 €/an, soit ~1–2,5 $/mois amorti   |
| **Total mensuel estimé** |                         | **~6 à 7,50 $/mois (≈ 3 500–4 300 XOF)** |

À comparer aux ~21–22 $/mois (Vercel/Netlify Pro + domaine) qu'imposerait un hébergeur « tout-en-un » pour un usage commercial — soit environ 3 fois plus cher que la solution recommandée, pour un bénéfice (aperçus de branches, edge network mondial) que ce site à trafic modéré n'exploite pas vraiment.

---

## 6. Plan de mise en production (checklist)

- [ ] 6.1 Vérifier que le dépôt est poussé sur GitHub (ou GitLab/Bitbucket)
- [ ] 6.2 Créer le projet Supabase et exécuter `supabase/schema.sql`
- [ ] 6.3 Créer le compte Resend et récupérer une clé API
- [ ] 6.4 Créer le projet Railway, connecter le dépôt, renseigner les variables d'environnement
- [ ] 6.5 Acheter/configurer le nom de domaine et le pointer vers Railway
- [ ] 6.6 Mettre à jour `siteConfig.url` avec le vrai domaine, committer, laisser le redéploiement automatique se faire
- [ ] 6.7 Vérifications post-déploiement (formulaire, SEO, HTTPS, mobile)
- [ ] 6.8 Mettre en place la surveillance (uptime monitor)

Le détail de chaque étape suit.

---

## 7. Manuel pas-à-pas

### 7.1 Préparer le dépôt Git

```bash
git remote -v          # vérifier qu'un remote GitHub existe déjà
git push origin master  # pousser les commits si ce n'est pas déjà fait
```

Si le dépôt n'est pas encore sur GitHub : créez un dépôt vide sur [github.com/new](https://github.com/new) (ne pas cocher « Initialize with README »), puis :

```bash
git remote add origin https://github.com/<votre-compte>/hexa_website.git
git push -u origin master
```

Confirmez que `.env.local` n'est **jamais** poussé (il est dans `.gitignore` — vérifiez avec `git status` qu'il n'apparaît pas).

### 7.2 Créer et configurer Supabase

1. Créez un compte sur [supabase.com](https://supabase.com) et un nouveau projet (choisissez une région proche de vos utilisateurs, ex. Europe si pas de région Afrique disponible).
2. Notez le mot de passe de base de données généré (à conserver de côté, pas utilisé par l'app mais utile en cas de besoin d'accès direct).
3. Une fois le projet prêt, ouvrez **SQL Editor** (menu latéral) → **New query**, collez le contenu de `supabase/schema.sql` de ce dépôt, exécutez.
4. Allez dans **Project Settings → API** :
   - Copiez **Project URL** → ce sera `SUPABASE_URL`.
   - Copiez la clé **service_role** (⚠️ pas la clé `anon`/`public` — la `service_role` est cachée derrière une icône œil, c'est un long token qui commence par `eyJ`) → ce sera `SUPABASE_SERVICE_ROLE_KEY`.

### 7.3 Créer et configurer Resend

1. Créez un compte sur [resend.com](https://resend.com).
2. Menu **API Keys** → **Create API Key** → copiez la clé (commence par `re_`) → ce sera `RESEND_API_KEY`.
3. Pour l'adresse d'expédition :
   - **Pour tester rapidement** : utilisez `RESEND_FROM_EMAIL="HEXA <onboarding@resend.dev>"` (fonctionne sans configuration DNS, mais moins professionnel et parfois filtré en spam).
   - **Pour la production** : menu **Domains** → **Add Domain** → renseignez votre domaine (ex. `hexa.ci`) → ajoutez les enregistrements DNS (SPF, DKIM) indiqués chez votre registrar → une fois vérifié (peut prendre jusqu'à 48h), utilisez `RESEND_FROM_EMAIL="HEXA <contact@votredomaine>"`.

### 7.4 Déployer sur Railway

1. Créez un compte sur [railway.com](https://railway.com) (connexion GitHub recommandée).
2. **New Project** → **Deploy from GitHub repo** → sélectionnez `hexa_website`.
3. Railway détecte automatiquement Next.js. Vérifiez dans **Settings** du service :
   - **Build Command** : `npm run build` (par défaut)
   - **Start Command** : `npm run start` (par défaut)
4. Onglet **Variables** → ajoutez les 4 variables (valeurs récupérées aux étapes 7.2/7.3) :
   ```
   SUPABASE_URL=...
   SUPABASE_SERVICE_ROLE_KEY=...
   RESEND_API_KEY=...
   RESEND_FROM_EMAIL=HEXA <onboarding@resend.dev>
   ```
5. Railway déploie automatiquement. Suivez les logs de build dans l'onglet **Deployments** — le build doit se terminer par le même résultat que localement (`✓ Compiled successfully`, 12 routes).
6. Une URL temporaire du type `hexa-website-production.up.railway.app` est fournie — testez le site dessus avant de brancher le vrai domaine.

### 7.5 Domaine et DNS

1. Si vous n'avez pas encore de domaine, achetez-le maintenant (voir §4).
2. Dans Railway : service → **Settings → Networking → Custom Domain** → renseignez votre domaine → Railway indique un enregistrement **CNAME** à créer.
3. Chez votre registrar (là où le domaine est enregistré), ajoutez cet enregistrement CNAME (généralement dans une section « DNS » ou « Zone DNS »).
4. Attendez la propagation DNS (de quelques minutes à quelques heures). Railway émet automatiquement un certificat HTTPS dès que le DNS est détecté — aucune action manuelle sur le TLS.

### 7.6 Mettre à jour la configuration du site

Une fois le domaine actif, mettez à jour le code source :

```ts
// src/lib/site-config.ts
url: "https://votredomaine.com",  // remplacer hexa.ci par le vrai domaine
```

```bash
git add src/lib/site-config.ts
git commit -m "chore: configure le domaine de production"
git push
```

Railway redéploie automatiquement sur chaque push. Cette variable pilote à elle seule les métadonnées SEO, le sitemap, le JSON-LD et l'image Open Graph — aucun autre fichier à modifier.

### 7.7 Vérifications post-déploiement

- [ ] La page d'accueil, `/contact` et `/mentions-legales` répondent en HTTPS sans erreur.
- [ ] Soumettre le formulaire de contact sur le vrai domaine : vérifier la réception de l'email et la ligne dans Supabase (**Table Editor → contact_messages**).
- [ ] `https://votredomaine.com/sitemap.xml` et `/robots.txt` sont accessibles.
- [ ] `https://votredomaine.com/opengraph-image` affiche bien l'image de marque (utile pour les partages LinkedIn/WhatsApp).
- [ ] Tester le partage sur un [debugger LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/) ou similaire pour confirmer l'aperçu.
- [ ] Vérifier sur mobile réel (pas seulement le navigateur desktop redimensionné).

### 7.8 Surveillance et maintenance

- **Logs** : onglet **Deployments → Logs** dans Railway — c'est là qu'apparaissent les messages `[contact]`, `[email]`, `[supabase]` définis dans le code, utiles pour diagnostiquer un échec d'envoi.
- **Disponibilité** : configurez un moniteur gratuit (ex. [UptimeRobot](https://uptimerobot.com), palier gratuit) qui vérifie `https://votredomaine.com` toutes les 5 minutes et alerte par email en cas de panne.
- **Redéploiement** : chaque `git push` sur la branche connectée redéploie automatiquement. Pas d'action manuelle nécessaire.
- **Rollback** : dans Railway, onglet **Deployments**, chaque déploiement passé peut être « redéployé » en un clic pour revenir en arrière en cas de problème.
- **Pause Supabase** : si le formulaire est peu utilisé, le projet Supabase gratuit peut se mettre en pause après 7 jours d'inactivité ; réactivez-le depuis le tableau de bord Supabase le cas échéant (l'email de notification, lui, continue de fonctionner indépendamment).

---

## 8. Alternative : Render au lieu de Railway

Les étapes 7.2, 7.3, 7.5, 7.6, 7.7, 7.8 sont identiques. Seule l'étape 7.4 change :

1. Compte sur [render.com](https://render.com) → **New → Web Service** → connecter le dépôt GitHub.
2. **Build Command** : `npm run build` — **Start Command** : `npm run start`.
3. Choisir le plan **Starter** (7 $/mois) — le palier gratuit met le service en veille après 15 minutes d'inactivité, ce qui provoque un temps de chargement de ~1 minute pour le premier visiteur après une pause : à éviter pour un site vitrine professionnel.
4. Renseigner les 4 variables d'environnement dans l'onglet **Environment**.

---

## 9. Dépannage

| Symptôme                                       | Cause probable                                                            | Solution                                                                                                                     |
| ---------------------------------------------- | ------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Build échoue avec une erreur de version Node   | L'hébergeur utilise une version de Node différente                        | Vérifiez que `package.json` contient bien `"engines": { "node": ">=20.9.0" }` (déjà en place) et que l'hébergeur le respecte |
| Formulaire renvoie 200 mais aucun email reçu   | `RESEND_API_KEY` invalide ou domaine d'expédition non vérifié             | Consultez les logs (`[contact] Échec d'un canal de livraison`) ; vérifiez la clé sur resend.com/api-keys                     |
| Formulaire renvoie 200 mais rien dans Supabase | Clé `SUPABASE_SERVICE_ROLE_KEY` invalide, ou table non créée              | Relancez `supabase/schema.sql` ; re-copiez la clé `service_role` (pas `anon`)                                                |
| `429 Too Many Requests` en usage normal        | Rate-limit atteint (5/min/IP) — normal si tests répétés depuis la même IP | Attendre 1 minute, ou tester depuis un autre réseau                                                                          |
| Site inaccessible juste après le pointage DNS  | Propagation DNS en cours                                                  | Patienter (jusqu'à quelques heures), vérifier avec [dnschecker.org](https://dnschecker.org)                                  |

---

## Sources (tarifs, juillet 2026)

- [Vercel Pricing](https://vercel.com/pricing) · [Vercel Hobby Plan (usage non commercial)](https://vercel.com/docs/plans/hobby)
- [Netlify Pricing](https://www.netlify.com/pricing/)
- [Cloudflare Workers & Pages Pricing](https://www.cloudflare.com/plans/developer-platform/) · [Cloudflare Pages Functions Pricing](https://developers.cloudflare.com/pages/functions/pricing/)
- [Railway Pricing](https://railway.com/pricing) · [Railway Pricing Plans (docs)](https://docs.railway.com/pricing/plans)
- [Render Pricing](https://render.com/pricing)
- [Supabase Pricing](https://supabase.com/pricing) · [Supabase Billing docs](https://supabase.com/docs/guides/platform/billing-on-supabase)
- [Resend Pricing](https://resend.com/pricing) · [Resend account quotas](https://resend.com/docs/knowledge-base/account-quotas-and-limits)
- [Hetzner Cloud](https://www.hetzner.com/cloud) · [OVHcloud VPS Prices](https://www.ovhcloud.com/en/public-vcf-aas/prices/)
- [Cloudflare Registrar Pricing](https://cfdomainpricing.com/) · [.ci domain registration (EuroDNS)](https://www.eurodns.com/domain-extensions/ci-domain-registration)
- [Upstash Redis Pricing](https://upstash.com/pricing/redis)
