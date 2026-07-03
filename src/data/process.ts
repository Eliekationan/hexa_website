export interface ProcessStep {
  step: number;
  title: string;
  description: string;
}

export const processSteps: ProcessStep[] = [
  {
    step: 1,
    title: "Analyse",
    description:
      "Écoute de vos besoins, étude du contexte métier et cadrage des objectifs.",
  },
  {
    step: 2,
    title: "Conception",
    description:
      "Architecture technique, choix technologiques et découpage en jalons livrables.",
  },
  {
    step: 3,
    title: "Design",
    description:
      "Maquettes et prototypes interactifs pour valider l'expérience avant le code.",
  },
  {
    step: 4,
    title: "Développement",
    description:
      "Implémentation itérative avec revues de code et démonstrations régulières.",
  },
  {
    step: 5,
    title: "Tests & Qualité",
    description:
      "Tests automatisés, revue de sécurité et validation des critères d'acceptation.",
  },
  {
    step: 6,
    title: "Déploiement",
    description:
      "Mise en production progressive, supervision et accompagnement au lancement.",
  },
  {
    step: 7,
    title: "Maintenance",
    description:
      "Suivi continu, évolutions et support pour accompagner la croissance du produit.",
  },
];
