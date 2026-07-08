"use client";

import { useEffect, useState } from "react";
import { ShareLinkedIn } from "@/components/blog/ShareLinkedIn";

interface AdminOnlyShareLinkedInProps {
  url: string;
  title: string;
  excerpt: string;
}

// Vérifié côté client (après chargement de la page) plutôt que dans le
// composant serveur de l'article : ce dernier utilise `revalidate` (ISR) pour
// rester rapide pour le crawler LinkedIn — lire les cookies de session admin
// y forcerait un rendu 100% dynamique et casserait ce cache.
export function AdminOnlyShareLinkedIn(props: AdminOnlyShareLinkedInProps) {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/admin/session")
      .then((res) => res.json())
      .then((data: { isAdmin: boolean }) => {
        if (!cancelled && data.isAdmin) setIsAdmin(true);
      })
      .catch(() => {
        // Pas de session admin détectable : on n'affiche simplement rien.
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (!isAdmin) return null;

  return <ShareLinkedIn {...props} />;
}
