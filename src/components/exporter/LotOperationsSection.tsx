"use client";

import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { LotOperationsPanel } from "@/components/lots/LotOperationsPanel";

interface Props {
  isReady: boolean;
  stationId: string;
  stationEditable: boolean;
  onStationIdChange: (value: string) => void;
}

export function LotOperationsSection({
  isReady,
  stationId,
  stationEditable,
  onStationIdChange,
}: Props) {
  if (!isReady) {
    return (
      <Card title="Washing station scope" weight="tertiary">
        <Input
          label="Washing station ID (required for batch operations)"
          mono
          value={stationId}
          onChange={(e) => onStationIdChange(e.target.value)}
          placeholder="WS-001"
        />
      </Card>
    );
  }

  return (
    <LotOperationsPanel
      mode="exporter"
      washingStationId={stationId}
      stationEditable={stationEditable}
      onStationIdChange={onStationIdChange}
    />
  );
}
