import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge, Card, Detail, Empty, Flash, PageHeader, TableWrap } from "@/components/ui";
import { ConfirmButton, SubmitButton } from "@/components/buttons";
import { dateFr, fcfa, monthLabel, today } from "@/lib/format";
import { DUE_STATUS } from "@/lib/labels";
import { requireOrg } from "@/lib/session";
import { deleteLease, endLease } from "../actions";

export default async function Page({ params, searchParams }: { params: { id: string }; searchParams: { erreur?: string; ok?: string } }) {
  const { supabase, org, isAgency } = await requireOrg();
  const { data: l } = await supabase
    .from("leases")
    .select("*, properties(id, name, city), tenants(id, full_name, phone)")
    .eq("id", params.id)
    .eq("org_id", org.id)
    .maybeSingle();
  if (!l) notFound();
  const { data: dues } = await supabase.from("v_dues").select("*").eq("lease_id", l.id).order("period", { ascending: false });
  const owed = (dues ?? []).reduce((s, d) => s + (d.status === "a_venir" ? 0 : d.balance), 0);

  return (
    <>
      <PageHeader
        title={`Bail — ${l.properties?.name}`}
        subtitle={`${l.tenants?.full_name} · depuis le ${dateFr(l.start_date)}`}
        back={{ href: "/baux", label: "Baux" }}
        actions={
          <Link href={`/baux/${l.id}/modifier`} className="btn btn-primary">
            Modifier
          </Link>
        }
      />
      <Flash searchParams={searchParams} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card title="Échéances" padded={false}>
            {dues?.length ? (
              <TableWrap>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Mois</th>
                      <th>Échéance</th>
                      <th className="text-right">Dû</th>
                      <th className="text-right">Payé</th>
                      <th>Statut</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {dues.map((d) => (
                      <tr key={d.id}>
                        <td>{monthLabel(d.period.slice(0, 7))}</td>
                        <td>{dateFr(d.due_date)}</td>
                        <td className="text-right tabular-nums">{fcfa(d.amount_due)}</td>
                        <td className="text-right tabular-nums">{fcfa(d.amount_paid)}</td>
                        <td>
                          <Badge tone={DUE_STATUS[d.status].tone}>{DUE_STATUS[d.status].label}</Badge>
                        </td>
                        <td className="text-right">
                          <Link href={`/loyers?mois=${d.period.slice(0, 7)}`} className="text-xs link">
                            Encaisser
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </TableWrap>
            ) : (
              <Empty title="Aucune échéance">Générez les échéances depuis la page Loyers.</Empty>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Conditions">
            <dl className="space-y-3">
              <Detail label="Statut">{l.status === "actif" ? <Badge tone="green">Actif</Badge> : <Badge>Terminé</Badge>}</Detail>
              <Detail label="Locataire">
                <Link href={`/locataires/${l.tenants?.id}`} className="link">
                  {l.tenants?.full_name}
                </Link>
              </Detail>
              <Detail label="Bien">
                <Link href={`/biens/${l.properties?.id}`} className="link">
                  {l.properties?.name}
                </Link>
              </Detail>
              <Detail label="Période">
                {dateFr(l.start_date)} → {l.end_date ? dateFr(l.end_date) : "indéterminée"}
              </Detail>
              <Detail label="Loyer">{fcfa(l.rent_amount)}</Detail>
              <Detail label="Charges">{fcfa(l.charges_amount)}</Detail>
              <Detail label="Caution">{fcfa(l.deposit_amount)}</Detail>
              <Detail label="Échéance">le {l.due_day} de chaque mois</Detail>
              {isAgency && <Detail label="Frais de mise en location">{fcfa(l.agency_fee)}</Detail>}
              <Detail label="Reste dû à ce jour">
                <span className={owed > 0 ? "font-semibold text-red-700" : ""}>{fcfa(owed)}</span>
              </Detail>
              <Detail label="Notes">{l.notes}</Detail>
            </dl>
          </Card>

          {l.status === "actif" && (
            <Card title="Fin du bail">
              <form action={endLease} className="space-y-3">
                <input type="hidden" name="id" value={l.id} />
                <div>
                  <label className="label" htmlFor="end_date">
                    Date de sortie du locataire
                  </label>
                  <input id="end_date" name="end_date" type="date" defaultValue={l.end_date ?? today()} className="input" required />
                </div>
                <SubmitButton className="btn w-full">Terminer le bail</SubmitButton>
              </form>
            </Card>
          )}

          <form action={deleteLease}>
            <input type="hidden" name="id" value={l.id} />
            <ConfirmButton message="Supprimer ce bail saisi par erreur ? (impossible s'il a des paiements)">
              Supprimer le bail
            </ConfirmButton>
          </form>
        </div>
      </div>
    </>
  );
}
