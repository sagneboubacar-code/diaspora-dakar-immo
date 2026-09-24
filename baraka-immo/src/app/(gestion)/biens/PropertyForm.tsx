import { Checkbox, Input, MoneyInput, Select, Textarea } from "@/components/ui";
import { SubmitButton } from "@/components/buttons";
import { PROPERTY_TYPES } from "@/lib/labels";
import { saveProperty } from "./actions";

export function PropertyForm({
  property,
  owners,
  isAgency,
  defaultOwner,
}: {
  property?: any;
  owners: { id: string; full_name: string }[];
  isAgency: boolean;
  defaultOwner?: string;
}) {
  return (
    <form action={saveProperty} className="card space-y-5 p-5 sm:p-6">
      {property && <input type="hidden" name="id" value={property.id} />}
      <div className="grid gap-4 sm:grid-cols-2">
        {isAgency && (
          <Select
            label="Propriétaire"
            name="owner_id"
            required
            placeholder="— Choisir —"
            defaultValue={property?.owner_id ?? defaultOwner}
            options={owners.map((o) => [o.id, o.full_name])}
            className="sm:col-span-2"
          />
        )}
        <Input label="Désignation" name="name" required defaultValue={property?.name} placeholder="Appartement F3 — 2e étage" />
        <Input label="Référence interne" name="reference" defaultValue={property?.reference} placeholder="OUK-012" />
        <Select label="Type" name="type" defaultValue={property?.type ?? "appartement"} options={PROPERTY_TYPES} />
        <Input label="Ville / quartier" name="city" defaultValue={property?.city} placeholder="Dakar, Ouakam" />
        <Input label="Adresse" name="address" defaultValue={property?.address} className="sm:col-span-2" />
        <Input label="Surface (m²)" name="surface_m2" inputMode="decimal" defaultValue={property?.surface_m2} />
        <Input label="Nombre de pièces" name="rooms" inputMode="numeric" defaultValue={property?.rooms} />
        <MoneyInput label="Loyer mensuel" name="rent_amount" defaultValue={property?.rent_amount} hint="En FCFA, hors charges" />
        <MoneyInput label="Charges mensuelles" name="charges_amount" defaultValue={property?.charges_amount} />
        {isAgency && (
          <Input
            label="Commission propre à ce bien (%)"
            name="commission_rate"
            inputMode="decimal"
            defaultValue={property?.commission_rate}
            hint="Laisser vide pour appliquer le taux du propriétaire."
          />
        )}
        <Textarea label="Notes" name="notes" defaultValue={property?.notes} className="sm:col-span-2" />
        {property && (
          <Checkbox
            name="archived"
            label="Archiver ce bien"
            defaultChecked={property.archived}
            hint="Il n'apparaît plus dans les listes, son historique est conservé."
          />
        )}
      </div>
      <div className="flex justify-end">
        <SubmitButton>Enregistrer</SubmitButton>
      </div>
    </form>
  );
}
