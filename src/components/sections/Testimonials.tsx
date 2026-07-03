"use client";

import { useEffect, useRef, useState } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TestimonialCard } from "@/components/sections/TestimonialCard";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site-config";
import { testimonials } from "@/data/testimonials";

const AUTOPLAY_INTERVAL = 6000;
const RESUME_DELAY = 5000;

export function Testimonials() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const resumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { eyebrow, title } = siteConfig.sections.testimonials;

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion || paused) return;

    const interval = setInterval(() => {
      setIndex((current) => (current + 1) % testimonials.length);
    }, AUTOPLAY_INTERVAL);

    return () => clearInterval(interval);
  }, [paused]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const slide = track.children[index] as HTMLElement | undefined;
    if (!slide) return;
    // Scroll only the carousel track itself (not scrollIntoView, which would
    // also scroll the whole page if the carousel is currently off-screen).
    track.scrollTo({ left: slide.offsetLeft, behavior: "smooth" });
  }, [index]);

  function handleInteractionStart() {
    setPaused(true);
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
  }

  function handleInteractionEnd() {
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = setTimeout(() => setPaused(false), RESUME_DELAY);
  }

  function goTo(nextIndex: number) {
    handleInteractionStart();
    setIndex((nextIndex + testimonials.length) % testimonials.length);
    handleInteractionEnd();
  }

  return (
    <section id="temoignages" className="scroll-mt-24 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow={eyebrow} title={title} />

        <div className="mt-16 hidden gap-6 sm:grid sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.name} testimonial={testimonial} />
          ))}
        </div>

        <div className="mt-16 sm:hidden">
          <div
            ref={trackRef}
            role="group"
            aria-label="Témoignages clients"
            tabIndex={0}
            onMouseEnter={handleInteractionStart}
            onMouseLeave={handleInteractionEnd}
            onTouchStart={handleInteractionStart}
            onTouchEnd={handleInteractionEnd}
            onKeyDown={(event) => {
              if (event.key === "ArrowRight") goTo(index + 1);
              if (event.key === "ArrowLeft") goTo(index - 1);
            }}
            className="flex snap-x snap-mandatory [scrollbar-width:none] gap-4 overflow-x-auto scroll-smooth pb-2 motion-reduce:scroll-auto"
          >
            {testimonials.map((testimonial) => (
              <div key={testimonial.name} className="w-full shrink-0 snap-center">
                <TestimonialCard testimonial={testimonial} />
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-center gap-2">
            {testimonials.map((testimonial, dotIndex) => (
              <button
                key={testimonial.name}
                type="button"
                onClick={() => goTo(dotIndex)}
                aria-label={`Aller au témoignage ${dotIndex + 1}`}
                aria-current={dotIndex === index}
                className={cn(
                  "h-2.5 rounded-full transition-all duration-200",
                  dotIndex === index ? "bg-accent w-6" : "bg-surface-2 w-2.5",
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
