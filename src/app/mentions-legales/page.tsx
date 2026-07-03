import type { Metadata } from "next";
import { legalSections } from "@/data/legal";

export const metadata: Metadata = {
  title: "Mentions légales",
  description:
    "Mentions légales du site HEXA : éditeur, hébergement, propriété intellectuelle et données personnelles.",
};

export default function MentionsLegalesPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 pt-32 pb-24">
      <h1 className="text-foreground text-4xl font-semibold tracking-tight">
        Mentions légales
      </h1>
      <div className="mt-10 flex flex-col gap-8">
        {legalSections.map((section) => (
          <section key={section.title}>
            <h2 className="text-foreground text-xl font-semibold">{section.title}</h2>
            <div className="text-muted mt-3 flex flex-col gap-2 text-sm leading-relaxed">
              {section.content.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
