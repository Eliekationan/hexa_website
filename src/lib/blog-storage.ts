import "server-only";
import { supabaseAdmin } from "@/lib/supabase";

const BUCKET = "blog-images";
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

function extensionFor(mimeType: string): string {
  const map: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
    "image/avif": "avif",
  };
  return map[mimeType] ?? "bin";
}

export async function uploadBlogImage(file: File): Promise<string> {
  if (!supabaseAdmin) {
    throw new Error(
      "[blog-storage] SUPABASE_URL/SUPABASE_SERVICE_ROLE_KEY manquants — upload impossible.",
    );
  }

  if (!file.type.startsWith("image/")) {
    throw new Error("Le fichier doit être une image.");
  }

  if (file.size > MAX_SIZE_BYTES) {
    throw new Error("L'image ne doit pas dépasser 5 Mo.");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const path = `${crypto.randomUUID()}.${extensionFor(file.type)}`;

  const { error } = await supabaseAdmin.storage.from(BUCKET).upload(path, buffer, {
    contentType: file.type,
    upsert: false,
  });

  if (error) {
    throw error;
  }

  const { data } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
