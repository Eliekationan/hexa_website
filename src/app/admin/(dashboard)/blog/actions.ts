"use server";

import { revalidatePath } from "next/cache";
import { getAdminUser } from "@/lib/auth/server";
import { blogPostFormSchema, parseTags, type BlogPostFormValues } from "@/lib/blog-schema";
import { createPost, updatePost, deletePost, generateUniqueSlug } from "@/lib/blog";

async function requireAdmin() {
  const user = await getAdminUser();
  if (!user) {
    throw new Error("Non autorisé.");
  }
}

function revalidateBlog(slug?: string) {
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  if (slug) revalidatePath(`/blog/${slug}`);
}

export async function createPostAction(values: BlogPostFormValues) {
  await requireAdmin();
  const data = blogPostFormSchema.parse(values);
  const slug = await generateUniqueSlug(data.slug || data.title);

  const post = await createPost({
    slug,
    title: data.title,
    excerpt: data.excerpt,
    content: data.content,
    coverImageUrl: data.coverImageUrl || null,
    tags: parseTags(data.tags ?? ""),
    status: data.status,
    seoTitle: data.seoTitle || null,
    seoDescription: data.seoDescription || null,
  });

  revalidateBlog(post.slug);
  return post;
}

export async function updatePostAction(id: string, values: BlogPostFormValues) {
  await requireAdmin();
  const data = blogPostFormSchema.parse(values);
  const slug = await generateUniqueSlug(data.slug || data.title, id);

  const post = await updatePost(id, {
    slug,
    title: data.title,
    excerpt: data.excerpt,
    content: data.content,
    coverImageUrl: data.coverImageUrl || null,
    tags: parseTags(data.tags ?? ""),
    status: data.status,
    seoTitle: data.seoTitle || null,
    seoDescription: data.seoDescription || null,
  });

  revalidateBlog(post.slug);
  return post;
}

export async function deletePostAction(id: string, slug: string) {
  await requireAdmin();
  await deletePost(id);
  revalidateBlog(slug);
}
