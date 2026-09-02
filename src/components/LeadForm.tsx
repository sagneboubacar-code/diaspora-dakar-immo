import { submitLead } from "@/lib/actions/leads";
import { Button } from "@/components/Button";

const inputClasses =
  "w-full rounded-lg border border-ink/15 bg-white px-4 py-2.5 text-sm text-ink placeholder:text-graytext/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";
const labelClasses = "space-y-1.5 text-sm font-medium text-ink";

export function LeadForm({
  variant,
  propertySlug,
  propertyTitle,
  submitLabel = "PARLER À UN CONSEILLER",
}: {
  variant: "contact" | "diaspora" | "bien";
  propertySlug?: string;
  propertyTitle?: string;
  submitLabel?: string;
}) {
  return (
    <form action={submitLead} className="space-y-4">
      <input type="hidden" name="source" value={variant} />
      {propertySlug && <input type="hidden" name="property_slug" value={propertySlug} />}
      {propertyTitle && <input type="hidden" name="property_title" value={propertyTitle} />}

      <label className={labelClasses}>
        Nom complet
        <input name="full_name" required className={inputClasses} placeholder="Votre nom" />
      </label>

      {variant === "diaspora" && (
        <label className={labelClasses}>
          Pays de résidence
          <input name="country" required className={inputClasses} placeholder="Ex. France, Canada..." />
        </label>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className={labelClasses}>
          WhatsApp
          <input name="phone" required className={inputClasses} placeholder="+221 77 000 00 00" />
        </label>
        <label className={labelClasses}>
          Email
          <input name="email" type="email" className={inputClasses} placeholder="vous@exemple.com" />
        </label>
      </div>

      {variant === "diaspora" && (
        <>
          <label className={labelClasses}>
            Type de projet
            <select name="project_type" required className={inputClasses} defaultValue="">
              <option value="" disabled>
                Choisir…
              </option>
              <option value="Achat de terrain">Achat de terrain</option>
              <option value="Construction">Construction</option>
              <option value="Achat de maison/villa/appartement">Achat de maison / villa / appartement</option>
              <option value="Gestion d'un bien existant">Gestion d&apos;un bien existant</option>
              <option value="Autre">Autre</option>
            </select>
          </label>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className={labelClasses}>
              Localisation souhaitée
              <input name="location" className={inputClasses} placeholder="Ex. Dakar, Diamniadio..." />
            </label>
            <label className={labelClasses}>
              Budget
              <input name="budget" className={inputClasses} placeholder="Ex. 15 000 000 FCFA" />
            </label>
          </div>
        </>
      )}

      <label className={labelClasses}>
        Message
        <textarea
          name="message"
          rows={4}
          className={inputClasses}
          placeholder={
            variant === "bien"
              ? "Je souhaite avoir plus d'informations sur ce bien..."
              : "Parlez-nous de votre projet..."
          }
        />
      </label>

      <Button className="w-full sm:w-auto">{submitLabel}</Button>
    </form>
  );
}
