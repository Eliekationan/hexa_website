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
    phone: "+225 07 58 752 437",
    hours: "7j/7, 8h30 – 18h00",
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
  hero: {
    title: "L'ingénierie logicielle qui accélère votre croissance",
    subtitle:
      "HEXA conçoit des produits web, mobile et agentiques sur-mesure, du cadrage stratégique jusqu'à la mise en production.",
    primaryCta: { label: "Prendre rendez-vous", href: "/contact" },
    secondaryCta: { label: "Découvrir nos services", href: "#services" },
  },
  sections: {
    services: {
      eyebrow: "Ce que nous faisons",
      title: "Des services pensés pour votre croissance",
      description:
        "De l'ingénierie logicielle à l'agentique, HEXA couvre l'ensemble du cycle de vie de vos produits numériques.",
    },
    stats: {
      eyebrow: "Pourquoi HEXA",
      title: "La confiance se mesure aux résultats",
      description:
        "Des années d'expertise mises au service de la fiabilité et de la satisfaction de nos clients.",
    },
    technologies: {
      eyebrow: "Notre stack",
      title: "Des technologies éprouvées",
      description:
        "Nous choisissons des outils robustes et éprouvés, adaptés à la taille et aux ambitions de chaque projet.",
    },
    process: {
      eyebrow: "Notre méthode",
      title: "Un processus clair, du cadrage à la maintenance",
      description:
        "Chaque projet suit les mêmes fondamentaux de rigueur, avec une transparence totale à chaque étape.",
    },
    projects: {
      eyebrow: "Nos réalisations",
      title: "Des projets qui font la différence",
      description:
        "Un aperçu de missions menées pour des clients dans le web, le mobile, l'agentique et le conseil.",
    },
    testimonials: {
      eyebrow: "Ils nous font confiance",
      title: "La parole à nos clients",
      description: "",
    },
    faq: {
      eyebrow: "Questions fréquentes",
      title: "Tout ce qu'il faut savoir avant de démarrer",
      description: "",
    },
  },
} as const;

export type SiteConfig = typeof siteConfig;
