import Link from "next/link";

type Variant = "primary" | "outline" | "outline-light" | "dark";

const VARIANT_CLASSES: Record<Variant, string> = {
  primary: "bg-primary text-white hover:bg-primary-dark",
  outline: "border border-ink/15 text-ink hover:border-primary hover:text-primary",
  "outline-light": "border border-white/30 text-white hover:border-white hover:bg-white/10",
  dark: "bg-ink text-white hover:bg-ink/90",
};

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold tracking-wide transition-colors";

export function ButtonLink({
  href,
  variant = "primary",
  className = "",
  children,
  target,
}: {
  href: string;
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
  target?: string;
}) {
  const external = href.startsWith("http") || target === "_blank";
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseClasses} ${VARIANT_CLASSES[variant]} ${className}`}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={`${baseClasses} ${VARIANT_CLASSES[variant]} ${className}`}>
      {children}
    </Link>
  );
}

export function Button({
  variant = "primary",
  className = "",
  children,
  type = "submit",
}: {
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
  type?: "submit" | "button";
}) {
  return (
    <button type={type} className={`${baseClasses} ${VARIANT_CLASSES[variant]} ${className}`}>
      {children}
    </button>
  );
}
