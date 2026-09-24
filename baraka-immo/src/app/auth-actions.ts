"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSession, homeFor } from "@/lib/session";
import { str } from "@/lib/form";

function origin() {
  const h = headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "http";
  return `${proto}://${host}`;
}

function back(path: string, message: string): never {
  redirect(`${path}?erreur=${encodeURIComponent(message)}`);
}

// Après toute connexion : rattache invitations et fiches propriétaire,
// puis envoie l'utilisateur au bon endroit.
async function enter(): Promise<never> {
  const supabase = createClient();
  await supabase.rpc("claim_access");
  const s = await getSession();
  redirect(s ? homeFor(s) : "/connexion");
}

export async function signIn(fd: FormData) {
  const email = str(fd, "email");
  const password = str(fd, "password");
  if (!email || !password) back("/connexion", "Email et mot de passe requis.");
  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    back(
      "/connexion",
      error.message.includes("Email not confirmed")
        ? "Confirmez d'abord votre email (lien reçu par email)."
        : "Email ou mot de passe incorrect.",
    );
  }
  await enter();
}

export async function signUp(fd: FormData) {
  const email = str(fd, "email");
  const password = str(fd, "password");
  if (!email || !password) back("/inscription", "Email et mot de passe requis.");
  if (password.length < 8) back("/inscription", "Le mot de passe doit faire au moins 8 caractères.");
  const supabase = createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: `${origin()}/auth/callback` },
  });
  if (error) back("/inscription", error.message);
  // Si la confirmation d'email est désactivée dans Supabase, la session
  // existe déjà ; sinon l'utilisateur doit cliquer sur le lien reçu.
  if (data.session) await enter();
  redirect(`/connexion?ok=${encodeURIComponent("Compte créé : cliquez sur le lien reçu par email pour l'activer.")}`);
}

export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect("/connexion");
}

export async function requestReset(fd: FormData) {
  const email = str(fd, "email");
  if (!email) back("/mot-de-passe-oublie", "Indiquez votre email.");
  const supabase = createClient();
  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin()}/auth/callback?next=/nouveau-mot-de-passe`,
  });
  redirect(`/connexion?ok=${encodeURIComponent("Si un compte existe, un lien de réinitialisation vient d'être envoyé.")}`);
}

export async function updatePassword(fd: FormData) {
  const password = str(fd, "password");
  if (!password || password.length < 8)
    back("/nouveau-mot-de-passe", "Le mot de passe doit faire au moins 8 caractères.");
  const supabase = createClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) back("/nouveau-mot-de-passe", error.message);
  await enter();
}

export async function createOrganization(fd: FormData) {
  const kind = str(fd, "kind");
  const name = str(fd, "name");
  if (!name || (kind !== "agence" && kind !== "proprietaire"))
    back("/demarrer", "Choisissez un type d'espace et indiquez un nom.");
  const supabase = createClient();
  const { error } = await supabase.rpc("create_organization", {
    p_kind: kind,
    p_name: name,
    p_phone: str(fd, "phone"),
  });
  if (error) back("/demarrer", error.message);
  redirect("/tableau-de-bord");
}
