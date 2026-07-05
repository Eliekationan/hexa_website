import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod";

const draftSchema = z.object({
  title: z.string(),
  excerpt: z.string(),
  content: z.string(),
  tags: z.array(z.string()),
  seoTitle: z.string(),
  seoDescription: z.string(),
});

export type BlogDraft = z.infer<typeof draftSchema>;

let client: Anthropic | null = null;

function getClient() {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("[ai-draft] ANTHROPIC_API_KEY manquant.");
  }
  if (!client) {
    client = new Anthropic();
  }
  return client;
}

export async function generateBlogDraft(topic: string): Promise<BlogDraft> {
  const anthropic = getClient();

  const response = await anthropic.messages.parse({
    model: "claude-opus-4-8",
    max_tokens: 8000,
    thinking: { type: "adaptive" },
    system:
      "Tu es un rédacteur SEO pour HEXA, une entreprise d'ingénierie logicielle et de conseil " +
      "spécialisée en développement web, mobile et solutions agentiques/IA. Rédige des articles de " +
      "blog en français, informatifs et concrets, destinés à un public professionnel (dirigeants, " +
      "décideurs techniques). Le contenu doit être au format Markdown, structuré avec des titres " +
      "de niveau 2/3, sans placeholder ni contenu générique.",
    messages: [
      {
        role: "user",
        content: `Rédige un article de blog complet sur le sujet suivant : "${topic}".`,
      },
    ],
    output_config: {
      format: zodOutputFormat(draftSchema),
    },
  });

  if (!response.parsed_output) {
    throw new Error("[ai-draft] Réponse IA invalide (parsing échoué).");
  }

  return response.parsed_output;
}
