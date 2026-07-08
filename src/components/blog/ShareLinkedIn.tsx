"use client";

import { useState } from "react";
import { LinkedInIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

interface ShareLinkedInProps {
  url: string;
  className?: string;
}

export function ShareLinkedIn({ url, className }: ShareLinkedInProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;

  async function handleClick() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 5000);
    } catch {
      // Presse-papiers indisponible (permissions navigateur) : LinkedIn
      // s'ouvre quand même, l'utilisateur colle le lien manuellement.
    }
    window.open(shareUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <button
        type="button"
        onClick={handleClick}
        className={cn(
          "border-border-strong text-foreground/80 hover:border-accent/60 hover:text-accent inline-flex w-fit items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
          className,
        )}
      >
        <LinkedInIcon />
        Partager sur LinkedIn
      </button>
      {copied && (
        <p className="text-accent text-xs">
          Lien copié — collez-le (Ctrl+V) dans la fenêtre LinkedIn qui vient de
          s&apos;ouvrir.
        </p>
      )}
    </div>
  );
}
