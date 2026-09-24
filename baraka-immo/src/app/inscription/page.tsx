import Link from "next/link";
import { AuthShell } from "../AuthShell";
import { Flash, Input } from "@/components/ui";
import { SubmitButton } from "@/components/buttons";
import { signUp } from "../auth-actions";

export const metadata = { title: "Créer un compte" };

export default function Page({ searchParams }: { searchParams: { erreur?: string } }) {
  return (
    <AuthShell
      title="Créer un compte"
      footer={
        <>
          Déjà inscrit ? <Link href="/connexion" className="link">Se connecter</Link>
        </>
      }
    >
      <Flash searchParams={searchParams} />
      <form action={signUp} className="space-y-4">
        <Input label="Email" name="email" type="email" required />
        <Input label="Mot de passe" name="password" type="password" required hint="8 caractères minimum" />
        <SubmitButton className="btn btn-primary w-full" pendingText="Création…">
          Créer mon compte
        </SubmitButton>
      </form>
      <div className="mt-6 rounded-lg bg-slate-50 p-4 text-sm text-slate-600">
        <p className="font-medium text-slate-700">Propriétaire dont les biens sont gérés par une agence ?</p>
        <p className="mt-1">
          Créez votre compte avec l&apos;email communiqué à votre agence : vous accéderez directement à votre espace
          propriétaire (biens, loyers encaissés, relevés).
        </p>
      </div>
    </AuthShell>
  );
}
