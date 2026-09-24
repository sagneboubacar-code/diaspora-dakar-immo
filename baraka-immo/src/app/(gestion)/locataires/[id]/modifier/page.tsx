import { notFound } from "next/navigation";
import { Flash, PageHeader } from "@/components/ui";
import { requireOrg } from "@/lib/session";
import { TenantForm } from "../../TenantForm";

export const metadata = { title: "Modifier le locataire" };

export default async function Page({ params, searchParams }: { params: { id: string }; searchParams: { erreur?: string } }) {
  const { supabase, org } = await requireOrg();
  const { data: tenant } = await supabase.from("tenants").select("*").eq("id", params.id).eq("org_id", org.id).maybeSingle();
  if (!tenant) notFound();
  return (
    <>
      <PageHeader title={`Modifier ${tenant.full_name}`} back={{ href: `/locataires/${tenant.id}`, label: tenant.full_name }} />
      <Flash searchParams={searchParams} />
      <TenantForm tenant={tenant} />
    </>
  );
}
