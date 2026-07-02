"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { clearSession, getOperator, getToken, type Operator } from "@/lib/auth";
import { isRoleAllowed, roleDashboardPath, type OperatorRole } from "@/lib/roles";

export function useRequireRole(allowedRoles: OperatorRole[]) {
  const router = useRouter();
  const [operator, setOperator] = useState<Operator | null>(null);
  const [ready, setReady] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [denyReason, setDenyReason] = useState<"unauthenticated" | "forbidden" | null>(
    null,
  );
  const roleKey = allowedRoles.join(",");

  useEffect(() => {
    const token = getToken();
    const op = getOperator();
    setOperator(op);
    setReady(true);

    if (!token || !op) {
      setAuthorized(false);
      setDenyReason("unauthenticated");
      router.replace("/login");
      return;
    }

    if (isRoleAllowed(op.role, allowedRoles)) {
      setAuthorized(true);
      setDenyReason(null);
      return;
    }

    setAuthorized(false);
    setDenyReason("forbidden");
    router.replace(roleDashboardPath(op.role));
  }, [roleKey, router]);

  const logout = () => {
    clearSession();
    router.replace("/");
  };

  return {
    operator,
    ready,
    authorized,
    denyReason,
    logout,
    isAuthenticated: Boolean(getToken()),
  };
}
