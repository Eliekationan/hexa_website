import { z } from "zod";

export const chatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().trim().min(1).max(4000),
});

export type ChatMessage = z.infer<typeof chatMessageSchema>;

export const quoteAgentRequestSchema = z.object({
  messages: z.array(chatMessageSchema).min(1).max(40),
});

export const projectTypes = [
  "ingenierie",
  "conseil",
  "web",
  "mobile",
  "agentique",
  "autre",
] as const;

export type ProjectType = (typeof projectTypes)[number];

export const quoteSubmissionSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email(),
  phone: z.string().trim().max(40).optional(),
  projectType: z.enum(projectTypes),
  needSummary: z.string().trim().min(10).max(2000),
  budgetRangeMin: z.number().int().nonnegative(),
  budgetRangeMax: z.number().int().nonnegative(),
  timeline: z.string().trim().max(200).optional(),
});

export type QuoteSubmission = z.infer<typeof quoteSubmissionSchema>;
