import Link from "next/link";
import { redirect } from "next/navigation";
import { Card, Empty, PageHeader, Stat, TableWrap } from "@/components/ui";
import { currentMonth, fcfa, isMonth, monthLabel } from "@/lib/format";
import { requireOrg } from "@/lib/session";

export const metadata = { title: "Commissions" };

interface Row {
  collected: number;
  commission: number;
  fees: number;
}

export default async function Page({ searchParams }: { searchParams: { annee?: string; mois?: string } }) {
  const { supabase, org, isAgency } = await requireOrg();
  if (!isAgency) redirect("/tableau-de-bord");

  const year = /^\d{4}$/.test(searchParams.annee ?? "") ? searchParams.annee! : currentMonth().slice(0, 4);
  const [{ data: payments }, { data: leases }] = await Promise.all([
    supabase
      .from("v_payments")
      .select("paid_on, amount, commission_amount, owner_id, owner_name")
      .eq("org_id", org.id)
      .gte("paid_on", `${year}-01-01`)
      .lt("paid_on", `${Number(year) + 1}-01-01`),
    supabase
      .from("leases")
      .select("start_date, agency_fee, properties(owner_id, owners(full_name))")
      .eq("org_id", org.id)
      .gt("agency_fee", 0)
      .gte("start_date", `${year}-01-01`)
      .lt("start_date", `${Number(year) + 1}-01-01`),
  ]);

  const months = Array.from({ length: 12 }, (_, i) => `${year}-${String(i + 1).padStart(2, "0")}`);
  const byMonth = new Map<string, Row>(months.map((m) => [m, { collected: 0, commission: 0, fees: 0 }]));
  for (const p of payments ?? []) {
    const r = byMonth.get(p.paid_on.slice(0, 7))!;
    r.collected += p.amount;
    r.commission += p.commission_amount;
  }
  for (const l of leases ?? []) byMonth.get(l.start_date.slice(0, 7))!.fees += l.agency_fee;

  const total = [...byMonth.values()].reduce(
    (t, r) => ({ collected: t.collected + r.collected, commission: t.commission + r.commission, fees: t.fees + r.fees }),
    { collected: 0, commission: 0, fees: 0 },
  );

  // Détail par propriétaire du mois choisi.
  const month = isMonth(searchParams.mois) && searchParams.mois.startsWith(year) ? searchParams.mois : null;
  const byOwner = new Map<string, Row & { name: string }>();
  if (month) {
    for (const p of payments ?? []) {
      if (!p.paid_on.startsWith(month)) continue;
      const r = byOwner.get(p.owner_id) ?? { name: p.owner_name, collected: 0, commission: 0, fees: 0 };
      r.collected += p.amount;
      r.commission += p.commission_amount;
      byOwner.set(p.owner_id, r);
    }
    for (const l of leases ?? []) {
      if (!l.start_date.startsWith(month)) continue;
      const prop = l.properties as any;
      const r = byOwner.get(prop.owner_id) ?? { name: prop.owners?.full_name, collected: 0, commission: 0, fees: 0 };
      r.fees += l.agency_fee;
      byOwner.set(prop.owner_id, r);
    }
  }

  return (
    <>
      <PageHeader
        title="Commissions de l'agence"
        subtitle="Honoraires de gestion prélevés sur chaque loyer encaissé, et frais de mise en location."
        actions={
          <div className="flex items-center gap-2">
            <Link href={`/commissions?annee=${Number(year) - 1}`} className="btn btn-sm">
              ←
            </Link>
            <span className="font-semibold">{year}</span>
            <Link href={`/commissions?annee=${Number(year) + 1}`} className="btn btn-sm">
              →
            </Link>
          </div>
        }
      />

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <Stat label={`Loyers encaissés ${year}`} value={fcfa(total.collected)} />
        <Stat label="Honoraires de gestion" value={fcfa(total.commission)} />
        <Stat label="Chiffre d'affaires agence" value={fcfa(total.commission + total.fees)} tone="green" hint={`dont ${fcfa(total.fees)} de frais de mise en location`} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Par mois" padded={false}>
          <TableWrap>
            <table className="table">
              <thead>
                <tr>
                  <th>Mois</th>
                  <th className="text-right">Encaissé</th>
                  <th className="text-right">Honoraires</th>
                  <th className="text-right">Frais</th>
                  <th className="text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {months.map((m) => {
                  const r = byMonth.get(m)!;
                  return (
                    <tr key={m} className={m === month ? "bg-brand-light/40" : ""}>
                      <td>
                        <Link href={`/commissions?annee=${year}&mois=${m}`} className="link">
                          {monthLabel(m)}
                        </Link>
                      </td>
                      <td className="text-right tabular-nums">{fcfa(r.collected)}</td>
                      <td className="text-right tabular-nums">{fcfa(r.commission)}</td>
                      <td className="text-right tabular-nums">{fcfa(r.fees)}</td>
                      <td className="text-right font-semibold tabular-nums">{fcfa(r.commission + r.fees)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </TableWrap>
        </Card>

        <Card title={month ? `Détail — ${monthLabel(month)}` : "Détail par propriétaire"} padded={false}>
          {!month ? (
            <Empty title="Choisissez un mois">Cliquez sur un mois pour voir les commissions par propriétaire.</Empty>
          ) : byOwner.size ? (
            <TableWrap>
              <table className="table">
                <thead>
                  <tr>
                    <th>Propriétaire</th>
                    <th className="text-right">Encaissé</th>
                    <th className="text-right">Honoraires</th>
                    <th className="text-right">Frais</th>
                  </tr>
                </thead>
                <tbody>
                  {[...byOwner.entries()]
                    .sort((a, b) => a[1].name.localeCompare(b[1].name))
                    .map(([id, r]) => (
                      <tr key={id}>
                        <td>
                          <Link href={`/imprimer/releve/${id}?mois=${month}`} target="_blank" className="link">
                            {r.name}
                          </Link>
                        </td>
                        <td className="text-right tabular-nums">{fcfa(r.collected)}</td>
                        <td className="text-right tabular-nums">{fcfa(r.commission)}</td>
                        <td className="text-right tabular-nums">{fcfa(r.fees)}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </TableWrap>
          ) : (
            <Empty title="Aucune commission ce mois-ci" />
          )}
        </Card>
      </div>
    </>
  );
}
