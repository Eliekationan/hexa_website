export const siteConfig = {
  name: "HEXA",
  legalName: "HEXA SARL",
  tagline: "Ingénierie, conseil et développement web, mobile et agentique",
  description:
    "HEXA accompagne les entreprises dans leurs projets d'ingénierie logicielle, de conseil technologique et de développement web, mobile et agentique / IA.",
  url: "https://hexa.ci",
  locale: "fr-CI",
  contact: {
    address: "Rue des Jardins, Cocody, Abidjan, Côte d'Ivoire",
    email: "contact@hexa.ci",
    phone: "+225 27 22 49 50 60",
    hours: "Lundi – Vendredi, 8h30 – 18h00",
    mapEmbedUrl:
      "https://www.openstreetmap.org/export/embed.html?bbox=-3.9994%2C5.3398%2C-3.9694%2C5.3598&layer=mapnik&marker=5.3498%2C-3.9844",
    mapLinkUrl:
      "https://www.openstreetmap.org/?mlat=5.3498&mlon=-3.9844#map=14/5.3498/-3.9844",
  },
  social: {
    linkedin: "https://www.linkedin.com/company/hexa",
    x: "https://x.com/hexa",
    github: "https://github.com/hexa",
  },
  nav: [
    { label: "Services", href: "#services" },
    { label: "Pourquoi HEXA", href: "#pourquoi-hexa" },
    { label: "Technologies", href: "#technologies" },
    { label: "Processus", href: "#processus" },
    { label: "Réalisations", href: "#realisations" },
    { label: "FAQ", href: "#faq" },
    { label: "Contact", href: "/contact" },
  ],
  cta: {
    label: "Prendre rendez-vous",
    href: "/contact",
  },
} as const;

export type SiteConfig = typeof siteConfig;
