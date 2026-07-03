"use client";

import { FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { SurfaceInset } from "@/components/ui/SurfaceInset";
import { TypeLabel } from "@/components/ui/typography";
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
  onGoToFarmersTab: () => void;
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
  onGoToFarmersTab,
  onSubmit,
}: Props) {
  return (
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
                    ? "No farmers registered"
                    : "Select farmer"}
              </option>
              {farmers.map((farmer) => (
                <option key={farmer.id} value={String(farmer.id)}>
                  #{farmer.id} — {farmer.fullName}
                </option>
              ))}
            </select>
          </label>
          {!farmersLoading && farmers.length === 0 ? (
            <TypeLabel className="text-slate-600">
              Register farmers in the{" "}
              <button
                type="button"
                className="font-semibold text-forest underline"
                onClick={onGoToFarmersTab}
              >
                Farmers
              </button>{" "}
              tab first.
            </TypeLabel>
          ) : null}
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
  );
}
