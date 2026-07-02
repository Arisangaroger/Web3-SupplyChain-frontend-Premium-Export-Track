"use client";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { SurfaceInset } from "@/components/ui/SurfaceInset";
import { DataValue, TypeLabel } from "@/components/ui/typography";

interface Props {
  trackingCode: string;
  operatorRole?: string;
  geoLoading: boolean;
  onTrackingCodeChange: (value: string) => void;
  onRecordStage: () => void;
}

export function PortClearancePanel({
  trackingCode,
  operatorRole,
  geoLoading,
  onTrackingCodeChange,
  onRecordStage,
}: Props) {
  return (
    <Card step="2" title="Confirm port lock & GPS" weight="primary" badge="Main action">
      <SurfaceInset className="space-y-3 p-4">
        <Input
          label="Tracking / lot code"
          mono
          value={trackingCode}
          onChange={(e) => onTrackingCodeChange(e.target.value)}
          placeholder="WS-QR-00012345"
        />
        <TypeLabel>
          Operator: {operatorRole ?? "—"} → records stage{" "}
          <DataValue className="font-semibold">PORT_LOCKED</DataValue>
        </TypeLabel>
        <Button onClick={onRecordStage} disabled={geoLoading || !trackingCode.trim()}>
          {geoLoading ? "Capturing GPS…" : "Record final lock + location"}
        </Button>
      </SurfaceInset>
    </Card>
  );
}
