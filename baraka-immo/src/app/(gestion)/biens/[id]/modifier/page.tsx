import { notFound } from "next/navigation";
import { Flash, PageHeader } from "@/components/ui";
import { requireOrg } from "@/lib/session";
import { PropertyForm } from "../../PropertyForm";

export const metadata = { title: "Modifier le bien" };

export default async function Page({ params, searchParams }: { params: { id: string }; searchParams: { erreur?: string } }) {
  const { supabase, org, isAgency } = await requireOrg();
  const [{ data: property }, { data: owners }] = await Promise.all([
    supabase.from("properties").select("*").eq("id", params.id).eq("org_id", org.id).maybeSingle(),
    supabase.from("owners").select("id, full_name").eq("org_id", org.id).order("full_name"),
  ]);
  if (!property) notFound();
  return (
    <>
      <PageHeader title={`Modifier ${property.name}`} back={{ href: `/biens/${property.id}`, label: property.name }} />
      <Flash searchParams={searchParams} />
      <PropertyForm property={property} owners={owners ?? []} isAgency={isAgency} />
    </>
  );
}
