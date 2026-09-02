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

## Contenu à compléter par l'agence

- `src/lib/data/properties.ts` — biens (terrains, maisons, villas, appartements, projets)
- `src/lib/data/realisations.ts` — chantiers réels (photos avant/pendant/après)
- `src/lib/data/testimonials.ts` — témoignages clients
- `public/` — logo et photos réelles (le Hero utilise un dégradé de marque en attendant une vraie photo)
