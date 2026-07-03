"use client";

import { FormEvent, useState } from "react";
import { DashboardLayout } from "@/components/Layout";
import { Button } from "@/components/ui/Button";
import { SurfaceInset } from "@/components/ui/SurfaceInset";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { BodyText, DashboardHeroStrip } from "@/components/ui/typography";
import { FormErrorBanner, FormSuccessBanner } from "@/components/ui/FormFeedback";
import type { OperatorRole, PublicRegisterRole } from "@/lib/roles";
import { PUBLIC_REGISTER_ROLES } from "@/lib/roles";
import { getApiErrorMessage, registerOperator } from "@/services/api";

const ALLOWED_ROLES: OperatorRole[] = ["ADMIN"];

export default function AdminRegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<PublicRegisterRole>("WASHING_STATION");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const result = await registerOperator({
        email,
        password,
        role,
      });
      setMessage(
        `User created: ${result.operator.email} (${result.operator.role}). They can sign in now.`,
      );
      setEmail("");
      setPassword("");
    } catch (err) {
      setError(getApiErrorMessage(err, "Registration failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="Admin — Add user" allowedRoles={ALLOWED_ROLES}>
      <DashboardHeroStrip
        label="New user"
        value="1"
        sublabel="One account per form"
        valueClassName="text-amber"
      />
      <BodyText muted className="mb-4">
        Create accounts for washing stations, exporters, warehouse staff, and port workers.
        Washing station users are linked to a station automatically. You cannot create admin
        accounts here.
      </BodyText>

      <Card step="1" title="Create user account" weight="primary" badge="Admin">
        <SurfaceInset className="max-w-md p-4">
        <form onSubmit={onSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="Password (min 8 characters)"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
          />
          <label className="block">
            <span className="eyebrow text-slate-600">Role</span>
            <select
              className="type-body mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 outline-none focus:border-forest focus:ring-2 focus:ring-forest/20"
              value={role}
              onChange={(e) => setRole(e.target.value as PublicRegisterRole)}
            >
              {PUBLIC_REGISTER_ROLES.map((r) => (
                <option key={r} value={r}>
                  {r.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </label>
          {error ? <FormErrorBanner>{error}</FormErrorBanner> : null}
          {message ? <FormSuccessBanner>{message}</FormSuccessBanner> : null}
          <Button type="submit" disabled={loading}>
            {loading ? "Creating…" : "Create user"}
          </Button>
        </form>
        </SurfaceInset>
      </Card>
    </DashboardLayout>
  );
}
