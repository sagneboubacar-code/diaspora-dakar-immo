import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge, Card, Detail, Empty, Flash, PageHeader, TableWrap } from "@/components/ui";
import { ConfirmButton } from "@/components/buttons";
import { dateFr, fcfa, monthLabel, percent } from "@/lib/format";
import { DUE_STATUS, EXPENSE_CATEGORIES, PROPERTY_TYPES } from "@/lib/labels";
import { requireOrg } from "@/lib/session";
import { deleteProperty } from "../actions";

export default async function Page({ params, searchParams }: { params: { id: string }; searchParams: { erreur?: string; ok?: string } }) {
  const { supabase, org, isAgency } = await requireOrg();
  const { data: p } = await supabase
    .from("properties")
    .select("*, owners(id, full_name, commission_rate)")
    .eq("id", params.id)
    .eq("org_id", org.id)
    .maybeSingle();
  if (!p) notFound();

  const [{ data: leases }, { data: dues }, { data: expenses }] = await Promise.all([
    supabase.from("leases").select("*, tenants(id, full_name, phone)").eq("property_id", p.id).order("start_date", { ascending: false }),
    supabase.from("v_dues").select("*").eq("property_id", p.id).order("period", { ascending: false }).limit(12),
    supabase.from("expenses").select("*").eq("property_id", p.id).order("spent_on", { ascending: false }).limit(10),
  ]);
  const active = leases?.find((l) => l.status === "actif");
  const rate = p.commission_rate ?? p.owners?.commission_rate ?? org.default_commission_rate;

  return (
    <>
      <PageHeader
        title={p.name}
        subtitle={[p.reference, PROPERTY_TYPES[p.type], p.city].filter(Boolean).join(" · ")}
        back={{ href: "/biens", label: "Biens" }}
        actions={
          <>
            {!active && !p.archived && (
              <Link href={`/baux/nouveau?bien=${p.id}`} className="btn">
                + Nouveau bail
              </Link>
            )}
            <Link href={`/biens/${p.id}/modifier`} className="btn btn-primary">
              Modifier
            </Link>
          </>
        }
      />
      <Flash searchParams={searchParams} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card title="Location en cours">
            {active ? (
              <dl className="grid gap-4 sm:grid-cols-3">
                <Detail label="Locataire">
                  <Link href={`/locataires/${active.tenants?.id}`} className="link">
                    {active.tenants?.full_name}
                  </Link>
                </Detail>
                <Detail label="Depuis le">{dateFr(active.start_date)}</Detail>
                <Detail label="Bail">
                  <Link href={`/baux/${active.id}`} className="link">
                    Voir le bail
                  </Link>
                </Detail>
                <Detail label="Loyer">{fcfa(active.rent_amount)}</Detail>
                <Detail label="Charges">{fcfa(active.charges_amount)}</Detail>
                <Detail label="Échéance">le {active.due_day} du mois</Detail>
              </dl>
            ) : (
              <p className="text-sm text-slate-500">Ce bien est actuellement vacant.</p>
            )}
          </Card>

          <Card title="Derniers loyers" padded={false}>
            {dues?.length ? (
              <TableWrap>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Mois</th>
                      <th>Locataire</th>
                      <th className="text-right">Dû</th>
                      <th className="text-right">Payé</th>
                      <th>Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dues.map((d) => (
                      <tr key={d.id}>
                        <td>{monthLabel(d.period.slice(0, 7))}</td>
                        <td>{d.tenant_name}</td>
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
              <Empty title="Aucun loyer enregistré" />
            )}
          </Card>

          <Card title="Historique des baux" padded={false}>
            {leases?.length ? (
              <TableWrap>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Locataire</th>
                      <th>Période</th>
                      <th className="text-right">Loyer</th>
                      <th>Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leases.map((l) => (
                      <tr key={l.id}>
                        <td>
                          <Link href={`/baux/${l.id}`} className="link">
                            {l.tenants?.full_name}
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

          <Card
            title="Dépenses"
            padded={false}
            actions={
              <Link href={`/depenses?bien=${p.id}`} className="text-sm link">
                Ajouter une dépense
              </Link>
            }
          >
            {expenses?.length ? (
              <TableWrap>
                <table className="table">
                  <tbody>
                    {expenses.map((e) => (
                      <tr key={e.id}>
                        <td>{dateFr(e.spent_on)}</td>
                        <td>
                          {e.label}
                          <div className="text-xs text-slate-500">{EXPENSE_CATEGORIES[e.category]}</div>
                        </td>
                        <td className="text-right tabular-nums">{fcfa(e.amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </TableWrap>
            ) : (
              <Empty title="Aucune dépense" />
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Informations">
            <dl className="space-y-3">
              {isAgency && (
                <Detail label="Propriétaire">
                  <Link href={`/proprietaires/${p.owners?.id}`} className="link">
                    {p.owners?.full_name}
                  </Link>
                </Detail>
              )}
              <Detail label="Adresse">{[p.address, p.city].filter(Boolean).join(", ")}</Detail>
              <Detail label="Surface">{p.surface_m2 ? `${p.surface_m2} m²` : null}</Detail>
              <Detail label="Pièces">{p.rooms}</Detail>
              <Detail label="Loyer de référence">{fcfa(p.rent_amount)}</Detail>
              <Detail label="Charges">{fcfa(p.charges_amount)}</Detail>
              {isAgency && <Detail label="Commission appliquée">{percent(rate)}</Detail>}
              <Detail label="Notes">{p.notes}</Detail>
            </dl>
          </Card>
          <form action={deleteProperty}>
            <input type="hidden" name="id" value={p.id} />
            <ConfirmButton message="Supprimer définitivement ce bien ? Impossible s'il a des baux : archivez-le plutôt.">
              Supprimer le bien
            </ConfirmButton>
          </form>
        </div>
      </div>
    </>
  );
}
