export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="bg-accent text-accent-foreground sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-lg focus:px-4 focus:py-2 focus:text-sm focus:font-medium"
    >
      Aller au contenu principal
    </a>
  );
}
