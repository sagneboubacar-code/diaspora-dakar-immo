"use server";

import { revalidatePath } from "next/cache";
import { requireOrg } from "@/lib/session";
import { isMonth, monthLabel, monthStart } from "@/lib/format";
import { amount, done, fail, FormError, required, str } from "@/lib/form";

export async function generateDues(fd: FormData) {
  const { supabase, org } = await requireOrg();
  const month = str(fd, "mois");
  const back = `/loyers?mois=${month}`;
  if (!isMonth(month)) fail("/loyers", new FormError("Mois invalide."));
  const { data, error } = await supabase.rpc("generate_dues", { p_org: org.id, p_period: monthStart(month) });
  if (error) fail(back, error);
  revalidatePath("/", "layout");
  done(back, data ? `${data} échéance(s) créée(s) pour ${monthLabel(month)}.` : "Toutes les échéances du mois existent déjà.");
}

export async function recordPayment(fd: FormData) {
  const { supabase, org } = await requireOrg();
  const back = str(fd, "back") ?? "/loyers";
  let paymentId: string | null = null;
  try {
    const value = amount(fd, "amount");
    if (!value || value <= 0) throw new FormError("Indiquez un montant supérieur à 0.");
    // Numéro de quittance et commission sont fixés par la base (trigger).
    const { data, error } = await supabase
      .from("payments")
      .insert({
        org_id: org.id,
        due_id: required(fd, "due_id", "Échéance"),
        amount: value,
        paid_on: required(fd, "paid_on", "Date"),
        method: str(fd, "method") ?? "especes",
        reference: str(fd, "reference"),
      })
      .select("id, receipt_number")
      .single();
    if (error) throw error;
    paymentId = data.id;
  } catch (e) {
    fail(back, e as Error);
  }
  revalidatePath("/", "layout");
  done(`${back}${back.includes("?") ? "&" : "?"}quittance=${paymentId}`, "Paiement enregistré.");
}

export async function deletePayment(fd: FormData) {
  const { supabase, isAdmin } = await requireOrg();
  const back = str(fd, "back") ?? "/loyers";
  if (!isAdmin) fail(back, new FormError("Seul un administrateur peut annuler un paiement."));
  const { error } = await supabase.from("payments").delete().eq("id", str(fd, "id")!);
  if (error) fail(back, error);
  revalidatePath("/", "layout");
  done(back, "Paiement annulé.");
}
