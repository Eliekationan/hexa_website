import { NextResponse, type NextRequest } from "next/server";
import { blogTopics } from "@/data/blog-topics";
import { generateBlogDraft } from "@/lib/ai-draft";
import { createPost, generateUniqueSlug } from "@/lib/blog";

export const dynamic = "force-dynamic";

function pickTopicOfTheDay(): string {
  const daysSinceEpoch = Math.floor(Date.now() / 86_400_000);
  return blogTopics[daysSinceEpoch % blogTopics.length];
}

export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const topic = pickTopicOfTheDay();

  try {
    const draft = await generateBlogDraft(topic);
    const slug = await generateUniqueSlug(draft.title);

    const post = await createPost({
      slug,
      title: draft.title,
      excerpt: draft.excerpt,
      content: draft.content,
      tags: draft.tags,
      status: "draft",
      seoTitle: draft.seoTitle,
      seoDescription: draft.seoDescription,
    });

    return NextResponse.json({ ok: true, postId: post.id, slug: post.slug, topic });
  } catch (error) {
    console.error("[cron/generate-draft] échec de la génération :", error);
    return NextResponse.json(
      { error: "Échec de la génération du brouillon." },
      { status: 500 },
    );
  }
}
