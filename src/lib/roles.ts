export const OPERATOR_ROLES = [
  "WASHING_STATION",
  "EXPORTER",
  "WAREHOUSE",
  "PORT",
  "ADMIN",
] as const;

export type OperatorRole = (typeof OPERATOR_ROLES)[number];

export const DASHBOARD_ACCESS: Record<string, OperatorRole[]> = {
  "/dashboards/washing-station": ["WASHING_STATION", "ADMIN"],
  "/dashboards/exporter": ["EXPORTER", "ADMIN"],
  "/dashboards/warehouse": ["WAREHOUSE", "ADMIN"],
  "/dashboards/port": ["PORT", "ADMIN"],
  "/dashboards/admin/register": ["ADMIN"],
};

export const PUBLIC_REGISTER_ROLES = [
  "WASHING_STATION",
  "EXPORTER",
  "WAREHOUSE",
  "PORT",
] as const;

export type PublicRegisterRole = (typeof PUBLIC_REGISTER_ROLES)[number];

export function roleDashboardPath(role: string): string {
  switch (role) {
    case "WASHING_STATION":
      return "/dashboards/washing-station";
    case "EXPORTER":
      return "/dashboards/exporter";
    case "WAREHOUSE":
      return "/dashboards/warehouse";
    case "PORT":
      return "/dashboards/port";
    case "ADMIN":
      return "/dashboards/admin/register";
    default:
      return "/";
  }
}

export function isRoleAllowed(role: string, allowedRoles: OperatorRole[]): boolean {
  if (role === "ADMIN") {
    return true;
  }
  return allowedRoles.includes(role as OperatorRole);
}
