# Baraka Immo — logiciel de gestion locative

Logiciel web pour **les agences immobilières** qui gèrent des biens pour le compte de propriétaires, et pour
**les propriétaires** qui gèrent eux-mêmes leurs biens. Montants en FCFA ; paiements en espèces, Wave, Orange Money,
Free Money, virement ou chèque.

Projet autonome : il ne dépend pas du site Diaspora Dakar Immo et peut être déplacé tel quel dans son propre dépôt.

## Fonctionnalités

| Module | Ce qu'il fait |
| --- | --- |
| **Biens & propriétaires** | Fiches propriétaires (dont diaspora : pays de résidence, coordonnées de reversement), biens rattachés, loyer et charges de référence, archivage. |
| **Locataires & baux** | Fiches locataires (CNI, contact d'urgence), baux avec loyer, charges, caution, jour d'échéance, date de fin. Un seul bail actif par bien, garanti par la base. |
| **Loyers & quittances** | Échéances mensuelles générées d'un clic, paiements partiels, filtres impayés/partiels/payés, **relance WhatsApp** pré-rédigée, **quittance numérotée** (Q-2026-00001…) avec montant en toutes lettres, à imprimer ou enregistrer en PDF. |
| **Commissions** | Taux par défaut de l'agence, taux par propriétaire, taux par bien. La commission est **calculée et figée par la base** à chaque encaissement. Frais de mise en location par bail. Bilan mensuel et annuel, détail par propriétaire. |
| **Dépenses & reversements** | Travaux et frais déduits du propriétaire (ou pris en charge par l'agence), reversements enregistrés, **solde à reverser** de chaque propriétaire en temps réel. |
| **Espace propriétaire** | Le propriétaire se connecte et consulte (sans pouvoir rien modifier) ses biens, les loyers du mois, ses quittances, ses relevés mensuels et les reversements reçus. |
| **Équipe** | Plusieurs utilisateurs par agence : *administrateur* (tout) ou *agent* (tout sauf paramètres, équipe et annulations). |

## Installation (une seule fois)

1. **Créer un projet Supabase** gratuit sur <https://supabase.com>.
2. Dans Supabase → *SQL Editor*, coller et exécuter le contenu de `supabase/migrations/0001_schema.sql`.
3. Dans Supabase → *Authentication* → *URL Configuration* :
   - *Site URL* : l'adresse du logiciel (par ex. `https://gestion.baraka-immo.sn`, ou `http://localhost:3002` en local) ;
   - *Redirect URLs* : ajouter `<adresse>/auth/callback`.
4. **Laisser activée** la confirmation d'email (*Authentication → Providers → Email → Confirm email*). C'est ce qui
   garantit qu'une personne ne peut pas se faire passer pour un propriétaire en s'inscrivant avec son email.
5. Copier `.env.local.example` en `.env.local` et renseigner les deux valeurs de Supabase → *Project Settings → API* :

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   ```

6. Lancer :

   ```bash
   npm install
   npm run dev        # http://localhost:3002
   ```

Pour la mise en ligne, le plus simple est [Vercel](https://vercel.com) : importer le dépôt, indiquer `baraka-immo`
comme *Root Directory* s'il est encore dans le dépôt du site, et ajouter les deux variables d'environnement.

## Utilisation au quotidien

1. **Créer son compte** (`/inscription`), puis son espace : *agence* ou *propriétaire*.
2. Ajouter les propriétaires (agence), les biens, les locataires, puis les baux. À la création d'un bail, les
   échéances depuis la date d'entrée jusqu'au mois en cours sont créées automatiquement.
3. Chaque début de mois : *Loyers & quittances* → **Générer les échéances**.
4. À chaque paiement : **Encaisser** sur la ligne du locataire → la quittance est prête à imprimer ou à envoyer.
5. En fin de mois : ouvrir le **relevé** du propriétaire (fiche propriétaire → *Relevés mensuels*), puis enregistrer
   le **reversement**.

**Donner accès à un propriétaire** : sur sa fiche, renseigner son email et cocher *Ouvrir l'espace propriétaire*. Il
crée ensuite son compte avec ce même email et arrive directement dans son espace.

**Ajouter un collaborateur** : *Paramètres* → *Inviter un collaborateur*. La personne se connecte (ou crée son compte)
avec l'email invité.

## Sécurité

Toutes les règles d'accès sont appliquées **dans la base de données** (Row Level Security de Postgres), pas seulement
dans l'interface :

- une agence ne voit jamais les données d'une autre, même en connaissant un identifiant ;
- un propriétaire ne voit que ses propres biens, loyers, dépenses et reversements, en lecture seule ;
- le numéro de quittance et la commission sont fixés par la base : on ne peut ni les falsifier, ni les modifier
  après coup. Pour corriger un paiement, un administrateur l'annule et le ressaisit ;
- l'application n'utilise que la clé publique (*anon*) de Supabase ; la clé *service_role* n'est jamais nécessaire.

## Calculs

- **Commission** = montant encaissé × taux (taux du bien, sinon du propriétaire, sinon de l'agence), arrondi au franc.
  Elle s'applique aux sommes encaissées, charges comprises.
- **Solde propriétaire** = loyers encaissés − commissions − dépenses à sa charge − reversements déjà effectués.
- **Frais de mise en location** : revenu de l'agence, comptés dans le mois d'entrée du locataire ; ils ne sont pas
  déduits du propriétaire.

## Technique

Next.js 14 (App Router, Server Actions) · Supabase (Postgres, Auth, RLS) · Tailwind CSS. Aucune autre dépendance.

```
supabase/migrations/   schéma, règles de sécurité, triggers, vues
src/app/(gestion)/     écrans de l'agence ou du propriétaire gestionnaire
src/app/portail/       espace propriétaire (lecture seule)
src/app/imprimer/      quittances et relevés imprimables
src/lib/               session, formats (FCFA, dates), montants en lettres
```

Commandes : `npm run dev`, `npm run build`, `npm run lint`, `npm run typecheck`.
