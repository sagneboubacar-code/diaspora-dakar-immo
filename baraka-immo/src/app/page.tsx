import Link from "next/link";
import { redirect } from "next/navigation";
import { Logo } from "./AuthShell";
import { APP_NAME, APP_TAGLINE } from "@/lib/config";
import { getSession, homeFor } from "@/lib/session";
import { supabaseConfigured } from "@/lib/supabase/server";

const FEATURES = [
  ["Biens & propriétaires", "Tous les biens gérés, rattachés à leur propriétaire, au Sénégal comme dans la diaspora."],
  ["Locataires & baux", "Contrats, loyer, charges, caution, jour d'échéance. Un bail actif par bien, sans erreur possible."],
  ["Loyers & quittances", "Échéances générées chaque mois, paiements partiels, relances WhatsApp, quittances numérotées en PDF."],
  ["Commissions d'agence", "Honoraires de gestion calculés et figés à chaque encaissement, frais de mise en location, bilan mensuel."],
  ["Reversements", "Solde de chaque propriétaire en temps réel : encaissé − commission − dépenses − déjà reversé."],
  ["Espace propriétaire", "Le propriétaire se connecte et consulte ses biens, ses loyers, ses relevés mensuels, depuis n'importe quel pays."],
];

export default async function Home() {
  if (supabaseConfigured()) {
    const s = await getSession();
    if (s) redirect(homeFor(s));
  }

  return (
    <main className="min-h-screen bg-white">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
        <span className="flex items-center gap-2 text-lg font-bold">
          <Logo /> {APP_NAME}
        </span>
        <nav className="flex gap-2">
          <Link href="/connexion" className="btn">
            Connexion
          </Link>
          <Link href="/inscription" className="btn btn-primary">
            Créer un compte
          </Link>
        </nav>
      </header>

      <section className="mx-auto max-w-6xl px-4 pb-16 pt-12 sm:pt-20">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand">{APP_TAGLINE}</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl">
          Loyers, quittances, commissions et reversements, enfin au même endroit.
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-slate-600">
          Pour les agences qui gèrent des biens pour le compte de propriétaires, et pour les propriétaires qui gèrent
          eux-mêmes. Montants en FCFA, paiements Wave, Orange Money, espèces ou virement.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/inscription" className="btn btn-primary px-5 py-2.5 text-base">
            Commencer gratuitement
          </Link>
          <Link href="/connexion" className="btn px-5 py-2.5 text-base">
            J&apos;ai déjà un compte
          </Link>
        </div>
        {!supabaseConfigured() && (
          <p className="mt-6 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
            Configuration manquante : renseignez NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY (voir le
            README).
          </p>
        )}
      </section>

      <section className="border-t border-slate-100 bg-slate-50">
        <div className="mx-auto grid max-w-6xl gap-4 px-4 py-14 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(([title, text]) => (
            <div key={title} className="card p-5">
              <h2 className="font-semibold">{title}</h2>
              <p className="mt-1.5 text-sm text-slate-600">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
