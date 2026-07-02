export const PUBLIC_UTILITY_NAV = [
  {
    path: "/verify/lot/demo",
    label: "Verify lot",
    matchPrefix: "/verify/lot",
    description: "Check an entire export batch and every farmer allocation inside it.",
  },
  {
    path: "/verify/passport/demo",
    label: "Public passport",
    matchPrefix: "/verify/passport",
    description: "Scan a sack passport to see provenance, compliance, and custody history.",
  },
  {
    path: "/dashboards/lender",
    label: "Lender portal",
    matchPrefix: "/dashboards/lender",
    description: "Run a cryptographic farmer credit audit without an operator account.",
  },
] as const;

export const LOGIN_NAV = {
  path: "/login",
  label: "Operator login",
  exact: true,
} as const;

export type PublicNavItem = (typeof PUBLIC_UTILITY_NAV)[number];
