"use client";

import { useState } from "react";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

export function ContactMap() {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="border-border bg-surface relative h-72 overflow-hidden rounded-2xl border sm:h-full">
      {!loaded && (
        <div className="bg-surface-2 absolute inset-0 flex animate-pulse items-center justify-center">
          <span className="text-muted text-sm">Chargement de la carte…</span>
        </div>
      )}
      <iframe
        title="Localisation de HEXA à Abidjan"
        src={siteConfig.contact.mapEmbedUrl}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={cn(
          "h-full w-full transition-opacity duration-500",
          loaded ? "opacity-100" : "opacity-0",
        )}
      />
    </div>
  );
}
