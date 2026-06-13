"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { LogoIcon } from "./Icons";

interface SidebarLink {
  href: string;
  label: string;
  icon: ReactNode;
}

interface SidebarProps {
  links: SidebarLink[];
}

export default function Sidebar({ links }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-200/80 bg-white md:flex">
      <div className="flex h-16 items-center gap-2.5 border-b border-slate-200/80 px-5">
        <LogoIcon className="h-7 w-7" />
        <div>
          <p className="text-sm font-bold text-slate-900">SAMS</p>
          <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
            Dashboard
          </p>
        </div>
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-4">
        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          Navigation
        </p>
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                isActive
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-slate-100 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600"
                }`}
              >
                {link.icon}
              </span>
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-slate-200/80 p-4">
        <div className="rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 p-4 ring-1 ring-blue-100/60">
          <p className="text-xs font-semibold text-blue-900">Need help?</p>
          <p className="mt-1 text-[11px] leading-relaxed text-blue-700/70">
            Contact your institution admin for support.
          </p>
        </div>
      </div>
    </aside>
  );
}
