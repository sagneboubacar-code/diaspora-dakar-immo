import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge, Card, Detail, Empty, Flash, PageHeader, TableWrap } from "@/components/ui";
import { ConfirmButton } from "@/components/buttons";
import { dateFr, fcfa, monthLabel } from "@/lib/format";
import { DUE_STATUS } from "@/lib/labels";
import { requireOrg } from "@/lib/session";
import { deleteTenant } from "../actions";

export default async function Page({ params, searchParams }: { params: { id: string }; searchParams: { erreur?: string; ok?: string } }) {
  const { supabase, org } = await requireOrg();
  const { data: t } = await supabase.from("tenants").select("*").eq("id", params.id).eq("org_id", org.id).maybeSingle();
  if (!t) notFound();

  const [{ data: leases }, { data: dues }] = await Promise.all([
    supabase.from("leases").select("*, properties(id, name)").eq("tenant_id", t.id).order("start_date", { ascending: false }),
    supabase.from("v_dues").select("*").eq("tenant_id", t.id).order("period", { ascending: false }).limit(24),
  ]);
  const unpaid = (dues ?? []).filter((d) => d.status === "impaye" || d.status === "partiel").reduce((s, d) => s + d.balance, 0);

  return (
    <>
      <PageHeader
        title={t.full_name}
        subtitle={[t.phone, t.email].filter(Boolean).join(" · ")}
        back={{ href: "/locataires", label: "Locataires" }}
        actions={
          <>
            <Link href={`/baux/nouveau?locataire=${t.id}`} className="btn">
              + Nouveau bail
            </Link>
            <Link href={`/locataires/${t.id}/modifier`} className="btn btn-primary">
              Modifier
            </Link>
          </>
        }
      />
      <Flash searchParams={searchParams} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card title="Baux" padded={false}>
            {leases?.length ? (
              <TableWrap>
                <table className="table">
                  <tbody>
                    {leases.map((l) => (
                      <tr key={l.id}>
                        <td>
                          <Link href={`/baux/${l.id}`} className="link">
                            {l.properties?.name}
                          </Link>
                        </td>
                        <td>
                          {dateFr(l.start_date)} → {l.end_date ? dateFr(l.end_date) : "…"}
                        </td>
                        <td className="text-right tabular-nums">{fcfa(l.rent_amount)}</td>
                        <td>{l.status === "actif" ? <Badge tone="green">Actif</Badge> : <Badge>Terminé</Badge>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </TableWrap>
            ) : (
              <Empty title="Aucun bail" />
            )}
          </Card>
          <Card title="Historique des loyers" padded={false}>
            {dues?.length ? (
              <TableWrap>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Mois</th>
                      <th>Bien</th>
                      <th className="text-right">Dû</th>
                      <th className="text-right">Payé</th>
                      <th>Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dues.map((d) => (
                      <tr key={d.id}>
                        <td>{monthLabel(d.period.slice(0, 7))}</td>
                        <td>{d.property_name}</td>
                        <td className="text-right tabular-nums">{fcfa(d.amount_due)}</td>
                        <td className="text-right tabular-nums">{fcfa(d.amount_paid)}</td>
                        <td>
                          <Badge tone={DUE_STATUS[d.status].tone}>{DUE_STATUS[d.status].label}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </TableWrap>
            ) : (
              <Empty title="Aucun loyer" />
            )}
          </Card>
        </div>
        <div className="space-y-6">
          <Card title="Informations">
            <dl className="space-y-3">
              <Detail label="Reste dû">
                <span className={unpaid > 0 ? "font-semibold text-red-700" : ""}>{fcfa(unpaid)}</span>
              </Detail>
              <Detail label="CNI / passeport">{t.id_number}</Detail>
              <Detail label="Profession">{t.profession}</Detail>
              <Detail label="Contact d'urgence">{t.emergency_contact}</Detail>
              <Detail label="Notes">{t.notes}</Detail>
            </dl>
          </Card>
          <form action={deleteTenant}>
            <input type="hidden" name="id" value={t.id} />
            <ConfirmButton message="Supprimer ce locataire ? Impossible s'il a des baux.">Supprimer le locataire</ConfirmButton>
          </form>
        </div>
      </div>
    </>
  );
}
