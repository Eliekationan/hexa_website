export interface LegalSection {
  title: string;
  content: string[];
}

export const legalSections: LegalSection[] = [
  {
    title: "Éditeur du site",
    content: [
      "HEXA SARL, société de droit ivoirien, immatriculée au Registre du Commerce et du Crédit Mobilier d'Abidjan.",
      "Siège social : Rue des Jardins, Cocody, Abidjan, Côte d'Ivoire.",
      "Contact : contact@hexa.ci",
    ],
  },
  {
    title: "Directeur de la publication",
    content: ["La direction de HEXA SARL est responsable de la publication du site."],
  },
  {
    title: "Hébergement",
    content: [
      "Ce site est hébergé par un prestataire d'hébergement cloud garantissant la disponibilité et la sécurité des données hébergées.",
    ],
  },
  {
    title: "Propriété intellectuelle",
    content: [
      "L'ensemble des contenus présents sur ce site (textes, visuels, logos, éléments graphiques) est la propriété exclusive de HEXA SARL, sauf mention contraire, et ne peut être reproduit sans autorisation préalable.",
    ],
  },
  {
    title: "Données personnelles",
    content: [
      "Les informations transmises via le formulaire de contact sont utilisées exclusivement pour répondre à votre demande et ne sont ni cédées ni transmises à des tiers.",
    ],
  },
];
