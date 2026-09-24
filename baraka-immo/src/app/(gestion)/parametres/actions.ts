"use server";

import { revalidatePath } from "next/cache";
import { requireOrg } from "@/lib/session";
import { decimal, done, fail, FormError, required, str } from "@/lib/form";

export async function saveSettings(fd: FormData) {
  const { supabase, org, isAdmin } = await requireOrg();
  try {
    if (!isAdmin) throw new FormError("Seul un administrateur peut modifier les paramètres.");
    const rate = decimal(fd, "default_commission_rate") ?? 0;
    if (rate < 0 || rate > 100) throw new FormError("Le taux doit être compris entre 0 et 100 %.");
    const prefix = (str(fd, "receipt_prefix") ?? "Q").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6) || "Q";
    const { error } = await supabase
      .from("organizations")
      .update({
        name: required(fd, "name", "Nom"),
        phone: str(fd, "phone"),
        email: str(fd, "email"),
        address: str(fd, "address"),
        city: str(fd, "city"),
        ninea: str(fd, "ninea"),
        default_commission_rate: rate,
        receipt_prefix: prefix,
      })
      .eq("id", org.id);
    if (error) throw error;
  } catch (e) {
    fail("/parametres", e as Error);
  }
  revalidatePath("/", "layout");
  done("/parametres", "Paramètres enregistrés.");
}

export async function inviteMember(fd: FormData) {
  const { supabase, org, isAdmin } = await requireOrg();
  try {
    if (!isAdmin) throw new FormError("Seul un administrateur peut inviter.");
    const role = str(fd, "role") === "admin" ? "admin" : "agent";
    const { error } = await supabase
      .from("invitations")
      .upsert({ org_id: org.id, email: required(fd, "email", "Email").toLowerCase(), role, accepted_at: null }, { onConflict: "org_id,email" });
    if (error) throw error;
  } catch (e) {
    fail("/parametres", e as Error);
  }
  revalidatePath("/parametres");
  done("/parametres", "Invitation enregistrée : la personne doit se connecter (ou créer son compte) avec cet email.");
}

export async function cancelInvitation(fd: FormData) {
  const { supabase } = await requireOrg();
  const { error } = await supabase.from("invitations").delete().eq("id", str(fd, "id")!);
  if (error) fail("/parametres", error);
  revalidatePath("/parametres");
  done("/parametres", "Invitation annulée.");
}

export async function removeMember(fd: FormData) {
  const { supabase, org } = await requireOrg();
  const { error } = await supabase.from("memberships").delete().eq("org_id", org.id).eq("user_id", str(fd, "user_id")!);
  if (error) fail("/parametres", error);
  revalidatePath("/parametres");
  done("/parametres", "Accès retiré.");
}
