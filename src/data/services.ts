export type ServiceIcon = "engineering" | "consulting" | "web" | "mobile" | "agentic";

export interface Service {
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  icon: ServiceIcon;
  featured?: boolean;
}

export const services: Service[] = [
  {
    slug: "ingenierie",
    title: "Ingénierie logicielle",
    description:
      "Conception et industrialisation de systèmes robustes, de l'architecture au déploiement, pour des produits qui tiennent dans la durée.",
    keywords: ["Architecture", "APIs", "DevOps", "Qualité", "Scalabilité"],
    icon: "engineering",
  },
  {
    slug: "conseil",
    title: "Conseil technologique",
    description:
      "Audit, cadrage et accompagnement stratégique pour aligner vos choix technologiques sur vos objectifs métier.",
    keywords: ["Audit", "Stratégie IT", "Roadmap", "Accompagnement"],
    icon: "consulting",
  },
  {
    slug: "web",
    title: "Développement Web",
    description:
      "Sites vitrines, plateformes et applications web performantes, accessibles et pensées pour l'échelle.",
    keywords: ["Next.js", "React", "SEO", "Performance", "Accessibilité"],
    icon: "web",
  },
  {
    slug: "mobile",
    title: "Développement Mobile",
    description:
      "Applications iOS et Android natives ou cross-platform, de la maquette au déploiement sur les stores.",
    keywords: ["React Native", "iOS", "Android", "UX mobile"],
    icon: "mobile",
  },
  {
    slug: "agentique",
    title: "Agentique / IA",
    description:
      "Conception d'agents IA autonomes et de workflows augmentés par l'IA pour automatiser vos processus métier les plus complexes.",
    keywords: ["Agents IA", "LLM", "Automatisation", "RAG", "Intégration", "MCP"],
    icon: "agentic",
    featured: true,
  },
];
