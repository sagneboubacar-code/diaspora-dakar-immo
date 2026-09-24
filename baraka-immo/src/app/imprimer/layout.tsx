import { redirect } from "next/navigation";
import { PrintButton } from "@/components/buttons";
import { getSession } from "@/lib/session";

// Documents imprimables (quittances, relevés) : accessibles à l'agence comme
// au propriétaire concerné — la RLS décide de ce que chacun peut lire.
export default async function PrintLayout({ children }: { children: React.ReactNode }) {
  const s = await getSession();
  if (!s) redirect("/connexion");
  return (
    <div className="min-h-screen bg-slate-100 py-6 print:bg-white print:py-0">
      <div className="no-print mx-auto mb-4 flex max-w-3xl justify-end gap-2 px-4">
        <PrintButton />
      </div>
      <article className="mx-auto max-w-3xl bg-white p-8 shadow-sm sm:p-12 print:max-w-none print:p-0 print:shadow-none">
        {children}
      </article>
    </div>
  );
}
