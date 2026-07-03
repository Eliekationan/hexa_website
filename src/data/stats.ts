export interface Stat {
  value: number;
  suffix: string;
  label: string;
}

export const stats: Stat[] = [
  { value: 100, suffix: "%", label: "Projets livrés dans les délais" },
  { value: 50, suffix: "+", label: "Clients accompagnés" },
  { value: 10, suffix: "+", label: "Années d'expertise cumulée" },
  { value: 99, suffix: "%", label: "Satisfaction client" },
];
