import type { Testimonial } from "@/lib/data/types";

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

// Un témoignage seul occupe toute la largeur : dans une grille il resterait
// orphelin à côté de deux colonnes vides. À partir de deux, grille classique.
export function Testimonials({ items }: { items: Testimonial[] }) {
  const featured = items.length === 1;

  return (
    <div className={featured ? "mx-auto max-w-3xl" : "grid grid-cols-1 gap-6 lg:grid-cols-2"}>
      {items.map((testimonial) => (
        <TestimonialCard key={testimonial.name} testimonial={testimonial} featured={featured} />
      ))}
    </div>
  );
}

function TestimonialCard({ testimonial: t, featured }: { testimonial: Testimonial; featured: boolean }) {
  const last = t.quote.length - 1;

  return (
    <figure className="relative overflow-hidden rounded-3xl border border-ink/10 bg-white p-7 shadow-card sm:p-10">
      {/* Guillemet décoratif : purement graphique, masqué aux lecteurs d'écran */}
      <span
        aria-hidden
        className="pointer-events-none absolute -top-10 right-4 font-display text-[8rem] leading-none text-primary/10"
      >
        &rdquo;
      </span>

      {t.headline && (
        <p
          className={`relative font-display font-semibold text-balance text-ink ${
            featured ? "text-xl sm:text-2xl" : "text-lg"
          }`}
        >
          {t.headline}
        </p>
      )}

      <blockquote className="relative mt-6 space-y-4 border-l-2 border-primary/30 pl-5 text-sm leading-relaxed text-graytext">
        {t.quote.map((paragraph, i) => (
          <p key={i}>
            {i === 0 && <span aria-hidden>&laquo;&nbsp;</span>}
            {paragraph}
            {i === last && <span aria-hidden>&nbsp;&raquo;</span>}
          </p>
        ))}
      </blockquote>

      <figcaption className="relative mt-7 flex items-center gap-4 border-t border-ink/10 pt-6">
        {t.photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={t.photo} alt={t.name} className="h-12 w-12 shrink-0 rounded-full object-cover" />
        ) : (
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-primary/10 font-display text-sm font-bold text-primary">
            {initials(t.name)}
          </span>
        )}
        <div className="min-w-0">
          <p className="font-display text-sm font-semibold text-ink">
            {t.name} {t.flag && <span aria-hidden>{t.flag}</span>}
          </p>
          <p className="text-xs text-graytext">{t.country}</p>
        </div>
      </figcaption>

      {(t.project || t.location) && (
        <dl className="relative mt-5 grid gap-4 rounded-2xl bg-sand p-5 text-xs sm:grid-cols-2">
          {t.project && (
            <div>
              <dt className="font-semibold uppercase tracking-wide text-primary">Projet</dt>
              <dd className="mt-1 leading-relaxed text-graytext">{t.project}</dd>
            </div>
          )}
          {t.location && (
            <div>
              <dt className="font-semibold uppercase tracking-wide text-primary">Lieu</dt>
              <dd className="mt-1 leading-relaxed text-graytext">📍 {t.location}</dd>
            </div>
          )}
        </dl>
      )}
    </figure>
  );
}
