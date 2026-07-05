import { PostForm } from "../PostForm";

export default function NewPostPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-foreground text-lg font-semibold">Nouvel article</h1>
      <PostForm mode="create" />
    </div>
  );
}
