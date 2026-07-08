import { z } from "zod";

export const newsletterSubscribeSchema = z.object({
  email: z.string().trim().min(1, "L'email est requis.").email("Adresse email invalide."),
});

export type NewsletterSubscribeValues = z.infer<typeof newsletterSubscribeSchema>;
