import { APP_NAME } from "@/lib/config";

// En-tête commun aux documents : coordonnées de l'agence ou du bailleur.
export function DocHeader({ org, title, subtitle }: { org: any; title: string; subtitle?: string }) {
  return (
    <header className="mb-8 flex flex-wrap items-start justify-between gap-6 border-b-2 border-ink pb-5">
      <div className="text-sm leading-relaxed">
        <p className="text-lg font-bold">{org?.name}</p>
        {org?.address && <p>{[org.address, org.city].filter(Boolean).join(", ")}</p>}
        {org?.phone && <p>Tél. {org.phone}</p>}
        {org?.email && <p>{org.email}</p>}
        {org?.ninea && <p>NINEA {org.ninea}</p>}
      </div>
      <div className="text-right">
        <h1 className="text-2xl font-bold uppercase tracking-wide">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-slate-600">{subtitle}</p>}
      </div>
    </header>
  );
}

export function DocFooter() {
  return <p className="mt-12 text-center text-xs text-slate-400">Document généré avec {APP_NAME}</p>;
}
