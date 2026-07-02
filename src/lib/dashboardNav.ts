import { roleDashboardPath } from "@/lib/roles";

export const DASHBOARD_NAV_ITEMS = [
  { path: "/dashboards/washing-station", label: "Washing station" },
  { path: "/dashboards/exporter", label: "Exporter" },
  { path: "/dashboards/warehouse", label: "Warehouse" },
  { path: "/dashboards/port", label: "Port" },
] as const;

export const ADMIN_NAV_ITEMS = [
  ...DASHBOARD_NAV_ITEMS,
  { path: "/dashboards/admin/register", label: "Register operator" },
] as const;

export function getOperatorDashboardNav(role: string) {
  if (role === "ADMIN") {
    return ADMIN_NAV_ITEMS;
  }

  const homePath = roleDashboardPath(role);
  const homeItem = DASHBOARD_NAV_ITEMS.find((item) => item.path === homePath);
  return homeItem ? [homeItem] : [];
}
