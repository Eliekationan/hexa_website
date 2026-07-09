"use client";

import { useEffect, useState } from "react";
import { SunIcon, MoonIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

type Theme = "light" | "dark";

const STORAGE_KEY = "hexa-theme";

export function ThemeToggle({ className }: { className?: string }) {
  // null tant que le thème réel (posé par le script anti-flash dans <head>,
  // avant l'hydratation) n'a pas été lu côté client — évite un mismatch
  // d'hydratation entre le rendu serveur et le thème effectif de l'utilisateur.
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme");
    setTheme(current === "light" ? "light" : "dark");
  }, []);

  function toggleTheme() {
    const next: Theme = theme === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem(STORAGE_KEY, next);
    setTheme(next);
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === "light" ? "Passer au thème sombre" : "Passer au thème clair"}
      className={cn(
        "text-foreground/80 hover:text-foreground flex h-10 w-10 items-center justify-center rounded-full transition-colors",
        className,
      )}
    >
      {theme === null ? null : theme === "light" ? <MoonIcon /> : <SunIcon />}
    </button>
  );
}
