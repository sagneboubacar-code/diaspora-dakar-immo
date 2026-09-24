import { notFound } from "next/navigation";
import { Flash, PageHeader } from "@/components/ui";
import { requireOrg } from "@/lib/session";
import { OwnerForm } from "../../OwnerForm";

export const metadata = { title: "Modifier le propriétaire" };

export default async function Page({ params, searchParams }: { params: { id: string }; searchParams: { erreur?: string } }) {
  const { supabase, org } = await requireOrg();
  const { data: owner } = await supabase.from("owners").select("*").eq("id", params.id).eq("org_id", org.id).maybeSingle();
  if (!owner) notFound();
  return (
    <>
      <PageHeader title={`Modifier ${owner.full_name}`} back={{ href: `/proprietaires/${owner.id}`, label: owner.full_name }} />
      <Flash searchParams={searchParams} />
      <OwnerForm owner={owner} defaultRate={org.default_commission_rate} />
    </>
  );
}
