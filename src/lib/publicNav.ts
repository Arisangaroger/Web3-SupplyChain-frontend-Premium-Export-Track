export const PUBLIC_UTILITY_NAV = [
  {
    path: "/verify/lot/demo",
    label: "Verify lot",
    matchPrefix: "/verify/lot",
    description: "Check an export batch and see which farmers are in it.",
  },
  {
    path: "/verify/passport/demo",
    label: "Public passport",
    matchPrefix: "/verify/passport",
    description: "Scan a sack passport to see farm data and compliance.",
  },
  {
    path: "/dashboards/lender",
    label: "Lender portal",
    matchPrefix: "/dashboards/lender",
    description: "Check a farmer's credit score and monthly records.",
  },
] as const;

export const LOGIN_NAV = {
  path: "/login",
  label: "Sign in",
  exact: true,
} as const;

export type PublicNavItem = (typeof PUBLIC_UTILITY_NAV)[number];
