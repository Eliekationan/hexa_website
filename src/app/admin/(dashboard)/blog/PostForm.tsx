"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { blogPostFormSchema, type BlogPostFormValues } from "@/lib/blog-schema";
import { createPostAction, updatePostAction, generateDraftAction } from "./actions";

interface PostFormProps {
  mode: "create" | "edit";
  postId?: string;
  defaultValues?: Partial<BlogPostFormValues>;
}

const emptyDefaults: BlogPostFormValues = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  coverImageUrl: "",
  tags: "",
  status: "draft",
  seoTitle: "",
  seoDescription: "",
};

export function PostForm({ mode, postId, defaultValues }: PostFormProps) {
  const router = useRouter();
  const [showPreview, setShowPreview] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [topic, setTopic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BlogPostFormValues>({
    resolver: zodResolver(blogPostFormSchema),
    defaultValues: { ...emptyDefaults, ...defaultValues },
  });

  const contentValue = watch("content") ?? "";

  async function onGenerateDraft() {
    if (!topic.trim()) return;
    setIsGenerating(true);
    setGenerationError(null);
    try {
      const draft = await generateDraftAction(topic);
      setValue("title", draft.title, { shouldValidate: true });
      setValue("excerpt", draft.excerpt, { shouldValidate: true });
      setValue("content", draft.content, { shouldValidate: true });
      setValue("tags", draft.tags.join(", "));
      setValue("seoTitle", draft.seoTitle);
      setValue("seoDescription", draft.seoDescription);
      setShowPreview(false);
    } catch {
      setGenerationError("La génération a échoué. Réessayez ou rédigez manuellement.");
    } finally {
      setIsGenerating(false);
    }
  }

  async function onSubmit(values: BlogPostFormValues) {
    setIsSubmitting(true);
    setServerError(null);
    try {
      if (mode === "create") {
        await createPostAction(values);
      } else if (postId) {
        await updatePostAction(postId, values);
      }
      router.push("/admin/blog");
      router.refresh();
    } catch {
      setServerError("Une erreur est survenue lors de l'enregistrement.");
      setIsSubmitting(false);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-border-strong bg-background px-3 py-2 text-sm text-foreground outline-none focus-visible:outline-2 focus-visible:outline-accent";

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
      <div className="flex flex-col gap-2 rounded-lg border border-border-strong bg-surface-2 p-4">
        <label htmlFor="ai-topic" className="text-sm font-medium text-foreground">
          Générer un brouillon avec l&apos;IA
        </label>
        <div className="flex gap-3">
          <input
            id="ai-topic"
            placeholder="Sujet de l'article, ex : les bénéfices de l'agentique pour les PME"
            className={inputClass}
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
          <Button type="button" variant="secondary" disabled={isGenerating || !topic.trim()} onClick={onGenerateDraft}>
            {isGenerating ? "Génération…" : "Générer"}
          </Button>
        </div>
        <p className="text-xs text-foreground/60">
          Remplit titre, extrait, contenu, tags et SEO ci-dessous — à relire avant de publier.
        </p>
        {generationError && (
          <p role="alert" className="text-sm text-red-400">
            {generationError}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="title" className="text-sm font-medium text-foreground">
          Titre
        </label>
        <input id="title" className={inputClass} {...register("title")} />
        {errors.title && (
          <p role="alert" className="text-sm text-red-400">
            {errors.title.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="slug" className="text-sm font-medium text-foreground">
          Slug (optionnel — généré depuis le titre si vide)
        </label>
        <input id="slug" placeholder="mon-article" className={inputClass} {...register("slug")} />
        {errors.slug && (
          <p role="alert" className="text-sm text-red-400">
            {errors.slug.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="excerpt" className="text-sm font-medium text-foreground">
          Extrait
        </label>
        <textarea id="excerpt" rows={2} className={inputClass} {...register("excerpt")} />
        {errors.excerpt && (
          <p role="alert" className="text-sm text-red-400">
            {errors.excerpt.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor="content" className="text-sm font-medium text-foreground">
            Contenu (Markdown)
          </label>
          <button
            type="button"
            onClick={() => setShowPreview((v) => !v)}
            className="text-xs text-accent hover:underline"
          >
            {showPreview ? "Revenir à l'édition" : "Prévisualiser"}
          </button>
        </div>
        {showPreview ? (
          <div className="markdown-preview rounded-lg border border-border-strong bg-background px-4 py-3 text-sm text-foreground">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {contentValue || "*Rien à prévisualiser.*"}
            </ReactMarkdown>
          </div>
        ) : (
          <textarea
            id="content"
            rows={16}
            className={cn(inputClass, "font-mono")}
            {...register("content")}
          />
        )}
        {errors.content && (
          <p role="alert" className="text-sm text-red-400">
            {errors.content.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="coverImageUrl" className="text-sm font-medium text-foreground">
          Image de couverture (URL, optionnel)
        </label>
        <input id="coverImageUrl" className={inputClass} {...register("coverImageUrl")} />
        {errors.coverImageUrl && (
          <p role="alert" className="text-sm text-red-400">
            {errors.coverImageUrl.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="tags" className="text-sm font-medium text-foreground">
          Tags (séparés par des virgules)
        </label>
        <input id="tags" placeholder="ia, agentique, actualité" className={inputClass} {...register("tags")} />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="seoTitle" className="text-sm font-medium text-foreground">
            Titre SEO (optionnel)
          </label>
          <input id="seoTitle" className={inputClass} {...register("seoTitle")} />
          {errors.seoTitle && (
            <p role="alert" className="text-sm text-red-400">
              {errors.seoTitle.message}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="seoDescription" className="text-sm font-medium text-foreground">
            Description SEO (optionnel)
          </label>
          <input id="seoDescription" className={inputClass} {...register("seoDescription")} />
          {errors.seoDescription && (
            <p role="alert" className="text-sm text-red-400">
              {errors.seoDescription.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="status" className="text-sm font-medium text-foreground">
          Statut
        </label>
        <select id="status" className={inputClass} {...register("status")}>
          <option value="draft">Brouillon</option>
          <option value="published">Publié</option>
        </select>
      </div>

      {serverError && (
        <p role="alert" className="text-sm text-red-400">
          {serverError}
        </p>
      )}

      <div className="flex gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Enregistrement…" : mode === "create" ? "Créer l'article" : "Enregistrer"}
        </Button>
        <Button type="button" variant="secondary" onClick={() => router.push("/admin/blog")}>
          Annuler
        </Button>
      </div>
    </form>
  );
}
