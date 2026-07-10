import "server-only";
import { supabaseAdmin } from "@/lib/supabase";

export interface RatingSummary {
  average: number;
  count: number;
}

const EMPTY_SUMMARY: RatingSummary = { average: 0, count: 0 };

function requireSupabase() {
  if (!supabaseAdmin) {
    throw new Error(
      "[blog-ratings] SUPABASE_URL/SUPABASE_SERVICE_ROLE_KEY manquants — notes indisponibles.",
    );
  }
  return supabaseAdmin;
}

export async function getRatingSummary(postId: string): Promise<RatingSummary> {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from("blog_post_ratings")
    .select("rating")
    .eq("post_id", postId);

  if (error) throw error;
  if (!data || data.length === 0) return EMPTY_SUMMARY;

  const sum = data.reduce((total, row) => total + row.rating, 0);
  return { average: sum / data.length, count: data.length };
}

export async function insertRating(
  postId: string,
  rating: number,
): Promise<RatingSummary> {
  const supabase = requireSupabase();
  const { error } = await supabase
    .from("blog_post_ratings")
    .insert({ post_id: postId, rating });

  if (error) throw error;

  return getRatingSummary(postId);
}
