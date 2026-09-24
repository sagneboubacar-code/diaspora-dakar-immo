import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const ORG_COOKIE = "org";

export interface Org {
  id: string;
  kind: "agence" | "proprietaire";
  name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  city: string | null;
  ninea: string | null;
  default_commission_rate: number;
  receipt_prefix: string;
}

export interface Membership {
  role: "admin" | "agent";
  org: Org;
}

export interface OwnerProfile {
  id: string;
  org_id: string;
  full_name: string;
  org_name: string;
}

// Une seule lecture par requête, partagée entre layout et page.
export const getSession = cache(async () => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const [{ data: ms }, { data: os }] = await Promise.all([
    supabase
      .from("memberships")
      .select("role, organizations(*)")
      .eq("user_id", user.id),
    supabase
      .from("owners")
      .select("id, org_id, full_name, organizations(name)")
      .eq("user_id", user.id)
      .eq("portal_enabled", true),
  ]);

  const memberships: Membership[] = (ms ?? [])
    .map((m: any) => ({ role: m.role, org: m.organizations as Org }))
    .filter((m) => m.org)
    .sort((a, b) => a.org.name.localeCompare(b.org.name));

  const ownerProfiles: OwnerProfile[] = (os ?? []).map((o: any) => ({
    id: o.id,
    org_id: o.org_id,
    full_name: o.full_name,
    org_name: o.organizations?.name ?? "",
  }));

  return { supabase, user, memberships, ownerProfiles };
});

// Page d'arrivée selon le profil : gestionnaire, propriétaire, ou nouveau compte.
export function homeFor(s: { memberships: Membership[]; ownerProfiles: OwnerProfile[] }) {
  if (s.memberships.length) return "/tableau-de-bord";
  if (s.ownerProfiles.length) return "/portail";
  return "/demarrer";
}

// Pour les pages de gestion : exige d'être membre d'au moins un espace et
// renvoie l'espace courant (cookie, sinon le premier).
export const requireOrg = cache(async () => {
  const s = await getSession();
  if (!s) redirect("/connexion");
  if (!s.memberships.length) redirect(homeFor(s));

  const wanted = cookies().get(ORG_COOKIE)?.value;
  const current = s.memberships.find((m) => m.org.id === wanted) ?? s.memberships[0];
  return {
    ...s,
    org: current.org,
    role: current.role,
    isAdmin: current.role === "admin",
    isAgency: current.org.kind === "agence",
  };
});
