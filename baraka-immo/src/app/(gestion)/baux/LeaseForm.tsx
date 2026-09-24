import Link from "next/link";
import { Input, MoneyInput, Select, Textarea } from "@/components/ui";
import { SubmitButton } from "@/components/buttons";
import { today } from "@/lib/format";
import { saveLease } from "./actions";

type Opt = { id: string; label: string };

export function LeaseForm({
  lease,
  properties,
  tenants,
  defaults,
  isAgency,
}: {
  lease?: any;
  properties: Opt[];
  tenants: Opt[];
  defaults: { property_id?: string; tenant_id?: string; rent?: number; charges?: number };
  isAgency: boolean;
}) {
  return (
    <form action={saveLease} className="card space-y-5 p-5 sm:p-6">
      {lease && <input type="hidden" name="id" value={lease.id} />}
      <div className="grid gap-4 sm:grid-cols-2">
        {lease ? (
          <>
            <Input label="Bien" name="_p" defaultValue={lease.properties?.name} className="pointer-events-none opacity-70" />
            <Input label="Locataire" name="_t" defaultValue={lease.tenants?.full_name} className="pointer-events-none opacity-70" />
          </>
        ) : (
          <>
            <Select
              label="Bien"
              name="property_id"
              required
              placeholder="— Choisir un bien vacant —"
              defaultValue={defaults.property_id}
              options={properties.map((p) => [p.id, p.label])}
              hint={properties.length ? undefined : "Aucun bien vacant : créez un bien ou terminez un bail."}
            />
            <Select
              label="Locataire"
              name="tenant_id"
              required
              placeholder="— Choisir —"
              defaultValue={defaults.tenant_id}
              options={tenants.map((t) => [t.id, t.label])}
              hint={
                <Link href="/locataires/nouveau?next=bail" className="link">
                  + Créer un nouveau locataire
                </Link>
              }
            />
          </>
        )}
        <Input label="Date d'entrée" name="start_date" type="date" required defaultValue={lease?.start_date ?? today()} />
        <Input label="Date de fin (facultatif)" name="end_date" type="date" defaultValue={lease?.end_date} hint="Laisser vide pour un bail à durée indéterminée." />
        <MoneyInput label="Loyer mensuel" name="rent_amount" required defaultValue={lease?.rent_amount ?? defaults.rent} hint="En FCFA, hors charges" />
        <MoneyInput label="Charges mensuelles" name="charges_amount" defaultValue={lease?.charges_amount ?? defaults.charges} />
        <MoneyInput label="Caution versée" name="deposit_amount" defaultValue={lease?.deposit_amount} />
        <Input
          label="Jour d'échéance"
          name="due_day"
          type="number"
          defaultValue={lease?.due_day ?? 5}
          hint="Le loyer est dû ce jour-là chaque mois (1 à 28)."
        />
        {isAgency && (
          <MoneyInput
            label="Frais de mise en location (agence)"
            name="agency_fee"
            defaultValue={lease?.agency_fee}
            hint="Perçus une fois à la signature ; comptés dans les commissions du mois d'entrée."
          />
        )}
        <Textarea label="Notes / clauses particulières" name="notes" defaultValue={lease?.notes} className="sm:col-span-2" />
      </div>
      <div className="flex justify-end">
        <SubmitButton>Enregistrer le bail</SubmitButton>
      </div>
    </form>
  );
}
