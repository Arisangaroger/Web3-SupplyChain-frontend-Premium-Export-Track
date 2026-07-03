"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AppLoadingScreen } from "@/components/ui/AppLoadingScreen";
import { LoginBrandPanel } from "@/components/auth/LoginBrandPanel";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { getApiErrorMessage, login } from "@/services/api";
import { getOperator, getToken, roleDashboardPath, saveSession } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sessionChecked, setSessionChecked] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

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
    return <AppLoadingScreen message={redirecting ? "Opening dashboard" : "Please wait"} />;
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
            <h2 className="mt-4 font-display text-display-md text-slate-900">Sign in</h2>
            <p className="mt-2 text-sm text-slate-600">
              For washing station, exporter, warehouse, port, and admin staff.
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
