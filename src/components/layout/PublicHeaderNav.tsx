"use client";

import { usePathname } from "next/navigation";
import { LogIn } from "lucide-react";
import { LOGIN_NAV, PUBLIC_UTILITY_NAV } from "@/lib/publicNav";
import { isActivePath, PublicNavLink } from "@/components/layout/navUtils";

export function PublicHeaderNav() {
  const pathname = usePathname();

  return (
    <nav
      className="flex flex-wrap items-center justify-end gap-1 lg:gap-1.5"
      aria-label="Site navigation"
    >
      {PUBLIC_UTILITY_NAV.map(({ path, label, matchPrefix }) => (
        <PublicNavLink
          key={path}
          href={path}
          active={isActivePath(pathname, path, { matchPrefix })}
        >
          {label}
        </PublicNavLink>
      ))}

      <PublicNavLink
        href={LOGIN_NAV.path}
        active={isActivePath(pathname, LOGIN_NAV.path, { exact: LOGIN_NAV.exact })}
        variant="cta"
        icon={<LogIn className="h-4 w-4" aria-hidden />}
      >
        {LOGIN_NAV.label}
      </PublicNavLink>
    </nav>
  );
}
