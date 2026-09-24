import Link from "next/link";
import { Badge, Card, Empty, Flash, PageHeader, TableWrap } from "@/components/ui";
import { addDays, dateFr, fcfa, today } from "@/lib/format";
import { requireOrg } from "@/lib/session";

export const metadata = { title: "Baux" };

export default async function Page({ searchParams }: { searchParams: { erreur?: string; ok?: string; tous?: string } }) {
  const { supabase, org } = await requireOrg();
  const all = searchParams.tous === "1";
  let q = supabase
    .from("leases")
    .select("id, start_date, end_date, rent_amount, charges_amount, status, properties(name), tenants(full_name)")
    .eq("org_id", org.id)
    .order("start_date", { ascending: false });
  if (!all) q = q.eq("status", "actif");
  const { data: leases } = await q;
  const soon = addDays(today(), 60);

  return (
    <>
      <PageHeader
        title="Baux"
        subtitle={all ? "Tous les baux" : "Baux actifs"}
        actions={
          <>
            <Link href={all ? "/baux" : "/baux?tous=1"} className="btn">
              {all ? "Baux actifs seulement" : "Voir aussi les baux terminés"}
            </Link>
            <Link href="/baux/nouveau" className="btn btn-primary">
              + Nouveau bail
            </Link>
          </>
        }
      />
      <Flash searchParams={searchParams} />
      <Card padded={false}>
        {leases?.length ? (
          <TableWrap>
            <table className="table">
              <thead>
                <tr>
                  <th>Bien</th>
                  <th>Locataire</th>
                  <th>Période</th>
                  <th className="text-right">Loyer + charges</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                {leases.map((l) => (
                  <tr key={l.id}>
                    <td>
                      <Link href={`/baux/${l.id}`} className="link">
                        {(l.properties as any)?.name}
                      </Link>
                    </td>
                    <td>{(l.tenants as any)?.full_name}</td>
                    <td>
                      {dateFr(l.start_date)} → {l.end_date ? dateFr(l.end_date) : "…"}
                    </td>
                    <td className="text-right tabular-nums">{fcfa(l.rent_amount + l.charges_amount)}</td>
                    <td>
                      {l.status !== "actif" ? (
                        <Badge>Terminé</Badge>
                      ) : l.end_date && l.end_date <= soon ? (
                        <Badge tone="amber">Fin proche</Badge>
                      ) : (
                        <Badge tone="green">Actif</Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableWrap>
        ) : (
          <Empty title="Aucun bail">Créez un bail pour relier un locataire à un bien.</Empty>
        )}
      </Card>
    </>
  );
}
