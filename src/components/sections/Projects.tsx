"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectCard } from "@/components/sections/ProjectCard";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site-config";
import { projects, projectCategories, type ProjectCategory } from "@/data/projects";

type FilterKey = ProjectCategory | "Tous";

export function Projects() {
  const [active, setActive] = useState<FilterKey>("Tous");
  const shouldReduceMotion = useReducedMotion();
  const { eyebrow, title, description } = siteConfig.sections.projects;

  const filtered =
    active === "Tous" ? projects : projects.filter((p) => p.category === active);
  const filters: FilterKey[] = ["Tous", ...projectCategories];

  return (
    <section id="realisations" className="scroll-mt-24 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow={eyebrow} title={title} description={description} />

        <div className="mt-12 flex flex-wrap items-center justify-center gap-2">
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              aria-pressed={active === filter}
              onClick={() => setActive(filter)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200",
                active === filter
                  ? "bg-primary text-primary-foreground"
                  : "bg-surface-2 text-muted hover:text-foreground",
              )}
            >
              {filter}
            </button>
          ))}
        </div>

        <motion.div layout={!shouldReduceMotion} className="mt-12">
          {filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="border-border bg-surface flex flex-col items-center gap-3 rounded-2xl border border-dashed px-6 py-16 text-center"
            >
              <span className="text-foreground text-lg font-semibold">
                Projets à venir
              </span>
              <p className="text-muted max-w-md text-sm text-pretty">
                Nous préparons de nouvelles réalisations dans cette catégorie. Revenez
                bientôt ou contactez-nous pour en discuter dès maintenant.
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {filtered.map((project) => (
                  <motion.div
                    key={project.slug}
                    layout={!shouldReduceMotion}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: shouldReduceMotion ? 0 : 0.25 }}
                  >
                    <ProjectCard project={project} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
