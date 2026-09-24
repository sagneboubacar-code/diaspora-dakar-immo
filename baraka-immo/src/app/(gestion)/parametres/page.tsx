import { Badge, Card, Flash, Input, PageHeader, Select, TableWrap } from "@/components/ui";
import { ConfirmButton, SubmitButton } from "@/components/buttons";
import { dateFr } from "@/lib/format";
import { ORG_KINDS, ROLES } from "@/lib/labels";
import { requireOrg } from "@/lib/session";
import { cancelInvitation, inviteMember, removeMember, saveSettings } from "./actions";

export const metadata = { title: "Paramètres" };

export default async function Page({ searchParams }: { searchParams: { erreur?: string; ok?: string } }) {
  const { supabase, org, isAdmin, isAgency, user } = await requireOrg();
  const [{ data: members }, { data: invitations }] = await Promise.all([
    supabase.rpc("org_members", { p_org: org.id }),
    isAdmin
      ? supabase.from("invitations").select("*").eq("org_id", org.id).is("accepted_at", null).order("created_at")
      : Promise.resolve({ data: [] as { id: string; email: string; role: string; created_at: string }[] }),
  ]);

  return (
    <>
      <PageHeader title="Paramètres" subtitle={ORG_KINDS[org.kind]} />
      <Flash searchParams={searchParams} />
      <div className="grid gap-6 lg:grid-cols-5">
        <Card title="Informations (quittances et relevés)" className="lg:col-span-3">
          <form action={saveSettings} className="space-y-4">
            <fieldset disabled={!isAdmin} className="grid gap-4 sm:grid-cols-2">
              <Input label="Nom" name="name" required defaultValue={org.name} className="sm:col-span-2" />
              <Input label="Téléphone" name="phone" defaultValue={org.phone} />
              <Input label="Email" name="email" type="email" defaultValue={org.email} />
              <Input label="Adresse" name="address" defaultValue={org.address} />
              <Input label="Ville" name="city" defaultValue={org.city} />
              <Input label="NINEA" name="ninea" defaultValue={org.ninea} />
              <Input label="Préfixe des quittances" name="receipt_prefix" defaultValue={org.receipt_prefix} hint="Ex. Q → Q-2026-00001" />
              {isAgency && (
                <Input
                  label="Commission de gestion par défaut (%)"
                  name="default_commission_rate"
                  inputMode="decimal"
                  defaultValue={org.default_commission_rate}
                  hint="S'applique aux propriétaires sans taux particulier. Les paiements déjà enregistrés ne changent pas."
                />
              )}
            </fieldset>
            {isAdmin && (
              <div className="flex justify-end">
                <SubmitButton>Enregistrer</SubmitButton>
              </div>
            )}
          </form>
        </Card>

        <div className="space-y-6 lg:col-span-2">
          <Card title="Équipe" padded={false}>
            <TableWrap>
              <table className="table">
                <tbody>
                  {(members ?? []).map((m: { user_id: string; email: string; role: string }) => (
                    <tr key={m.user_id}>
                      <td className="break-all">{m.email}</td>
                      <td>
                        <Badge tone={m.role === "admin" ? "blue" : "gray"}>{ROLES[m.role]}</Badge>
                      </td>
                      <td className="text-right">
                        {isAdmin && m.user_id !== user.id && (
                          <form action={removeMember}>
                            <input type="hidden" name="user_id" value={m.user_id} />
                            <ConfirmButton message={`Retirer l'accès de ${m.email} ?`} className="text-xs text-red-600 hover:underline">
                              Retirer
                            </ConfirmButton>
                          </form>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableWrap>
          </Card>

          {isAdmin && (
            <Card title="Inviter un collaborateur">
              <form action={inviteMember} className="space-y-3">
                <Input label="Email" name="email" type="email" required />
                <Select label="Rôle" name="role" options={ROLES} defaultValue="agent" hint="Un agent gère tout sauf les paramètres, l'équipe et les annulations." />
                <SubmitButton className="btn btn-primary w-full">Inviter</SubmitButton>
              </form>
              {invitations && invitations.length > 0 && (
                <ul className="mt-5 space-y-2 border-t border-slate-100 pt-4 text-sm">
                  {invitations.map((i) => (
                    <li key={i.id} className="flex items-center justify-between gap-2">
                      <span className="break-all">
                        {i.email}
                        <span className="block text-xs text-slate-500">
                          {ROLES[i.role]} · en attente depuis le {dateFr(i.created_at)}
                        </span>
                      </span>
                      <form action={cancelInvitation}>
                        <input type="hidden" name="id" value={i.id} />
                        <SubmitButton className="text-xs text-red-600 hover:underline" pendingText="…">
                          Annuler
                        </SubmitButton>
                      </form>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
