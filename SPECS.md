# SPECS — Spécifications fonctionnelles du site HEXA

Ce document décrit le comportement attendu de chaque fonctionnalité. Chaque section se termine par des critères d'acceptation (CA) : une fonctionnalité n'est terminée que lorsque tous ses CA sont satisfaits.

---

## F1 — Navigation

### Comportement
- Header fixe en haut de l'écran sur toutes les pages.
- État initial (scroll = 0) : fond transparent, pas de bordure.
- Dès que l'utilisateur scrolle (> 20px) : fond glassmorphism (surface semi-transparente + backdrop-blur), fine bordure basse `white/10`, transition fluide 300ms.
- Liens du menu : Services, Pourquoi HEXA, Technologies, Processus, Réalisations, FAQ, Contact. Tous sont des ancres vers les sections de la page d'accueil, sauf Contact qui pointe vers `/contact`.
- Clic sur une ancre : défilement fluide avec offset compensant la hauteur du header (la section ne doit pas être masquée par le header).
- Le lien correspondant à la section visible est mis en surbrillance (scroll-spy via IntersectionObserver).
- Bouton CTA « Prendre rendez-vous » toujours visible dans le header (desktop).

### Mobile (< 1024px)
- Menu remplacé par un bouton burger animé (transformation burger ↔ croix).
- Ouverture : panneau plein écran ou drawer avec animation d'entrée, liens en grande taille, CTA en bas.
- Fermeture au clic sur un lien, sur la croix, ou touche Échap. Scroll du body bloqué quand le menu est ouvert.

### Critères d'acceptation
- [ ] Le header change d'état au scroll dans les deux sens sans clignotement.
- [ ] Aucune section n'est masquée par le header après un clic d'ancre.
- [ ] Le menu mobile est navigable au clavier et piège le focus quand il est ouvert.
- [ ] Le scroll-spy met en surbrillance la bonne section pendant le défilement.

---

## F2 — Hero animé

### Comportement
- Fond : grille/motif hexagonal subtil + particules lumineuses + halo radial dans la palette (primaire/accent). Animations en CSS/SVG (transform et opacity uniquement), boucle infinie douce.
- Le titre, sous-titre et boutons apparaissent en cascade (stagger) au chargement.
- Bouton « Découvrir nos services » : scroll fluide vers #services. Bouton « Prendre rendez-vous » : navigation vers /contact.
- Si `prefers-reduced-motion` : particules et animations d'entrée désactivées, contenu affiché directement.

### Critères d'acceptation
- [ ] Le hero occupe ~100vh sur desktop et reste lisible sur mobile 360px sans débordement.
- [ ] L'animation de fond ne provoque aucun jank (pas de layout/paint en continu, uniquement compositor).
- [ ] Le LCP est le titre du hero (texte), pas une image.

---

## F3 — Cartes Services

### Comportement
- 5 cartes issues de `src/data/services.ts`. La carte Agentique est visuellement distincte : plus grande (span 2 colonnes sur desktop), bordure en dégradé animé, badge « Service phare ».
- Survol d'une carte : légère élévation (translateY -4px), glow de la bordure dans la couleur d'accent, icône animée. Transition 200–300ms.
- Chaque carte : icône, titre, description, liste de 4–6 mots-clés en badges.
- Carte Agentique : contient en plus l'animation d'agents — un mini-schéma SVG animé où 4–5 nœuds (agents) échangent des impulsions lumineuses le long de connexions, en boucle.

### Critères d'acceptation
- [ ] La grille passe de 3 colonnes (desktop) à 2 (tablette) à 1 (mobile) sans carte orpheline disgracieuse.
- [ ] L'animation d'agents tourne en continu sans consommer de CPU excessif et se fige si reduced-motion.
- [ ] Tout le contenu vient de `services.ts` ; changer un texte ne demande de toucher qu'à ce fichier.

---

## F4 — Statistiques animées

### Comportement
- 4 statistiques (100 %, 50+, 10+, 99 %). Les nombres comptent de 0 à leur valeur en ~1,5s la première fois qu'ils entrent dans le viewport (déclenchement unique, `once: true`).
- Suffixes (%, +) affichés sans être animés.
- Reduced-motion : valeurs affichées directement.

### Critères d'acceptation
- [ ] Le compteur ne se relance pas quand on rescrolle vers la section.
- [ ] Aucune mise en page ne bouge pendant l'animation (largeur réservée pour le nombre final).

---

## F5 — Grille Technologies

### Comportement
- Onglets ou segments par catégorie (Frontend, Backend, Bases de données, Cloud, IA). Le clic filtre la grille avec une transition animée (fade/scale des items).
- Option « Tout » affichant l'ensemble. État actif visuellement clair.
- Chaque techno : icône + nom, léger effet au survol.

### Critères d'acceptation
- [ ] Le changement de catégorie est instantané (< 100ms perçu) et animé.
- [ ] L'état des onglets est accessible (role=tablist ou boutons avec aria-pressed).

---

## F6 — Timeline Processus

### Comportement
- 7 étapes (Analyse → Maintenance) sur une ligne horizontale (desktop) ou verticale (mobile).
- Les étapes se révèlent progressivement au scroll (stagger).
- Survol/focus d'une étape : mise en avant + courte description visible (soit toujours affichée, soit révélée — choisir l'option la plus lisible et s'y tenir).
- Un trait de progression relie les étapes, animé au scroll.

### Critères d'acceptation
- [ ] La timeline est lisible et complète sur 360px sans scroll horizontal.
- [ ] Les descriptions sont accessibles au clavier (focus) et pas uniquement au survol.

---

## F7 — Galerie Réalisations avec filtres

