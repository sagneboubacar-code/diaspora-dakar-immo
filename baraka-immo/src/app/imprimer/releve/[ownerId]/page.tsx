import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { currentMonth, dateFr, fcfa, isMonth, monthLabel, percent } from "@/lib/format";
import { DUE_STATUS, PAYMENT_METHODS } from "@/lib/labels";
import { getStatement } from "@/lib/statement";
import { DocFooter, DocHeader } from "../../DocHeader";

export const metadata = { title: "Relevé de gestion" };

export default async function Page({ params, searchParams }: { params: { ownerId: string }; searchParams: { mois?: string } }) {
  const month = isMonth(searchParams.mois) ? searchParams.mois : currentMonth();
  const s = await getStatement(createClient(), params.ownerId, month);
  if (!s) notFound();
  const { owner, org, payments, expenses, payouts, unpaid, totals } = s;

  return (
    <>
      <DocHeader org={org} title="Relevé de gestion" subtitle={monthLabel(month)} />

      <div className="mb-8 text-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Propriétaire</p>
        <p className="mt-1 font-semibold">{owner.full_name}</p>
        {owner.country && <p>{owner.country}</p>}
      </div>

      <Section title="Loyers encaissés">
        {payments.length ? (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase text-slate-500">
                <th className="py-1.5">Date</th>
                <th>Bien / locataire</th>
                <th>Période</th>
                <th className="text-right">Montant</th>
                <th className="text-right">Commission</th>
              </tr>
            </thead>
            <tbody className="[&_td]:border-t [&_td]:border-slate-200 [&_td]:py-1.5">
              {payments.map((p) => (
                <tr key={p.id}>
                  <td>{dateFr(p.paid_on)}</td>
                  <td>
                    {p.property_name}
                    <span className="block text-xs text-slate-500">
                      {p.tenant_name} · {PAYMENT_METHODS[p.method]} · {p.receipt_number}
                    </span>
                  </td>
                  <td>{monthLabel(p.period.slice(0, 7))}</td>
                  <td className="text-right tabular-nums">{fcfa(p.amount)}</td>
                  <td className="text-right tabular-nums">
                    {fcfa(p.commission_amount)}
                    <span className="block text-xs text-slate-500">{percent(p.commission_rate)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-sm text-slate-500">Aucun encaissement ce mois-ci.</p>
        )}
      </Section>

      {expenses.length > 0 && (
        <Section title="Dépenses engagées pour votre compte">
          <table className="w-full text-sm">
            <tbody className="[&_td]:border-t [&_td]:border-slate-200 [&_td]:py-1.5">
              {expenses.map((e) => (
                <tr key={e.id}>
                  <td>{dateFr(e.spent_on)}</td>
                  <td>
                    {e.label}
                    <span className="block text-xs text-slate-500">{e.properties?.name}</span>
                  </td>
                  <td className="text-right tabular-nums">{fcfa(e.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>
      )}

      <Section title="Récapitulatif du mois">
        <table className="w-full text-sm">
          <tbody className="[&_td]:py-1.5">
            <tr>
              <td>Loyers encaissés</td>
              <td className="text-right tabular-nums">{fcfa(totals.collected)}</td>
            </tr>
            <tr>
              <td>− Honoraires de gestion</td>
              <td className="text-right tabular-nums">{fcfa(totals.commission)}</td>
            </tr>
            <tr>
              <td>− Dépenses</td>
              <td className="text-right tabular-nums">{fcfa(totals.spent)}</td>
            </tr>
            <tr className="border-t-2 border-ink text-base font-bold">
              <td className="pt-2">Net revenant au propriétaire</td>
              <td className="pt-2 text-right tabular-nums">{fcfa(totals.net)}</td>
            </tr>
            {payouts.map((p) => (
              <tr key={p.id} className="text-slate-600">
                <td>
                  Reversé le {dateFr(p.paid_on)} ({PAYMENT_METHODS[p.method]}
                  {p.reference ? ` · ${p.reference}` : ""})
                </td>
                <td className="text-right tabular-nums">{fcfa(p.amount)}</td>
              </tr>
            ))}
            <tr className="font-semibold">
              <td className="pt-2">Solde restant à vous reverser (à ce jour, tous mois confondus)</td>
              <td className="pt-2 text-right tabular-nums">{fcfa(s.balance)}</td>
            </tr>
          </tbody>
        </table>
      </Section>

      {unpaid.length > 0 && (
        <Section title="Loyers du mois non soldés">
          <ul className="text-sm">
            {unpaid.map((u, i) => (
              <li key={i} className="flex justify-between border-t border-slate-200 py-1.5">
                <span>
                  {u.property_name} — {u.tenant_name} ({DUE_STATUS[u.status].label.toLowerCase()})
                </span>
                <span className="tabular-nums">{fcfa(u.balance)}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}
      <DocFooter />
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8 break-inside-avoid">
      <h2 className="mb-2 text-sm font-bold uppercase tracking-wide">{title}</h2>
      {children}
    </section>
  );
}
