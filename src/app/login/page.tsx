"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AppLoadingScreen } from "@/components/ui/AppLoadingScreen";
import { LoginBrandPanel } from "@/components/auth/LoginBrandPanel";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { checkBackendHealth, getApiErrorMessage, login } from "@/services/api";
import { getOperator, getToken, roleDashboardPath, saveSession } from "@/lib/auth";

function StatusDot({ status }: { status: "checking" | "online" | "offline" }) {
  const colors = {
    checking: "bg-slate-300",
    online: "bg-emerald-500",
    offline: "bg-red-500",
  };
  const labels = {
    checking: "Connecting…",
    online: "API connected",
    offline: "API offline",
  };

  return (
    <span className="inline-flex items-center gap-2 text-xs text-slate-500">
      <span className={`h-1.5 w-1.5 rounded-full ${colors[status]}`} />
      {labels[status]}
    </span>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sessionChecked, setSessionChecked] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  const [backendStatus, setBackendStatus] = useState<"checking" | "online" | "offline">(
    "checking",
  );

  useEffect(() => {
    let active = true;
    checkBackendHealth()
      .then(() => {
        if (active) setBackendStatus("online");
      })
      .catch(() => {
        if (active) setBackendStatus("offline");
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const token = getToken();
    const operator = getOperator();
    if (token && operator) {
      setRedirecting(true);
      router.replace(roleDashboardPath(operator.role));
      return;
    }
    setSessionChecked(true);
  }, [router]);

  if (redirecting || !sessionChecked) {
    return <AppLoadingScreen message={redirecting ? "Opening your dashboard" : "Checking session"} />;
  }

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const auth = await login({ email, password });
      saveSession(auth);
      router.push(roleDashboardPath(auth.operator.role));
    } catch (err) {
      setError(getApiErrorMessage(err, "Login failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-canvas">
      <div className="flex min-w-0 flex-1 flex-col lg:flex-row">
        <LoginBrandPanel />

        <div className="flex flex-1 flex-col justify-center bg-white px-6 py-10 sm:px-12 lg:px-16 xl:px-24">
          <div className="mx-auto w-full max-w-sm">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-forest transition hover:underline"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden />
              Back to home
            </Link>
            <StatusDot status={backendStatus} />
            <h2 className="mt-4 text-display-md text-slate-900">Operator sign in</h2>
            <p className="mt-2 text-sm text-slate-600">
              For washing station, exporter, warehouse, port, and admin accounts.
            </p>

            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              <Input
                label="Email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                label="Password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {error ? (
                <p className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </p>
              ) : null}
              <Button type="submit" className="w-full py-2.5" disabled={loading}>
                {loading ? "Signing in…" : "Sign in"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
