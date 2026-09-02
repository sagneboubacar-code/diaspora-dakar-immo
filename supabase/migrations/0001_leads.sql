-- =========================================================================
-- Demandes reçues via les formulaires du site (contact, projet diaspora,
-- intérêt pour un bien). Insert-only depuis le site public (clé anon) ;
-- la consultation se fait pour l'instant depuis le Table Editor Supabase —
-- un back-office dédié (section 23 du cahier des charges) pourra être
-- branché plus tard sans changer ce schéma.
-- =========================================================================

create extension if not exists "pgcrypto";

create table public.leads (
  id            uuid primary key default gen_random_uuid(),
  source        text not null check (source in ('contact', 'diaspora', 'bien', 'whatsapp_flottant')),
  full_name     text not null,
  country       text,
  phone         text,
  email         text,
  project_type  text,
  location      text,
  budget        text,
  message       text,
  property_slug text,
  created_at    timestamptz not null default now()
);

create index idx_leads_created_at on public.leads (created_at desc);

alter table public.leads enable row level security;

-- Le site public peut créer une demande, mais jamais en lire (les
-- consulter nécessite la clé service_role, réservée au back-office futur).
create policy "leads_insert_public" on public.leads
  for insert
  with check (true);
