export interface FaqItem {
  question: string;
  answer: string;
}

export const faqItems: FaqItem[] = [
  {
    question: "Quels types de projets HEXA prend-elle en charge ?",
    answer:
      "Nous accompagnons des projets d'ingénierie logicielle, de conseil technologique, de développement web et mobile, ainsi que des projets agentiques / IA, pour des startups comme pour des grandes entreprises.",
  },
  {
    question: "Combien de temps dure un projet type ?",
    answer:
      "Cela dépend du périmètre : un site vitrine peut être livré en 3 à 6 semaines, tandis qu'une plateforme complète ou une solution agentique sur-mesure prend généralement entre 3 et 6 mois, découpés en jalons livrables.",
  },
  {
    question: "Travaillez-vous avec des entreprises en dehors de la Côte d'Ivoire ?",
    answer:
      "Oui, nous accompagnons des clients en Afrique de l'Ouest et à l'international, avec des équipes habituées au travail à distance et aux fuseaux horaires décalés.",
  },
  {
    question: "Comment se déroule la phase de cadrage ?",
    answer:
      "Nous démarrons par des ateliers d'analyse pour comprendre vos objectifs, vos contraintes techniques et vos utilisateurs, avant de proposer une architecture et un plan de livraison détaillé.",
  },
  {
    question: "Proposez-vous de la maintenance après la mise en production ?",
    answer:
      "Oui, chaque projet peut être accompagné d'un contrat de maintenance évolutive incluant le support, la supervision et les évolutions fonctionnelles.",
  },
  {
    question: "Qu'est-ce qu'un agent IA au sens où HEXA le conçoit ?",
    answer:
      "Un agent IA est un système autonome capable de raisonner sur une tâche, d'utiliser des outils (API, bases de données, documents) et d'agir pour atteindre un objectif métier précis, avec supervision humaine si nécessaire.",
  },
  {
    question: "Comment sont protégées nos données pendant un projet ?",
    answer:
      "Nous appliquons des pratiques de sécurité strictes (accès restreints, chiffrement, environnements cloisonnés) et signons systématiquement un accord de confidentialité avant le début de toute mission.",
  },
  {
    question: "Comment demander un devis ?",
    answer:
      "Il vous suffit de remplir le formulaire de la page Contact avec le détail de votre besoin : nous revenons vers vous sous 24h ouvrées avec une première estimation.",
  },
];
