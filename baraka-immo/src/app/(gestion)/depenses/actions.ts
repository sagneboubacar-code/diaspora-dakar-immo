"use server";

import { revalidatePath } from "next/cache";
import { requireOrg } from "@/lib/session";
import { amount, bool, done, fail, FormError, required, str } from "@/lib/form";

export async function saveExpense(fd: FormData) {
  const { supabase, org } = await requireOrg();
  try {
    const value = amount(fd, "amount");
    if (!value) throw new FormError("Indiquez le montant.");
    const { error } = await supabase.from("expenses").insert({
      org_id: org.id,
      property_id: required(fd, "property_id", "Bien"),
      spent_on: required(fd, "spent_on", "Date"),
      category: str(fd, "category") ?? "autre",
      label: required(fd, "label", "Libellé"),
      amount: value,
      charge_to_owner: org.kind === "agence" ? bool(fd, "charge_to_owner") : true,
    });
    if (error) throw error;
  } catch (e) {
    fail("/depenses", e as Error);
  }
  revalidatePath("/", "layout");
  done("/depenses", "Dépense enregistrée.");
}

export async function deleteExpense(fd: FormData) {
  const { supabase } = await requireOrg();
  const { error } = await supabase.from("expenses").delete().eq("id", str(fd, "id")!);
  if (error) fail("/depenses", error);
  revalidatePath("/", "layout");
  done("/depenses", "Dépense supprimée.");
}
