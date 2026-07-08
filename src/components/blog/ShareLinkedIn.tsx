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

// LinkedIn efface tout le texte collé dès qu'un lien se trouve dans le même
// geste de collage (confirmé en test réel) : coller "légende + lien" d'un
// coup ne laisse que la carte d'aperçu, sans la légende. Copier la légende
// et le lien séparément — et les coller l'un après l'autre — préserve les
// deux.
export function ShareLinkedIn({ url, title, excerpt, className }: ShareLinkedInProps) {
  const [step, setStep] = useState<"idle" | "caption-copied" | "link-copied">("idle");
  const [popupBlocked, setPopupBlocked] = useState(false);

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return false;
    }
  }

  async function handleCopyCaption() {
    // L'API presse-papiers exige que le document ait le focus, or window.open
    // fait basculer le focus vers le nouvel onglet — la copie doit donc être
    // terminée AVANT d'ouvrir LinkedIn, sans quoi elle échoue silencieusement
    // (confirmé en test réel : légende jamais copiée quand ouvert en premier).
    await copy(buildCaption(title, excerpt));
    setStep("caption-copied");
    const newWindow = window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      "_blank",
      "noopener,noreferrer",
    );
    setPopupBlocked(!newWindow);
  }

  async function handleCopyLink() {
    await copy(url);
    setStep("link-copied");
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <button
        type="button"
        onClick={handleCopyCaption}
        className={cn(
          "border-border-strong text-foreground/80 hover:border-accent/60 hover:text-accent inline-flex w-fit items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
          className,
        )}
      >
        <LinkedInIcon />
        Partager sur LinkedIn
      </button>

      {popupBlocked && (
        <p role="alert" className="text-xs text-red-400">
          Votre navigateur a bloqué l&apos;ouverture de LinkedIn. Autorisez les popups
          pour ce site, puis réessayez.
        </p>
      )}

      {step !== "idle" && (
        <div className="border-border-strong bg-surface-2 flex flex-col items-start gap-2 rounded-lg border p-3 text-xs">
          <p className="text-foreground/80">
            1. Légende copiée — collez-la (Ctrl+V) dans la fenêtre LinkedIn qui vient de
            s&apos;ouvrir.
          </p>
          <p className="text-foreground/80">
            2. Revenez ici, copiez le lien ci-dessous, puis collez-le (Ctrl+V) à la fin,
            sur une nouvelle ligne.
          </p>
          <Button type="button" size="sm" variant="secondary" onClick={handleCopyLink}>
            {step === "link-copied" ? "Lien copié ✓" : "Copier le lien"}
          </Button>
        </div>
      )}
    </div>
  );
}
