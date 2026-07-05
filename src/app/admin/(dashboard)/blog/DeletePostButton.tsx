"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deletePostAction } from "./actions";

export function DeletePostButton({
  id,
  slug,
  title,
}: {
  id: string;
  slug: string;
  title: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="text-sm text-red-400 hover:underline"
      >
        Supprimer
      </button>
    );
  }

  return (
    <span className="inline-flex items-center gap-2 text-sm">
      <span className="text-foreground/70">Supprimer « {title} » ?</span>
      <button
        type="button"
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            await deletePostAction(id, slug);
            router.refresh();
          })
        }
        className="font-medium text-red-400 hover:underline"
      >
        Confirmer
      </button>
      <button
        type="button"
        onClick={() => setConfirming(false)}
        className="text-foreground/60 hover:underline"
      >
        Annuler
      </button>
    </span>
  );
}
