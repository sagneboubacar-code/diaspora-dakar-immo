import type { Testimonial } from "./types";

// Témoignages réels, transmis par les clients eux-mêmes et repris mot pour
// mot. Ne jamais en inventer ni en reformuler : la liste reste vide tant que
// l'agence n'en fournit pas. Les projets sont sortis du texte et placés dans
// `projects` — ce sont des informations de contexte, pas des paroles du
// client.
export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Omar Simond",
    country: "Dakar, Sénégal",
    flag: "🇸🇳",
    badge: "Client au Sénégal",
    headline: "Un accompagnement complet, du terrain jusqu'à la remise des clés",
    projects: [
      {
        title: "Acquisition du terrain + construction d'une maison R+1 clés en main",
        location: "Cité Apix, Tivaouane Peulh",
      },
    ],
    quote: [
      "Lorsque j'ai décidé de réaliser mon projet immobilier, mes principales inquiétudes concernaient le choix du lieu et du voisinage, la disponibilité de l'eau, les risques d'escroquerie ainsi que la qualité de la construction.",
      "J'ai choisi Diaspora Dakar Immo parce que le directeur accorde une réelle importance à la qualité et à la bonne réalisation des projets.",
      "J'ai été accompagné depuis l'acquisition du terrain jusqu'à la construction de ma maison R+1 clés en main. Je reçois régulièrement des photos et des vidéos qui me permettent de suivre l'évolution du chantier. Le directeur se déplace également sur place pour suivre personnellement l'avancement des travaux, ce que j'apprécie beaucoup.",
      "Je recommande Diaspora Dakar Immo à toute personne qui souhaite réaliser un projet immobilier au Sénégal et qui recherche de la qualité, voire une construction haut de gamme.",
    ],
  },
  {
    name: "M. Dieng",
    country: "Bordeaux, France",
    flag: "🇫🇷",
    badge: "Client diaspora",
    headline: "Une première expérience qui m'a conduit à leur confier un nouveau projet",
    projects: [
      { title: "Extension d'une maison de R à R+1", location: "Hamo 6, Guédiawaye" },
      { title: "Achat d'un terrain + construction d'une maison R+2", location: "Cité Gadaye" },
    ],
    quote: [
      "Avant de commencer, j'étais inquiet quant à l'aboutissement du projet. La présentation et les explications du gérant m'ont convaincu de choisir Diaspora Dakar Immo.",
      "J'ai apprécié les échanges au fur et à mesure de l'avancement des travaux, illustrés par des photos et des vidéos qui me permettaient de suivre le projet à distance.",
      "Je recommande cette société. Le devis a été respecté. À la suite de cette première expérience, j'ai confié à Diaspora Dakar Immo l'achat d'un terrain et la construction d'une maison R+2.",
      "Je n'ai pas été déçu, car ce deuxième projet a également été réalisé à distance.",
    ],
  },
  {
    name: "Pape Djibril Diop",
    country: "New York, États-Unis",
    flag: "🇺🇸",
    badge: "Propriétaire bailleur",
    headline: "Une gestion transparente et un suivi efficace, même à distance",
    projectsLabel: "Service",
    projects: [
      { title: "Gestion locative de 3 appartements (immeuble R+3)", location: "Cambérène, Dakar" },
    ],
    quote: [
      "Mon projet était de confier la gestion locative de plusieurs appartements situés dans mon immeuble R+3 au Sénégal. Diaspora Dakar Immo gère actuellement la location de trois de mes appartements.",
      "Mes principales inquiétudes concernaient surtout la transparence, la fiabilité de la gestion et le suivi à distance. Je voulais être sûr que les loyers seraient bien versés, que les éventuels problèmes seraient signalés rapidement et que l'immeuble serait correctement suivi.",
      "J'ai choisi de leur faire confiance parce qu'ils ont été honnêtes et transparents avec moi dès le début. Jusqu'à présent, je n'ai pas eu de problème particulier avec eux, ce qui a renforcé ma confiance.",
      "Le suivi à distance se passe bien. Les paiements sont généralement effectués automatiquement sur mon compte et je vérifie chaque mois que tout est en ordre. Lorsqu'il y a un problème dans l'immeuble, je suis informé. Lorsque je demande au responsable de s'occuper d'une situation, il le fait et revient vers moi avec un suivi.",
      "Je dirais à toute personne qui souhaite investir ou faire gérer un bien au Sénégal qu'il est important de travailler avec une équipe sérieuse, transparente et disponible. Mon expérience avec Diaspora Dakar Immo a été positive jusqu'à présent, et je suis satisfait de leur gestion et de leur suivi.",
    ],
  },
];
