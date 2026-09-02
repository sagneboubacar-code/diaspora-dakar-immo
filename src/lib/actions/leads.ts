"use server";

import { redirect } from "next/navigation";
import { getSupabase } from "@/lib/supabase/client";
import { whatsappHref } from "@/lib/site-config";

const SOURCE_LABELS: Record<string, string> = {
  contact: "message depuis la page Contact",
  diaspora: "projet immobilier au Sénégal (diaspora)",
  bien: "intérêt pour un bien",
};

function field(formData: FormData, name: string) {
  const value = String(formData.get(name) ?? "").trim();
  return value || null;
}

// Enregistre la demande (best-effort — un Supabase pas encore configuré ne
// doit jamais empêcher le prospect de nous joindre) puis redirige vers une
// page de confirmation avec un lien WhatsApp pré-rempli du récapitulatif.
export async function submitLead(formData: FormData) {
  const source = String(formData.get("source") ?? "contact");
  const fullName = field(formData, "full_name") ?? "Prospect site web";
  const country = field(formData, "country");
  const phone = field(formData, "phone");
  const email = field(formData, "email");
  const projectType = field(formData, "project_type");
  const location = field(formData, "location");
  const budget = field(formData, "budget");
  const message = field(formData, "message");
  const propertySlug = field(formData, "property_slug");
  const propertyTitle = field(formData, "property_title");

  const supabase = getSupabase();
  if (supabase) {
    await supabase.from("leads").insert({
      source,
      full_name: fullName,
      country,
      phone,
      email,
      project_type: projectType,
      location,
      budget,
      message,
      property_slug: propertySlug,
    });
  }

  const lines = [
    `Bonjour Diaspora Dakar Immo, je viens de remplir le formulaire (${SOURCE_LABELS[source] ?? source}).`,
    `Nom : ${fullName}`,
  ];
  if (country) lines.push(`Pays de résidence : ${country}`);
  if (phone) lines.push(`Téléphone/WhatsApp : ${phone}`);
  if (email) lines.push(`Email : ${email}`);
  if (propertyTitle) lines.push(`Bien concerné : ${propertyTitle}`);
  if (projectType) lines.push(`Type de projet : ${projectType}`);
  if (location) lines.push(`Localisation souhaitée : ${location}`);
  if (budget) lines.push(`Budget : ${budget}`);
  if (message) lines.push(`Message : ${message}`);
  lines.push("Merci de me recontacter.");

  redirect(`/merci?wa=${encodeURIComponent(whatsappHref(lines.join("\n")))}`);
}
