"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import {
  contactFormSchema,
  contactSubjects,
  type ContactFormValues,
} from "@/lib/contact";

const MESSAGE_MAX_LENGTH = 2000;

type SubmitStatus = "idle" | "loading" | "success" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: { nom: "", email: "", sujet: undefined, message: "", honeypot: "" },
  });

  const messageValue = watch("message") ?? "";

  async function onSubmit(data: ContactFormValues) {
    setStatus("loading");
    setServerError(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        setServerError(
          body?.error ?? "Une erreur est survenue. Merci de réessayer dans un instant.",
        );
        setStatus("error");
        return;
      }

      setStatus("success");
    } catch {
      setServerError("Impossible de contacter le serveur. Vérifiez votre connexion.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-border bg-surface flex flex-col items-center gap-4 rounded-2xl border p-10 text-center"
      >
        <h3 className="text-foreground text-xl font-semibold">
          Message envoyé, nous revenons vers vous sous 24h
        </h3>
        <p className="text-muted text-sm">
          Merci de nous avoir contactés. Notre équipe traite votre demande.
        </p>
        <Button
          variant="secondary"
          onClick={() => {
            reset();
            setStatus("idle");
          }}
        >
          Envoyer un autre message
        </Button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <label htmlFor="nom" className="text-foreground text-sm font-medium">
          Nom
        </label>
        <input
          id="nom"
          type="text"
          autoComplete="name"
          aria-invalid={!!errors.nom}
          aria-describedby={errors.nom ? "nom-error" : undefined}
          className="border-border bg-surface-2 text-foreground focus-visible:outline-accent rounded-lg border px-4 py-2.5 text-sm"
          {...register("nom")}
        />
        {errors.nom && (
          <p id="nom-error" role="alert" className="text-sm text-red-400">
            {errors.nom.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-foreground text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
          className="border-border bg-surface-2 text-foreground focus-visible:outline-accent rounded-lg border px-4 py-2.5 text-sm"
          {...register("email")}
        />
        {errors.email && (
          <p id="email-error" role="alert" className="text-sm text-red-400">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="sujet" className="text-foreground text-sm font-medium">
          Sujet
        </label>
        <select
          id="sujet"
          defaultValue=""
          aria-invalid={!!errors.sujet}
          aria-describedby={errors.sujet ? "sujet-error" : undefined}
          className="border-border bg-surface-2 text-foreground focus-visible:outline-accent rounded-lg border px-4 py-2.5 text-sm"
          {...register("sujet")}
        >
          <option value="" disabled>
            Choisissez un sujet
          </option>
          {contactSubjects.map((subject) => (
            <option key={subject} value={subject}>
              {subject}
            </option>
          ))}
        </select>
        {errors.sujet && (
          <p id="sujet-error" role="alert" className="text-sm text-red-400">
            {errors.sujet.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor="message" className="text-foreground text-sm font-medium">
            Message
          </label>
          <span className="text-muted text-xs tabular-nums">
            {messageValue.length}/{MESSAGE_MAX_LENGTH}
          </span>
        </div>
        <textarea
          id="message"
          rows={5}
          maxLength={MESSAGE_MAX_LENGTH}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
          className="border-border bg-surface-2 text-foreground focus-visible:outline-accent resize-none rounded-lg border px-4 py-2.5 text-sm"
          {...register("message")}
        />
        {errors.message && (
          <p id="message-error" role="alert" className="text-sm text-red-400">
            {errors.message.message}
          </p>
        )}
      </div>

      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="honeypot">Ne pas remplir ce champ</label>
        <input
          id="honeypot"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register("honeypot")}
        />
      </div>

      {status === "error" && serverError && (
        <p role="alert" className="text-sm text-red-400">
          {serverError}
        </p>
      )}

      <Button
        type="submit"
        disabled={status === "loading"}
        className={cn("mt-2 justify-center", status === "loading" && "opacity-80")}
      >
        {status === "loading" ? (
          <>
            <span
              aria-hidden="true"
              className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
            />
            Envoi en cours…
          </>
        ) : (
          "Envoyer le message"
        )}
      </Button>
    </form>
  );
}
