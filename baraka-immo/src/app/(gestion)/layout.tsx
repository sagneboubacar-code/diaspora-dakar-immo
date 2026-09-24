import Link from "next/link";
import { Sidebar, type NavItem } from "@/components/Sidebar";
import { APP_NAME } from "@/lib/config";
import { ORG_KINDS } from "@/lib/labels";
import { requireOrg } from "@/lib/session";
import { signOut } from "../auth-actions";
import { switchOrg } from "./org-actions";

export default async function GestionLayout({ children }: { children: React.ReactNode }) {
  const { org, memberships, ownerProfiles, user, isAgency } = await requireOrg();

  const items: NavItem[] = [
    { href: "/tableau-de-bord", label: "Tableau de bord" },
    { href: "/loyers", label: "Loyers & quittances" },
    { href: "/biens", label: "Biens" },
    ...(isAgency ? [{ href: "/proprietaires", label: "Propriétaires" }] : []),
    { href: "/locataires", label: "Locataires" },
    { href: "/baux", label: "Baux" },
    { href: "/depenses", label: "Dépenses" },
    ...(isAgency
      ? [
          { href: "/commissions", label: "Commissions" },
          { href: "/reversements", label: "Reversements" },
        ]
      : []),
    { href: "/parametres", label: "Paramètres" },
  ];

  const orgSwitcher =
    memberships.length > 1 ? (
      <form action={switchOrg} className="flex gap-1.5">
        <select name="org" defaultValue={org.id} className="input py-1.5 text-xs" aria-label="Espace">
          {memberships.map((m) => (
            <option key={m.org.id} value={m.org.id}>
              {m.org.name}
            </option>
          ))}
        </select>
        <button className="btn btn-sm" type="submit">
          OK
        </button>
      </form>
    ) : (
      <div className="rounded-lg bg-slate-50 px-3 py-2">
        <p className="truncate text-sm font-semibold">{org.name}</p>
        <p className="text-xs text-slate-500">{ORG_KINDS[org.kind]}</p>
      </div>
    );

  const footer = (
    <div className="space-y-2">
      <p className="truncate text-xs text-slate-500">{user.email}</p>
      {ownerProfiles.length > 0 && (
        <Link href="/portail" className="block text-xs link">
          Mon espace propriétaire
        </Link>
      )}
      <form action={signOut}>
        <button type="submit" className="text-xs font-medium text-slate-600 hover:text-slate-900">
          Se déconnecter
        </button>
      </form>
    </div>
  );

  return (
    <div className="min-h-screen">
      <Sidebar appName={APP_NAME} items={items} orgSwitcher={orgSwitcher} footer={footer} />
      <main className="lg:pl-64">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:py-8">{children}</div>
      </main>
    </div>
  );
}
