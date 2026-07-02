"use client";

import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { TypeLabel } from "@/components/ui/typography";

interface Props {
  stationId: string;
  onStationIdChange: (value: string) => void;
  isReady: boolean;
  editable: boolean;
}

export function StationScopePanel({ stationId, onStationIdChange, isReady, editable }: Props) {
  if (!editable && isReady) {
    return null;
  }

  return (
    <Card title="Washing station scope" weight="tertiary" className="mb-6">
      <Input
        label="Washing station ID"
        mono
        value={stationId}
        onChange={(e) => onStationIdChange(e.target.value)}
        placeholder="WS-001"
        required
      />
      {!isReady ? (
        <TypeLabel className="mt-2 text-amber-800">
          Enter the station ID you are operating before intake or rollup.
        </TypeLabel>
      ) : null}
    </Card>
  );
}
