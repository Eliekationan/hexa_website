import type { ProjectType } from "@/lib/quote-schema";

export interface PricingTier {
  label: string;
  minFcfa: number;
  maxFcfa: number;
}

export interface ServicePricing {
  projectType: Exclude<ProjectType, "autre">;
  tiers: PricingTier[];
}

export const pricingGrid: ServicePricing[] = [
  {
    projectType: "web",
    tiers: [
      { label: "Site vitrine (jusqu'à ~8 pages)", minFcfa: 500_000, maxFcfa: 1_200_000 },
      { label: "Site e-commerce", minFcfa: 800_000, maxFcfa: 2_500_000 },
      {
        label: "Plateforme web / application complexe (comptes, dashboard, intégrations)",
        minFcfa: 2_500_000,
        maxFcfa: 7_000_000,
      },
    ],
  },
  {
    projectType: "mobile",
    tiers: [
      {
        label: "Application simple (MVP, une plateforme)",
        minFcfa: 1_500_000,
        maxFcfa: 3_500_000,
      },
      {
        label: "Application cross-platform complète (iOS + Android + backend)",
        minFcfa: 3_500_000,
        maxFcfa: 8_000_000,
      },
      {
        label: "Application complexe (paiement, temps réel, forte charge)",
        minFcfa: 8_000_000,
        maxFcfa: 15_000_000,
      },
    ],
  },
  {
    projectType: "ingenierie",
    tiers: [
      {
        label: "Système standard, périmètre cadré",
        minFcfa: 2_000_000,
        maxFcfa: 5_000_000,
      },
      {
        label: "Système complexe (architecture distribuée, haute disponibilité)",
        minFcfa: 5_000_000,
        maxFcfa: 15_000_000,
      },
    ],
  },
  {
    projectType: "conseil",
    tiers: [
      { label: "Audit ou cadrage ponctuel", minFcfa: 400_000, maxFcfa: 1_200_000 },
      {
        label: "Accompagnement stratégique continu",
        minFcfa: 1_200_000,
        maxFcfa: 3_000_000,
      },
    ],
  },
  {
    projectType: "agentique",
    tiers: [
      {
        label: "Agent IA simple (cas d'usage unique)",
        minFcfa: 1_500_000,
        maxFcfa: 3_500_000,
      },
      {
        label: "Système agentique complexe (multi-agents, RAG, intégrations)",
        minFcfa: 4_000_000,
        maxFcfa: 9_000_000,
      },
    ],
  },
];

export const dayRateFcfa = { minFcfa: 120_000, maxFcfa: 220_000 };

export const autrePricingNote =
  "Pour les besoins hors de ces catégories : évaluation au cas par cas selon le brief.";
