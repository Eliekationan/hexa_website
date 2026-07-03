"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  WebIcon,
  EngineeringIcon,
  DatabaseIcon,
  CloudIcon,
  AgenticIcon,
  type IconProps,
} from "@/components/icons";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site-config";
import {
  technologies,
  technologyCategories,
  type TechnologyCategory,
} from "@/data/technologies";

const categoryIcon: Record<TechnologyCategory, (props: IconProps) => React.ReactElement> =
  {
    frontend: WebIcon,
    backend: EngineeringIcon,
    database: DatabaseIcon,
    cloud: CloudIcon,
    ia: AgenticIcon,
  };

type FilterKey = TechnologyCategory | "all";

export function Technologies() {
  const [active, setActive] = useState<FilterKey>("all");
  const shouldReduceMotion = useReducedMotion();
  const { eyebrow, title, description } = siteConfig.sections.technologies;

  const filtered =
    active === "all"
      ? technologies
      : technologies.filter((tech) => tech.category === active);

  const filters: { key: FilterKey; label: string }[] = [
    { key: "all", label: "Tout" },
    ...technologyCategories.map((category) => ({
      key: category.key,
      label: category.label,
    })),
  ];

  return (
    <section id="technologies" className="scroll-mt-24 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow={eyebrow} title={title} description={description} />

        <div
          role="tablist"
          aria-label="Filtrer les technologies par catégorie"
          className="mt-12 flex flex-wrap items-center justify-center gap-2"
        >
          {filters.map((filter) => (
            <button
              key={filter.key}
              type="button"
              role="tab"
              aria-selected={active === filter.key}
              onClick={() => setActive(filter.key)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200",
                active === filter.key
                  ? "bg-primary text-primary-foreground"
                  : "bg-surface-2 text-muted hover:text-foreground",
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <motion.div
          layout={!shouldReduceMotion}
          className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((tech) => {
              const Icon = categoryIcon[tech.category];
              return (
                <motion.div
                  key={tech.name}
                  layout={!shouldReduceMotion}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
                  className="border-border bg-surface hover:border-accent/40 hover:text-accent flex flex-col items-center gap-2 rounded-xl border px-4 py-5 text-center transition-colors duration-200"
                >
                  <Icon width={22} height={22} />
                  <span className="text-sm font-medium">{tech.name}</span>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
