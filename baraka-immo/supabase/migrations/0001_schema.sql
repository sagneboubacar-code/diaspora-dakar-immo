-- =========================================================================
-- Gestion immobilière — schéma initial
--
-- Un « espace » (organization) est soit une agence qui gère les biens de
-- plusieurs propriétaires, soit un propriétaire qui gère lui-même ses biens.
-- Toutes les tables métier portent un org_id, et la sécurité par ligne (RLS)
-- garantit qu'un utilisateur ne voit que :
--   * les données des espaces dont il est membre (admin ou agent) ;
--   * en lecture seule, les données liées à sa fiche propriétaire quand une
--     agence lui a ouvert l'espace propriétaire (owners.user_id).
--
-- Montants en FCFA entiers (bigint) : pas de centimes, pas d'arrondi flottant.
-- Les clés étrangères composites (id, org_id) empêchent de rattacher un bail
-- à un bien d'un autre espace, même en connaissant son identifiant.
-- =========================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------- espaces

create table public.organizations (
  id                      uuid primary key default gen_random_uuid(),
  kind                    text not null check (kind in ('agence', 'proprietaire')),
  name                    text not null,
  phone                   text,
  email                   text,
  address                 text,
  city                    text,
  ninea                   text, -- identifiant fiscal (Sénégal), affiché sur les quittances
  default_commission_rate numeric(5,2) not null default 10
                            check (default_commission_rate between 0 and 100),
  receipt_prefix          text not null default 'Q',
  receipt_seq             integer not null default 0,
  created_at              timestamptz not null default now()
);

create table public.memberships (
  org_id     uuid not null references public.organizations(id) on delete cascade,
  user_id    uuid not null references auth.users(id) on delete cascade,
  role       text not null check (role in ('admin', 'agent')),
  created_at timestamptz not null default now(),
  primary key (org_id, user_id)
);
create index idx_memberships_user on public.memberships (user_id);

-- Invitation d'un collaborateur : acceptée automatiquement à la connexion
-- de la personne dont l'email (confirmé) correspond — voir claim_access().
create table public.invitations (
  id          uuid primary key default gen_random_uuid(),
  org_id      uuid not null references public.organizations(id) on delete cascade,
  email       text not null,
  role        text not null check (role in ('admin', 'agent')),
  created_at  timestamptz not null default now(),
  accepted_at timestamptz,
  unique (org_id, email)
);

-- ----------------------------------------------------------- propriétaires

create table public.owners (
  id              uuid primary key default gen_random_uuid(),
  org_id          uuid not null references public.organizations(id) on delete cascade,
  full_name       text not null,
  phone           text,
  email           text,
  country         text, -- pays de résidence (diaspora)
  address         text,
  -- Taux du mandat de gestion ; null = taux par défaut de l'espace.
  commission_rate numeric(5,2) check (commission_rate between 0 and 100),
  payout_details  text, -- coordonnées de reversement : Wave, Orange Money, IBAN...
  notes           text,
  -- Compte de l'espace propriétaire, relié par claim_access().
  user_id         uuid references auth.users(id) on delete set null,
  portal_enabled  boolean not null default false,
  created_at      timestamptz not null default now(),
  unique (id, org_id)
);
create index idx_owners_org on public.owners (org_id);
create index idx_owners_user on public.owners (user_id);

-- ------------------------------------------------------------------- biens

create table public.properties (
  id              uuid primary key default gen_random_uuid(),
  org_id          uuid not null references public.organizations(id) on delete cascade,
  owner_id        uuid not null,
  reference       text,
  name            text not null,
  type            text not null default 'appartement'
                    check (type in ('appartement', 'studio', 'chambre', 'maison', 'villa',
                                    'bureau', 'commerce', 'terrain', 'immeuble', 'autre')),
  address         text,
  city            text,
  surface_m2      numeric(10,2),
  rooms           smallint,
  rent_amount     bigint not null default 0 check (rent_amount >= 0),
  charges_amount  bigint not null default 0 check (charges_amount >= 0),
  -- Taux propre à ce bien ; null = taux du propriétaire, puis de l'espace.
  commission_rate numeric(5,2) check (commission_rate between 0 and 100),
  archived        boolean not null default false,
  notes           text,
  created_at      timestamptz not null default now(),
  unique (id, org_id),
  foreign key (owner_id, org_id) references public.owners (id, org_id)
);
create index idx_properties_org on public.properties (org_id);
create index idx_properties_owner on public.properties (owner_id);

-- --------------------------------------------------------------- locataires

