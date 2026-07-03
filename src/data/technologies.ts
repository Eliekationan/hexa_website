export type TechnologyCategory = "frontend" | "backend" | "database" | "cloud" | "ia";

export interface Technology {
  name: string;
  category: TechnologyCategory;
}

export const technologyCategories: { key: TechnologyCategory; label: string }[] = [
  { key: "frontend", label: "Frontend" },
  { key: "backend", label: "Backend" },
  { key: "database", label: "Bases de données" },
  { key: "cloud", label: "Cloud" },
  { key: "ia", label: "IA" },
];

export const technologies: Technology[] = [
  { name: "React", category: "frontend" },
  { name: "Next.js", category: "frontend" },
  { name: "TypeScript", category: "frontend" },
  { name: "Tailwind CSS", category: "frontend" },
  { name: "Vue.js", category: "frontend" },
  { name: "Node.js", category: "backend" },
  { name: "NestJS", category: "backend" },
  { name: "Python", category: "backend" },
  { name: "Django", category: "backend" },
  { name: "Laravel", category: "backend" },
  { name: "PostgreSQL", category: "database" },
  { name: "MongoDB", category: "database" },
  { name: "MySQL", category: "database" },
  { name: "Redis", category: "database" },
  { name: "AWS", category: "cloud" },
  { name: "Google Cloud", category: "cloud" },
  { name: "Vercel", category: "cloud" },
  { name: "Docker", category: "cloud" },
  { name: "Kubernetes", category: "cloud" },
  { name: "OpenAI API", category: "ia" },
  { name: "LangChain", category: "ia" },
  { name: "Hugging Face", category: "ia" },
  { name: "TensorFlow", category: "ia" },
];
