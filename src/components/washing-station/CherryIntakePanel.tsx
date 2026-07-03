"use client";

import { FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { SurfaceInset } from "@/components/ui/SurfaceInset";

interface Props {
  farmerId: string;
  weightKg: string;
  basePrice: string;
  regionCode: string;
  geoLoading: boolean;
  isReady: boolean;
  onFarmerIdChange: (value: string) => void;
  onWeightKgChange: (value: string) => void;
  onBasePriceChange: (value: string) => void;
  onRegionCodeChange: (value: string) => void;
  onSubmit: (event: FormEvent) => void;
}

export function CherryIntakePanel({
  farmerId,
  weightKg,
  basePrice,
  regionCode,
  geoLoading,
  isReady,
  onFarmerIdChange,
  onWeightKgChange,
  onBasePriceChange,
  onRegionCodeChange,
  onSubmit,
}: Props) {
  return (
    <Card step="A" title="Cherry intake (farm provenance, no QR)" weight="secondary">
      <SurfaceInset className="p-4">
        <form onSubmit={onSubmit} className="space-y-3">
          <Input
            label="Farmer ID"
            mono
            value={farmerId}
            onChange={(e) => onFarmerIdChange(e.target.value)}
            placeholder="e.g. 101"
            required
          />
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
          <Button type="submit" disabled={geoLoading || !isReady}>
            {geoLoading ? "Capturing GPS..." : "Log cherry delivery"}
          </Button>
        </form>
      </SurfaceInset>
    </Card>
  );
}
