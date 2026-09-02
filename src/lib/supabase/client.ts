import { createClient } from "@supabase/supabase-js";

// Client anon, insert-only côté "leads" (voir la migration RLS) — utilisé
// uniquement pour enregistrer les demandes envoyées depuis les formulaires
// publics. Pas d'auth ici : le back-office viendra dans une phase 2.
export function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}
