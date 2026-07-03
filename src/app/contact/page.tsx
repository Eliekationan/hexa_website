import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ContactForm } from "@/components/sections/ContactForm";
import { ContactInfo } from "@/components/sections/ContactInfo";
import { ContactMap } from "@/components/sections/ContactMap";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contactez HEXA pour discuter de votre projet d'ingénierie, de conseil, de développement web, mobile ou agentique.",
};

export default function ContactPage() {
  return (
    <main id="main-content" className="px-6 pt-32 pb-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          as="h1"
          eyebrow="Contact"
          title="Discutons de votre projet"
          description="Décrivez-nous votre besoin, nous revenons vers vous sous 24h ouvrées."
          align="left"
        />

        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-[3fr_2fr]">
          <div className="border-border bg-surface rounded-2xl border p-6 sm:p-8">
            <ContactForm />
          </div>

          <div className="flex flex-col gap-6">
            <ContactInfo />
            <ContactMap />
          </div>
        </div>
      </div>
    </main>
  );
}
