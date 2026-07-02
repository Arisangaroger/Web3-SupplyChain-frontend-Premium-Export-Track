import Link from "next/link";

export function isActivePath(
  pathname: string,
  path: string,
  options?: { matchPrefix?: string; exact?: boolean },
): boolean {
  const normalized = pathname.replace(/\/$/, "") || "/";
  const target = path.replace(/\/$/, "") || "/";

  if (options?.exact) {
    return normalized === target;
  }

  const prefix = options?.matchPrefix;
  if (prefix) {
    const normalizedPrefix = prefix.replace(/\/$/, "") || "/";
    return (
      normalized === target ||
      normalized.startsWith(`${normalizedPrefix}/`) ||
      normalized === normalizedPrefix
    );
  }

  return normalized === target || normalized.startsWith(`${target}/`);
}

export function NavPill({
  href,
  active,
  children,
  icon,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest ${
        active
          ? "nav-active-pill"
          : "border-slate-200/90 bg-white text-slate-600 hover:border-amber-300/50 hover:bg-amber-50/50 hover:text-amber-900"
      }`}
    >
      {active ? (
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber" aria-hidden />
      ) : (
        icon ?? null
      )}
      {children}
    </Link>
  );
}

export function PublicNavLink({
  href,
  active,
  children,
  icon,
  variant = "link",
  fullWidth = false,
  onNavigate,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
  icon?: React.ReactNode;
  variant?: "link" | "cta";
  fullWidth?: boolean;
  onNavigate?: () => void;
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium tracking-tight transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest";

  const layout = fullWidth ? "w-full px-4 py-3" : "px-3.5 py-2 lg:px-4 lg:py-2.5";

  const activeSoft = "bg-forest/10 text-forest";

  const linkStyles = active ? activeSoft : "text-slate-700 hover:bg-slate-100/80 hover:text-forest";

  const ctaStyles = active
    ? activeSoft
    : "bg-forest text-white hover:bg-forest-light";

  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={`${base} ${layout} ${variant === "cta" ? ctaStyles : linkStyles}`}
    >
      {icon ? <span className="shrink-0 opacity-80">{icon}</span> : null}
      <span>{children}</span>
    </Link>
  );
}

export function NavDivider() {
  return <span className="hidden h-6 w-px shrink-0 bg-slate-200 sm:block" aria-hidden />;
}

export function NavSidebarLink({
  href,
  active,
  children,
  icon,
  onNavigate,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
  icon?: React.ReactNode;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest ${
        active
          ? "nav-active-sidebar"
          : "text-slate-600 hover:bg-white/70 hover:text-slate-900"
      }`}
    >
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md border ${
          active
            ? "border-amber-300/60 bg-amber-50 text-amber-900"
            : "border-slate-200/80 bg-white text-slate-500"
        }`}
        aria-hidden
      >
        {icon}
      </span>
      <span className="truncate">{children}</span>
    </Link>
  );
}

export function NavSidebarLinkDark({
  href,
  active,
  children,
  icon,
  onNavigate,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
  icon?: React.ReactNode;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber ${
        active
          ? "bg-white/10 text-white ring-1 ring-amber/30"
          : "text-white/70 hover:bg-white/5 hover:text-white"
      }`}
    >
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${
          active ? "bg-amber/20 text-amber" : "bg-white/5 text-white/60"
        }`}
        aria-hidden
      >
        {icon}
      </span>
      <span className="truncate">{children}</span>
    </Link>
  );
}
