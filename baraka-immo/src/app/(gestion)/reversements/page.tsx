import Link from "next/link";
import { redirect } from "next/navigation";
import { Card, Empty, Flash, Input, MoneyInput, PageHeader, Select, TableWrap } from "@/components/ui";
import { ConfirmButton, SubmitButton } from "@/components/buttons";
import { dateFr, fcfa, today } from "@/lib/format";
import { PAYMENT_METHODS } from "@/lib/labels";
import { requireOrg } from "@/lib/session";
import { deletePayout, savePayout } from "./actions";

export const metadata = { title: "Reversements" };

export default async function Page({ searchParams }: { searchParams: { erreur?: string; ok?: string; proprietaire?: string } }) {
  const { supabase, org, isAgency, isAdmin } = await requireOrg();
  if (!isAgency) redirect("/tableau-de-bord");

  const [{ data: balances }, { data: payouts }] = await Promise.all([
    supabase.from("v_owner_balances").select("*").eq("org_id", org.id).order("full_name"),
    supabase.from("payouts").select("*, owners(full_name)").eq("org_id", org.id).order("paid_on", { ascending: false }).limit(50),
  ]);
  const chosen = balances?.find((b) => b.owner_id === searchParams.proprietaire);
  const totalDue = (balances ?? []).reduce((s, b) => s + Math.max(0, b.balance), 0);

  return (
    <>
      <PageHeader title="Reversements" subtitle={`Total à reverser aux propriétaires : ${fcfa(totalDue)}`} />
      <Flash searchParams={searchParams} />
      <div className="grid gap-6 lg:grid-cols-3">
        <Card title="Enregistrer un reversement" className="h-fit">
          {balances?.length ? (
            <form action={savePayout} className="space-y-4">
              <Select
                label="Propriétaire"
                name="owner_id"
                required
                placeholder="— Choisir —"
                defaultValue={searchParams.proprietaire}
                options={balances.map((b) => [b.owner_id, `${b.full_name} (solde ${fcfa(b.balance)})`])}
              />
              <div className="grid grid-cols-2 gap-3">
                <MoneyInput label="Montant" name="amount" required defaultValue={chosen && chosen.balance > 0 ? chosen.balance : undefined} />
                <Input label="Date" name="paid_on" type="date" defaultValue={today()} required />
              </div>
              <Select label="Moyen" name="method" options={PAYMENT_METHODS} defaultValue="virement" />
              <Input label="Référence" name="reference" placeholder="N° de transaction" />
              <Input label="Note" name="notes" placeholder="Loyers de septembre" />
              <SubmitButton className="btn btn-primary w-full">Enregistrer</SubmitButton>
            </form>
          ) : (
            <p className="text-sm text-slate-500">Aucun propriétaire.</p>
          )}
        </Card>

        <div className="space-y-6 lg:col-span-2">
          <Card title="Soldes des propriétaires" padded={false}>
            {balances?.length ? (
              <TableWrap>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Propriétaire</th>
                      <th className="text-right">Encaissé</th>
                      <th className="text-right">Commission</th>
                      <th className="text-right">Dépenses</th>
                      <th className="text-right">Reversé</th>
                      <th className="text-right">Solde</th>
                    </tr>
                  </thead>
                  <tbody>
                    {balances.map((b) => (
                      <tr key={b.owner_id}>
                        <td>
                          <Link href={`/proprietaires/${b.owner_id}`} className="link">
                            {b.full_name}
                          </Link>
                        </td>
                        <td className="text-right tabular-nums">{fcfa(b.collected)}</td>
                        <td className="text-right tabular-nums">{fcfa(b.commission)}</td>
                        <td className="text-right tabular-nums">{fcfa(b.expenses)}</td>
                        <td className="text-right tabular-nums">{fcfa(b.paid_out)}</td>
                        <td className={`text-right font-semibold tabular-nums ${b.balance < 0 ? "text-red-700" : ""}`}>{fcfa(b.balance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </TableWrap>
            ) : (
              <Empty title="Aucun propriétaire" />
            )}
          </Card>

          <Card title="Historique" padded={false}>
            {payouts?.length ? (
              <TableWrap>
                <table className="table">
                  <tbody>
                    {payouts.map((p) => (
                      <tr key={p.id}>
                        <td>{dateFr(p.paid_on)}</td>
                        <td>
                          {p.owners?.full_name}
                          <div className="text-xs text-slate-500">
                            {[PAYMENT_METHODS[p.method], p.reference, p.notes].filter(Boolean).join(" · ")}
                          </div>
                        </td>
                        <td className="text-right tabular-nums">{fcfa(p.amount)}</td>
                        <td className="text-right">
                          {isAdmin && (
                            <form action={deletePayout}>
                              <input type="hidden" name="id" value={p.id} />
                              <ConfirmButton message="Supprimer ce reversement ?" className="text-xs text-red-600 hover:underline">
                                Supprimer
                              </ConfirmButton>
                            </form>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </TableWrap>
            ) : (
              <Empty title="Aucun reversement" />
            )}
          </Card>
        </div>
      </div>
    </>
  );
}
