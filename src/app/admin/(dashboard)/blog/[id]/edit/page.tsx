import { notFound } from "next/navigation";
import { getPostByIdAdmin } from "@/lib/blog";
import { PostForm } from "../../PostForm";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getPostByIdAdmin(id);

  if (!post) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-foreground text-lg font-semibold">Modifier « {post.title} »</h1>
      <PostForm
        mode="edit"
        postId={post.id}
        defaultValues={{
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          coverImageUrl: post.coverImageUrl ?? "",
          tags: post.tags.join(", "),
          status: post.status,
          seoTitle: post.seoTitle ?? "",
          seoDescription: post.seoDescription ?? "",
        }}
      />
    </div>
  );
}
