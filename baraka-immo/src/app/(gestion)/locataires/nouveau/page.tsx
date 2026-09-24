import { Flash, PageHeader } from "@/components/ui";
import { TenantForm } from "../TenantForm";

export const metadata = { title: "Nouveau locataire" };

export default function Page({ searchParams }: { searchParams: { erreur?: string; next?: string } }) {
  return (
    <>
      <PageHeader title="Nouveau locataire" back={{ href: "/locataires", label: "Locataires" }} />
      <Flash searchParams={searchParams} />
      <TenantForm next={searchParams.next} />
    </>
  );
}
