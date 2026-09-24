import { redirect } from "next/navigation";
import { AuthShell } from "../AuthShell";
import { Flash, Input } from "@/components/ui";
import { SubmitButton } from "@/components/buttons";
import { createOrganization, signOut } from "../auth-actions";
import { getSession, homeFor } from "@/lib/session";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Créer votre espace" };

export default async function Page({ searchParams }: { searchParams: { erreur?: string } }) {
  // Une invitation ou un accès propriétaire a pu être ouvert depuis la
  // dernière connexion : on tente le rattachement avant de proposer de
  // créer un espace.
  await createClient().rpc("claim_access");
  const s = await getSession();
  if (!s) redirect("/connexion");
  if (s.memberships.length) redirect(homeFor(s));

  return (
    <AuthShell
      title="Créer votre espace de gestion"
      footer={
        <form action={signOut}>
          Connecté en tant que {s.user.email} ·{" "}
          <button className="link" type="submit">
            Se déconnecter
          </button>
        </form>
      }
    >
      <Flash searchParams={searchParams} />
      {s.ownerProfiles.length > 0 && (
        <p className="mb-5 rounded-lg bg-brand-light/60 p-3 text-sm">
          Vous avez déjà accès à votre <a href="/portail" className="link">espace propriétaire</a>. Créez un espace
          ci-dessous seulement si vous gérez aussi des biens vous-même.
        </p>
      )}
      <form action={createOrganization} className="space-y-5">
        <fieldset>
          <legend className="label">Vous êtes</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            <KindOption value="agence" title="Une agence" text="Vous gérez les biens de plusieurs propriétaires, contre commission." defaultChecked />
            <KindOption value="proprietaire" title="Un propriétaire" text="Vous gérez vous-même vos biens et vos locataires." />
          </div>
        </fieldset>
        <Input label="Nom de l'agence ou votre nom" name="name" required />
        <Input label="Téléphone" name="phone" type="tel" placeholder="77 123 45 67" />
        <SubmitButton className="btn btn-primary w-full" pendingText="Création…">
          Créer l&apos;espace
        </SubmitButton>
      </form>
    </AuthShell>
  );
}

function KindOption({ value, title, text, defaultChecked }: { value: string; title: string; text: string; defaultChecked?: boolean }) {
  return (
    <label className="flex cursor-pointer gap-3 rounded-lg border border-slate-200 p-3 has-[:checked]:border-brand has-[:checked]:bg-brand-light/40">
      <input type="radio" name="kind" value={value} defaultChecked={defaultChecked} className="mt-1 text-brand focus:ring-brand" />
      <span>
        <span className="block text-sm font-semibold">{title}</span>
        <span className="block text-xs text-slate-500">{text}</span>
      </span>
    </label>
  );
}
