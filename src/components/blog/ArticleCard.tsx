import Link from "next/link";
import readingTime from "reading-time";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { BlogPost } from "@/lib/blog";

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" }).format(
    new Date(iso),
  );
}

export function ArticleCard({ post }: { post: BlogPost }) {
  const minutes = Math.max(1, Math.round(readingTime(post.content).minutes));

  return (
    <Card hoverable className="flex h-full flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
        {post.publishedAt && <span>{formatDate(post.publishedAt)}</span>}
        <span aria-hidden="true">·</span>
        <span>{minutes} min de lecture</span>
      </div>

      <h3 className="text-lg font-semibold text-foreground">
        <Link href={`/blog/${post.slug}`} className="hover:text-accent transition-colors">
          {post.title}
        </Link>
      </h3>

      <p className="flex-1 text-sm text-muted text-pretty">{post.excerpt}</p>

      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </Card>
  );
}
