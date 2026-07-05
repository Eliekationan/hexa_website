import { PostForm } from "../PostForm";

export default function NewPostPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-lg font-semibold text-foreground">Nouvel article</h1>
      <PostForm mode="create" />
    </div>
  );
}
