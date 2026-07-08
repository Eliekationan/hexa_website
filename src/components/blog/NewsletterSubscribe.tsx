"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import {
  newsletterSubscribeSchema,
  type NewsletterSubscribeValues,
} from "@/lib/newsletter-schema";

type Status = "idle" | "loading" | "success" | "error";

interface NewsletterSubscribeProps {
  className?: string;
}

export function NewsletterSubscribe({ className }: NewsletterSubscribeProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewsletterSubscribeValues>({
    resolver: zodResolver(newsletterSubscribeSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit(values: NewsletterSubscribeValues) {
    setStatus("loading");
    setMessage(null);

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const body = (await response.json().catch(() => null)) as {
        ok?: boolean;
        alreadySubscribed?: boolean;
        error?: string;
      } | null;

      if (!response.ok) {
        setStatus("error");
        setMessage(body?.error ?? "Une erreur est survenue. Réessayez dans un instant.");
        return;
      }

      setStatus("success");
      setMessage(
        body?.alreadySubscribed
          ? "Vous êtes déjà abonné à la newsletter !"
          : "Merci ! Vous recevrez nos prochains articles par email.",
      );
      reset();
    } catch {
      setStatus("error");
      setMessage("Impossible de contacter le serveur. Vérifiez votre connexion.");
    }
  }

  return (
    <div
      className={cn(
        "border-border-strong bg-surface-2 flex flex-col gap-4 rounded-2xl border p-6",
        className,
      )}
    >
      <div>
        <p className="text-foreground text-base font-semibold">
          Suivez nos prochains articles
        </p>
        <p className="text-foreground/60 mt-1 text-sm">
          Un email quand un nouvel article est publié — pas de spam, désabonnement à tout
          moment.
        </p>
      </div>

      {status === "success" ? (
        <p role="status" className="text-accent text-sm">
          {message}
        </p>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="flex flex-col gap-2 sm:flex-row sm:items-start"
        >
          <div className="flex-1">
            <label htmlFor="newsletter-email" className="sr-only">
              Adresse email
            </label>
            <input
              id="newsletter-email"
              type="email"
              autoComplete="email"
              placeholder="vous@exemple.com"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "newsletter-email-error" : undefined}
              className="border-border-strong bg-background text-foreground focus-visible:outline-accent w-full rounded-lg border px-4 py-2.5 text-sm outline-none"
              {...register("email")}
            />
            {errors.email && (
              <p
                id="newsletter-email-error"
                role="alert"
                className="mt-1 text-xs text-red-400"
              >
                {errors.email.message}
              </p>
            )}
            {status === "error" && message && (
              <p role="alert" className="mt-1 text-xs text-red-400">
                {message}
              </p>
            )}
          </div>
          <Button type="submit" size="sm" disabled={status === "loading"}>
            {status === "loading" ? "Envoi…" : "S'abonner"}
          </Button>
        </form>
      )}
    </div>
  );
}
