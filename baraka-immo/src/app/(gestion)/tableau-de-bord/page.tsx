import Link from "next/link";
import { Badge, Card, Empty, PageHeader, Stat, TableWrap } from "@/components/ui";
import { SubmitButton } from "@/components/buttons";
import { addDays, currentMonth, dateFr, fcfa, monthEnd, monthLabel, monthStart, today } from "@/lib/format";
import { DUE_STATUS } from "@/lib/labels";
import { requireOrg } from "@/lib/session";
import { generateDues } from "../loyers/actions";

export const metadata = { title: "Tableau de bord" };

export default async function Page() {
  const { supabase, org, isAgency } = await requireOrg();
  const month = currentMonth();
  const now = today();

  const [dues, late, properties, leases, pays, owners, tenants] = await Promise.all([
    supabase.from("v_dues").select("amount_due, amount_paid").eq("org_id", org.id).eq("period", monthStart(month)),
    supabase
      .from("v_dues")
      .select("*")
      .eq("org_id", org.id)
      .in("status", ["impaye", "partiel"])
      .lt("due_date", now)
      .order("due_date")
      .limit(10),
    supabase.from("properties").select("id", { count: "exact", head: true }).eq("org_id", org.id).eq("archived", false),
    supabase
      .from("leases")
      .select("id, end_date, properties(name), tenants(full_name)")
      .eq("org_id", org.id)
      .eq("status", "actif"),
    supabase.from("payments").select("commission_amount").eq("org_id", org.id).gte("paid_on", monthStart(month)).lt("paid_on", monthEnd(month)),
    supabase.from("owners").select("id", { count: "exact", head: true }).eq("org_id", org.id),
    supabase.from("tenants").select("id", { count: "exact", head: true }).eq("org_id", org.id),
  ]);

  const expected = (dues.data ?? []).reduce((s, d) => s + d.amount_due, 0);
  const collected = (dues.data ?? []).reduce((s, d) => s + d.amount_paid, 0);
  const commission = (pays.data ?? []).reduce((s, p) => s + p.commission_amount, 0);
  const activeLeases = leases.data ?? [];
  const propertyCount = properties.count ?? 0;
  const ending = activeLeases
    .filter((l) => l.end_date && l.end_date <= addDays(now, 60))
    .sort((a, b) => (a.end_date! < b.end_date! ? -1 : 1));
  const needsDues = activeLeases.length > 0 && (dues.data ?? []).length < activeLeases.length;

  const steps = [
    ...(isAgency ? [{ done: (owners.count ?? 0) > 0, href: "/proprietaires/nouveau", label: "Ajouter un propriétaire" }] : []),
    { done: propertyCount > 0, href: "/biens/nouveau", label: "Ajouter un bien" },
    { done: (tenants.count ?? 0) > 0, href: "/locataires/nouveau", label: "Ajouter un locataire" },
    { done: activeLeases.length > 0, href: "/baux/nouveau", label: "Créer un bail" },
  ];
  const onboarding = steps.some((s) => !s.done);

  return (
    <>
      <PageHeader title="Tableau de bord" subtitle={`${org.name} · ${monthLabel(month)}`} />

      {onboarding && (
        <Card title="Bien démarrer" className="mb-6">
          <ol className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <li key={s.href}>
                <Link
                  href={s.href}
                  className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm ${
                    s.done ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-slate-200 hover:border-brand"
                  }`}
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold ring-1 ring-slate-200">
                    {s.done ? "✓" : i + 1}
                  </span>
                  {s.label}
                </Link>
              </li>
            ))}
          </ol>
        </Card>
      )}

      {needsDues && (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <span>Certaines échéances de {monthLabel(month).toLowerCase()} n&apos;ont pas encore été générées.</span>
          <form action={generateDues}>
            <input type="hidden" name="mois" value={month} />
            <SubmitButton className="btn btn-sm btn-primary" pendingText="Génération…">
              Générer maintenant
            </SubmitButton>
          </form>
        </div>
      )}

      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Loyers attendus ce mois" value={fcfa(expected)} />
        <Stat
          label="Encaissés ce mois"
          value={fcfa(collected)}
          tone="green"
          hint={expected ? `${Math.round((collected / expected) * 100)} % recouvré` : undefined}
        />
        {isAgency ? (
          <Stat label="Commissions du mois" value={fcfa(commission)} />
        ) : (
          <Stat label="Reste à encaisser" value={fcfa(expected - collected)} tone={expected > collected ? "red" : undefined} />
        )}
        <Stat
          label="Occupation"
          value={propertyCount ? `${Math.round((activeLeases.length / propertyCount) * 100)} %` : "—"}
          hint={`${activeLeases.length} loué(s) sur ${propertyCount} bien(s)`}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card
          title="Loyers en retard"
          padded={false}
          className="lg:col-span-2"
          actions={
            <Link href="/loyers?statut=impaye" className="text-sm link">
              Tout voir
            </Link>
          }
        >
          {late.data?.length ? (
            <TableWrap>
              <table className="table">
                <thead>
                  <tr>
                    <th>Locataire</th>
                    <th>Mois</th>
                    <th className="text-right">Reste dû</th>
                    <th>Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {late.data.map((d) => (
                    <tr key={d.id}>
                      <td>
                        <Link href={`/loyers?mois=${d.period.slice(0, 7)}`} className="link">
                          {d.tenant_name}
                        </Link>
                        <div className="text-xs text-slate-500">{d.property_name}</div>
                      </td>
                      <td>{monthLabel(d.period.slice(0, 7))}</td>
                      <td className="text-right font-medium tabular-nums text-red-700">{fcfa(d.balance)}</td>
                      <td>
                        <Badge tone={DUE_STATUS[d.status].tone}>{DUE_STATUS[d.status].label}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableWrap>
          ) : (
            <Empty title="Aucun retard de paiement 🎉" />
          )}
        </Card>

        <Card title="Baux se terminant sous 60 jours" padded={false}>
          {ending.length ? (
            <ul className="divide-y divide-slate-100">
              {ending.map((l) => (
                <li key={l.id} className="px-5 py-3 text-sm">
                  <Link href={`/baux/${l.id}`} className="link">
                    {(l.properties as any)?.name}
                  </Link>
                  <div className="text-xs text-slate-500">
                    {(l.tenants as any)?.full_name} · fin le {dateFr(l.end_date)}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <Empty title="Rien à signaler" />
          )}
        </Card>
      </div>
    </>
  );
}
