import { SectionHeading } from "@/components/ui/SectionHeading";
import { AnimatedCounter } from "@/components/sections/AnimatedCounter";
import { stats } from "@/data/stats";
import { siteConfig } from "@/lib/site-config";

export function Stats() {
  const { eyebrow, title, description } = siteConfig.sections.stats;

  return (
    <section id="pourquoi-hexa" className="scroll-mt-24 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow={eyebrow} title={title} description={description} />

        <div className="mt-16 grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="border-border bg-surface flex flex-col items-center gap-2 rounded-2xl border px-4 py-8 text-center"
            >
              <span className="text-primary text-4xl font-semibold sm:text-5xl">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </span>
              <span className="text-muted text-sm text-pretty">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
