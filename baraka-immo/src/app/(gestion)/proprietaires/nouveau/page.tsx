import { Flash, PageHeader } from "@/components/ui";
import { requireOrg } from "@/lib/session";
import { OwnerForm } from "../OwnerForm";

export const metadata = { title: "Nouveau propriétaire" };

export default async function Page({ searchParams }: { searchParams: { erreur?: string } }) {
  const { org } = await requireOrg();
  return (
    <>
      <PageHeader title="Nouveau propriétaire" back={{ href: "/proprietaires", label: "Propriétaires" }} />
      <Flash searchParams={searchParams} />
      <OwnerForm defaultRate={org.default_commission_rate} />
    </>
  );
}
