import { redirect } from "next/navigation";

export function str(fd: FormData, key: string): string | null {
  const v = fd.get(key);
  if (typeof v !== "string") return null;
  const t = v.trim();
  return t === "" ? null : t;
}

export function required(fd: FormData, key: string, label: string): string {
  const v = str(fd, key);
  if (!v) throw new FormError(`Le champ « ${label} » est obligatoire.`);
  return v;
}

// Montants saisis « 250 000 » ou « 250.000 » : on ne garde que les chiffres.
export function amount(fd: FormData, key: string): number | null {
  const v = str(fd, key);
  if (v === null) return null;
  const digits = v.replace(/[^\d]/g, "");
  return digits === "" ? null : Number(digits);
}

export function decimal(fd: FormData, key: string): number | null {
  const v = str(fd, key);
  if (v === null) return null;
  const n = Number(v.replace(",", ".").replace(/[^\d.]/g, ""));
  return Number.isFinite(n) ? n : null;
}

export function bool(fd: FormData, key: string) {
  return fd.get(key) === "on";
}

export class FormError extends Error {}

// Traduit les erreurs Postgres les plus courantes en messages lisibles.
export function humanError(error: { message: string; code?: string } | Error): string {
  const msg = error.message ?? "";
  if (error instanceof FormError) return msg;
  if (msg.includes("uq_leases_active_property"))
    return "Ce bien a déjà un bail actif. Terminez-le avant d'en créer un nouveau.";
  if ("code" in error && error.code === "23503")
    return "Impossible : cet élément est encore utilisé ailleurs (bail, paiement, dépense…).";
  if (msg.includes("row-level security")) return "Action non autorisée pour votre compte.";
  if (msg.includes("check constraint")) return "Une valeur saisie est invalide.";
  return msg || "Une erreur est survenue.";
}

// Renvoie vers la page avec un message d'erreur affiché par <Flash />.
export function fail(path: string, error: { message: string; code?: string } | Error): never {
  const sep = path.includes("?") ? "&" : "?";
  redirect(`${path}${sep}erreur=${encodeURIComponent(humanError(error))}`);
}

export function done(path: string, message: string): never {
  const sep = path.includes("?") ? "&" : "?";
  redirect(`${path}${sep}ok=${encodeURIComponent(message)}`);
}
