"use client";

import { useMemo, useState } from "react";
import { PropertyCard } from "@/components/PropertyCard";
import { EmptyState } from "@/components/EmptyState";
import type { Property } from "@/lib/data/types";

const TYPE_OPTIONS: { value: Property["type"] | "tous"; label: string }[] = [
  { value: "tous", label: "Tous les types" },
  { value: "terrain", label: "Terrains" },
  { value: "maison", label: "Maisons" },
  { value: "villa", label: "Villas" },
  { value: "appartement", label: "Appartements" },
  { value: "projet", label: "Projets immobiliers" },
];

const selectClasses =
  "w-full rounded-lg border border-ink/15 bg-white px-3 py-2 text-sm text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";

export function PropertyBrowser({ properties }: { properties: Property[] }) {
  const [purpose, setPurpose] = useState<"tous" | Property["purpose"]>("tous");
  const [type, setType] = useState<Property["type"] | "tous">("tous");
  const [location, setLocation] = useState("");
  const [maxBudget, setMaxBudget] = useState("");
  const [minBedrooms, setMinBedrooms] = useState("");

  const filtered = useMemo(() => {
    return properties.filter((p) => {
      if (purpose !== "tous" && p.purpose !== purpose) return false;
      if (type !== "tous" && p.type !== type) return false;
      if (location && !p.location.toLowerCase().includes(location.toLowerCase())) return false;
      if (maxBudget && p.price !== null && p.price > Number(maxBudget)) return false;
      if (minBedrooms && (p.bedrooms ?? 0) < Number(minBedrooms)) return false;
      return true;
    });
  }, [properties, purpose, type, location, maxBudget, minBedrooms]);

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 rounded-2xl border border-ink/10 bg-white p-5 shadow-card sm:grid-cols-3 lg:grid-cols-5">
        <select
          value={purpose}
          onChange={(e) => setPurpose(e.target.value as typeof purpose)}
          className={selectClasses}
        >
          <option value="tous">Acheter ou louer</option>
          <option value="vente">Acheter</option>
          <option value="location">Louer</option>
        </select>
        <select value={type} onChange={(e) => setType(e.target.value as typeof type)} className={selectClasses}>
          {TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Localisation"
          className={selectClasses}
        />
        <input
          value={maxBudget}
          onChange={(e) => setMaxBudget(e.target.value)}
          type="number"
          placeholder="Budget max (FCFA)"
          className={selectClasses}
        />
        <select
          value={minBedrooms}
          onChange={(e) => setMinBedrooms(e.target.value)}
          className={selectClasses}
        >
          <option value="">Chambres</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
          <option value="4">4+</option>
        </select>
      </div>

      <div className="mt-10">
        {properties.length === 0 ? (
          <EmptyState
            title="Nos opportunités sont actuellement en cours de mise à jour."
            description="Contactez-nous pour connaître les biens actuellement disponibles."
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            title="Aucun bien ne correspond à ces critères."
            description="Élargissez votre recherche ou contactez-nous directement, de nouvelles opportunités arrivent régulièrement."
          />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((property) => (
              <PropertyCard key={property.slug} property={property} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
