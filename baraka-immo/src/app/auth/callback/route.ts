import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Lien de confirmation d'email ou de réinitialisation de mot de passe.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const next = searchParams.get("next");

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      await supabase.rpc("claim_access");
      const safeNext = next && next.startsWith("/") && !next.startsWith("//") ? next : "/";
      return NextResponse.redirect(`${origin}${safeNext}`);
    }
  }
  return NextResponse.redirect(
    `${origin}/connexion?erreur=${encodeURIComponent("Lien invalide ou expiré.")}`,
  );
}
