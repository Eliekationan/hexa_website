export type ProjectCategory = "Web" | "Mobile" | "IA/Agentique" | "Conseil";

export interface Project {
  slug: string;
  title: string;
  category: ProjectCategory;
  description: string;
  tags: string[];
  gradient: [string, string];
}

export const projectCategories: ProjectCategory[] = [
  "Web",
  "Mobile",
  "IA/Agentique",
  "Conseil",
];

export const projects: Project[] = [
  {
    slug: "plateforme-e-commerce",
    title: "Plateforme e-commerce B2B",
    category: "Web",
    description:
      "Refonte d'une plateforme de vente en gros avec catalogue dynamique et tarification par client.",
    tags: ["Next.js", "PostgreSQL", "Paiement"],
    gradient: ["var(--color-primary)", "var(--color-accent)"],
  },
  {
    slug: "portail-rh",
    title: "Portail RH interne",
    category: "Web",
    description:
      "Application de gestion des congés et des évaluations pour un groupe de 300 employés.",
    tags: ["React", "NestJS", "MySQL"],
    gradient: ["var(--color-accent)", "var(--color-primary)"],
  },
  {
    slug: "app-livraison",
    title: "Application de livraison",
    category: "Mobile",
    description:
      "App mobile de suivi de livraison en temps réel pour une flotte de coursiers urbains.",
    tags: ["React Native", "Géolocalisation", "Notifications"],
    gradient: ["var(--color-primary)", "var(--color-surface-2)"],
  },
  {
    slug: "app-banque-mobile",
    title: "Application bancaire mobile",
    category: "Mobile",
    description:
      "Application de banque mobile avec authentification biométrique et virements instantanés.",
    tags: ["iOS", "Android", "Sécurité"],
    gradient: ["var(--color-accent)", "var(--color-surface-2)"],
  },
  {
    slug: "assistant-support-client",
    title: "Assistant IA de support client",
    category: "IA/Agentique",
    description:
      "Agent conversationnel autonome capable de résoudre 70 % des tickets support sans intervention humaine.",
    tags: ["Agents IA", "LLM", "RAG"],
    gradient: ["var(--color-primary)", "var(--color-accent)"],
  },
  {
    slug: "automatisation-facturation",
    title: "Automatisation de la facturation",
    category: "IA/Agentique",
    description:
      "Workflow agentique qui extrait, valide et intègre automatiquement les factures fournisseurs.",
    tags: ["Automatisation", "OCR", "Intégration"],
    gradient: ["var(--color-accent)", "var(--color-primary)"],
  },
  {
    slug: "audit-architecture-cloud",
    title: "Audit d'architecture cloud",
    category: "Conseil",
    description:
      "Audit complet de l'infrastructure cloud d'une scale-up et plan de réduction des coûts de 30 %.",
    tags: ["Audit", "Cloud", "Optimisation"],
    gradient: ["var(--color-surface-2)", "var(--color-primary)"],
  },
  {
    slug: "roadmap-transformation-digitale",
    title: "Roadmap de transformation digitale",
    category: "Conseil",
    description:
      "Cadrage stratégique et feuille de route technologique sur 18 mois pour un acteur de la distribution.",
    tags: ["Stratégie", "Roadmap", "Change management"],
    gradient: ["var(--color-surface-2)", "var(--color-accent)"],
  },
];
