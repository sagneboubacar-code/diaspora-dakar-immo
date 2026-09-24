import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { dateFr, fcfa, monthLabel } from "@/lib/format";
import { PAYMENT_METHODS } from "@/lib/labels";
import { numberToFrench } from "@/lib/words";
import { DocFooter, DocHeader } from "../../DocHeader";

export const metadata = { title: "Quittance" };

export default async function Page({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: p } = await supabase.from("v_payments").select("*").eq("id", params.id).maybeSingle();
  if (!p) notFound();

  const [{ data: due }, { data: lease }, { data: org }, { data: earlier }] = await Promise.all([
    supabase.from("v_dues").select("*").eq("id", p.due_id).single(),
    supabase.from("rent_dues").select("leases(properties(name, address, city))").eq("id", p.due_id).single(),
    supabase.from("organizations").select("*").eq("id", p.org_id).single(),
    supabase.from("payments").select("amount, created_at").eq("due_id", p.due_id),
  ]);
  // Ce qui était déjà réglé avant ce paiement, et ce qui reste après lui.
  const before = (earlier ?? []).filter((x) => x.created_at < p.created_at).reduce((s, x) => s + x.amount, 0);
  const remaining = Math.max(0, (due?.amount_due ?? 0) - before - p.amount);
  const full = remaining === 0;
  const property = (lease?.leases as any)?.properties;
  const period = monthLabel(p.period.slice(0, 7)).toLowerCase();
  const isAgency = org?.kind === "agence";

  return (
    <>
      <DocHeader org={org} title={full ? "Quittance de loyer" : "Reçu de paiement"} subtitle={`N° ${p.receipt_number}`} />

      <div className="mb-8 grid gap-6 text-sm sm:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Locataire</p>
          <p className="mt-1 font-semibold">{p.tenant_name}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Logement</p>
          <p className="mt-1 font-semibold">{property?.name}</p>
          <p>{[property?.address, property?.city].filter(Boolean).join(", ")}</p>
        </div>
        {isAgency && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Propriétaire (bailleur)</p>
            <p className="mt-1">{p.owner_name}</p>
          </div>
        )}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Période</p>
          <p className="mt-1 capitalize">{period}</p>
        </div>
      </div>

      <p className="mb-8 text-sm leading-relaxed">
        {isAgency ? (
          <>
            <strong>{org?.name}</strong>, agissant en qualité de mandataire de <strong>{p.owner_name}</strong>, déclare
          </>
        ) : (
          <>
            Je soussigné(e) <strong>{org?.name}</strong>, bailleur, déclare
          </>
        )}{" "}
        avoir reçu de <strong>{p.tenant_name}</strong> la somme de <strong>{fcfa(p.amount)}</strong> (
        {numberToFrench(p.amount)} francs CFA) le {dateFr(p.paid_on)}, au titre du loyer et des charges du mois de{" "}
        {period}
        {full ? ", et lui en donne quittance, sous réserve de tous droits." : ", à titre de paiement partiel."}
      </p>

      <table className="mb-8 w-full text-sm">
        <tbody className="[&_td]:border-b [&_td]:border-slate-200 [&_td]:py-2">
          <tr>
            <td>Loyer</td>
            <td className="text-right tabular-nums">{fcfa(due?.rent_amount)}</td>
          </tr>
          <tr>
            <td>Charges</td>
            <td className="text-right tabular-nums">{fcfa(due?.charges_amount)}</td>
          </tr>
          <tr className="font-semibold">
            <td>Total dû pour la période</td>
            <td className="text-right tabular-nums">{fcfa(due?.amount_due)}</td>
          </tr>
          {before > 0 && (
            <tr>
              <td>Déjà réglé précédemment</td>
              <td className="text-right tabular-nums">{fcfa(before)}</td>
            </tr>
          )}
          <tr className="font-semibold">
            <td>
              Montant reçu ({PAYMENT_METHODS[p.method]}
              {p.reference ? ` · réf. ${p.reference}` : ""})
            </td>
            <td className="text-right tabular-nums">{fcfa(p.amount)}</td>
          </tr>
          <tr className={remaining ? "font-semibold text-red-700" : ""}>
            <td>Reste à payer</td>
            <td className="text-right tabular-nums">{fcfa(remaining)}</td>
          </tr>
        </tbody>
      </table>

      <div className="flex justify-end">
        <div className="w-64 text-center text-sm">
          <p>Fait le {dateFr(p.paid_on)}</p>
          <p className="mt-1">Signature et cachet</p>
          <div className="mt-2 h-24 rounded border border-dashed border-slate-300" />
        </div>
      </div>
      <DocFooter />
    </>
  );
}
