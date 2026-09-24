import Link from "next/link";
import { Badge, Card, Empty, Flash, PageHeader, Stat, TableWrap } from "@/components/ui";
import { ConfirmButton, SubmitButton } from "@/components/buttons";
import { addMonths, currentMonth, dateFr, fcfa, isMonth, monthLabel, monthStart, today, whatsappLink } from "@/lib/format";
import { DUE_STATUS, PAYMENT_METHODS } from "@/lib/labels";
import { requireOrg } from "@/lib/session";
import { deletePayment, generateDues, recordPayment } from "./actions";

export const metadata = { title: "Loyers & quittances" };

const FILTERS: [string, string][] = [
  ["", "Tous"],
  ["impaye", "Impayés"],
  ["partiel", "Partiels"],
  ["paye", "Payés"],
  ["a_venir", "À venir"],
];

export default async function Page({
  searchParams,
}: {
  searchParams: { mois?: string; statut?: string; erreur?: string; ok?: string; quittance?: string };
}) {
  const { supabase, org, isAdmin } = await requireOrg();
  const month = isMonth(searchParams.mois) ? searchParams.mois : currentMonth();
  const statut = searchParams.statut ?? "";
  const back = `/loyers?mois=${month}${statut ? `&statut=${statut}` : ""}`;

  const { data: allDues } = await supabase
    .from("v_dues")
    .select("*")
    .eq("org_id", org.id)
    .eq("period", monthStart(month))
    .order("property_name");
  const dues = (allDues ?? []).filter((d) => !statut || d.status === statut);
  const ids = (allDues ?? []).map((d) => d.id);
  const { data: payments } = ids.length
    ? await supabase.from("payments").select("*").in("due_id", ids).order("paid_on")
    : { data: [] };

  const expected = (allDues ?? []).reduce((s, d) => s + d.amount_due, 0);
  const collected = (allDues ?? []).reduce((s, d) => s + d.amount_paid, 0);
  const late = (allDues ?? []).filter((d) => d.status === "impaye" || d.status === "partiel").length;

  return (
    <>
      <PageHeader
        title="Loyers & quittances"
        subtitle="Échéances du mois, encaissements, relances et quittances."
        actions={
          <form action={generateDues}>
            <input type="hidden" name="mois" value={month} />
            <SubmitButton className="btn btn-primary" pendingText="Génération…">
              Générer les échéances de {monthLabel(month).toLowerCase()}
            </SubmitButton>
          </form>
        }
      />
      <Flash searchParams={searchParams} />
      {searchParams.quittance && (
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-brand/20 bg-brand-light/50 px-4 py-3 text-sm">
          <span>La quittance est prête.</span>
          <Link href={`/imprimer/quittance/${searchParams.quittance}`} target="_blank" className="btn btn-sm btn-primary">
            Ouvrir la quittance
          </Link>
        </div>
      )}

      <div className="mb-5 flex flex-wrap items-center gap-2">
        <Link href={`/loyers?mois=${addMonths(month, -1)}`} className="btn btn-sm" aria-label="Mois précédent">
          ←
        </Link>
        <span className="min-w-40 text-center font-semibold">{monthLabel(month)}</span>
        <Link href={`/loyers?mois=${addMonths(month, 1)}`} className="btn btn-sm" aria-label="Mois suivant">
          →
        </Link>
        {month !== currentMonth() && (
          <Link href="/loyers" className="text-sm link">
            Mois en cours
          </Link>
        )}
        <div className="ml-auto flex flex-wrap gap-1">
          {FILTERS.map(([value, label]) => (
            <Link
              key={value}
              href={`/loyers?mois=${month}${value ? `&statut=${value}` : ""}`}
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                statut === value ? "bg-ink text-white" : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Attendu" value={fcfa(expected)} hint={`${allDues?.length ?? 0} échéance(s)`} />
        <Stat label="Encaissé" value={fcfa(collected)} tone="green" />
        <Stat label="Reste à encaisser" value={fcfa(expected - collected)} tone={expected - collected > 0 ? "red" : undefined} />
        <Stat
          label="Recouvrement"
          value={expected ? `${Math.round((collected / expected) * 100)} %` : "—"}
          hint={late ? `${late} locataire(s) en retard` : "Aucun retard"}
        />
      </div>

      <Card padded={false}>
        {dues.length ? (
          <TableWrap>
            <table className="table">
              <thead>
                <tr>
                  <th>Bien / locataire</th>
                  <th>Échéance</th>
                  <th className="text-right">Dû</th>
                  <th className="text-right">Payé</th>
                  <th>Statut</th>
                  <th>Paiements</th>
                </tr>
              </thead>
              <tbody>
                {dues.map((d) => {
                  const pays = (payments ?? []).filter((p) => p.due_id === d.id);
                  const wa =
                    d.balance > 0 &&
                    whatsappLink(
                      d.tenant_phone,
                      `Bonjour ${d.tenant_name}, sauf erreur de notre part, le loyer de ${monthLabel(month).toLowerCase()} pour « ${d.property_name} » n'est pas encore réglé : reste ${fcfa(d.balance)}. Merci de régulariser. — ${org.name}`,
                    );
                  return (
                    <tr key={d.id}>
                      <td>
                        <div className="font-medium">{d.property_name}</div>
                        <div className="text-xs text-slate-500">{d.tenant_name}</div>
                      </td>
                      <td>{dateFr(d.due_date)}</td>
                      <td className="text-right tabular-nums">{fcfa(d.amount_due)}</td>
                      <td className="text-right tabular-nums">{fcfa(d.amount_paid)}</td>
                      <td>
                        <Badge tone={DUE_STATUS[d.status].tone}>{DUE_STATUS[d.status].label}</Badge>
                      </td>
                      <td className="min-w-64">
                        <ul className="space-y-1">
                          {pays.map((p) => (
                            <li key={p.id} className="flex flex-wrap items-center gap-x-2 text-xs">
                              <span className="tabular-nums">{fcfa(p.amount)}</span>
                              <span className="text-slate-500">
                                {dateFr(p.paid_on)} · {PAYMENT_METHODS[p.method]}
                              </span>
                              <Link href={`/imprimer/quittance/${p.id}`} target="_blank" className="link">
                                {p.receipt_number}
                              </Link>
                              {isAdmin && (
                                <form action={deletePayment} className="inline">
                                  <input type="hidden" name="id" value={p.id} />
                                  <input type="hidden" name="back" value={back} />
                                  <ConfirmButton
                                    message={`Annuler le paiement ${p.receipt_number} ?`}
                                    className="text-red-600 hover:underline"
                                  >
                                    annuler
                                  </ConfirmButton>
                                </form>
                              )}
                            </li>
                          ))}
                        </ul>
                        {d.balance > 0 && (
                          <details className="mt-1">
                            <summary className="cursor-pointer text-xs font-medium text-brand">Encaisser</summary>
                            <form action={recordPayment} className="mt-2 grid gap-2 rounded-lg bg-slate-50 p-3 sm:grid-cols-2">
                              <input type="hidden" name="due_id" value={d.id} />
                              <input type="hidden" name="back" value={back} />
                              <input name="amount" defaultValue={d.balance} inputMode="numeric" className="input" aria-label="Montant" required />
                              <input name="paid_on" type="date" defaultValue={today()} className="input" aria-label="Date" required />
                              <select name="method" className="input" aria-label="Moyen de paiement" defaultValue="especes">
                                {Object.entries(PAYMENT_METHODS).map(([v, l]) => (
                                  <option key={v} value={v}>
                                    {l}
                                  </option>
                                ))}
                              </select>
                              <input name="reference" placeholder="Réf. transaction" className="input" aria-label="Référence" />
                              <SubmitButton className="btn btn-primary btn-sm sm:col-span-2">Enregistrer le paiement</SubmitButton>
                            </form>
                          </details>
                        )}
                        {wa && (
                          <a href={wa} target="_blank" rel="noreferrer" className="mt-1 inline-block text-xs font-medium text-emerald-700 hover:underline">
                            Relancer sur WhatsApp
                          </a>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </TableWrap>
        ) : (
          <Empty title={allDues?.length ? "Aucune échéance avec ce statut" : `Aucune échéance pour ${monthLabel(month).toLowerCase()}`}>
            {!allDues?.length && "Cliquez sur « Générer les échéances » pour créer les loyers du mois à partir des baux actifs."}
          </Empty>
        )}
      </Card>
    </>
  );
}
