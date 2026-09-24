import Link from "next/link";
import type { ReactNode } from "react";
import type { Tone } from "@/lib/labels";

export function PageHeader({
  title,
  subtitle,
  actions,
  back,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  back?: { href: string; label: string };
}) {
  return (
    <div className="mb-6">
      {back && (
        <Link href={back.href} className="mb-2 inline-block text-sm text-slate-500 hover:text-slate-800">
          ← {back.label}
        </Link>
      )}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
        </div>
        {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
      </div>
    </div>
  );
}

export function Card({
  title,
  actions,
  children,
  className = "",
  padded = true,
}: {
  title?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return (
    <section className={`card ${className}`}>
      {(title || actions) && (
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-3.5">
          <h2 className="font-semibold">{title}</h2>
          {actions}
        </div>
      )}
      <div className={padded ? "p-5" : ""}>{children}</div>
    </section>
  );
}

const toneClasses: Record<Tone, string> = {
  green: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  amber: "bg-amber-50 text-amber-800 ring-amber-600/20",
  red: "bg-red-50 text-red-700 ring-red-600/20",
  gray: "bg-slate-100 text-slate-600 ring-slate-500/20",
  blue: "bg-sky-50 text-sky-700 ring-sky-600/20",
};

export function Badge({ tone = "gray", children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span className={`inline-flex items-center whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${toneClasses[tone]}`}>
      {children}
    </span>
  );
}

export function Stat({
  label,
  value,
  hint,
  tone,
}: {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  tone?: "red" | "green";
}) {
  const color = tone === "red" ? "text-red-700" : tone === "green" ? "text-emerald-700" : "text-ink";
  return (
    <div className="card p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className={`mt-1.5 text-base font-bold tabular-nums sm:text-xl ${color}`}>{value}</p>
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

export function Flash({ searchParams }: { searchParams?: { erreur?: string; ok?: string } }) {
  if (searchParams?.erreur)
    return (
      <div role="alert" className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
        {searchParams.erreur}
      </div>
    );
  if (searchParams?.ok)
    return (
      <div role="status" className="mb-5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
        {searchParams.ok}
      </div>
    );
  return null;
}

export function Empty({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="px-6 py-10 text-center">
      <p className="font-medium text-slate-700">{title}</p>
      {children && <div className="mt-2 text-sm text-slate-500">{children}</div>}
    </div>
  );
}

export function TableWrap({ children }: { children: ReactNode }) {
  return <div className="overflow-x-auto">{children}</div>;
}

type FieldProps = {
  label: string;
  name: string;
  defaultValue?: string | number | null;
  required?: boolean;
  hint?: ReactNode;
  className?: string;
};

export function Input({
  label,
  name,
  defaultValue,
  required,
  hint,
  className = "",
  type = "text",
  placeholder,
  inputMode,
  step,
}: FieldProps & {
  type?: string;
  placeholder?: string;
  inputMode?: "numeric" | "decimal" | "email" | "tel" | "text";
  step?: string;
}) {
  return (
    <div className={className}>
      <label className="label" htmlFor={name}>
        {label}
        {required && <span className="text-red-600"> *</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue ?? ""}
        required={required}
        placeholder={placeholder}
        inputMode={inputMode}
        step={step}
        className="input"
      />
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

export function MoneyInput(props: FieldProps & { placeholder?: string }) {
  return <Input {...props} inputMode="numeric" hint={props.hint ?? "En FCFA"} />;
}

export function Select({
  label,
  name,
  defaultValue,
  required,
  hint,
  className = "",
  options,
  placeholder,
}: FieldProps & { options: Record<string, string> | string[][]; placeholder?: string }) {
  // Tableau de paires [valeur, libellé] ou objet { valeur: libellé }.
  const entries = Array.isArray(options) ? options : Object.entries(options);
  return (
    <div className={className}>
      <label className="label" htmlFor={name}>
        {label}
        {required && <span className="text-red-600"> *</span>}
      </label>
      <select id={name} name={name} defaultValue={defaultValue ?? ""} required={required} className="input">
        {placeholder !== undefined && <option value="">{placeholder}</option>}
        {entries.map(([value, text]) => (
          <option key={value} value={value}>
            {text}
          </option>
        ))}
      </select>
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

export function Textarea({ label, name, defaultValue, hint, className = "" }: FieldProps) {
  return (
    <div className={className}>
      <label className="label" htmlFor={name}>
        {label}
      </label>
      <textarea id={name} name={name} defaultValue={defaultValue ?? ""} rows={3} className="input" />
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

export function Checkbox({
  label,
  name,
  defaultChecked,
  hint,
  className = "",
}: {
  label: string;
  name: string;
  defaultChecked?: boolean;
  hint?: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="flex items-start gap-2.5 text-sm">
        <input
          type="checkbox"
          name={name}
          defaultChecked={defaultChecked}
          className="mt-0.5 h-4 w-4 rounded border-slate-300 text-brand focus:ring-brand"
        />
        <span>
          <span className="font-medium text-slate-700">{label}</span>
          {hint && <span className="mt-0.5 block text-xs text-slate-500">{hint}</span>}
        </span>
      </label>
    </div>
  );
}

// Ligne « libellé : valeur » des fiches détaillées.
export function Detail({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="mt-0.5 text-sm">{children || "—"}</dd>
    </div>
  );
}
