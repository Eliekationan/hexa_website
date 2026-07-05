import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedPosts } from "@/lib/blog";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 9;

export const metadata: Metadata = {
  title: siteConfig.sections.blog.title,
  description: siteConfig.sections.blog.description,
  alternates: {
    canonical: "/blog",
    types: { "application/rss+xml": "/blog/rss.xml" },
  },
};

interface BlogIndexPageProps {
  searchParams: Promise<{ page?: string; tag?: string }>;
}

export default async function BlogIndexPage({ searchParams }: BlogIndexPageProps) {
  const { page: pageParam, tag } = await searchParams;
  const posts = await getPublishedPosts();

  const allTags = Array.from(new Set(posts.flatMap((post) => post.tags))).sort();
  const filtered = tag ? posts.filter((post) => post.tags.includes(tag)) : posts;

  const page = Math.max(1, Number.parseInt(pageParam ?? "1", 10) || 1);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function pageHref(targetPage: number) {
    const params = new URLSearchParams();
    if (tag) params.set("tag", tag);
    if (targetPage > 1) params.set("page", String(targetPage));
    const query = params.toString();
    return query ? `/blog?${query}` : "/blog";
  }

  return (
    <main id="main-content" className="mx-auto max-w-6xl px-6 pt-32 pb-24">
      <SectionHeading
        as="h1"
        eyebrow={siteConfig.sections.blog.eyebrow}
        title={siteConfig.sections.blog.title}
        description={siteConfig.sections.blog.description}
      />

      {allTags.length > 0 && (
        <div className="mt-10 flex flex-wrap justify-center gap-2">
          <Link href="/blog">
            <Badge variant={!tag ? "accent" : "default"}>Tous</Badge>
          </Link>
          {allTags.map((t) => (
            <Link key={t} href={`/blog?tag=${encodeURIComponent(t)}`}>
              <Badge variant={tag === t ? "accent" : "default"}>{t}</Badge>
            </Link>
          ))}
        </div>
      )}

      {pageItems.length === 0 ? (
        <p className="text-muted mt-16 text-center">Aucun article pour le moment.</p>
      ) : (
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pageItems.map((post) => (
            <ArticleCard key={post.id} post={post} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <nav
          aria-label="Pagination"
          className="mt-14 flex items-center justify-center gap-2 text-sm"
        >
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={pageHref(p)}
              aria-current={p === page ? "page" : undefined}
              className={cn(
                "border-border-strong flex h-9 w-9 items-center justify-center rounded-full border transition-colors",
                p === page
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground/70 hover:text-accent",
              )}
            >
              {p}
            </Link>
          ))}
        </nav>
      )}
    </main>
  );
}
