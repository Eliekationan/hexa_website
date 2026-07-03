import { z } from "zod";

export const contactSubjects = [
  "Ingénierie",
  "Conseil",
  "Développement Web",
  "Développement Mobile",
  "Agentique / IA",
  "Autre",
] as const;

export const contactFormSchema = z.object({
  nom: z
    .string()
    .trim()
    .min(2, "Le nom doit contenir au moins 2 caractères.")
    .max(80, "Le nom ne peut pas dépasser 80 caractères."),
  email: z.string().trim().min(1, "L'email est requis.").email("Adresse email invalide."),
  sujet: z.enum(contactSubjects, {
    error: () => "Veuillez sélectionner un sujet.",
  }),
  message: z
    .string()
    .trim()
    .min(20, "Le message doit contenir au moins 20 caractères.")
    .max(2000, "Le message ne peut pas dépasser 2000 caractères."),
  honeypot: z.string().optional(),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
