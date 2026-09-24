// Les dates circulent en chaînes ISO « AAAA-MM-JJ » et les mois en
// « AAAA-MM » : on évite les objets Date en local, source classique de
// décalages d'un jour selon le fuseau du serveur.

const money = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 });

export function fcfa(n: number | null | undefined) {
  return `${money.format(Number(n ?? 0))} FCFA`;
}

export function percent(n: number | null | undefined) {
  return `${Number(n ?? 0).toLocaleString("fr-FR", { maximumFractionDigits: 2 })} %`;
}

export function today() {
  return new Date().toISOString().slice(0, 10);
}

export function currentMonth() {
  return today().slice(0, 7);
}

export function isMonth(s: string | undefined | null): s is string {
  return !!s && /^\d{4}-(0[1-9]|1[0-2])$/.test(s);
}

export function monthStart(month: string) {
  return `${month}-01`;
}

export function addMonths(month: string, delta: number) {
  const [y, m] = month.split("-").map(Number);
  const d = new Date(Date.UTC(y, m - 1 + delta, 1));
  return d.toISOString().slice(0, 7);
}

// Premier jour du mois suivant : borne exclusive des filtres de période.
export function monthEnd(month: string) {
  return monthStart(addMonths(month, 1));
}

export function monthLabel(month: string) {
  const [y, m] = month.split("-").map(Number);
  const s = new Date(Date.UTC(y, m - 1, 1)).toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function dateFr(iso: string | null | undefined) {
  if (!iso) return "—";
  const [y, m, d] = iso.slice(0, 10).split("-");
  return `${d}/${m}/${y}`;
}

export function addDays(iso: string, days: number) {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

// Lien WhatsApp : les numéros sénégalais saisis sans indicatif (9 chiffres
// commençant par 7 ou 3) reçoivent le +221.
export function whatsappLink(phone: string | null | undefined, text: string) {
  if (!phone) return null;
  let digits = phone.replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.length === 9 && /^[73]/.test(digits)) digits = `221${digits}`;
  if (digits.length < 8) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}
