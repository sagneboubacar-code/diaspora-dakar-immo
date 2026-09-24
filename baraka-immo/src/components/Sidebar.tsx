"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export interface NavItem {
  href: string;
  label: string;
}

export function Sidebar({
  appName,
  items,
  orgSwitcher,
  footer,
}: {
  appName: string;
  items: NavItem[];
  orgSwitcher: React.ReactNode;
  footer: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const nav = (
    <nav className="flex flex-1 flex-col gap-0.5 px-3">
      {items.map((it) => {
        const active = pathname === it.href || pathname.startsWith(`${it.href}/`);
        return (
          <Link
            key={it.href}
            href={it.href}
            onClick={() => setOpen(false)}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
              active ? "bg-brand-light/70 text-brand-dark" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            {it.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Barre mobile */}
      <div className="no-print sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
        <span className="font-bold">{appName}</span>
        <button type="button" className="btn btn-sm" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
          {open ? "Fermer" : "Menu"}
        </button>
      </div>

      <aside
        className={`no-print fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200 bg-white py-5 transition-transform lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-4 px-6 text-lg font-bold">{appName}</div>
        <div className="mb-4 px-3">{orgSwitcher}</div>
        {nav}
        <div className="mt-4 border-t border-slate-100 px-6 pt-4 text-sm">{footer}</div>
      </aside>
      {open && <div className="fixed inset-0 z-30 bg-black/30 lg:hidden" onClick={() => setOpen(false)} />}
    </>
  );
}
