"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, Leaf, LogIn, Menu, X } from "lucide-react";
import { APP_NAME } from "@/lib/brand";
import { LOGIN_NAV, PUBLIC_UTILITY_NAV } from "@/lib/publicNav";
import { isActivePath, NavSidebarLink } from "@/components/layout/navUtils";

interface Props {
  mobileOpen: boolean;
  onMobileOpen: () => void;
  onMobileClose: () => void;
}

export function PublicSidebar({ mobileOpen, onMobileOpen, onMobileClose }: Props) {
  const pathname = usePathname();

  return (
    <>
      <button
        type="button"
        className="fixed left-4 top-4 z-30 inline-flex items-center justify-center rounded-lg border border-forest/15 bg-white p-2 text-forest shadow-sm lg:hidden"
        aria-label="Open navigation"
        onClick={onMobileOpen}
      >
        <Menu className="h-5 w-5" />
      </button>

      {mobileOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-[1px] lg:hidden"
          aria-label="Close navigation"
          onClick={onMobileClose}
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-forest/10 bg-chrome transition-transform duration-200 lg:static lg:z-auto lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Site navigation"
      >
        <div className="flex items-center justify-between border-b border-forest/10 px-4 py-4">
          <Link href="/" className="flex min-w-0 items-center gap-3" onClick={onMobileClose}>
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-forest/15 bg-white shadow-sm">
              <Leaf className="h-5 w-5 text-forest" aria-hidden />
            </span>
            <span className="truncate font-display text-sm font-semibold text-forest">{APP_NAME}</span>
          </Link>
          <button
            type="button"
            className="rounded-lg p-1.5 text-slate-500 hover:bg-white hover:text-slate-700 lg:hidden"
            aria-label="Close menu"
            onClick={onMobileClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
          <section>
            <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
              Public
            </p>
            <div className="space-y-1">
              {PUBLIC_UTILITY_NAV.map(({ path, label, matchPrefix }) => (
                <NavSidebarLink
                  key={path}
                  href={path}
                  active={isActivePath(pathname, path, { matchPrefix })}
                  icon={<ExternalLink className="h-4 w-4" />}
                  onNavigate={onMobileClose}
                >
                  {label}
                </NavSidebarLink>
              ))}
            </div>
          </section>

          <section>
            <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
              Staff
            </p>
            <div className="space-y-1">
              <NavSidebarLink
                href={LOGIN_NAV.path}
                active={isActivePath(pathname, LOGIN_NAV.path, { exact: LOGIN_NAV.exact })}
                icon={<LogIn className="h-4 w-4" />}
                onNavigate={onMobileClose}
              >
                {LOGIN_NAV.label}
              </NavSidebarLink>
            </div>
          </section>
        </nav>
      </aside>
    </>
  );
}