create table public.tenants (
  id                uuid primary key default gen_random_uuid(),
  org_id            uuid not null references public.organizations(id) on delete cascade,
  full_name         text not null,
  phone             text,
  email             text,
  id_number         text, -- CNI / passeport
  profession        text,
  emergency_contact text,
  notes             text,
  created_at        timestamptz not null default now(),
  unique (id, org_id)
);
create index idx_tenants_org on public.tenants (org_id);

-- -------------------------------------------------------------------- baux

create table public.leases (
  id               uuid primary key default gen_random_uuid(),
  org_id           uuid not null references public.organizations(id) on delete cascade,
  property_id      uuid not null,
  tenant_id        uuid not null,
  start_date       date not null,
  end_date         date,
  rent_amount      bigint not null check (rent_amount >= 0),
  charges_amount   bigint not null default 0 check (charges_amount >= 0),
  deposit_amount   bigint not null default 0 check (deposit_amount >= 0), -- caution
  due_day          smallint not null default 5 check (due_day between 1 and 28),
  -- Frais de mise en location perçus une fois par l'agence (souvent un mois).
  agency_fee       bigint not null default 0 check (agency_fee >= 0),
  status           text not null default 'actif' check (status in ('actif', 'termine')),
  notes            text,
  created_at       timestamptz not null default now(),
  unique (id, org_id),
  foreign key (property_id, org_id) references public.properties (id, org_id),
  foreign key (tenant_id, org_id) references public.tenants (id, org_id),
  check (end_date is null or end_date >= start_date)
);
create index idx_leases_org on public.leases (org_id);
-- Un bien n'a qu'un bail actif à la fois.
create unique index uq_leases_active_property on public.leases (property_id) where status = 'actif';

-- ------------------------------------------------- échéances et paiements

-- Une échéance par bail et par mois (period = 1er jour du mois).
create table public.rent_dues (
  id             uuid primary key default gen_random_uuid(),
  org_id         uuid not null references public.organizations(id) on delete cascade,
  lease_id       uuid not null,
  period         date not null check (extract(day from period) = 1),
  due_date       date not null,
  rent_amount    bigint not null check (rent_amount >= 0),
  charges_amount bigint not null default 0 check (charges_amount >= 0),
  created_at     timestamptz not null default now(),
  unique (id, org_id),
  unique (lease_id, period),
  foreign key (lease_id, org_id) references public.leases (id, org_id) on delete cascade
);
create index idx_rent_dues_org_period on public.rent_dues (org_id, period);

-- Un encaissement (plusieurs possibles par échéance : paiements partiels).
-- La commission est figée au moment de l'encaissement : changer un taux
-- plus tard ne réécrit pas les relevés déjà envoyés.
create table public.payments (
  id                uuid primary key default gen_random_uuid(),
  org_id            uuid not null references public.organizations(id) on delete cascade,
  due_id            uuid not null,
  amount            bigint not null check (amount > 0),
  paid_on           date not null default current_date,
  method            text not null default 'especes'
                      check (method in ('especes', 'wave', 'orange_money', 'free_money',
                                        'virement', 'cheque', 'autre')),
  reference         text,
  receipt_number    text,
  commission_rate   numeric(5,2) not null default 0,
  commission_amount bigint not null default 0,
  notes             text,
  created_at        timestamptz not null default now(),
  foreign key (due_id, org_id) references public.rent_dues (id, org_id) on delete cascade
);
create index idx_payments_org_paid_on on public.payments (org_id, paid_on);
create index idx_payments_due on public.payments (due_id);
create unique index uq_payments_receipt on public.payments (org_id, receipt_number);

-- ------------------------------------------------------------- dépenses

create table public.expenses (
  id              uuid primary key default gen_random_uuid(),
  org_id          uuid not null references public.organizations(id) on delete cascade,
  property_id     uuid not null,
  spent_on        date not null default current_date,
  category        text not null default 'reparation'
                    check (category in ('reparation', 'entretien', 'taxe', 'facture',
                                        'assurance', 'autre')),
  label           text not null,
  amount          bigint not null check (amount > 0),
  -- false = dépense supportée par l'agence, sans impact sur le relevé.
  charge_to_owner boolean not null default true,
  created_at      timestamptz not null default now(),
  foreign key (property_id, org_id) references public.properties (id, org_id)
);
create index idx_expenses_org_spent_on on public.expenses (org_id, spent_on);

-- --------------------------------------------- reversements au propriétaire

