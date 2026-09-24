// Montant en toutes lettres pour les quittances (orthographe traditionnelle,
// sans traits d'union systématiques) : 1 250 000 → « un million deux cent
// cinquante mille ».

const UNITS = [
  "zéro", "un", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf",
  "dix", "onze", "douze", "treize", "quatorze", "quinze", "seize",
  "dix-sept", "dix-huit", "dix-neuf",
];
const TENS = ["", "", "vingt", "trente", "quarante", "cinquante", "soixante"];

function below100(n: number): string {
  if (n < 20) return UNITS[n];
  if (n < 70) {
    const t = Math.floor(n / 10);
    const u = n % 10;
    if (u === 0) return TENS[t];
    if (u === 1) return `${TENS[t]} et un`;
    return `${TENS[t]}-${UNITS[u]}`;
  }
  if (n < 80) return n === 71 ? "soixante et onze" : `soixante-${UNITS[n - 60]}`;
  if (n === 80) return "quatre-vingts";
  return `quatre-vingt-${UNITS[n - 80]}`;
}

function below1000(n: number): string {
  const h = Math.floor(n / 100);
  const r = n % 100;
  if (h === 0) return below100(r);
  const head = h === 1 ? "cent" : `${UNITS[h]} cent${r === 0 ? "s" : ""}`;
  return r === 0 ? head : `${head} ${below100(r)}`;
}

export function numberToFrench(value: number): string {
  let n = Math.round(Math.abs(value));
  if (n === 0) return "zéro";
  const parts: string[] = [];
  const scales: [number, string][] = [
    [1_000_000_000, "milliard"],
    [1_000_000, "million"],
  ];
  for (const [size, word] of scales) {
    const q = Math.floor(n / size);
    if (q) {
      parts.push(`${below1000(q)} ${word}${q > 1 ? "s" : ""}`);
      n %= size;
    }
  }
  const thousands = Math.floor(n / 1000);
  if (thousands) {
    // « quatre-vingts » et « cents » perdent leur s devant « mille ».
    const w = thousands === 1 ? "" : `${below1000(thousands).replace(/(cent|vingt)s$/, "$1")} `;
    parts.push(`${w}mille`);
    n %= 1000;
  }
  if (n) parts.push(below1000(n));
  return parts.join(" ");
}
