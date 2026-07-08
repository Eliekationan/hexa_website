import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import readingTime from "reading-time";
import { getPublishedPostBySlug, getPublishedPosts } from "@/lib/blog";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { ShareLinkedIn } from "@/components/blog/ShareLinkedIn";
import { Badge } from "@/components/ui/Badge";
import { siteConfig } from "@/lib/site-config";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);

  if (!post) return {};

  const title = post.seoTitle || post.title;
  const description = post.seoDescription || post.excerpt;

  return {
    title,
    description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: post.publishedAt ?? undefined,
      images: post.coverImageUrl ? [post.coverImageUrl] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const allPosts = await getPublishedPosts();
  const related = allPosts
    .filter((p) => p.id !== post.id && p.tags.some((tag) => post.tags.includes(tag)))
    .slice(0, 3);

  const minutes = Math.max(1, Math.round(readingTime(post.content).minutes));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt ?? undefined,
    dateModified: post.updatedAt,
    image: post.coverImageUrl ?? undefined,
    author: { "@type": "Organization", name: siteConfig.name },
    publisher: { "@type": "Organization", name: siteConfig.name },
    mainEntityOfPage: `${siteConfig.url}/blog/${post.slug}`,
  };

  return (
    <main id="main-content" className="mx-auto max-w-3xl px-6 pt-32 pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Link href="/blog" className="text-accent text-sm hover:underline">
        ← Retour au blog
      </Link>

      <header className="mt-6 flex flex-col gap-4">
        <div className="text-muted flex flex-wrap items-center gap-2 text-xs">
          {post.publishedAt && <span>{formatDate(post.publishedAt)}</span>}
          <span aria-hidden="true">·</span>
          <span>{minutes} min de lecture</span>
        </div>
        <h1 className="text-foreground text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          {post.title}
        </h1>
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        )}
        <ShareLinkedIn url={`${siteConfig.url}/blog/${post.slug}`} />
      </header>

      {post.coverImageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.coverImageUrl}
          alt=""
          className="border-border-strong mt-8 w-full rounded-2xl border object-cover"
        />
      )}

      <div className="markdown-preview text-foreground mt-10">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="text-foreground text-xl font-semibold">Articles liés</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((relatedPost) => (
              <ArticleCard key={relatedPost.id} post={relatedPost} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