create table public.payouts (
  id         uuid primary key default gen_random_uuid(),
  org_id     uuid not null references public.organizations(id) on delete cascade,
  owner_id   uuid not null,
  paid_on    date not null default current_date,
  amount     bigint not null check (amount > 0),
  method     text not null default 'virement'
               check (method in ('especes', 'wave', 'orange_money', 'free_money',
                                 'virement', 'cheque', 'autre')),
  reference  text,
  notes      text,
  created_at timestamptz not null default now(),
  foreign key (owner_id, org_id) references public.owners (id, org_id)
);
create index idx_payouts_org_paid_on on public.payouts (org_id, paid_on);

-- =========================================================================
-- Fonctions d'accès (security definer : lisent memberships/owners sans
-- repasser par leur propre RLS, ce qui évite la récursion).
-- =========================================================================

create function public.is_member(o uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from memberships where org_id = o and user_id = auth.uid());
$$;

create function public.is_admin(o uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from memberships
                 where org_id = o and user_id = auth.uid() and role = 'admin');
$$;

create function public.is_my_owner(owner uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from owners
                 where id = owner and user_id = auth.uid() and portal_enabled);
$$;

create function public.owns_property(pid uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from properties p join owners o on o.id = p.owner_id
                 where p.id = pid and o.user_id = auth.uid() and o.portal_enabled);
$$;

create function public.owns_lease(lid uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from leases l
                 join properties p on p.id = l.property_id
                 join owners o on o.id = p.owner_id
                 where l.id = lid and o.user_id = auth.uid() and o.portal_enabled);
$$;

create function public.owns_due(did uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from rent_dues d
                 join leases l on l.id = d.lease_id
                 join properties p on p.id = l.property_id
                 join owners o on o.id = p.owner_id
                 where d.id = did and o.user_id = auth.uid() and o.portal_enabled);
$$;

create function public.owns_tenant(tid uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from leases l
                 join properties p on p.id = l.property_id
                 join owners o on o.id = p.owner_id
                 where l.tenant_id = tid and o.user_id = auth.uid() and o.portal_enabled);
$$;

create function public.is_portal_org(o uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from owners
                 where org_id = o and user_id = auth.uid() and portal_enabled);
$$;

-- =========================================================================
-- RLS
-- =========================================================================

alter table public.organizations enable row level security;
alter table public.memberships   enable row level security;
alter table public.invitations   enable row level security;
alter table public.owners        enable row level security;
alter table public.properties    enable row level security;
alter table public.tenants       enable row level security;
alter table public.leases        enable row level security;
alter table public.rent_dues     enable row level security;
alter table public.payments      enable row level security;
alter table public.expenses      enable row level security;
alter table public.payouts       enable row level security;

-- Espaces : créés uniquement via create_organization() ; seuls les admins
-- modifient les réglages (le compteur de quittances est protégé par trigger).
create policy org_select on public.organizations for select
  using (public.is_member(id) or public.is_portal_org(id));
create policy org_update on public.organizations for update
  using (public.is_admin(id)) with check (public.is_admin(id));

create policy memberships_select on public.memberships for select
  using (public.is_member(org_id));
create policy memberships_admin_delete on public.memberships for delete
  using (public.is_admin(org_id) and user_id <> auth.uid());
create policy memberships_admin_update on public.memberships for update
  using (public.is_admin(org_id) and user_id <> auth.uid())
  with check (public.is_admin(org_id));

create policy invitations_admin on public.invitations for all
  using (public.is_admin(org_id)) with check (public.is_admin(org_id));

-- Tables métier : lecture/écriture pour les membres, lecture seule pour le
-- propriétaire concerné.
create policy owners_member on public.owners for all
  using (public.is_member(org_id)) with check (public.is_member(org_id));
create policy owners_portal on public.owners for select
  using (user_id = auth.uid() and portal_enabled);

create policy properties_member on public.properties for all
  using (public.is_member(org_id)) with check (public.is_member(org_id));
create policy properties_portal on public.properties for select
  using (public.is_my_owner(owner_id));

create policy tenants_member on public.tenants for all
  using (public.is_member(org_id)) with check (public.is_member(org_id));
create policy tenants_portal on public.tenants for select
  using (public.owns_tenant(id));

create policy leases_member on public.leases for all
  using (public.is_member(org_id)) with check (public.is_member(org_id));
create policy leases_portal on public.leases for select
  using (public.owns_property(property_id));

create policy rent_dues_member on public.rent_dues for all
  using (public.is_member(org_id)) with check (public.is_member(org_id));
create policy rent_dues_portal on public.rent_dues for select
  using (public.owns_lease(lease_id));

create policy payments_member on public.payments for all
  using (public.is_member(org_id)) with check (public.is_member(org_id));
create policy payments_portal on public.payments for select
  using (public.owns_due(due_id));

create policy expenses_member on public.expenses for all
  using (public.is_member(org_id)) with check (public.is_member(org_id));
