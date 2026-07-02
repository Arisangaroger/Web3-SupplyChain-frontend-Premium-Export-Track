"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { DashboardLayout } from "@/components/Layout";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { SurfaceInset } from "@/components/ui/SurfaceInset";
import { EmptyStatePanel } from "@/components/ui/EmptyStatePanel";
import { FormErrorBanner, FormSuccessBanner } from "@/components/ui/FormFeedback";
import { LoadingStatePanel } from "@/components/ui/LoadingStatePanel";
import { LifecycleTimeline } from "@/components/lifecycle/LifecycleTimeline";
import { QrScanner } from "@/components/qr/QrScanner";
import { useAuth } from "@/hooks/useAuth";
import { useGeolocation } from "@/hooks/useGeolocation";
import { STAGE_LABELS, parseTrackingCode, type LifecycleStage } from "@/lib/lifecycle";
import type { OperatorRole } from "@/lib/roles";
import { advanceLifecycle, getApiErrorMessage, getLifecycleTimeline } from "@/services/api";
import { BodyText, DashboardHeroStrip, DataValue, TypeLabel } from "@/components/ui/typography";

function stageNumber(stage: LifecycleStage): string {
  return STAGE_LABELS[stage]?.match(/^(\d+)/)?.[1] ?? "·";
}

interface Props {
  title: string;
  targetStage: LifecycleStage;
  scanLabel: string;
  allowedRoles: OperatorRole[];
  extraSections?: ReactNode;
}

export function LifecycleDashboard({
  title,
  targetStage,
  scanLabel,
  allowedRoles,
  extraSections,
}: Props) {
  const { operator } = useAuth();
  const { capture, toCoordinateString, loading } = useGeolocation();
  const [trackingCode, setTrackingCode] = useState("");
  const [timeline, setTimeline] = useState<Awaited<
    ReturnType<typeof getLifecycleTimeline>
  > | null>(null);
  const [message, setMessage] = useState<ReactNode | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onScan = (code: string) => {
    const parsed = parseTrackingCode(code);
    setTrackingCode(parsed);
    setMessage(
      <>
        Scanned: <DataValue className="font-semibold">{parsed}</DataValue>
      </>,
    );
  };

  const loadTimeline = async (code: string) => {
    setError(null);
    try {
      const data = await getLifecycleTimeline(code);
      setTimeline(data);
    } catch (err) {
      setTimeline(null);
      setError(getApiErrorMessage(err, "Timeline not found"));
    }
  };

  const onAdvance = async () => {
    setMessage(null);
    setError(null);
    try {
      const point = await capture();
      const gps = toCoordinateString(point);
      const code = parseTrackingCode(trackingCode);
      const result = await advanceLifecycle({
        trackingCode: code,
        stage: targetStage,
        gpsCoordinates: gps,
      });
      setTimeline(result);
      setMessage(
        <>
          Advanced to <DataValue className="font-semibold">{targetStage}</DataValue> at{" "}
          <DataValue>{gps}</DataValue>
        </>,
      );
    } catch (err) {
      setError(getApiErrorMessage(err, "Stage advance failed"));
    }
  };

  return (
    <DashboardLayout title={title} allowedRoles={allowedRoles}>
      <DashboardHeroStrip
        label="Target lifecycle stage"
        value={stageNumber(targetStage)}
        sublabel={STAGE_LABELS[targetStage]}
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <QrScanner onScan={onScan} title={scanLabel} weight="secondary" />

        <Card
          step={stageNumber(targetStage)}
          title="Confirm stage & GPS"
          weight="primary"
          badge="Main action"
        >
          <SurfaceInset className="space-y-3 p-4">
          <Input
              label="Tracking / Lot Code"
              mono
              value={trackingCode}
              onChange={(e) => setTrackingCode(e.target.value)}
            />
            <TypeLabel>
              Operator: {operator?.role} → records stage{" "}
              <DataValue className="font-semibold">{targetStage}</DataValue>
            </TypeLabel>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="ghost"
                onClick={() => loadTimeline(parseTrackingCode(trackingCode))}
                disabled={!trackingCode}
              >
                Load Timeline
              </Button>
              <Button onClick={onAdvance} disabled={loading || !trackingCode}>
                {loading ? "Capturing GPS..." : "Record Stage + Location"}
              </Button>
            </div>
            {error ? <FormErrorBanner>{error}</FormErrorBanner> : null}
            {message ? <FormSuccessBanner>{message}</FormSuccessBanner> : null}
          </SurfaceInset>
        </Card>

        {loading ? (
          <div className="lg:col-span-2">
            <LoadingStatePanel label="Capturing GPS coordinates…" />
          </div>
        ) : timeline ? (
          <Card title="Supply Chain Progress" weight="secondary" className="lg:col-span-2">
            <LifecycleTimeline
              currentStage={timeline.currentStage}
              locked={timeline.locked}
              events={timeline.events}
            />
          </Card>
        ) : (
          <Card title="Supply chain progress" weight="tertiary" className="lg:col-span-2">
            <EmptyStatePanel
              compact
              icon="chain"
              title="No timeline loaded"
              description="Scan a TRACK QR code, enter the tracking ID, and tap Load Timeline to see custody stages and GPS stamps for this sack."
            />
          </Card>
        )}
      </div>

      {extraSections ? <div className="mt-8">{extraSections}</div> : null}
    </DashboardLayout>
  );
}
