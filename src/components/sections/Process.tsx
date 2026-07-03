"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { processSteps } from "@/data/process";
import { siteConfig } from "@/lib/site-config";

export function Process() {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const { eyebrow, title, description } = siteConfig.sections.process;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.8", "end 0.4"],
  });

  return (
    <section id="processus" className="scroll-mt-24 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow={eyebrow} title={title} description={description} />

        <div ref={containerRef} className="relative mt-16">
          <div className="border-border absolute top-5 bottom-0 left-5 w-px border-l lg:top-5 lg:right-5 lg:bottom-auto lg:left-5 lg:h-px lg:w-auto lg:border-t lg:border-l-0" />
          <motion.div
            className="bg-accent absolute top-5 bottom-0 left-5 w-px origin-top lg:top-5 lg:right-5 lg:bottom-auto lg:left-5 lg:h-px lg:w-auto lg:origin-left"
            style={{ scaleY: scrollYProgress, scaleX: scrollYProgress }}
          />

          <ol className="relative flex flex-col gap-10 lg:flex-row lg:justify-between lg:gap-4">
            {processSteps.map((step, index) => (
              <motion.li
                key={step.step}
                className="relative flex gap-4 pl-0 lg:flex-1 lg:flex-col lg:gap-4 lg:pl-0 lg:text-center"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{
                  duration: shouldReduceMotion ? 0 : 0.5,
                  delay: shouldReduceMotion ? 0 : index * 0.08,
                }}
              >
                <span className="bg-primary text-primary-foreground border-background relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-4 text-sm font-semibold lg:mx-auto">
                  {step.step}
                </span>
                <div className="focus-within:text-accent group flex-1" tabIndex={0}>
                  <h3 className="text-foreground text-base font-semibold">
                    {step.title}
                  </h3>
                  <p className="text-muted mt-1 text-sm text-pretty">
                    {step.description}
                  </p>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