### Comportement
- Cartes projets issues de `src/data/projects.ts` (champs : titre, catégorie, description, tags, visuel SVG/dégradé généré — pas d'images externes).
- Barre de filtres par catégorie (Web, Mobile, IA/Agentique, Conseil) + « Tous ». Filtre exclusif (un seul actif à la fois).
- Changement de filtre : les cartes sortantes/entrantes s'animent (layout animation Framer Motion).
- État vide : si une catégorie n'a aucun projet, afficher un message élégant « Projets à venir » — jamais une zone vide brute.
- Survol d'une carte : zoom léger du visuel, apparition d'un overlay avec les tags.

### Critères d'acceptation
- [ ] Le filtrage fonctionne sans rechargement ni saut de page.
- [ ] L'état vide est géré et stylé.
- [ ] Ajouter un projet = ajouter un objet dans `projects.ts`, rien d'autre.

---

## F8 — Témoignages

### Comportement
- Données dans `src/data/testimonials.ts` (nom, rôle, entreprise, citation, initiales pour l'avatar — avatars générés en SVG à partir des initiales, pas de photos).
- Desktop : grille de 3 cartes. Mobile : carrousel swipeable avec indicateurs (points).
- Défilement automatique du carrousel toutes les 6s, mis en pause au survol/touch et si reduced-motion.

### Critères d'acceptation
- [ ] Le carrousel est utilisable au doigt, au clavier (flèches) et via les points.
- [ ] L'auto-play se met en pause à l'interaction et ne reprend pas brutalement.

---

## F9 — FAQ en accordéons

### Comportement
- 6–8 questions dans `src/data/faq.ts`.
- Un seul panneau ouvert à la fois (l'ouverture d'une question ferme la précédente).
- Animation d'ouverture/fermeture fluide sur la hauteur (pas de saut), chevron qui pivote.
- Implémentation accessible : bouton avec `aria-expanded`, panneau avec `aria-hidden`/région, activable à la touche Entrée/Espace.

### Critères d'acceptation
- [ ] Aucun saut de layout à l'ouverture/fermeture.
- [ ] Entièrement utilisable au clavier avec états ARIA corrects.

---

## F10 — Formulaire de contact

### Champs et validation (zod + react-hook-form)
- `nom` : requis, 2–80 caractères.
- `email` : requis, format email valide.
- `sujet` : requis, sélection parmi : Ingénierie, Conseil, Développement Web, Développement Mobile, Agentique / IA, Autre.
- `message` : requis, 20–2000 caractères, compteur de caractères visible.
- Champ honeypot caché (anti-spam basique) : si rempli, la soumission est silencieusement ignorée côté serveur.

### Comportement
- Validation à la soumission puis en temps réel sur les champs déjà touchés. Messages d'erreur en français, sous chaque champ, avec `aria-describedby`.
- Soumission : POST vers `/api/contact` (route handler). Bouton en état loading (spinner, désactivé) pendant la requête.
- Succès : le formulaire est remplacé par un message de confirmation animé (« Message envoyé, nous revenons vers vous sous 24h ») avec option « Envoyer un autre message ».
- Échec réseau/serveur : message d'erreur non bloquant au-dessus du bouton, les données saisies sont conservées.
- Côté serveur : revalidation zod du payload (ne jamais faire confiance au client), réponse 400 si invalide, 200 sinon. L'envoi effectif passe par une unique fonction `sendContactMessage(data)` dans `src/lib/contact.ts` qui, pour l'instant, log côté serveur — c'est le seul point à modifier pour brancher un vrai provider email plus tard.
- Limitation simple : rejeter (429) plus de 5 soumissions par minute par IP (compteur en mémoire suffisant).

### Critères d'acceptation
- [ ] Impossible de soumettre un formulaire invalide ; chaque erreur est lisible et localisée.
- [ ] Le payload est revalidé côté serveur (test : un POST direct malformé reçoit un 400).
- [ ] Les états loading, succès et erreur sont tous implémentés et stylés.
- [ ] Le honeypot bloque une soumission automatisée sans affecter un utilisateur réel.

---

## F11 — Carte et coordonnées (page Contact)

### Comportement
- Bloc coordonnées : adresse, email, téléphone, horaires — tous issus de `src/lib/site-config.ts`. Email et téléphone cliquables (`mailto:`, `tel:`).
- Carte : iframe OpenStreetMap centrée sur Abidjan, chargée en lazy (`loading="lazy"`), avec un placeholder stylé pendant le chargement. Pas de clé API, pas de Google Maps.
- Liens réseaux sociaux avec icônes, ouverture dans un nouvel onglet (`rel="noopener noreferrer"`).

### Critères d'acceptation
- [ ] Changer une coordonnée ne demande de modifier que `site-config.ts`.
- [ ] La carte ne bloque pas le rendu initial de la page.

---

## F12 — Footer

### Comportement
- 4 colonnes desktop (logo + description / navigation / services / contact & réseaux), empilées sur mobile.
- Ligne basse : © année courante calculée dynamiquement, lien « Mentions légales » vers `/mentions-legales` (page simple avec contenu type éditable dans `src/data/`).

### Critères d'acceptation
- [ ] L'année est dynamique.
- [ ] La page mentions légales existe et est liée (pas de lien mort).

---

## F13 — Comportements transverses

- Toute animation d'apparition au scroll se déclenche une seule fois (`once: true`) et respecte `prefers-reduced-motion`.
- Aucune fonctionnalité ne dépend de JavaScript pour afficher son contenu essentiel (le contenu est rendu côté serveur ; JS n'ajoute que l'interactivité).
- Tous les états interactifs ont un style focus visible.
- Aucun texte de contenu en dur dans un composant : tout vient de `src/data/` ou `src/lib/site-config.ts`.
