"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Anchor,
  Droplets,
  ExternalLink,
  Leaf,
  LogOut,
  Package,
  ShieldCheck,
  UserPlus,
  Warehouse,
  X,
} from "lucide-react";
import { APP_NAME } from "@/lib/brand";
import { getOperatorDashboardNav } from "@/lib/dashboardNav";
import { PUBLIC_UTILITY_NAV } from "@/lib/publicNav";
import { roleDashboardPath } from "@/lib/roles";
import { isActivePath, NavSidebarLinkDark } from "@/components/layout/navUtils";

const DASHBOARD_ICONS: Record<string, React.ReactNode> = {
  "/dashboards/washing-station": <Droplets className="h-4 w-4" />,
  "/dashboards/exporter": <Package className="h-4 w-4" />,
  "/dashboards/warehouse": <Warehouse className="h-4 w-4" />,
  "/dashboards/port": <Anchor className="h-4 w-4" />,
  "/dashboards/admin/register": <UserPlus className="h-4 w-4" />,
};

interface Props {
  operatorRole?: string;
  operatorEmail?: string;
  onLogout: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export function DashboardSidebar({
  operatorRole,
  operatorEmail,
  onLogout,
  mobileOpen,
  onMobileClose,
}: Props) {
  const pathname = usePathname();
  const workspaceNav = operatorRole ? getOperatorDashboardNav(operatorRole) : [];
  const homePath = operatorRole ? roleDashboardPath(operatorRole) : "/";

  return (
    <>
      {mobileOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-[1px] lg:hidden"
          aria-label="Close navigation"
          onClick={onMobileClose}
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-screen w-64 flex-col border-r border-forest/20 bg-[#0f2e22] text-white transition-transform duration-200 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
        aria-label="Application navigation"
      >
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
          <Link
            href={homePath}
            className="flex min-w-0 items-center gap-3"
            onClick={onMobileClose}
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5">
              <Leaf className="h-5 w-5 text-amber" aria-hidden />
            </span>
            <span className="truncate text-sm font-semibold text-white">{APP_NAME}</span>
          </Link>
          <button
            type="button"
            className="rounded-lg p-1.5 text-white/60 hover:bg-white/10 hover:text-white lg:hidden"
            aria-label="Close menu"
            onClick={onMobileClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {operatorEmail ? (
          <div className="border-b border-white/10 px-4 py-3">
            <p className="truncate text-xs text-white/55">{operatorEmail}</p>
            {operatorRole ? (
              <span className="mt-1.5 inline-flex rounded-md bg-white/10 px-2 py-0.5 font-data text-[10px] font-medium uppercase tracking-wide text-amber/90">
                {operatorRole.replace(/_/g, " ")}
              </span>
            ) : null}
          </div>
        ) : null}

        <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
          <section>
            <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/35">
              Workspace
            </p>
            <div className="space-y-1">
              {workspaceNav.map(({ path, label }) => (
                <NavSidebarLinkDark
                  key={path}
                  href={path}
                  active={isActivePath(pathname, path)}
                  icon={DASHBOARD_ICONS[path] ?? <ShieldCheck className="h-4 w-4" />}
                  onNavigate={onMobileClose}
                >
                  {label}
                </NavSidebarLinkDark>
              ))}
            </div>
          </section>

          <section>
            <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/35">
              Public portals
            </p>
            <div className="space-y-1">
              {PUBLIC_UTILITY_NAV.map(({ path, label, matchPrefix }) => (
                <NavSidebarLinkDark
                  key={path}
                  href={path}
                  active={isActivePath(pathname, path, { matchPrefix })}
                  icon={<ExternalLink className="h-4 w-4" />}
                  onNavigate={onMobileClose}
                >
                  {label}
                </NavSidebarLinkDark>
              ))}
            </div>
          </section>
        </nav>

        <div className="border-t border-white/10 p-3">
          <button
            type="button"
            onClick={() => {
              onMobileClose();
              onLogout();
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-200 transition hover:bg-red-500/10 hover:text-red-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-300"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-red-500/10 text-red-300">
              <LogOut className="h-4 w-4" aria-hidden />
            </span>
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}
