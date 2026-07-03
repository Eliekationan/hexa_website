import { Logo } from "@/components/icons/Logo";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center gap-10 px-6 pt-32 pb-20">
      <Logo />
      <SectionHeading
        eyebrow="Design system"
        title="HEXA — site en construction"
        description="Aperçu temporaire des primitives UI (étape 2 du plan)."
      />
      <div className="flex flex-wrap items-center gap-4">
        <Button variant="primary">Prendre rendez-vous</Button>
        <Button variant="secondary">Découvrir nos services</Button>
        <Button variant="ghost">En savoir plus</Button>
      </div>
      <Card hoverable className="flex max-w-md flex-col gap-3">
        <p className="text-foreground">Carte exemple avec badges de mots-clés.</p>
        <div className="flex flex-wrap gap-2">
          <Badge variant="accent">Next.js</Badge>
          <Badge>TypeScript</Badge>
          <Badge variant="outline">Tailwind 4</Badge>
        </div>
      </Card>
    </main>
  );
}
