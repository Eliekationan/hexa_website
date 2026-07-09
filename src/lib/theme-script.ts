/**
 * Exécuté de façon synchrone dans <head>, avant l'hydratation React, pour
 * poser data-theme sur <html> avant le premier paint — sans ça, la page
 * s'afficherait un instant dans le mauvais thème (flash), le temps que React
 * charge et applique la préférence de l'utilisateur.
 */
export const themeInitScript = `(function() {
  try {
    var stored = localStorage.getItem('hexa-theme');
    var theme = stored === 'light' || stored === 'dark'
      ? stored
      : (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {}
})();`;
