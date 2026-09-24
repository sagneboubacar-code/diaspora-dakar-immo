import { Input, Textarea } from "@/components/ui";
import { SubmitButton } from "@/components/buttons";
import { saveTenant } from "./actions";

export function TenantForm({ tenant, next }: { tenant?: any; next?: string }) {
  return (
    <form action={saveTenant} className="card space-y-5 p-5 sm:p-6">
      {tenant && <input type="hidden" name="id" value={tenant.id} />}
      {next && <input type="hidden" name="next" value={next} />}
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Nom complet" name="full_name" required defaultValue={tenant?.full_name} className="sm:col-span-2" />
        <Input label="Téléphone / WhatsApp" name="phone" type="tel" defaultValue={tenant?.phone} />
        <Input label="Email" name="email" type="email" defaultValue={tenant?.email} />
        <Input label="N° CNI / passeport" name="id_number" defaultValue={tenant?.id_number} />
        <Input label="Profession" name="profession" defaultValue={tenant?.profession} />
        <Input label="Personne à contacter en cas d'urgence" name="emergency_contact" defaultValue={tenant?.emergency_contact} className="sm:col-span-2" />
        <Textarea label="Notes" name="notes" defaultValue={tenant?.notes} className="sm:col-span-2" />
      </div>
      <div className="flex justify-end">
        <SubmitButton>Enregistrer</SubmitButton>
      </div>
    </form>
  );
}
