import { z } from "zod";

export const blogPostFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, "Le titre doit contenir au moins 5 caractères.")
    .max(160, "Le titre ne peut pas dépasser 160 caractères."),
  slug: z
    .string()
    .trim()
    .max(160, "Le slug ne peut pas dépasser 160 caractères.")
    .regex(
      /^[a-z0-9]+(-[a-z0-9]+)*$/,
      "Le slug ne peut contenir que des lettres minuscules, chiffres et tirets.",
    )
    .optional()
    .or(z.literal("")),
  excerpt: z
    .string()
    .trim()
    .min(20, "L'extrait doit contenir au moins 20 caractères.")
    .max(300, "L'extrait ne peut pas dépasser 300 caractères."),
  content: z.string().trim().min(50, "Le contenu doit contenir au moins 50 caractères."),
  coverImageUrl: z
    .string()
    .trim()
    .url("URL d'image invalide.")
    .optional()
    .or(z.literal("")),
  tags: z.string().trim().optional(),
  status: z.enum(["draft", "published"]),
  seoTitle: z
    .string()
    .trim()
    .max(70, "Le titre SEO ne peut pas dépasser 70 caractères.")
    .optional()
    .or(z.literal("")),
  seoDescription: z
    .string()
    .trim()
    .max(160, "La description SEO ne peut pas dépasser 160 caractères.")
    .optional()
    .or(z.literal("")),
});

export type BlogPostFormValues = z.infer<typeof blogPostFormSchema>;

export function parseTags(raw: string): string[] {
  return Array.from(
    new Set(
      raw
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    ),
  );
}
