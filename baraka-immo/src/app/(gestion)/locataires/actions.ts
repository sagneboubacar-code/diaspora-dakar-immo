"use server";

import { revalidatePath } from "next/cache";
import { requireOrg } from "@/lib/session";
import { done, fail, required, str } from "@/lib/form";

export async function saveTenant(fd: FormData) {
  const { supabase, org } = await requireOrg();
  const id = str(fd, "id");
  const back = id ? `/locataires/${id}/modifier` : "/locataires/nouveau";
  const next = str(fd, "next"); // retour au formulaire de bail si besoin
  let savedId = id;

  try {
    const row = {
      full_name: required(fd, "full_name", "Nom complet"),
      phone: str(fd, "phone"),
      email: str(fd, "email"),
      id_number: str(fd, "id_number"),
      profession: str(fd, "profession"),
      emergency_contact: str(fd, "emergency_contact"),
      notes: str(fd, "notes"),
    };
    if (id) {
      const { error } = await supabase.from("tenants").update(row).eq("id", id);
      if (error) throw error;
    } else {
      const { data, error } = await supabase
        .from("tenants")
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
  if (next === "bail") done(`/baux/nouveau?locataire=${savedId}`, "Locataire créé : complétez le bail.");
  done(`/locataires/${savedId}`, "Locataire enregistré.");
}

export async function deleteTenant(fd: FormData) {
  const { supabase } = await requireOrg();
  const id = str(fd, "id")!;
  const { error } = await supabase.from("tenants").delete().eq("id", id);
  if (error) fail(`/locataires/${id}`, error);
  revalidatePath("/", "layout");
  done("/locataires", "Locataire supprimé.");
}
