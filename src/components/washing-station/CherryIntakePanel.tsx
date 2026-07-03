"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { SurfaceInset } from "@/components/ui/SurfaceInset";
import { BodyText, TypeLabel } from "@/components/ui/typography";
import type { FarmerSummary } from "@/services/api";

interface Props {
  farmerId: string;
  farmers: FarmerSummary[];
  farmersLoading: boolean;
  weightKg: string;
  basePrice: string;
  regionCode: string;
  geoLoading: boolean;
  isReady: boolean;
  onFarmerIdChange: (value: string) => void;
  onWeightKgChange: (value: string) => void;
  onBasePriceChange: (value: string) => void;
  onRegionCodeChange: (value: string) => void;
  onRegisterFarmer: (fullName: string, kycReference?: string) => Promise<void>;
  onSubmit: (event: FormEvent) => void;
}

export function CherryIntakePanel({
  farmerId,
  farmers,
  farmersLoading,
  weightKg,
  basePrice,
  regionCode,
  geoLoading,
  isReady,
  onFarmerIdChange,
  onWeightKgChange,
  onBasePriceChange,
  onRegionCodeChange,
  onRegisterFarmer,
  onSubmit,
}: Props) {
  const [newFarmerName, setNewFarmerName] = useState("");
  const [newFarmerKyc, setNewFarmerKyc] = useState("");
  const [registering, setRegistering] = useState(false);

  const onRegister = async (event: FormEvent) => {
    event.preventDefault();
    if (!newFarmerName.trim()) return;
    setRegistering(true);
    try {
      await onRegisterFarmer(newFarmerName.trim(), newFarmerKyc.trim() || undefined);
      setNewFarmerName("");
      setNewFarmerKyc("");
    } finally {
      setRegistering(false);
    }
  };

  return (
    <>
      <Card step="0" title="Register farmers for this station" weight="tertiary" className="mb-6">
        <SurfaceInset className="space-y-3 p-4">
          <BodyText muted>
            Register cooperative members here first. Each farmer gets a numeric ID used at cherry intake.
          </BodyText>
          <form onSubmit={onRegister} className="grid gap-3 sm:grid-cols-2">
            <Input
              label="Farmer full name"
              value={newFarmerName}
              onChange={(e) => setNewFarmerName(e.target.value)}
              placeholder="e.g. Jean Mukamana"
              required
            />
            <Input
              label="KYC reference (optional)"
              mono
              value={newFarmerKyc}
              onChange={(e) => setNewFarmerKyc(e.target.value)}
              placeholder="e.g. KYC-2026-0042"
            />
            <div className="sm:col-span-2">
              <Button type="submit" variant="secondary" disabled={registering || !isReady}>
                {registering ? "Registering..." : "Register farmer"}
              </Button>
            </div>
          </form>
          {farmers.length > 0 ? (
            <ul className="mt-2 space-y-1 text-sm text-slate-700">
              {farmers.map((farmer) => (
                <li key={farmer.id} className="font-data">
                  <strong>#{farmer.id}</strong> — {farmer.fullName}
                  {farmer.kycReference ? ` · ${farmer.kycReference}` : ""}
                </li>
              ))}
            </ul>
          ) : farmersLoading ? (
            <TypeLabel className="text-slate-600">Loading registered farmers...</TypeLabel>
          ) : (
            <TypeLabel className="text-slate-600">No farmers registered for this station yet.</TypeLabel>
          )}
        </SurfaceInset>
      </Card>

      <Card step="A" title="Cherry intake (farm provenance, no QR)" weight="secondary">
        <SurfaceInset className="p-4">
          <form onSubmit={onSubmit} className="space-y-3">
            <label className="block">
              <span className="type-label mb-1 block">Farmer</span>
              <select
                className="w-full rounded-lg border border-forest/15 bg-white px-3 py-2 font-data text-sm"
                value={farmerId}
                onChange={(e) => onFarmerIdChange(e.target.value)}
                required
                disabled={farmersLoading || farmers.length === 0}
              >
                <option value="">
                  {farmersLoading
                    ? "Loading farmers..."
                    : farmers.length === 0
                      ? "Register a farmer first"
                      : "Select farmer"}
                </option>
                {farmers.map((farmer) => (
                  <option key={farmer.id} value={String(farmer.id)}>
                    #{farmer.id} — {farmer.fullName}
                  </option>
                ))}
              </select>
            </label>
            <Input
              label="Cherry weight (kg)"
              mono
              value={weightKg}
              onChange={(e) => onWeightKgChange(e.target.value)}
              placeholder="e.g. 120"
              required
            />
            <Input
              label="Base price / kg"
              mono
              value={basePrice}
              onChange={(e) => onBasePriceChange(e.target.value)}
              placeholder="e.g. 0.50"
              required
            />
            <Input
              label="Region code (EUDR)"
              mono
              value={regionCode}
              onChange={(e) => onRegionCodeChange(e.target.value)}
              placeholder="e.g. RW-South"
              required
            />
            <Button type="submit" disabled={geoLoading || !isReady || !farmerId}>
              {geoLoading ? "Capturing GPS..." : "Log cherry delivery"}
            </Button>
          </form>
        </SurfaceInset>
      </Card>
    </>
  );
}