create policy expenses_portal on public.expenses for select
  using (charge_to_owner and public.owns_property(property_id));

create policy payouts_member on public.payouts for all
  using (public.is_member(org_id)) with check (public.is_member(org_id));
create policy payouts_portal on public.payouts for select
  using (public.is_my_owner(owner_id));

-- =========================================================================
-- Triggers
-- =========================================================================

-- Le compteur de quittances n'est modifiable que par le trigger de paiement.
create function public.protect_receipt_seq() returns trigger
language plpgsql as $$
begin
  if new.receipt_seq is distinct from old.receipt_seq
     and current_setting('app.bump_receipt', true) is distinct from 'on' then
    new.receipt_seq := old.receipt_seq;
  end if;
  return new;
end;
$$;
create trigger trg_protect_receipt_seq before update on public.organizations
  for each row execute function public.protect_receipt_seq();

-- À l'encaissement : numéro de quittance séquentiel par espace, et
-- commission figée (bien > propriétaire > espace). Les champs envoyés par
-- le client sont ignorés : on ne peut pas s'attribuer un taux arbitraire.
create function public.before_payment_insert() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  v_rate numeric(5,2);
  v_seq  integer;
  v_pref text;
begin
  select coalesce(p.commission_rate, o.commission_rate, org.default_commission_rate)
    into v_rate
    from rent_dues d
    join leases l on l.id = d.lease_id
    join properties p on p.id = l.property_id
    join owners o on o.id = p.owner_id
    join organizations org on org.id = d.org_id
   where d.id = new.due_id;

  perform set_config('app.bump_receipt', 'on', true);
  update organizations set receipt_seq = receipt_seq + 1
   where id = new.org_id
   returning receipt_seq, receipt_prefix into v_seq, v_pref;
  perform set_config('app.bump_receipt', 'off', true);

  new.commission_rate   := coalesce(v_rate, 0);
  new.commission_amount := round(new.amount * coalesce(v_rate, 0) / 100);
  new.receipt_number    := v_pref || '-' || to_char(new.paid_on, 'YYYY') || '-'
                           || lpad(v_seq::text, 5, '0');
  return new;
end;
$$;
create trigger trg_before_payment_insert before insert on public.payments
  for each row execute function public.before_payment_insert();

-- Un paiement enregistré ne change plus de montant ni de numéro : pour
-- corriger, on le supprime et on le ressaisit (trace dans le journal Supabase).
create function public.freeze_payment() returns trigger
language plpgsql as $$
begin
  new.amount            := old.amount;
  new.due_id            := old.due_id;
  new.receipt_number    := old.receipt_number;
  new.commission_rate   := old.commission_rate;
  new.commission_amount := old.commission_amount;
  return new;
end;
$$;
create trigger trg_freeze_payment before update on public.payments
  for each row execute function public.freeze_payment();

-- =========================================================================
-- RPC
-- =========================================================================

-- Création d'un espace par l'utilisateur connecté, qui en devient admin.
-- Un propriétaire indépendant a automatiquement sa propre fiche, à 0 %.
create function public.create_organization(p_kind text, p_name text, p_phone text default null)
returns uuid
language plpgsql security definer set search_path = public as $$
declare
  v_org  uuid;
  v_mail text;
begin
  if auth.uid() is null then
    raise exception 'Connexion requise';
  end if;
  if p_kind not in ('agence', 'proprietaire') then
    raise exception 'Type d''espace invalide';
  end if;

  insert into organizations (kind, name, phone, default_commission_rate)
  values (p_kind, p_name, p_phone, case when p_kind = 'agence' then 10 else 0 end)
  returning id into v_org;

  insert into memberships (org_id, user_id, role) values (v_org, auth.uid(), 'admin');

  if p_kind = 'proprietaire' then
    select email into v_mail from auth.users where id = auth.uid();
    insert into owners (org_id, full_name, phone, email, commission_rate)
    values (v_org, p_name, p_phone, v_mail, 0);
  end if;

  return v_org;
end;
$$;

-- À chaque connexion : accepte les invitations et relie les fiches
-- propriétaire correspondant à l'email CONFIRMÉ de l'utilisateur.
create function public.claim_access() returns void
language plpgsql security definer set search_path = public as $$
declare
  v_mail text;
begin
  select lower(email) into v_mail from auth.users
   where id = auth.uid() and email_confirmed_at is not null;
  if v_mail is null then
    return;
  end if;

  insert into memberships (org_id, user_id, role)
  select i.org_id, auth.uid(), i.role from invitations i
   where lower(i.email) = v_mail and i.accepted_at is null
  on conflict (org_id, user_id) do nothing;

  update invitations set accepted_at = now()
   where lower(email) = v_mail and accepted_at is null;

  update owners set user_id = auth.uid()
   where lower(email) = v_mail and portal_enabled and user_id is null;
