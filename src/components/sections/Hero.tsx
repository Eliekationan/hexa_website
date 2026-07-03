import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/lib/site-config";
import { HeroBackground } from "@/components/sections/HeroBackground";

export function Hero() {
  const { title, subtitle, primaryCta, secondaryCta } = siteConfig.hero;

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden">
      <HeroBackground />

      <div className="relative mx-auto flex max-w-4xl flex-col items-center px-6 pt-24 text-center">
        <h1
          className="animate-hexa-fade-up text-foreground text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl"
          style={{ animationDelay: "0.05s" }}
        >
          {title}
        </h1>
        <p
          className="animate-hexa-fade-up text-muted mt-6 max-w-2xl text-lg text-pretty"
          style={{ animationDelay: "0.2s" }}
        >
          {subtitle}
        </p>
        <div
          className="animate-hexa-fade-up mt-10 flex flex-wrap items-center justify-center gap-4"
          style={{ animationDelay: "0.35s" }}
        >
          <Button href={primaryCta.href} size="lg">
            {primaryCta.label}
          </Button>
          <Button href={secondaryCta.href} variant="secondary" size="lg">
            {secondaryCta.label}
          </Button>
        </div>
      </div>
    </section>
  );
}
