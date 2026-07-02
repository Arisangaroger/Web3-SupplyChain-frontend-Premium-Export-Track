"use client";

import Link from "next/link";
import { LogIn, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { APP_NAME } from "@/lib/brand";
import { roleDashboardPath } from "@/lib/roles";

interface Props {
  reason: "unauthenticated" | "forbidden";
  operatorRole?: string;
}

export function AccessDeniedScreen({ reason, operatorRole }: Props) {
  const isUnauthenticated = reason === "unauthenticated";
  const Icon = isUnauthenticated ? LogIn : ShieldAlert;

  const title = isUnauthenticated ? "Sign in required" : "Access denied";
  const description = isUnauthenticated
    ? "Operator credentials are needed to open this dashboard. Sign in with your work email to continue."
    : "Your account role does not include access to this page. Return to your assigned dashboard or sign in with a different operator account.";
  const primaryHref = isUnauthenticated ? "/login" : operatorRole ? roleDashboardPath(operatorRole) : "/";
  const primaryLabel = isUnauthenticated ? "Go to operator login" : "Go to my dashboard";

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas px-4 py-12">
      <div className="surface-card w-full max-w-md p-8 text-center sm:p-10">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-red-200/80 bg-red-50/80">
          <Icon className="h-10 w-10 text-red-700/80" strokeWidth={1.5} aria-hidden />
        </div>
        <p className="eyebrow mt-6 text-slate-500">{APP_NAME}</p>
        <h1 className="mt-2 text-display-md text-slate-900">{title}</h1>
        <p className="type-body mx-auto mt-3 max-w-sm text-slate-600">{description}</p>
        <div className="mt-8 flex flex-col items-center gap-3">
          <Link href={primaryHref}>
            <Button>{primaryLabel}</Button>
          </Link>
          {!isUnauthenticated ? (
            <Link
              href="/login"
              className="text-sm font-medium text-forest transition hover:underline"
            >
              Sign in as different operator
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
