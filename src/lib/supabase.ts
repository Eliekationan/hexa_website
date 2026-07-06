import "server-only";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabaseAdmin =
  supabaseUrl && supabaseServiceRoleKey
    ? createClient(supabaseUrl, supabaseServiceRoleKey, {
        auth: { persistSession: false },
      })
    : null;

interface ContactMessageRecord {
  nom: string;
  email: string;
  sujet: string;
  message: string;
}

export async function insertContactMessage(data: ContactMessageRecord) {
  if (!supabaseAdmin) {
    console.warn(
      "[supabase] SUPABASE_URL/SUPABASE_SERVICE_ROLE_KEY manquants — message non archivé en base.",
    );
    return;
  }

  const { error } = await supabaseAdmin.from("contact_messages").insert(data);

  if (error) {
    throw error;
  }
}

interface QuoteRequestRecord {
  name: string;
  email: string;
  phone?: string;
  projectType: string;
  needSummary: string;
  budgetRangeMin: number;
  budgetRangeMax: number;
  timeline?: string;
  conversation: unknown;
}

export async function insertQuoteRequest(data: QuoteRequestRecord) {
  if (!supabaseAdmin) {
    console.warn(
      "[supabase] SUPABASE_URL/SUPABASE_SERVICE_ROLE_KEY manquants — devis non archivé en base.",
    );
    return;
  }

  const { error } = await supabaseAdmin.from("quote_requests").insert({
    name: data.name,
    email: data.email,
    phone: data.phone ?? null,
    project_type: data.projectType,
    need_summary: data.needSummary,
    budget_range_min: data.budgetRangeMin,
    budget_range_max: data.budgetRangeMax,
    timeline: data.timeline ?? null,
    conversation: data.conversation,
  });

  if (error) {
    throw error;
  }
}
