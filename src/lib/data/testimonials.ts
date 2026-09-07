import type { Testimonial } from "./types";

// Témoignages réels, transmis par les clients eux-mêmes et repris mot pour
// mot. Ne jamais en inventer ni en reformuler : la liste reste vide tant que
// l'agence n'en fournit pas.
export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Omar Simond",
    country: "Dakar, Sénégal",
    flag: "🇸🇳",
    location: "Cité Apix, Tivaouane Peulh",
    headline: "Un accompagnement complet, du terrain jusqu'à la remise des clés",
    project: "Acquisition du terrain + construction d'une maison R+1 clés en main",
    quote: [
      "Lorsque j'ai décidé de réaliser mon projet immobilier, mes principales inquiétudes concernaient le choix du lieu et du voisinage, la disponibilité de l'eau, les risques d'escroquerie ainsi que la qualité de la construction.",
      "J'ai choisi Diaspora Dakar Immo parce que le directeur accorde une réelle importance à la qualité et à la bonne réalisation des projets.",
      "J'ai été accompagné depuis l'acquisition du terrain jusqu'à la construction de ma maison R+1 clés en main. Je reçois régulièrement des photos et des vidéos qui me permettent de suivre l'évolution du chantier. Le directeur se déplace également sur place pour suivre personnellement l'avancement des travaux, ce que j'apprécie beaucoup.",
      "Je recommande Diaspora Dakar Immo à toute personne qui souhaite réaliser un projet immobilier au Sénégal et qui recherche de la qualité, voire une construction haut de gamme.",
    ],
  },
];
