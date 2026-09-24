import Link from "next/link";
import { Badge, Card, Empty, Flash, PageHeader, TableWrap } from "@/components/ui";
import { requireOrg } from "@/lib/session";

export const metadata = { title: "Locataires" };

export default async function Page({ searchParams }: { searchParams: { erreur?: string; ok?: string } }) {
  const { supabase, org } = await requireOrg();
  const { data: tenants } = await supabase
    .from("tenants")
    .select("id, full_name, phone, email, profession, leases(status, properties(name))")
    .eq("org_id", org.id)
    .order("full_name");

  return (
    <>
      <PageHeader
        title="Locataires"
        actions={
          <Link href="/locataires/nouveau" className="btn btn-primary">
            + Nouveau locataire
          </Link>
        }
      />
      <Flash searchParams={searchParams} />
      <Card padded={false}>
        {tenants?.length ? (
          <TableWrap>
            <table className="table">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Contact</th>
                  <th>Logement actuel</th>
                </tr>
              </thead>
              <tbody>
                {tenants.map((t) => {
                  const active = (t.leases as any[])?.find((l) => l.status === "actif");
                  return (
                    <tr key={t.id}>
                      <td>
                        <Link href={`/locataires/${t.id}`} className="link">
                          {t.full_name}
                        </Link>
                        {t.profession && <div className="text-xs text-slate-500">{t.profession}</div>}
                      </td>
                      <td className="text-slate-600">{[t.phone, t.email].filter(Boolean).join(" · ") || "—"}</td>
                      <td>{active ? active.properties?.name : <Badge>Aucun bail actif</Badge>}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </TableWrap>
        ) : (
          <Empty title="Aucun locataire" />
        )}
      </Card>
    </>
  );
}
