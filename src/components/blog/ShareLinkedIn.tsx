"use client";

import { useState } from "react";
import { LinkedInIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const MAX_SUMMARY_LINES = 15;

interface ShareLinkedInProps {
  url: string;
  title: string;
  excerpt: string;
  className?: string;
}

function buildCaption(title: string, excerpt: string): string {
  const lines = [title, "", excerpt, "", "👉 Lire l'article complet :"];
  return lines.slice(0, MAX_SUMMARY_LINES).join("\n");
}

// Partage en 3 actions volontairement séparées, chacune fiable pour une seule
// raison à la fois :
// - "Copier" = un simple clic synchrone pendant que la page a le focus
//   (navigator.clipboard.writeText l'exige) — jamais combiné avec l'ouverture
//   d'un onglet, qui ferait perdre ce focus et casserait la copie.
// - "Ouvrir LinkedIn" = un vrai lien <a target="_blank">, jamais un
//   window.open() scripté : les navigateurs ne bloquent pas les clics sur un
//   vrai lien comme ils bloquent parfois les popups ouverts par JavaScript.
// - LinkedIn efface tout le texte collé dès qu'un lien s'y trouve dans le
//   même geste de collage (confirmé en test réel) : la légende et le lien
//   doivent donc être copiés et collés l'un après l'autre, jamais ensemble.
export function ShareLinkedIn({ url, title, excerpt, className }: ShareLinkedInProps) {
  const [captionCopied, setCaptionCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;

  async function copy(text: string, onDone: () => void) {
    try {
      await navigator.clipboard.writeText(text);
      onDone();
    } catch {
      // Presse-papiers indisponible (permissions navigateur) : l'utilisateur
      // peut toujours copier manuellement le texte affiché ci-dessous.
    }
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <p className="text-foreground/80 text-sm font-medium">Partager sur LinkedIn</p>

      <div className="border-border-strong bg-surface-2 flex flex-col items-start gap-3 rounded-lg border p-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-foreground/60">1.</span>
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={() =>
              copy(buildCaption(title, excerpt), () => setCaptionCopied(true))
            }
          >
            <LinkedInIcon />
            {captionCopied ? "Légende copiée ✓" : "Copier la légende"}
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-foreground/60">2.</span>
          <a
            href={shareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "border-border-strong text-foreground/80 hover:border-accent/60 hover:text-accent inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
              className,
            )}
          >
            Ouvrir LinkedIn et coller la légende (Ctrl+V)
          </a>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-foreground/60">3.</span>
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={() => copy(url, () => setLinkCopied(true))}
          >
            {linkCopied ? "Lien copié ✓" : "Copier le lien"}
          </Button>
          <span className="text-foreground/60">
            puis collez-le à la fin, nouvelle ligne
          </span>
        </div>
      </div>
    </div>
  );
}
