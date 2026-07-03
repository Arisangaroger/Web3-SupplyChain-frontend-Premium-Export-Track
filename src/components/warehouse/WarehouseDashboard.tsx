"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/Layout";
import { StorageIntakePanel } from "@/components/warehouse/StorageIntakePanel";
import { WarehouseLotOperationsSection } from "@/components/warehouse/WarehouseLotOperationsSection";
import {
  WarehouseSectionNav,
  type WarehouseSection,
} from "@/components/warehouse/WarehouseSectionNav";
import { WarehouseTrackScanPanel } from "@/components/warehouse/WarehouseTrackScanPanel";
import { FormErrorBanner, FormSuccessBanner } from "@/components/ui/FormFeedback";
import { BodyText, DashboardHeroStrip, DataValue } from "@/components/ui/typography";
import { useAuth } from "@/hooks/useAuth";
import { useGeolocation } from "@/hooks/useGeolocation";
import { STAGE_LABELS, parseTrackingCode } from "@/lib/lifecycle";
import type { OperatorRole } from "@/lib/roles";
import { advanceLifecycle, getApiErrorMessage, getLifecycleTimeline } from "@/services/api";

const ALLOWED_ROLES: OperatorRole[] = ["WAREHOUSE", "ADMIN"];
const TARGET_STAGE = "AT_WAREHOUSE" as const;

function stageNumber(): string {
  return STAGE_LABELS[TARGET_STAGE]?.match(/^(\d+)/)?.[1] ?? "4";
}

const HERO_BY_SECTION: Record<
  WarehouseSection,
  { label: string; getValue: (ctx: HeroContext) => string; unit?: string }
> = {
  "track-scan": {
    label: "Tracking code",
    getValue: (ctx) => ctx.trackingCode || "—",
  },
  "storage-intake": {
    label: "Current step",
    getValue: () => stageNumber(),
  },
  "lot-operations": {
    label: "Warehouse stage",
    getValue: () => stageNumber(),
  },
};

interface HeroContext {
  trackingCode: string;
}

export function WarehouseDashboard() {
  const { operator } = useAuth();
  const { capture, toCoordinateString, loading: geoLoading } = useGeolocation();

  const [activeSection, setActiveSection] = useState<WarehouseSection>("track-scan");
  const [trackingCode, setTrackingCode] = useState("");
  const [timeline, setTimeline] = useState<Awaited<
    ReturnType<typeof getLifecycleTimeline>
  > | null>(null);
  const [timelineLoading, setTimelineLoading] = useState(false);
  const [stageRecorded, setStageRecorded] = useState(false);
  const [message, setMessage] = useState<React.ReactNode | null>(null);
  const [error, setError] = useState<string | null>(null);

  const heroContext: HeroContext = { trackingCode };
  const heroConfig = HERO_BY_SECTION[activeSection];
  const heroValue = heroConfig.getValue(heroContext);

  const clearFeedback = () => {
    setMessage(null);
    setError(null);
  };

  const onScan = (code: string) => {
    const parsed = parseTrackingCode(code);
    setTrackingCode(parsed);
    setMessage(
      <>
        Scanned: <DataValue className="font-semibold">{parsed}</DataValue>
      </>,
    );
    setError(null);
  };

  const loadTimeline = async () => {
    clearFeedback();
    setTimelineLoading(true);
    try {
      const code = parseTrackingCode(trackingCode);
      const data = await getLifecycleTimeline(code);
      setTimeline(data);
      setStageRecorded(data.currentStage === TARGET_STAGE);
      setActiveSection("storage-intake");
    } catch (err) {
      setTimeline(null);
      setError(getApiErrorMessage(err, "Timeline not found"));
    } finally {
      setTimelineLoading(false);
    }
  };

  const onRecordStage = async () => {
    clearFeedback();
    try {
      const point = await capture();
      const gps = toCoordinateString(point);
      const code = parseTrackingCode(trackingCode);
      const result = await advanceLifecycle({
        trackingCode: code,
        stage: TARGET_STAGE,
        gpsCoordinates: gps,
      });
      setTimeline(result);
      setStageRecorded(true);
      setMessage(
        <>
          Advanced to <DataValue className="font-semibold">{TARGET_STAGE}</DataValue> at{" "}
          <DataValue>{gps}</DataValue>
        </>,
      );
    } catch (err) {
      setError(getApiErrorMessage(err, "Stage advance failed"));
    }
  };

  const heroSublabel =
    activeSection === "lot-operations"
      ? "Lot lookup & check"
      : STAGE_LABELS[TARGET_STAGE];

  return (
    <DashboardLayout title="Warehouse" allowedRoles={ALLOWED_ROLES}>
      <DashboardHeroStrip
        label={heroConfig.label}
        value={heroValue}
        unit={heroConfig.unit}
        sublabel={heroSublabel}
        valueClassName={stageRecorded && activeSection === "storage-intake" ? "text-forest" : undefined}
      />

      <BodyText muted className="mb-4">
        Scan the <strong>tracking code</strong> when goods arrive. Mark them as stored with GPS,
        then trace or check export lots on site.
      </BodyText>

      <WarehouseSectionNav
        active={activeSection}
        onChange={setActiveSection}
        stageRecorded={stageRecorded}
      />

      {activeSection === "track-scan" ? (
        <WarehouseTrackScanPanel
          trackingCode={trackingCode}
          loading={timelineLoading}
          timeline={timeline}
          onTrackingCodeChange={setTrackingCode}
          onScan={onScan}
          onLoadTimeline={loadTimeline}
        />
      ) : null}

      {activeSection === "storage-intake" ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <StorageIntakePanel
            trackingCode={trackingCode}
            operatorRole={operator?.role}
            geoLoading={geoLoading}
            onTrackingCodeChange={setTrackingCode}
            onRecordStage={onRecordStage}
          />
          {timeline ? (
            <div className="rounded-xl border border-forest/10 bg-inset/30 p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Current stage
              </p>
              <p className="mt-2 font-data text-lg font-semibold text-forest">
                {timeline.currentStage.replace(/_/g, " ")}
              </p>
              <p className="mt-2 text-sm text-slate-600">
                {timeline.events.length} step{timeline.events.length === 1 ? "" : "s"}{" "}
                recorded on this sack.
              </p>
            </div>
          ) : null}
        </div>
      ) : null}

      {activeSection === "lot-operations" ? <WarehouseLotOperationsSection /> : null}

      {error ? <FormErrorBanner className="mt-6">{error}</FormErrorBanner> : null}
      {message ? <FormSuccessBanner className="mt-6">{message}</FormSuccessBanner> : null}
    </DashboardLayout>
  );
}
