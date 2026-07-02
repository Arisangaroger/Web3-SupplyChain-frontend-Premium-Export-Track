"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Leaf, LogIn, Menu, X } from "lucide-react";
import { useState } from "react";
import { APP_NAME, APP_TAGLINE } from "@/lib/brand";
import { PublicHeaderNav } from "@/components/layout/PublicHeaderNav";
import { LOGIN_NAV, PUBLIC_UTILITY_NAV } from "@/lib/publicNav";
import { isActivePath, PublicNavLink } from "@/components/layout/navUtils";

interface Props {
  children: React.ReactNode;
  showFooter?: boolean;
}

export function PublicSiteLayout({ children, showFooter = true }: Props) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <header className="sticky top-0 z-40 border-b border-forest/15 bg-white/95 shadow-[0_1px_0_rgba(27,67,50,0.06),0_4px_20px_rgba(27,67,50,0.06)] backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 lg:px-8 lg:py-3.5">
          <Link
            href="/"
            className="flex min-w-0 items-center gap-3"
            onClick={() => setMobileOpen(false)}
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-forest/15 bg-white shadow-sm">
              <Leaf className="h-5 w-5 text-forest" aria-hidden />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold text-forest">{APP_NAME}</span>
              <span className="hidden truncate text-[11px] text-slate-500 sm:block">{APP_TAGLINE}</span>
            </span>
          </Link>

          <div className="hidden md:block">
            <PublicHeaderNav />
          </div>

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg border border-forest/15 bg-white p-2 text-forest shadow-sm md:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {mobileOpen ? (
          <nav
            className="border-t border-forest/10 bg-white px-3 py-3 md:hidden"
            aria-label="Mobile site navigation"
          >
            <div className="flex flex-col gap-1.5">
              {PUBLIC_UTILITY_NAV.map(({ path, label, matchPrefix }) => (
                <PublicNavLink
                  key={path}
                  href={path}
                  fullWidth
                  active={isActivePath(pathname, path, { matchPrefix })}
                  onNavigate={() => setMobileOpen(false)}
                >
                  {label}
                </PublicNavLink>
              ))}
              <PublicNavLink
                href={LOGIN_NAV.path}
                fullWidth
                variant="cta"
                active={isActivePath(pathname, LOGIN_NAV.path, { exact: LOGIN_NAV.exact })}
                icon={<LogIn className="h-4 w-4" aria-hidden />}
                onNavigate={() => setMobileOpen(false)}
              >
                {LOGIN_NAV.label}
              </PublicNavLink>
            </div>
          </nav>
        ) : null}
      </header>

      <div className="flex-1">{children}</div>

      {showFooter ? (
        <footer className="bg-[#0f2e22] text-white">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <p className="text-white/70">
              <span className="font-semibold text-white">{APP_NAME}</span>
              <span className="text-white/35"> · </span>
              Traceable Rwanda coffee from farm to port.
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {PUBLIC_UTILITY_NAV.map(({ path, label }) => (
                <Link
                  key={path}
                  href={path}
                  className="font-medium text-white/75 transition hover:text-white hover:underline"
                >
                  {label}
                </Link>
              ))}
              <Link
                href={LOGIN_NAV.path}
                className="font-medium text-white/75 transition hover:text-white hover:underline"
              >
                {LOGIN_NAV.label}
              </Link>
            </div>
          </div>
        </footer>
      ) : null}
    </div>
  );
}
