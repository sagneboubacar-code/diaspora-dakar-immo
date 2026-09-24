import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge, Card, Detail, Empty, Flash, PageHeader, Stat, TableWrap } from "@/components/ui";
import { ConfirmButton } from "@/components/buttons";
import { addMonths, currentMonth, dateFr, fcfa, monthLabel, percent } from "@/lib/format";
import { PAYMENT_METHODS, PROPERTY_TYPES } from "@/lib/labels";
import { requireOrg } from "@/lib/session";
import { deleteOwner } from "../actions";

export default async function Page({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { erreur?: string; ok?: string };
}) {
  const { supabase, org } = await requireOrg();
  const { data: owner } = await supabase.from("owners").select("*").eq("id", params.id).eq("org_id", org.id).maybeSingle();
  if (!owner) notFound();

  const [{ data: properties }, { data: balance }, { data: payouts }] = await Promise.all([
    supabase
      .from("properties")
      .select("id, name, type, city, rent_amount, archived, leases(id, status, tenants(full_name))")
      .eq("owner_id", owner.id)
      .order("name"),
    supabase.from("v_owner_balances").select("*").eq("owner_id", owner.id).maybeSingle(),
    supabase.from("payouts").select("*").eq("owner_id", owner.id).order("paid_on", { ascending: false }).limit(10),
  ]);

  const months = Array.from({ length: 12 }, (_, i) => addMonths(currentMonth(), -i));

  return (
    <>
      <PageHeader
        title={owner.full_name}
        subtitle={[owner.country, owner.phone, owner.email].filter(Boolean).join(" · ")}
        back={{ href: "/proprietaires", label: "Propriétaires" }}
        actions={
          <>
            <Link href={`/biens/nouveau?proprietaire=${owner.id}`} className="btn">
              + Ajouter un bien
            </Link>
            <Link href={`/proprietaires/${owner.id}/modifier`} className="btn btn-primary">
              Modifier
            </Link>
          </>
        }
      />
      <Flash searchParams={searchParams} />

      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Loyers encaissés" value={fcfa(balance?.collected)} hint="Depuis le début" />
        <Stat label="Commissions" value={fcfa(balance?.commission)} />
        <Stat label="Dépenses" value={fcfa(balance?.expenses)} />
        <Stat
          label="Solde à reverser"
          value={fcfa(balance?.balance)}
          tone={(balance?.balance ?? 0) < 0 ? "red" : "green"}
          hint={`Déjà reversé : ${fcfa(balance?.paid_out)}`}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card title="Biens" padded={false}>
            {properties?.length ? (
              <TableWrap>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Bien</th>
                      <th>Locataire</th>
                      <th className="text-right">Loyer</th>
                    </tr>
                  </thead>
                  <tbody>
                    {properties.map((p) => {
                      const active = (p.leases as any[])?.find((l) => l.status === "actif");
                      return (
                        <tr key={p.id}>
                          <td>
                            <Link href={`/biens/${p.id}`} className="link">
                              {p.name}
                            </Link>
                            <div className="text-xs text-slate-500">
                              {PROPERTY_TYPES[p.type]} {p.city ? `· ${p.city}` : ""}
                            </div>
                          </td>
                          <td>
                            {p.archived ? (
                              <Badge>Archivé</Badge>
                            ) : active ? (
                              active.tenants?.full_name
                            ) : (
                              <Badge tone="amber">Vacant</Badge>
                            )}
                          </td>
                          <td className="text-right tabular-nums">{fcfa(p.rent_amount)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </TableWrap>
            ) : (
              <Empty title="Aucun bien">Ajoutez le premier bien de ce propriétaire.</Empty>
            )}
          </Card>

          <Card
            title="Derniers reversements"
            padded={false}
            actions={
              <Link href={`/reversements?proprietaire=${owner.id}`} className="text-sm link">
                Enregistrer un reversement
              </Link>
            }
          >
            {payouts?.length ? (
              <TableWrap>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Moyen</th>
                      <th>Référence</th>
                      <th className="text-right">Montant</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payouts.map((p) => (
                      <tr key={p.id}>
                        <td>{dateFr(p.paid_on)}</td>
                        <td>{PAYMENT_METHODS[p.method]}</td>
                        <td className="text-slate-600">{p.reference ?? "—"}</td>
                        <td className="text-right tabular-nums">{fcfa(p.amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </TableWrap>
            ) : (
              <Empty title="Aucun reversement enregistré" />
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Relevés mensuels">
            <ul className="space-y-1.5 text-sm">
              {months.map((m) => (
                <li key={m}>
                  <Link href={`/imprimer/releve/${owner.id}?mois=${m}`} className="link" target="_blank">
                    {monthLabel(m)}
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
          <Card title="Informations">
            <dl className="space-y-3">
              <Detail label="Commission">{percent(owner.commission_rate ?? org.default_commission_rate)}</Detail>
              <Detail label="Reversement">{owner.payout_details}</Detail>
              <Detail label="Adresse">{owner.address}</Detail>
              <Detail label="Espace propriétaire">
                {owner.portal_enabled
                  ? owner.user_id
                    ? "Actif — compte relié"
                    : `Ouvert — en attente de l'inscription de ${owner.email}`
                  : "Fermé"}
              </Detail>
              <Detail label="Notes">{owner.notes}</Detail>
            </dl>
          </Card>
          <form action={deleteOwner}>
            <input type="hidden" name="id" value={owner.id} />
            <ConfirmButton message="Supprimer ce propriétaire ? Impossible s'il a encore des biens.">
              Supprimer le propriétaire
            </ConfirmButton>
          </form>
        </div>
      </div>
    </>
  );
}
