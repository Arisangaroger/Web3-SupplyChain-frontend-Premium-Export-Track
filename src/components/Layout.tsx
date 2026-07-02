"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { useRequireRole } from "@/hooks/useRequireRole";
import type { OperatorRole } from "@/lib/roles";
import { AccessDeniedScreen } from "@/components/ui/AccessDeniedScreen";
import { AppLoadingScreen } from "@/components/ui/AppLoadingScreen";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";

export function DashboardLayout({
  title,
  allowedRoles,
  children,
}: {
  title: string;
  allowedRoles: OperatorRole[];
  children: React.ReactNode;
}) {
  const { operator, logout, ready, authorized, denyReason } = useRequireRole(allowedRoles);
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!ready) {
    return <AppLoadingScreen message="Loading session" />;
  }

  if (!authorized) {
    return (
      <AccessDeniedScreen
        reason={denyReason === "unauthenticated" ? "unauthenticated" : "forbidden"}
        operatorRole={operator?.role}
      />
    );
  }

  return (
    <div className="flex min-h-screen bg-canvas">
      <DashboardSidebar
        operatorRole={operator?.role}
        operatorEmail={operator?.email}
        onLogout={logout}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col lg:ml-64">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-forest/10 bg-chrome/95 px-4 py-3.5 backdrop-blur-sm lg:px-8">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg border border-forest/15 bg-white p-2 text-forest shadow-sm lg:hidden"
            aria-label="Open navigation"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="min-w-0">
            <h1 className="truncate text-display-sm text-forest">{title}</h1>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 type-body lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
