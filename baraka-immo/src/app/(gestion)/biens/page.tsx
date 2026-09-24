import Link from "next/link";
import { Badge, Card, Empty, Flash, PageHeader, TableWrap } from "@/components/ui";
import { fcfa } from "@/lib/format";
import { PROPERTY_TYPES } from "@/lib/labels";
import { requireOrg } from "@/lib/session";

export const metadata = { title: "Biens" };

export default async function Page({ searchParams }: { searchParams: { erreur?: string; ok?: string; archives?: string } }) {
  const { supabase, org, isAgency } = await requireOrg();
  const showArchived = searchParams.archives === "1";
  let q = supabase
    .from("properties")
    .select("id, name, reference, type, city, rent_amount, charges_amount, archived, owners(full_name), leases(status, tenants(full_name))")
    .eq("org_id", org.id)
    .order("name");
  if (!showArchived) q = q.eq("archived", false);
  const { data: properties } = await q;

  return (
    <>
      <PageHeader
        title="Biens"
        subtitle={`${properties?.length ?? 0} bien(s)${showArchived ? " (archives incluses)" : ""}`}
        actions={
          <>
            <Link href={showArchived ? "/biens" : "/biens?archives=1"} className="btn">
              {showArchived ? "Masquer les archives" : "Voir les archives"}
            </Link>
            <Link href="/biens/nouveau" className="btn btn-primary">
              + Nouveau bien
            </Link>
          </>
        }
      />
      <Flash searchParams={searchParams} />
      <Card padded={false}>
        {properties?.length ? (
          <TableWrap>
            <table className="table">
              <thead>
                <tr>
                  <th>Bien</th>
                  {isAgency && <th>Propriétaire</th>}
                  <th>Occupation</th>
                  <th className="text-right">Loyer + charges</th>
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
                          {[p.reference, PROPERTY_TYPES[p.type], p.city].filter(Boolean).join(" · ")}
                        </div>
                      </td>
                      {isAgency && <td className="text-slate-600">{(p.owners as any)?.full_name}</td>}
                      <td>
                        {p.archived ? (
                          <Badge>Archivé</Badge>
                        ) : active ? (
                          <Badge tone="green">Loué · {active.tenants?.full_name}</Badge>
                        ) : (
                          <Badge tone="amber">Vacant</Badge>
                        )}
                      </td>
                      <td className="text-right tabular-nums">
                        {fcfa(p.rent_amount)}
                        {p.charges_amount > 0 && <div className="text-xs text-slate-500">+ {fcfa(p.charges_amount)}</div>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </TableWrap>
        ) : (
          <Empty title="Aucun bien">
            {isAgency ? "Ajoutez d'abord un propriétaire, puis ses biens." : "Ajoutez votre premier bien."}
          </Empty>
        )}
      </Card>
    </>
  );
}
