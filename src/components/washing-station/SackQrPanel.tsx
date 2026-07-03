"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { SurfaceInset } from "@/components/ui/SurfaceInset";
import { LifecycleTimeline } from "@/components/lifecycle/LifecycleTimeline";
import { QrScanner } from "@/components/qr/QrScanner";
import { QrCodeDisplay } from "@/components/qr/QrCodeDisplay";
import { FarmerSelect } from "@/components/washing-station/FarmerSelect";
import { BodyText, DataValue } from "@/components/ui/typography";
import type { FarmerSummary } from "@/services/api";

interface RegisteredSack {
  trackingCode: string;
  trackingQrPayload: string;
  timeline: { currentStage: string; locked: boolean; events: unknown[] };
}

interface Props {
  trackingCode: string;
  sackWeightKg: string;
  farmerId: string;
  farmers: FarmerSummary[];
  farmersLoading: boolean;
  geoLoading: boolean;
  isReady: boolean;
  registeredSack: RegisteredSack | null;
  onTrackingCodeChange: (value: string) => void;
  onSackWeightKgChange: (value: string) => void;
  onFarmerIdChange: (value: string) => void;
  onGoToFarmersTab: () => void;
  onScan: (raw: string) => void;
  onRegister: () => void;
}

export function SackQrPanel({
  trackingCode,
  sackWeightKg,
  farmerId,
  farmers,
  farmersLoading,
  geoLoading,
  isReady,
  registeredSack,
  onTrackingCodeChange,
  onSackWeightKgChange,
  onFarmerIdChange,
  onGoToFarmersTab,
  onScan,
  onRegister,
}: Props) {
  return (
    <div className="space-y-6">
      <Card
        step="B"
        title="Scan pre-printed tracking QR on sack"
        weight="primary"
        badge="Current step"
      >
        <SurfaceInset className="space-y-3 p-4">
          <QrScanner onScan={onScan} title="Scan pre-printed TRACK sticker" />
          <Input
            label="Or enter tracking code manually"
            mono
            value={trackingCode}
            onChange={(e) => onTrackingCodeChange(e.target.value)}
            placeholder="WS-QR-00012345"
          />
          <FarmerSelect
            label="Farmer (same as cherry intake)"
            farmerId={farmerId}
            farmers={farmers}
            loading={farmersLoading}
            onChange={onFarmerIdChange}
            onGoToFarmersTab={onGoToFarmersTab}
          />
          <Input
            label="Processed green coffee weight (kg)"
            mono
            value={sackWeightKg}
            onChange={(e) => onSackWeightKgChange(e.target.value)}
            placeholder="e.g. 60"
            required
          />
          <BodyText muted className="text-xs leading-relaxed">
            Weight of this sack <strong>after</strong> washing, pulping, and drying — not the fresh
            cherry weight from intake. Cherry often loses roughly half its weight during processing
            (e.g. 120 kg cherries → ~60 kg green coffee in the sack).
          </BodyText>
          <Button
            onClick={onRegister}
            disabled={geoLoading || !isReady || !farmerId || !sackWeightKg.trim()}
          >
            {geoLoading ? "Capturing GPS..." : "Register tracking QR + GPS"}
          </Button>
          {registeredSack ? (
            <div className="space-y-3">
              <QrCodeDisplay
                value={registeredSack.trackingQrPayload}
                label="Internal TRACK QR — affix to sack"
              />
              <p className="text-xs text-slate-600">
                Code:{" "}
                <DataValue className="font-semibold">{registeredSack.trackingCode}</DataValue>
              </p>
            </div>
          ) : null}
        </SurfaceInset>
      </Card>

      {registeredSack?.timeline ? (
        <Card title="Sack lifecycle (internal tracking)" weight="secondary">
          <LifecycleTimeline
            currentStage={registeredSack.timeline.currentStage as "AT_WASHING_STATION"}
            locked={registeredSack.timeline.locked}
            events={
              registeredSack.timeline.events as {
                stage: string;
                gps_coordinates: string;
                recorded_at: string;
              }[]
            }
          />
        </Card>
      ) : null}
    </div>
  );
}
