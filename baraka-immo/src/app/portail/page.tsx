import Link from "next/link";
import { redirect } from "next/navigation";
import { Logo } from "../AuthShell";
import { Badge, Card, Empty, Stat, TableWrap } from "@/components/ui";
import { addMonths, currentMonth, dateFr, fcfa, monthLabel, monthStart } from "@/lib/format";
import { APP_NAME } from "@/lib/config";
import { DUE_STATUS, PAYMENT_METHODS, PROPERTY_TYPES } from "@/lib/labels";
import { getSession } from "@/lib/session";
import { signOut } from "../auth-actions";

export const metadata = { title: "Espace propriétaire" };

// Espace propriétaire, en lecture seule : la RLS limite chaque requête aux
// biens de la fiche propriétaire reliée au compte connecté.
export default async function Page({ searchParams }: { searchParams: { p?: string } }) {
  const s = await getSession();
  if (!s) redirect("/connexion");
  if (!s.ownerProfiles.length) redirect(s.memberships.length ? "/tableau-de-bord" : "/demarrer");

  const profile = s.ownerProfiles.find((o) => o.id === searchParams.p) ?? s.ownerProfiles[0];
  const { supabase } = s;
  const month = currentMonth();

  const [{ data: balance }, { data: properties }, { data: dues }, { data: payments }, { data: payouts }] = await Promise.all([
    supabase.from("v_owner_balances").select("*").eq("owner_id", profile.id).maybeSingle(),
    supabase.from("properties").select("id, name, type, city, rent_amount, archived").eq("owner_id", profile.id).eq("archived", false).order("name"),
    supabase.from("v_dues").select("*").eq("owner_id", profile.id).eq("period", monthStart(month)),
    supabase.from("v_payments").select("*").eq("owner_id", profile.id).order("paid_on", { ascending: false }).limit(15),
    supabase.from("payouts").select("*").eq("owner_id", profile.id).order("paid_on", { ascending: false }).limit(10),
  ]);
  const dueOf = new Map((dues ?? []).map((d) => [d.property_id, d]));
  const months = Array.from({ length: 12 }, (_, i) => addMonths(month, -i));

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4">
          <span className="flex items-center gap-2 font-bold">
            <Logo className="h-7 w-7" /> {APP_NAME}
            <span className="font-normal text-slate-500">· Espace propriétaire</span>
          </span>
          <div className="flex items-center gap-3 text-sm">
            {s.memberships.length > 0 && (
              <Link href="/tableau-de-bord" className="link">
                Gestion
              </Link>
            )}
            <form action={signOut}>
              <button className="text-slate-600 hover:text-slate-900" type="submit">
                Se déconnecter
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Bonjour {profile.full_name}</h1>
          <p className="text-sm text-slate-500">Biens gérés par {profile.org_name}</p>
          {s.ownerProfiles.length > 1 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {s.ownerProfiles.map((o) => (
                <Link key={o.id} href={`/portail?p=${o.id}`} className={`btn btn-sm ${o.id === profile.id ? "btn-primary" : ""}`}>
                  {o.org_name}
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Stat label="Loyers encaissés" value={fcfa(balance?.collected)} hint="Depuis le début du mandat" />
          <Stat label="Commissions & dépenses" value={fcfa((balance?.commission ?? 0) + (balance?.expenses ?? 0))} />
          <Stat label="Déjà reversé" value={fcfa(balance?.paid_out)} />
          <Stat label="Solde en attente" value={fcfa(balance?.balance)} tone="green" hint="À vous reverser" />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Card title={`Mes biens — ${monthLabel(month)}`} padded={false}>
              {properties?.length ? (
                <TableWrap>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Bien</th>
                        <th>Locataire</th>
                        <th className="text-right">Loyer du mois</th>
                        <th>Statut</th>
                      </tr>
                    </thead>
                    <tbody>
                      {properties.map((p) => {
                        const d = dueOf.get(p.id);
                        return (
                          <tr key={p.id}>
                            <td>
                              {p.name}
                              <div className="text-xs text-slate-500">
                                {PROPERTY_TYPES[p.type]} {p.city ? `· ${p.city}` : ""}
                              </div>
                            </td>
                            <td>{d?.tenant_name ?? <span className="text-slate-400">—</span>}</td>
                            <td className="text-right tabular-nums">{d ? fcfa(d.amount_due) : "—"}</td>
                            <td>
                              {d ? (
                                <Badge tone={DUE_STATUS[d.status].tone}>{DUE_STATUS[d.status].label}</Badge>
                              ) : (
                                <Badge tone="amber">Vacant</Badge>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </TableWrap>
              ) : (
                <Empty title="Aucun bien pour l'instant" />
              )}
            </Card>

            <Card title="Derniers loyers encaissés" padded={false}>
              {payments?.length ? (
                <TableWrap>
                  <table className="table">
                    <tbody>
                      {payments.map((p) => (
                        <tr key={p.id}>
                          <td>{dateFr(p.paid_on)}</td>
                          <td>
                            {p.property_name}
                            <div className="text-xs text-slate-500">
                              {p.tenant_name} · {monthLabel(p.period.slice(0, 7))} · {PAYMENT_METHODS[p.method]}
                            </div>
                          </td>
                          <td className="text-right tabular-nums">{fcfa(p.amount)}</td>
                          <td className="text-right">
                            <Link href={`/imprimer/quittance/${p.id}`} target="_blank" className="text-xs link">
                              Quittance
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </TableWrap>
              ) : (
                <Empty title="Aucun encaissement pour l'instant" />
              )}
            </Card>
          </div>

          <div className="space-y-6">
            <Card title="Relevés mensuels">
              <ul className="space-y-1.5 text-sm">
                {months.map((m) => (
                  <li key={m}>
                    <Link href={`/imprimer/releve/${profile.id}?mois=${m}`} target="_blank" className="link">
                      {monthLabel(m)}
                    </Link>
                  </li>
                ))}
              </ul>
            </Card>
            <Card title="Reversements reçus" padded={false}>
              {payouts?.length ? (
                <ul className="divide-y divide-slate-100 text-sm">
                  {payouts.map((p) => (
                    <li key={p.id} className="flex justify-between px-5 py-2.5">
                      <span>
                        {dateFr(p.paid_on)}
                        <span className="block text-xs text-slate-500">{PAYMENT_METHODS[p.method]}</span>
                      </span>
                      <span className="tabular-nums">{fcfa(p.amount)}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <Empty title="Aucun reversement" />
              )}
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
