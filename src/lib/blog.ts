import "server-only";
import { supabaseAdmin } from "@/lib/supabase";

export type BlogPostStatus = "draft" | "published";

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImageUrl: string | null;
  tags: string[];
  status: BlogPostStatus;
  publishedAt: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BlogPostInput {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImageUrl?: string | null;
  tags: string[];
  status: BlogPostStatus;
  seoTitle?: string | null;
  seoDescription?: string | null;
}

interface BlogPostRow {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image_url: string | null;
  tags: string[];
  status: BlogPostStatus;
  published_at: string | null;
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
  updated_at: string;
}

function fromRow(row: BlogPostRow): BlogPost {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    coverImageUrl: row.cover_image_url,
    tags: row.tags,
    status: row.status,
    publishedAt: row.published_at,
    seoTitle: row.seo_title,
    seoDescription: row.seo_description,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function requireSupabase() {
  if (!supabaseAdmin) {
    throw new Error(
      "[blog] SUPABASE_URL/SUPABASE_SERVICE_ROLE_KEY manquants — le blog nécessite Supabase.",
    );
  }
  return supabaseAdmin;
}

export function slugify(title: string): string {
  return title
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function generateUniqueSlug(title: string, ignoreId?: string): Promise<string> {
  const supabase = requireSupabase();
  const base = slugify(title) || "article";
  let candidate = base;
  let suffix = 2;

  for (;;) {
    let query = supabase.from("blog_posts").select("id").eq("slug", candidate).limit(1);
    if (ignoreId) {
      query = query.neq("id", ignoreId);
    }
    const { data, error } = await query;
    if (error) throw error;
    if (!data || data.length === 0) return candidate;
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }
}

export async function getPublishedPosts(): Promise<BlogPost[]> {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) throw error;
  return (data as BlogPostRow[]).map(fromRow);
}

export async function getPublishedPostBySlug(slug: string): Promise<BlogPost | null> {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("status", "published")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  return data ? fromRow(data as BlogPostRow) : null;
}

export async function getAllPostsAdmin(): Promise<BlogPost[]> {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return (data as BlogPostRow[]).map(fromRow);
}

export async function getPostByIdAdmin(id: string): Promise<BlogPost | null> {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data ? fromRow(data as BlogPostRow) : null;
}

export async function createPost(input: BlogPostInput): Promise<BlogPost> {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from("blog_posts")
    .insert({
      slug: input.slug,
      title: input.title,
      excerpt: input.excerpt,
      content: input.content,
      cover_image_url: input.coverImageUrl ?? null,
      tags: input.tags,
      status: input.status,
      published_at: input.status === "published" ? new Date().toISOString() : null,
      seo_title: input.seoTitle ?? null,
      seo_description: input.seoDescription ?? null,
    })
    .select("*")
    .single();

  if (error) throw error;
  return fromRow(data as BlogPostRow);
}

export async function updatePost(id: string, input: BlogPostInput): Promise<BlogPost> {
  const supabase = requireSupabase();
  const existing = await getPostByIdAdmin(id);
  if (!existing) {
    throw new Error(`[blog] Article introuvable : ${id}`);
  }

  const becomingPublished = input.status === "published" && existing.status !== "published";

  const { data, error } = await supabase
    .from("blog_posts")
    .update({
      slug: input.slug,
      title: input.title,
      excerpt: input.excerpt,
      content: input.content,
      cover_image_url: input.coverImageUrl ?? null,
      tags: input.tags,
      status: input.status,
      published_at: becomingPublished
        ? new Date().toISOString()
        : input.status === "published"
          ? existing.publishedAt
          : null,
      seo_title: input.seoTitle ?? null,
      seo_description: input.seoDescription ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw error;
  return fromRow(data as BlogPostRow);
}

export async function deletePost(id: string): Promise<void> {
  const supabase = requireSupabase();
  const { error } = await supabase.from("blog_posts").delete().eq("id", id);
  if (error) throw error;
}
