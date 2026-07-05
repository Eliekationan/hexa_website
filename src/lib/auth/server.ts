import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Client Supabase lié aux cookies de la requête courante, utilisé pour
 * l'authentification admin (login/logout/lecture de session) dans les
 * Server Components et Server Actions. Distinct de `src/lib/supabase.ts`
 * (clé service_role, sans notion de session) utilisé pour le CRUD du blog.
 */
export async function createAuthServerClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "[auth] NEXT_PUBLIC_SUPABASE_URL/NEXT_PUBLIC_SUPABASE_ANON_KEY manquants.",
    );
  }

  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Appelé depuis un Server Component (lecture seule) : les Server
          // Actions/Route Handlers qui suivent rafraîchiront la session.
        }
      },
    },
  });
}

export async function getAdminUser() {
  const supabase = await createAuthServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
