import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { services } from "@/data/services";
import { siteConfig } from "@/lib/site-config";
import { quoteSubmissionSchema, type ChatMessage } from "@/lib/quote-schema";
import { insertQuoteRequest } from "@/lib/supabase";
import { sendQuoteNotificationEmail } from "@/lib/email";

let client: Anthropic | null = null;

function getClient() {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("[quote-agent] ANTHROPIC_API_KEY manquant.");
  }
  if (!client) {
    client = new Anthropic();
  }
  return client;
}

const SUBMIT_QUOTE_TOOL: Anthropic.Tool = {
  name: "submit_quote",
  description:
    "Enregistre la demande de devis qualifiée une fois toutes les informations nécessaires recueillies (coordonnées, besoin, fourchette budgétaire indicative). À appeler une seule fois, seulement quand la conversation a suffisamment progressé.",
  input_schema: {
    type: "object",
    properties: {
      name: { type: "string", description: "Nom du visiteur" },
      email: { type: "string", description: "Email du visiteur" },
      phone: { type: "string", description: "Téléphone du visiteur, si fourni" },
      projectType: {
        type: "string",
        enum: ["ingenierie", "conseil", "web", "mobile", "agentique", "autre"],
        description: "Catégorie de projet correspondant au besoin exprimé",
      },
      needSummary: {
        type: "string",
        description: "Résumé clair et complet du besoin exprimé par le visiteur",
      },
      budgetRangeMin: { type: "integer", description: "Borne basse indicative en FCFA" },
      budgetRangeMax: { type: "integer", description: "Borne haute indicative en FCFA" },
      timeline: { type: "string", description: "Délai souhaité, si mentionné" },
    },
    required: [
      "name",
      "email",
      "projectType",
      "needSummary",
      "budgetRangeMin",
      "budgetRangeMax",
    ],
  },
};

function buildSystemPrompt(): string {
  const serviceList = services.map((s) => `- ${s.title} : ${s.description}`).join("\n");

  return `Tu es l'assistant commercial virtuel de ${siteConfig.name}, une entreprise d'ingénierie logicielle basée à Abidjan (Côte d'Ivoire).

Services proposés :
${serviceList}

Ton rôle : accueillir chaleureusement chaque visiteur, comprendre son besoin, puis produire une estimation de devis indicative.

Déroulé de la conversation :
1. Salue le visiteur et demande-lui de décrire son projet.
2. Pose les questions nécessaires pour qualifier le besoin : type de projet, fonctionnalités principales attendues, délai souhaité, budget déjà en tête s'il en a un.
3. Une fois le besoin bien compris, demande son nom et son email (obligatoires) et éventuellement son téléphone, en expliquant que c'est pour lui envoyer le devis détaillé.
4. Quand tu as : nom, email, type de projet, résumé clair du besoin et une estimation de budget → appelle l'outil submit_quote. Ne l'appelle qu'une seule fois.
5. Après l'appel de l'outil, remercie le visiteur, résume ce qui a été convenu, et précise que l'équipe HEXA le recontactera sous 24 à 48h ouvrées pour confirmer le devis détaillé.

Règles :
- Réponds toujours en français, sur un ton chaleureux, professionnel et concis (2 à 4 phrases par message maximum).
- Ne donne jamais un prix ferme : présente toujours les montants comme une fourchette indicative, à confirmer par l'équipe.
- Base tes fourchettes indicatives sur ces ordres de grandeur (en FCFA), à ajuster selon la complexité décrite :
  - Site vitrine simple : 500 000 – 1 500 000 FCFA
  - Plateforme web ou application complexe : 2 000 000 – 8 000 000 FCFA
  - Application mobile : 3 000 000 – 10 000 000 FCFA
  - Agent IA / agentique : 1 500 000 – 6 000 000 FCFA
  - Conseil ou audit ponctuel : 300 000 – 1 500 000 FCFA
- Si le visiteur pose une question hors sujet, réponds brièvement puis recentre la conversation sur son besoin.
- N'invente jamais d'informations précises sur HEXA (références clients, délais garantis) que tu ne connais pas.`;
}

export interface QuoteAgentResult {
  reply: string;
  completed: boolean;
}

export async function runQuoteAgent(messages: ChatMessage[]): Promise<QuoteAgentResult> {
  const anthropic = getClient();
  const system = buildSystemPrompt();

  const anthropicMessages: Anthropic.MessageParam[] = messages.map((m) => ({
    role: m.role,
    content: m.content,
  }));

  const response = await anthropic.messages.create({
    model: "claude-opus-4-8",
    max_tokens: 1024,
    thinking: { type: "disabled" },
    system,
    tools: [SUBMIT_QUOTE_TOOL],
    messages: anthropicMessages,
  });

  const toolUse = response.content.find(
    (block): block is Anthropic.ToolUseBlock =>
      block.type === "tool_use" && block.name === "submit_quote",
  );

  if (!toolUse) {
    const text = response.content.find(
      (b): b is Anthropic.TextBlock => b.type === "text",
    );
    return {
      reply: text?.text ?? "Désolé, une erreur est survenue. Pouvez-vous reformuler ?",
      completed: false,
    };
  }

  const submission = quoteSubmissionSchema.parse(toolUse.input);

  const results = await Promise.allSettled([
    insertQuoteRequest({ ...submission, conversation: messages }),
    sendQuoteNotificationEmail({ ...submission, to: siteConfig.contact.email }),
  ]);
  for (const result of results) {
    if (result.status === "rejected") {
      console.error("[quote-agent] Échec d'un canal d'enregistrement :", result.reason);
    }
  }

  const followUp = await anthropic.messages.create({
    model: "claude-opus-4-8",
    max_tokens: 512,
    thinking: { type: "disabled" },
    system,
    tools: [SUBMIT_QUOTE_TOOL],
    messages: [
      ...anthropicMessages,
      { role: "assistant", content: response.content },
      {
        role: "user",
        content: [
          {
            type: "tool_result",
            tool_use_id: toolUse.id,
            content: "Devis enregistré avec succès. L'équipe HEXA a été notifiée.",
          },
        ],
      },
    ],
  });

  const closingText = followUp.content.find(
    (b): b is Anthropic.TextBlock => b.type === "text",
  );

  return {
    reply:
      closingText?.text ?? "Merci ! Votre demande a bien été transmise à notre équipe.",
    completed: true,
  };
}
