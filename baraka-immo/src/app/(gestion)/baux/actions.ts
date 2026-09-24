"use server";

import { revalidatePath } from "next/cache";
import { requireOrg } from "@/lib/session";
import { addMonths, currentMonth, monthStart } from "@/lib/format";
import { amount, done, fail, FormError, required, str } from "@/lib/form";

export async function saveLease(fd: FormData) {
  const { supabase, org } = await requireOrg();
  const id = str(fd, "id");
  const back = id ? `/baux/${id}/modifier` : "/baux/nouveau";
  let savedId = id;

  try {
    const start = required(fd, "start_date", "Date d'entrée");
    const end = str(fd, "end_date");
    if (end && end < start) throw new FormError("La date de fin doit être après la date d'entrée.");
    const dueDay = Number(str(fd, "due_day") ?? 5);
    if (!(dueDay >= 1 && dueDay <= 28)) throw new FormError("Le jour d'échéance doit être entre 1 et 28.");
    const rent = amount(fd, "rent_amount");
    if (rent === null) throw new FormError("Indiquez le loyer mensuel.");

    const row = {
      start_date: start,
      end_date: end,
      rent_amount: rent,
      charges_amount: amount(fd, "charges_amount") ?? 0,
      deposit_amount: amount(fd, "deposit_amount") ?? 0,
      due_day: dueDay,
      agency_fee: amount(fd, "agency_fee") ?? 0,
      notes: str(fd, "notes"),
    };

    if (id) {
      const { error } = await supabase.from("leases").update(row).eq("id", id);
      if (error) throw error;
    } else {
      const { data, error } = await supabase
        .from("leases")
        .insert({
          ...row,
          org_id: org.id,
          property_id: required(fd, "property_id", "Bien"),
          tenant_id: required(fd, "tenant_id", "Locataire"),
        })
        .select("id")
        .single();
      if (error) throw error;
      savedId = data.id;

      // Échéances du mois d'entrée jusqu'au mois courant (bail saisi en
      // retard), 24 mois au plus. Les mois suivants sont générés depuis
      // la page Loyers.
      const dues = [];
      let m = start.slice(0, 7);
      const last = currentMonth();
      while (m <= last && dues.length < 24) {
        if (end && monthStart(m) > end) break;
        dues.push({
          org_id: org.id,
          lease_id: savedId,
          period: monthStart(m),
          due_date: `${m}-${String(dueDay).padStart(2, "0")}`,
          rent_amount: row.rent_amount,
          charges_amount: row.charges_amount,
        });
        m = addMonths(m, 1);
      }
      if (dues.length) {
        const { error: e2 } = await supabase.from("rent_dues").upsert(dues, { onConflict: "lease_id,period", ignoreDuplicates: true });
        if (e2) throw e2;
      }
    }
  } catch (e) {
    fail(back, e as Error);
  }
  revalidatePath("/", "layout");
  done(`/baux/${savedId}`, "Bail enregistré.");
}

export async function endLease(fd: FormData) {
  const { supabase } = await requireOrg();
  const id = str(fd, "id")!;
  const endDate = str(fd, "end_date");
  if (!endDate) fail(`/baux/${id}`, new FormError("Indiquez la date de sortie."));
  const { error } = await supabase.from("leases").update({ status: "termine", end_date: endDate }).eq("id", id);
  if (error) fail(`/baux/${id}`, error);
  // Les échéances postérieures à la sortie et sans paiement n'ont plus lieu d'être.
  const { data: later } = await supabase.from("v_dues").select("id, amount_paid").eq("lease_id", id).gt("period", endDate);
  const toDelete = (later ?? []).filter((d) => d.amount_paid === 0).map((d) => d.id);
  if (toDelete.length) await supabase.from("rent_dues").delete().in("id", toDelete);
  revalidatePath("/", "layout");
  done(`/baux/${id}`, "Bail terminé. Le bien est de nouveau disponible.");
}

export async function deleteLease(fd: FormData) {
  const { supabase } = await requireOrg();
  const id = str(fd, "id")!;
  const { data: paid } = await supabase.from("v_dues").select("id").eq("lease_id", id).gt("amount_paid", 0).limit(1);
  if (paid?.length)
    fail(`/baux/${id}`, new FormError("Ce bail a des paiements enregistrés : terminez-le plutôt que de le supprimer."));
  const { error } = await supabase.from("leases").delete().eq("id", id);
  if (error) fail(`/baux/${id}`, error);
  revalidatePath("/", "layout");
  done("/baux", "Bail supprimé.");
}
