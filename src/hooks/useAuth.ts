"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { clearSession, getOperator, getToken, type Operator } from "@/lib/auth";

export function useAuth(requireAuth = false) {
  const router = useRouter();
  const [operator, setOperator] = useState<Operator | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = getToken();
    const op = getOperator();
    setOperator(op);
    setReady(true);

    if (requireAuth && !token) {
      router.replace("/login");
    }
  }, [requireAuth, router]);

  const logout = () => {
    clearSession();
    router.replace("/");
  };

  return { operator, ready, logout, isAuthenticated: Boolean(getToken()) };
}
