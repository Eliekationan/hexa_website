"use client";

import { useEffect, useState } from "react";
import { StarIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

interface RatingSummary {
  average: number;
  count: number;
}

interface StarRatingProps {
  slug: string;
  className?: string;
}

function storageKey(slug: string) {
  return `hexa-rated-${slug}`;
}

export function StarRating({ slug, className }: StarRatingProps) {
  const [summary, setSummary] = useState<RatingSummary | null>(null);
  const [myRating, setMyRating] = useState<number | null>(null);
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(storageKey(slug));
    if (stored) setMyRating(Number(stored));

    fetch(`/api/blog/${slug}/rating`)
      .then((res) => res.json())
      .then((data: RatingSummary) => setSummary(data))
      .catch(() => {
        // Notes indisponibles : on affiche simplement le composant sans moyenne.
      });
  }, [slug]);

  async function submitRating(value: number) {
    if (myRating !== null || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/blog/${slug}/rating`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating: value }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        setError(body?.error ?? "Une erreur est survenue. Réessayez dans un instant.");
        return;
      }

      const data = (await response.json()) as RatingSummary;
      setSummary(data);
      setMyRating(value);
      localStorage.setItem(storageKey(slug), String(value));
    } catch {
      setError("Impossible d'enregistrer votre note. Vérifiez votre connexion.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const alreadyRated = myRating !== null;
  const displayValue = hoverValue ?? myRating ?? 0;

  return (
    <div className={cn("flex flex-col items-start gap-2", className)}>
      <p className="text-foreground/80 text-sm font-medium">
        {alreadyRated ? "Merci pour votre note !" : "Cet article vous a-t-il été utile ?"}
      </p>

      <div
        role={alreadyRated ? undefined : "radiogroup"}
        aria-label="Note sur 5 étoiles"
        className="flex items-center gap-1"
      >
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            disabled={alreadyRated || isSubmitting}
            aria-label={`${value} étoile${value > 1 ? "s" : ""}`}
            aria-pressed={alreadyRated ? myRating === value : undefined}
            onClick={() => submitRating(value)}
            onMouseEnter={() => !alreadyRated && setHoverValue(value)}
            onMouseLeave={() => setHoverValue(null)}
            className={cn(
              "transition-colors",
              alreadyRated ? "cursor-default" : "cursor-pointer",
              value <= displayValue ? "text-accent" : "text-foreground/30",
            )}
          >
            <StarIcon filled={value <= displayValue} width={22} height={22} />
          </button>
        ))}

        {summary && summary.count > 0 && (
          <span className="text-foreground/60 ml-2 text-xs">
            {summary.average.toFixed(1)} ({summary.count} avis)
          </span>
        )}
      </div>

      {error && (
        <p role="alert" className="text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
