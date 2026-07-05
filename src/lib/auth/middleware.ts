import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const PUBLIC_ADMIN_PATHS = ["/admin/login"];

export async function updateAdminSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const isPublicAdminPath = PUBLIC_ADMIN_PATHS.some((path) =>
    request.nextUrl.pathname.startsWith(path),
  );

  if (!supabaseUrl || !supabaseAnonKey) {
    // Auth non configurée : on bloque l'accès (redirection vers /admin/login)
    // plutôt que de laisser passer, pour ne jamais exposer /admin par défaut.
    if (isPublicAdminPath) return response;
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && !isPublicAdminPath) {
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (user && request.nextUrl.pathname === "/admin/login") {
    return NextResponse.redirect(new URL("/admin/blog", request.url));
  }

  return response;
}
