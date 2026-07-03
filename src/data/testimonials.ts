export interface Testimonial {
  name: string;
  role: string;
  company: string;
  quote: string;
  initials: string;
}

export const testimonials: Testimonial[] = [
  {
    name: "Awa Kouassi",
    role: "Directrice des opérations",
    company: "Ivoire Distribution",
    quote:
      "HEXA a transformé notre gestion logistique avec une plateforme fiable livrée dans les délais. Une équipe rigoureuse et à l'écoute.",
    initials: "AK",
  },
  {
    name: "Moussa Diabaté",
    role: "CTO",
    company: "Fintech Baobab",
    quote:
      "Le conseil technique de HEXA nous a permis de réduire nos coûts cloud de 30 % tout en fiabilisant notre architecture.",
    initials: "MD",
  },
  {
    name: "Fatou N'Guessan",
    role: "Fondatrice",
    company: "Marché Express",
    quote:
      "L'application mobile développée par HEXA a doublé notre taux de commandes en trois mois. Un vrai partenaire de croissance.",
    initials: "FN",
  },
  {
    name: "Yves Assouan",
    role: "Responsable innovation",
    company: "Groupe Atlantique",
    quote:
      "Leur agent IA de support client gère aujourd'hui la majorité de nos demandes de premier niveau, avec un temps de réponse divisé par cinq.",
    initials: "YA",
  },
  {
    name: "Sarah Bamba",
    role: "DRH",
    company: "Cocody Industries",
    quote:
      "Un accompagnement sur-mesure, de l'analyse au déploiement, avec une vraie capacité d'écoute de nos contraintes internes.",
    initials: "SB",
  },
];
