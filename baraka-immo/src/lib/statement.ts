import type { SupabaseClient } from "@supabase/supabase-js";
import { monthEnd, monthStart } from "@/lib/format";

// Relevé de gestion d'un propriétaire pour un mois. Utilisé par l'agence et
// par le propriétaire lui-même (la RLS filtre selon qui consulte).
export async function getStatement(supabase: SupabaseClient, ownerId: string, month: string) {
  const from = monthStart(month);
  const to = monthEnd(month);

  const { data: owner } = await supabase
    .from("owners")
    .select("*, organizations(*)")
    .eq("id", ownerId)
    .maybeSingle();
  if (!owner) return null;

  const [{ data: payments }, { data: expenses }, { data: payouts }, { data: balance }, { data: properties }] =
    await Promise.all([
      supabase.from("v_payments").select("*").eq("owner_id", ownerId).gte("paid_on", from).lt("paid_on", to).order("paid_on"),
      supabase
        .from("expenses")
        .select("*, properties!inner(name, owner_id)")
        .eq("properties.owner_id", ownerId)
        .eq("charge_to_owner", true)
        .gte("spent_on", from)
        .lt("spent_on", to)
        .order("spent_on"),
      supabase.from("payouts").select("*").eq("owner_id", ownerId).gte("paid_on", from).lt("paid_on", to).order("paid_on"),
      supabase.from("v_owner_balances").select("*").eq("owner_id", ownerId).maybeSingle(),
      supabase.from("properties").select("id").eq("owner_id", ownerId),
    ]);

  // Loyers du mois restant impayés, pour information.
  const propertyIds = (properties ?? []).map((p) => p.id);
  const { data: unpaid } = propertyIds.length
    ? await supabase
        .from("v_dues")
        .select("property_name, tenant_name, balance, status")
        .in("property_id", propertyIds)
        .eq("period", from)
        .in("status", ["impaye", "partiel", "a_venir"])
    : { data: [] };

  const collected = (payments ?? []).reduce((s, p) => s + p.amount, 0);
  const commission = (payments ?? []).reduce((s, p) => s + p.commission_amount, 0);
  const spent = (expenses ?? []).reduce((s, e) => s + e.amount, 0);
  const paidOut = (payouts ?? []).reduce((s, p) => s + p.amount, 0);

  return {
    owner,
    org: owner.organizations,
    payments: payments ?? [],
    expenses: expenses ?? [],
    payouts: payouts ?? [],
    unpaid: unpaid ?? [],
    totals: { collected, commission, spent, net: collected - commission - spent, paidOut },
    balance: balance?.balance ?? 0,
  };
}
