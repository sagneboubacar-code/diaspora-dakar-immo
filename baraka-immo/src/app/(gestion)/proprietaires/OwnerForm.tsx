import { Checkbox, Input, Textarea } from "@/components/ui";
import { SubmitButton } from "@/components/buttons";
import { percent } from "@/lib/format";
import { saveOwner } from "./actions";

export function OwnerForm({ owner, defaultRate }: { owner?: any; defaultRate: number }) {
  return (
    <form action={saveOwner} className="card space-y-5 p-5 sm:p-6">
      {owner && <input type="hidden" name="id" value={owner.id} />}
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Nom complet" name="full_name" defaultValue={owner?.full_name} required className="sm:col-span-2" />
        <Input label="Téléphone / WhatsApp" name="phone" type="tel" defaultValue={owner?.phone} />
        <Input label="Email" name="email" type="email" defaultValue={owner?.email} />
        <Input label="Pays de résidence" name="country" defaultValue={owner?.country} placeholder="Sénégal, France, Italie…" />
        <Input label="Adresse" name="address" defaultValue={owner?.address} />
        <Input
          label="Taux de commission (%)"
          name="commission_rate"
          inputMode="decimal"
          defaultValue={owner?.commission_rate}
          hint={`Laisser vide pour le taux par défaut de l'agence (${percent(defaultRate)}).`}
        />
        <Input
          label="Coordonnées de reversement"
          name="payout_details"
          defaultValue={owner?.payout_details}
          placeholder="Wave 77…, IBAN…"
        />
        <Textarea label="Notes" name="notes" defaultValue={owner?.notes} className="sm:col-span-2" />
        <Checkbox
          name="portal_enabled"
          label="Ouvrir l'espace propriétaire"
          defaultChecked={owner?.portal_enabled}
          className="sm:col-span-2"
          hint="Le propriétaire crée son compte avec l'email ci-dessus et consulte ses biens, loyers et relevés (lecture seule)."
        />
      </div>
      <div className="flex justify-end">
        <SubmitButton>Enregistrer</SubmitButton>
      </div>
    </form>
  );
}
