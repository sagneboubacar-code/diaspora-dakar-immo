"use server";

import { revalidatePath } from "next/cache";
import { requireOrg } from "@/lib/session";
import { bool, decimal, done, fail, FormError, required, str } from "@/lib/form";

export async function saveOwner(fd: FormData) {
  const { supabase, org } = await requireOrg();
  const id = str(fd, "id");
  const back = id ? `/proprietaires/${id}/modifier` : "/proprietaires/nouveau";
  let savedId = id;

  try {
    const email = str(fd, "email")?.toLowerCase() ?? null;
    const portal = bool(fd, "portal_enabled");
    if (portal && !email) throw new FormError("Un email est nécessaire pour ouvrir l'espace propriétaire.");
    const row = {
      full_name: required(fd, "full_name", "Nom complet"),
      phone: str(fd, "phone"),
      email,
      country: str(fd, "country"),
      address: str(fd, "address"),
      commission_rate: decimal(fd, "commission_rate"),
      payout_details: str(fd, "payout_details"),
      notes: str(fd, "notes"),
      portal_enabled: portal,
    };
    if (id) {
      const { error } = await supabase.from("owners").update(row).eq("id", id);
      if (error) throw error;
    } else {
      const { data, error } = await supabase
        .from("owners")
        .insert({ ...row, org_id: org.id })
        .select("id")
        .single();
      if (error) throw error;
      savedId = data.id;
    }
  } catch (e) {
    fail(back, e as Error);
  }
  revalidatePath("/", "layout");
  done(`/proprietaires/${savedId}`, "Propriétaire enregistré.");
}

export async function deleteOwner(fd: FormData) {
  const { supabase } = await requireOrg();
  const id = str(fd, "id")!;
  const { error } = await supabase.from("owners").delete().eq("id", id);
  if (error) fail(`/proprietaires/${id}`, error);
  revalidatePath("/", "layout");
  done("/proprietaires", "Propriétaire supprimé.");
}
