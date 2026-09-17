# Diaspora Dakar Immo — site vitrine

Next.js (App Router) + Tailwind CSS. Formulaires : Supabase (table `leads`, insert-only) + redirection WhatsApp.

## Démarrer

```bash
npm install
npm run dev
```

## Configuration

Copier `.env.local.example` en `.env.local` et renseigner un projet Supabase :

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Puis exécuter `supabase/migrations/0001_leads.sql` dans l'éditeur SQL Supabase. Sans ces variables, les formulaires
fonctionnent quand même (redirection WhatsApp) mais les demandes ne sont pas enregistrées en base.

## Vignettes des vidéos

Les vidéos de l'agence sont filmées au téléphone : elles sont en **portrait**, et
sans vignette un `<video>` s'affiche en rectangle noir. Chaque `.mp4` de `public/`
a donc un `.jpg` du même nom à côté de lui, généré une fois pour toutes :

```bash
./scripts/generate-posters.sh   # nécessite ffmpeg
```

Le script choisit l'image la plus détaillée parmi plusieurs instants du film. Si le
résultat tombe mal pour une vidéo, ajouter son chemin et une seconde précise dans
`FIXED_SECONDS`, en haut du script, plutôt que de remplacer le fichier à la main —
sinon la prochaine exécution écrase le choix.

**À relancer après l'ajout d'une nouvelle vidéo** : sans vignette, le bien ou le
chantier concerné s'affichera en noir.

## Contenu à compléter par l'agence

- `src/lib/data/properties.ts` — biens (terrains, maisons, villas, appartements, projets)
- `src/lib/data/realisations.ts` — chantiers réels (photos avant/pendant/après)
- `src/lib/data/testimonials.ts` — témoignages clients
- `public/` — logo et photos réelles (le Hero utilise un dégradé de marque en attendant une vraie photo)
