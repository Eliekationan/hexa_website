import Link from "next/link";
import { getAllPostsAdmin } from "@/lib/blog";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { DeletePostButton } from "./DeletePostButton";

export default async function AdminBlogPage() {
  const posts = await getAllPostsAdmin();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-foreground">Articles ({posts.length})</h1>
        <Button href="/admin/blog/new">Nouvel article</Button>
      </div>

      {posts.length === 0 ? (
        <p className="text-sm text-foreground/60">Aucun article pour le moment.</p>
      ) : (
        <ul className="flex flex-col divide-y divide-border-strong rounded-lg border border-border-strong">
          {posts.map((post) => (
            <li key={post.id} className="flex items-center justify-between gap-4 px-4 py-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="truncate text-sm font-medium text-foreground">{post.title}</span>
                  <Badge variant={post.status === "published" ? "accent" : "default"}>
                    {post.status === "published" ? "Publié" : "Brouillon"}
                  </Badge>
                </div>
                <p className="truncate text-xs text-foreground/60">/blog/{post.slug}</p>
              </div>
              <div className="flex shrink-0 items-center gap-4">
                <Link
                  href={`/admin/blog/${post.id}/edit`}
                  className="text-sm text-accent hover:underline"
                >
                  Modifier
                </Link>
                <DeletePostButton id={post.id} slug={post.slug} title={post.title} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
