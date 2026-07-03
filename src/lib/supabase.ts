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
