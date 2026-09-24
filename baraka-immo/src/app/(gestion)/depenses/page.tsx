import { Badge, Card, Checkbox, Empty, Flash, Input, MoneyInput, PageHeader, Select, TableWrap } from "@/components/ui";
import { ConfirmButton, SubmitButton } from "@/components/buttons";
import { dateFr, fcfa, today } from "@/lib/format";
import { EXPENSE_CATEGORIES } from "@/lib/labels";
import { requireOrg } from "@/lib/session";
import { deleteExpense, saveExpense } from "./actions";

export const metadata = { title: "Dépenses" };

export default async function Page({ searchParams }: { searchParams: { erreur?: string; ok?: string; bien?: string } }) {
  const { supabase, org, isAgency } = await requireOrg();
  const [{ data: properties }, { data: expenses }] = await Promise.all([
    supabase.from("properties").select("id, name").eq("org_id", org.id).eq("archived", false).order("name"),
    supabase
      .from("expenses")
      .select("*, properties(name, owners(full_name))")
      .eq("org_id", org.id)
      .order("spent_on", { ascending: false })
      .limit(100),
  ]);

  return (
    <>
      <PageHeader
        title="Dépenses"
        subtitle={isAgency ? "Travaux et frais payés pour le compte des propriétaires, déduits de leurs relevés." : "Travaux, taxes et frais liés à vos biens."}
      />
      <Flash searchParams={searchParams} />
      <div className="grid gap-6 lg:grid-cols-3">
        <Card title="Nouvelle dépense" className="h-fit">
          {properties?.length ? (
            <form action={saveExpense} className="space-y-4">
              <Select label="Bien" name="property_id" required placeholder="— Choisir —" defaultValue={searchParams.bien} options={properties.map((p) => [p.id, p.name])} />
              <Input label="Libellé" name="label" required placeholder="Réparation fuite salle de bain" />
              <div className="grid grid-cols-2 gap-3">
                <MoneyInput label="Montant" name="amount" required />
                <Input label="Date" name="spent_on" type="date" defaultValue={today()} required />
              </div>
              <Select label="Catégorie" name="category" options={EXPENSE_CATEGORIES} defaultValue="reparation" />
              {isAgency && (
                <Checkbox
                  name="charge_to_owner"
                  label="À déduire du propriétaire"
                  defaultChecked
                  hint="Décochez si la dépense est à la charge de l'agence."
                />
              )}
              <SubmitButton className="btn btn-primary w-full">Enregistrer</SubmitButton>
            </form>
          ) : (
            <p className="text-sm text-slate-500">Ajoutez d&apos;abord un bien.</p>
          )}
        </Card>
        <Card title="Dernières dépenses" padded={false} className="lg:col-span-2">
          {expenses?.length ? (
            <TableWrap>
              <table className="table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Libellé</th>
                    <th>Bien</th>
                    <th className="text-right">Montant</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((e) => (
                    <tr key={e.id}>
                      <td>{dateFr(e.spent_on)}</td>
                      <td>
                        {e.label}
                        <div className="text-xs text-slate-500">
                          {EXPENSE_CATEGORIES[e.category]}
                          {isAgency && !e.charge_to_owner && (
                            <>
                              {" "}
                              · <Badge tone="blue">charge agence</Badge>
                            </>
                          )}
                        </div>
                      </td>
                      <td>
                        {e.properties?.name}
                        {isAgency && <div className="text-xs text-slate-500">{e.properties?.owners?.full_name}</div>}
                      </td>
                      <td className="text-right tabular-nums">{fcfa(e.amount)}</td>
                      <td className="text-right">
                        <form action={deleteExpense}>
                          <input type="hidden" name="id" value={e.id} />
                          <ConfirmButton message="Supprimer cette dépense ?" className="text-xs text-red-600 hover:underline">
                            Supprimer
                          </ConfirmButton>
                        </form>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableWrap>
          ) : (
            <Empty title="Aucune dépense enregistrée" />
          )}
        </Card>
      </div>
    </>
  );
}
