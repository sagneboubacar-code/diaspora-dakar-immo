import Link from "next/link";
import { Card, Empty, Flash, PageHeader, TableWrap } from "@/components/ui";
import { fcfa, percent } from "@/lib/format";
import { requireOrg } from "@/lib/session";

export const metadata = { title: "Propriétaires" };

export default async function Page({ searchParams }: { searchParams: { erreur?: string; ok?: string } }) {
  const { supabase, org } = await requireOrg();
  const [{ data: owners }, { data: balances }, { data: props }] = await Promise.all([
    supabase.from("owners").select("*").eq("org_id", org.id).order("full_name"),
    supabase.from("v_owner_balances").select("owner_id, balance").eq("org_id", org.id),
    supabase.from("properties").select("owner_id").eq("org_id", org.id).eq("archived", false),
  ]);
  const balanceOf = new Map((balances ?? []).map((b) => [b.owner_id, b.balance]));
  const countOf = new Map<string, number>();
  (props ?? []).forEach((p) => countOf.set(p.owner_id, (countOf.get(p.owner_id) ?? 0) + 1));

  return (
    <>
      <PageHeader
        title="Propriétaires"
        subtitle="Les mandants dont l'agence gère les biens."
        actions={
          <Link href="/proprietaires/nouveau" className="btn btn-primary">
            + Nouveau propriétaire
          </Link>
        }
      />
      <Flash searchParams={searchParams} />
      <Card padded={false}>
        {owners?.length ? (
          <TableWrap>
            <table className="table">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Contact</th>
                  <th>Pays</th>
                  <th className="text-right">Biens</th>
                  <th className="text-right">Commission</th>
                  <th className="text-right">Solde à reverser</th>
                </tr>
              </thead>
              <tbody>
                {owners.map((o) => (
                  <tr key={o.id}>
                    <td>
                      <Link href={`/proprietaires/${o.id}`} className="link">
                        {o.full_name}
                      </Link>
                      {o.portal_enabled && <span className="ml-2 text-xs text-slate-500">· accès portail</span>}
                    </td>
                    <td className="text-slate-600">{o.phone ?? o.email ?? "—"}</td>
                    <td className="text-slate-600">{o.country ?? "—"}</td>
                    <td className="text-right tabular-nums">{countOf.get(o.id) ?? 0}</td>
                    <td className="text-right tabular-nums">{percent(o.commission_rate ?? org.default_commission_rate)}</td>
                    <td className="text-right font-medium tabular-nums">{fcfa(balanceOf.get(o.id))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableWrap>
        ) : (
          <Empty title="Aucun propriétaire pour l'instant">
            Commencez par ajouter un propriétaire, puis ses biens.
          </Empty>
        )}
      </Card>
    </>
  );
}
