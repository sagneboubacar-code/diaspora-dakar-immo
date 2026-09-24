import { notFound } from "next/navigation";
import { Flash, PageHeader } from "@/components/ui";
import { requireOrg } from "@/lib/session";
import { LeaseForm } from "../../LeaseForm";

export const metadata = { title: "Modifier le bail" };

export default async function Page({ params, searchParams }: { params: { id: string }; searchParams: { erreur?: string } }) {
  const { supabase, org, isAgency } = await requireOrg();
  const { data: lease } = await supabase
    .from("leases")
    .select("*, properties(name), tenants(full_name)")
    .eq("id", params.id)
    .eq("org_id", org.id)
    .maybeSingle();
  if (!lease) notFound();
  return (
    <>
      <PageHeader title="Modifier le bail" back={{ href: `/baux/${lease.id}`, label: "Bail" }} />
      <Flash searchParams={searchParams} />
      <p className="mb-4 text-sm text-slate-500">
        Un nouveau montant de loyer s&apos;applique aux prochaines échéances générées ; les échéances existantes ne
        changent pas.
      </p>
      <LeaseForm lease={lease} properties={[]} tenants={[]} defaults={{}} isAgency={isAgency} />
    </>
  );
}
