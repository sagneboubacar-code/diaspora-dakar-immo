"use server";

import { revalidatePath } from "next/cache";
import { requireOrg } from "@/lib/session";
import { amount, done, fail, FormError, required, str } from "@/lib/form";

export async function savePayout(fd: FormData) {
  const { supabase, org } = await requireOrg();
  try {
    const value = amount(fd, "amount");
    if (!value) throw new FormError("Indiquez le montant reversé.");
    const { error } = await supabase.from("payouts").insert({
      org_id: org.id,
      owner_id: required(fd, "owner_id", "Propriétaire"),
      paid_on: required(fd, "paid_on", "Date"),
      amount: value,
      method: str(fd, "method") ?? "virement",
      reference: str(fd, "reference"),
      notes: str(fd, "notes"),
    });
    if (error) throw error;
  } catch (e) {
    fail("/reversements", e as Error);
  }
  revalidatePath("/", "layout");
  done("/reversements", "Reversement enregistré.");
}

export async function deletePayout(fd: FormData) {
  const { supabase, isAdmin } = await requireOrg();
  if (!isAdmin) fail("/reversements", new FormError("Seul un administrateur peut supprimer un reversement."));
  const { error } = await supabase.from("payouts").delete().eq("id", str(fd, "id")!);
  if (error) fail("/reversements", error);
  revalidatePath("/", "layout");
  done("/reversements", "Reversement supprimé.");
}
