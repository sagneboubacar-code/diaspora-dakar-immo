import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthShell } from "../AuthShell";
import { Flash, Input } from "@/components/ui";
import { SubmitButton } from "@/components/buttons";
import { signIn } from "../auth-actions";
import { getSession, homeFor } from "@/lib/session";

export const metadata = { title: "Connexion" };

export default async function Page({ searchParams }: { searchParams: { erreur?: string; ok?: string } }) {
  const s = await getSession();
  if (s) redirect(homeFor(s));
  return (
    <AuthShell
      title="Connexion"
      footer={
        <>
          Pas encore de compte ? <Link href="/inscription" className="link">Créer un compte</Link>
        </>
      }
    >
      <Flash searchParams={searchParams} />
      <form action={signIn} className="space-y-4">
        <Input label="Email" name="email" type="email" required />
        <Input label="Mot de passe" name="password" type="password" required />
        <SubmitButton className="btn btn-primary w-full" pendingText="Connexion…">
          Se connecter
        </SubmitButton>
        <p className="text-center text-sm">
          <Link href="/mot-de-passe-oublie" className="text-slate-500 hover:text-slate-800">
            Mot de passe oublié ?
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
