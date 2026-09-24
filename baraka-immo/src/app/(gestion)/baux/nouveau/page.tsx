import { Flash, PageHeader } from "@/components/ui";
import { requireOrg } from "@/lib/session";
import { LeaseForm } from "../LeaseForm";

export const metadata = { title: "Nouveau bail" };

export default async function Page({ searchParams }: { searchParams: { erreur?: string; ok?: string; bien?: string; locataire?: string } }) {
  const { supabase, org, isAgency } = await requireOrg();
  const [{ data: properties }, { data: tenants }] = await Promise.all([
    supabase
      .from("properties")
      .select("id, name, rent_amount, charges_amount, owners(full_name), leases(status)")
      .eq("org_id", org.id)
      .eq("archived", false)
      .order("name"),
    supabase.from("tenants").select("id, full_name").eq("org_id", org.id).order("full_name"),
  ]);
  const vacant = (properties ?? []).filter((p) => !(p.leases as any[])?.some((l) => l.status === "actif"));
  const chosen = vacant.find((p) => p.id === searchParams.bien);

  return (
    <>
      <PageHeader title="Nouveau bail" back={{ href: "/baux", label: "Baux" }} />
      <Flash searchParams={searchParams} />
      <LeaseForm
        isAgency={isAgency}
        properties={vacant.map((p) => ({
          id: p.id,
          label: isAgency ? `${p.name} — ${(p.owners as any)?.full_name ?? ""}` : p.name,
        }))}
        tenants={(tenants ?? []).map((t) => ({ id: t.id, label: t.full_name }))}
        defaults={{
          property_id: chosen?.id,
          tenant_id: searchParams.locataire,
          rent: chosen?.rent_amount,
          charges: chosen?.charges_amount,
        }}
      />
    </>
  );
}
