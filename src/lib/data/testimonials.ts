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
  {
    name: "Kaba Cissé",
    country: "Paris 14e, France",
    flag: "🇫🇷",
    badge: "Client diaspora",
    headline: "Un suivi à distance étape par étape",
    projects: [
      {
        title: "Construction d'une maison familiale à plusieurs étages",
        location: "Cité Gadaye, Guédiawaye",
      },
    ],
    quote: [
      "Notre projet était de construire une maison familiale avec plusieurs étages, puisque nous avons une famille nombreuse, Al Hamdulilah.",
      "Franchement, pour être honnête, nous n'étions pas particulièrement inquiets, car nous avons été directement rassurés par Diaspora Dakar Immo et nous avons mis ce projet entre les mains de Dieu.",
      "C'est une connaissance à Dakar qui nous a mis en contact avec Diaspora Dakar Immo et qui nous en a dit beaucoup de bien.",
      "Le suivi s'est fait à distance lorsque nous étions en France. Nous recevions régulièrement des vidéos du chantier, avec l'avancement étape par étape. Nous étions également au Sénégal une à deux fois par an pendant plusieurs mois, ce qui nous permettait de voir l'avancement du projet directement sur place.",
      "À quelqu'un qui hésite encore, je lui dirais : “Let's go, vas-y ! Tu n'auras pas de regret, Insh'Allah.” Le Sénégal est un très beau pays et avec Diaspora Dakar Immo, tout est encore plus beau.",
    ],
  },
  {
    name: "Marème Soda Gueye",
    country: "Italie",
    flag: "🇮🇹",
    badge: "Cliente diaspora",
    headline: "Une relation de confiance qui dure depuis 2008",
    projects: [
      {
        title: "Acquisition du terrain + construction d'une maison R+1",
        location: "Cité Gadaye, Guédiawaye",
      },
      { title: "Gestion locative du bien", location: "Cité Gadaye, Guédiawaye" },
    ],
    quote: [
      "Mon projet avec Diaspora Dakar Immo a commencé par l'acquisition d'un terrain, suivie de la construction d'une maison R+1. Depuis, Diaspora Dakar Immo assure également la gestion locative de mon bien.",
      "Vivant en Italie, ma principale inquiétude était de pouvoir faire confiance à une équipe sérieuse et engagée, sans avoir à craindre la trahison ou le manque de suivi.",
      "Au fil des années, j'ai apprécié leur fidélité, leur véritable engagement et la confiance qui s'est installée entre nous.",
      "Aujourd'hui, je peux dire que cette collaboration se fait dans la confiance et avec une bonne gestion. Je ne regrette pas de leur avoir confié mon projet et la gestion de mon bien.",
      "À une personne qui souhaite investir au Sénégal depuis l'étranger, je dirais : soyez courageux, restez attentif, mais n'ayez pas peur de vous lancer avec une équipe de confiance.",
    ],
  },
];
