"use server";

import { revalidatePath } from "next/cache";
import { requireOrg } from "@/lib/session";
import { amount, bool, decimal, done, fail, FormError, required, str } from "@/lib/form";

export async function saveProperty(fd: FormData) {
  const { supabase, org } = await requireOrg();
  const id = str(fd, "id");
  const back = id ? `/biens/${id}/modifier` : "/biens/nouveau";
  let savedId = id;

  try {
    let ownerId = str(fd, "owner_id");
    if (!ownerId && org.kind === "proprietaire") {
      // Propriétaire indépendant : sa fiche unique, créée avec l'espace.
      const { data } = await supabase.from("owners").select("id").eq("org_id", org.id).order("created_at").limit(1).single();
      ownerId = data?.id ?? null;
    }
    if (!ownerId) throw new FormError("Choisissez le propriétaire du bien.");

    const row = {
      owner_id: ownerId,
      reference: str(fd, "reference"),
      name: required(fd, "name", "Désignation"),
      type: str(fd, "type") ?? "appartement",
      address: str(fd, "address"),
      city: str(fd, "city"),
      surface_m2: decimal(fd, "surface_m2"),
      rooms: decimal(fd, "rooms"),
      rent_amount: amount(fd, "rent_amount") ?? 0,
      charges_amount: amount(fd, "charges_amount") ?? 0,
      commission_rate: decimal(fd, "commission_rate"),
      archived: bool(fd, "archived"),
      notes: str(fd, "notes"),
    };
    if (id) {
      const { error } = await supabase.from("properties").update(row).eq("id", id);
      if (error) throw error;
    } else {
      const { data, error } = await supabase
        .from("properties")
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
  done(`/biens/${savedId}`, "Bien enregistré.");
}

export async function deleteProperty(fd: FormData) {
  const { supabase } = await requireOrg();
  const id = str(fd, "id")!;
  const { error } = await supabase.from("properties").delete().eq("id", id);
  if (error) fail(`/biens/${id}`, error);
  revalidatePath("/", "layout");
  done("/biens", "Bien supprimé.");
}
