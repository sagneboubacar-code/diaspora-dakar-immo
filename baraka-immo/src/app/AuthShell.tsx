import Link from "next/link";
import type { ReactNode } from "react";
import { APP_NAME } from "@/lib/config";

export function AuthShell({ title, children, footer }: { title: string; children: ReactNode; footer?: ReactNode }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <Link href="/" className="mb-8 flex items-center gap-2 text-lg font-bold">
        <Logo /> {APP_NAME}
      </Link>
      <div className="card w-full max-w-md p-6 sm:p-8">
        <h1 className="mb-6 text-xl font-bold">{title}</h1>
        {children}
      </div>
      {footer && <div className="mt-6 text-sm text-slate-600">{footer}</div>}
    </main>
  );
}

export function Logo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center justify-center rounded-lg bg-brand text-white ${className}`}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" aria-hidden>
        <path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" strokeLinejoin="round" />
      </svg>
    </span>
  );
}
