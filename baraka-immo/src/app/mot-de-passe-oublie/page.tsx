import Link from "next/link";
import { AuthShell } from "../AuthShell";
import { Flash, Input } from "@/components/ui";
import { SubmitButton } from "@/components/buttons";
import { requestReset } from "../auth-actions";

export const metadata = { title: "Mot de passe oublié" };

export default function Page({ searchParams }: { searchParams: { erreur?: string } }) {
  return (
    <AuthShell title="Mot de passe oublié" footer={<Link href="/connexion" className="link">Retour à la connexion</Link>}>
      <Flash searchParams={searchParams} />
      <form action={requestReset} className="space-y-4">
        <Input label="Email" name="email" type="email" required />
        <SubmitButton className="btn btn-primary w-full" pendingText="Envoi…">
          Recevoir un lien
        </SubmitButton>
      </form>
    </AuthShell>
  );
}
