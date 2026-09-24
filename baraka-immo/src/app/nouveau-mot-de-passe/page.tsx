import { AuthShell } from "../AuthShell";
import { Flash, Input } from "@/components/ui";
import { SubmitButton } from "@/components/buttons";
import { updatePassword } from "../auth-actions";

export const metadata = { title: "Nouveau mot de passe" };

export default function Page({ searchParams }: { searchParams: { erreur?: string } }) {
  return (
    <AuthShell title="Nouveau mot de passe">
      <Flash searchParams={searchParams} />
      <form action={updatePassword} className="space-y-4">
        <Input label="Nouveau mot de passe" name="password" type="password" required hint="8 caractères minimum" />
        <SubmitButton className="btn btn-primary w-full">Enregistrer</SubmitButton>
      </form>
    </AuthShell>
  );
}
