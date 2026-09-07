import type { Testimonial } from "@/lib/data/types";

// « M. Dieng » doit donner « D », pas « MD » : la civilité n'est pas un
// prénom. Les clients qui préfèrent rester discrets sont publiés sous cette
// forme, il faut donc que l'initiale reste juste.
const HONORIFICS = new Set(["m.", "mme", "mlle", "dr", "pr"]);

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .filter((part) => !HONORIFICS.has(part.toLowerCase()))
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

// Le nombre de colonnes suit le nombre de témoignages, pour qu'aucun ne
// reste orphelin sur sa ligne : un seul prend toute la largeur, deux se
// partagent la ligne, trois et plus passent en trois colonnes.
//
// Tant que la grille n'a pas assez de place, elle reste sur une colonne
// bornée à max-w-3xl : ces témoignages sont longs, et une colonne trop
// étroite (206 px à 1024 px en trois colonnes) comme une ligne pleine
// largeur sont aussi pénibles à lire l'une que l'autre.
const GRID = {
  2: "lg:max-w-none lg:grid-cols-2",
  3: "xl:max-w-none xl:grid-cols-3",
} as const;

export function Testimonials({ items }: { items: Testimonial[] }) {
  const featured = items.length === 1;
  const columns = items.length === 2 ? GRID[2] : GRID[3];

  return (
    <div
      className={
        featured
          ? "mx-auto max-w-3xl"
          : `mx-auto grid max-w-3xl grid-cols-1 items-stretch gap-6 ${columns}`
      }
    >
      {items.map((testimonial) => (
        <TestimonialCard key={testimonial.name} testimonial={testimonial} featured={featured} />
      ))}
    </div>
  );
}

function TestimonialCard({ testimonial: t, featured }: { testimonial: Testimonial; featured: boolean }) {
  const last = t.quote.length - 1;

  return (
    <figure className={`relative flex h-full flex-col overflow-hidden rounded-3xl border border-ink/10 bg-white shadow-card ${
        featured ? "p-7 sm:p-10" : "p-6 sm:p-8"
      }`}>
      {/* Guillemet décoratif : purement graphique, masqué aux lecteurs d'écran */}
      <span
        aria-hidden
        className="pointer-events-none absolute -top-10 right-4 font-display text-[8rem] leading-none text-primary/10"
      >
        &rdquo;
      </span>

      {t.badge && (
        <p className="relative inline-flex self-start rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold text-primary">
          {t.badge}
        </p>
      )}

      {t.headline && (
        <p
          className={`relative text-balance font-display font-semibold text-ink ${
            t.badge ? "mt-4" : ""
          } ${
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

      {/* mt-auto : quand deux cartes de longueurs différentes sont côte à côte,
          leurs lignes de signature restent alignées, comme au bas d'une lettre. */}
      <div className="relative mt-auto pt-7">
        {t.projects && t.projects.length > 0 && (
          <div className="rounded-2xl bg-sand p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">
              {t.projects.length > 1
                ? `${t.projects.length} projets confiés`
                : t.projectsLabel ?? "Projet"}
            </p>
            <ol className="mt-3 space-y-3 text-xs leading-relaxed text-graytext">
              {t.projects.map((project, i) => (
                <li key={project.title} className="flex gap-2.5">
                  {t.projects!.length > 1 && (
                    <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-white font-display text-[10px] font-bold text-primary">
                      {i + 1}
                    </span>
                  )}
                  <span>
                    <span className="font-medium text-ink">{project.title}</span>
                    {project.location && <span className="block">📍 {project.location}</span>}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        )}

        <figcaption className="mt-6 flex items-center gap-4 border-t border-ink/10 pt-6">
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
      </div>
    </figure>
  );
}