end;
$$;

-- Crée les échéances du mois pour tous les baux actifs de l'espace qui
-- couvrent ce mois. Idempotent : relancer ne crée pas de doublon.
create function public.generate_dues(p_org uuid, p_period date) returns integer
language plpgsql security invoker set search_path = public as $$
declare
  v_period date := date_trunc('month', p_period)::date;
  v_count  integer;
begin
  if not public.is_member(p_org) then
    raise exception 'Accès refusé';
  end if;

  insert into rent_dues (org_id, lease_id, period, due_date, rent_amount, charges_amount)
  select l.org_id, l.id, v_period,
         v_period + (l.due_day - 1),
         l.rent_amount, l.charges_amount
    from leases l
   where l.org_id = p_org
     and l.status = 'actif'
     and l.start_date < (v_period + interval '1 month')
     and (l.end_date is null or l.end_date >= v_period)
  on conflict (lease_id, period) do nothing;

  get diagnostics v_count = row_count;
  return v_count;
end;
$$;

-- Membres d'un espace avec leur email (auth.users n'est pas lisible
-- directement depuis le client).
create function public.org_members(p_org uuid)
returns table (user_id uuid, email text, role text, created_at timestamptz)
language sql stable security definer set search_path = public as $$
  select m.user_id, u.email::text, m.role, m.created_at
    from memberships m join auth.users u on u.id = m.user_id
   where m.org_id = p_org and public.is_member(p_org)
   order by m.created_at;
$$;

revoke execute on function public.org_members(uuid) from anon;
revoke execute on function public.create_organization(text, text, text) from anon;
revoke execute on function public.claim_access() from anon;
revoke execute on function public.generate_dues(uuid, date) from anon;

-- =========================================================================
-- Vues (security_invoker : la RLS des tables sous-jacentes s'applique)
-- =========================================================================

create view public.v_dues with (security_invoker = true) as
select d.id, d.org_id, d.lease_id, d.period, d.due_date,
       d.rent_amount, d.charges_amount,
       d.rent_amount + d.charges_amount as amount_due,
       l.property_id, l.tenant_id, p.owner_id,
       p.name  as property_name,
       t.full_name as tenant_name,
       t.phone as tenant_phone,
       o.full_name as owner_name,
       coalesce(s.paid, 0) as amount_paid,
       d.rent_amount + d.charges_amount - coalesce(s.paid, 0) as balance,
       case
         when coalesce(s.paid, 0) >= d.rent_amount + d.charges_amount then 'paye'
         when coalesce(s.paid, 0) > 0 then 'partiel'
         when d.due_date < current_date then 'impaye'
         else 'a_venir'
       end as status
  from rent_dues d
  join leases l     on l.id = d.lease_id
  join properties p on p.id = l.property_id
  join tenants t    on t.id = l.tenant_id
  join owners o     on o.id = p.owner_id
  left join lateral (select sum(amount) as paid from payments where due_id = d.id) s on true;

create view public.v_payments with (security_invoker = true) as
select pay.*, d.period, l.property_id, l.tenant_id, p.owner_id,
       p.name as property_name, t.full_name as tenant_name, o.full_name as owner_name
  from payments pay
  join rent_dues d  on d.id = pay.due_id
  join leases l     on l.id = d.lease_id
  join properties p on p.id = l.property_id
  join tenants t    on t.id = l.tenant_id
  join owners o     on o.id = p.owner_id;

-- Solde de chaque propriétaire : encaissé − commissions − dépenses − reversements.
create view public.v_owner_balances with (security_invoker = true) as
select o.id as owner_id, o.org_id, o.full_name,
       coalesce(c.collected, 0)  as collected,
       coalesce(c.commission, 0) as commission,
       coalesce(e.expenses, 0)   as expenses,
       coalesce(po.paid_out, 0)  as paid_out,
       coalesce(c.collected, 0) - coalesce(c.commission, 0)
         - coalesce(e.expenses, 0) - coalesce(po.paid_out, 0) as balance
  from owners o
  left join lateral (
    select sum(vp.amount) as collected, sum(vp.commission_amount) as commission
      from v_payments vp where vp.owner_id = o.id) c on true
  left join lateral (
    select sum(x.amount) as expenses
      from expenses x join properties p on p.id = x.property_id
     where p.owner_id = o.id and x.charge_to_owner) e on true
  left join lateral (
    select sum(amount) as paid_out from payouts where owner_id = o.id) po on true;
