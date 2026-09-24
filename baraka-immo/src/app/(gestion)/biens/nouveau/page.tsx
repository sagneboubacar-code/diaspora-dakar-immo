import Link from "next/link";
import { Empty, Flash, PageHeader } from "@/components/ui";
import { requireOrg } from "@/lib/session";
import { PropertyForm } from "../PropertyForm";

export const metadata = { title: "Nouveau bien" };

export default async function Page({ searchParams }: { searchParams: { erreur?: string; proprietaire?: string } }) {
  const { supabase, org, isAgency } = await requireOrg();
  const { data: owners } = await supabase.from("owners").select("id, full_name").eq("org_id", org.id).order("full_name");
  return (
    <>
      <PageHeader title="Nouveau bien" back={{ href: "/biens", label: "Biens" }} />
      <Flash searchParams={searchParams} />
      {isAgency && !owners?.length ? (
        <div className="card">
          <Empty title="Ajoutez d'abord un propriétaire">
            <Link href="/proprietaires/nouveau" className="link">
              Créer un propriétaire
            </Link>
          </Empty>
        </div>
      ) : (
        <PropertyForm owners={owners ?? []} isAgency={isAgency} defaultOwner={searchParams.proprietaire} />
      )}
    </>
  );
}
