"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/Layout";
import { CustodyReviewPanel } from "@/components/port/CustodyReviewPanel";
import { PortClearancePanel } from "@/components/port/PortClearancePanel";
import { PortSectionNav, type PortSection } from "@/components/port/PortSectionNav";
import { PortTrackScanPanel } from "@/components/port/PortTrackScanPanel";
import { FormErrorBanner, FormSuccessBanner } from "@/components/ui/FormFeedback";
import { BodyText, DashboardHeroStrip, DataValue } from "@/components/ui/typography";
import { useAuth } from "@/hooks/useAuth";
import { useGeolocation } from "@/hooks/useGeolocation";
import { STAGE_LABELS, parseTrackingCode } from "@/lib/lifecycle";
import type { OperatorRole } from "@/lib/roles";
import { advanceLifecycle, getApiErrorMessage, getLifecycleTimeline } from "@/services/api";

const ALLOWED_ROLES: OperatorRole[] = ["PORT", "ADMIN"];
const TARGET_STAGE = "PORT_LOCKED" as const;

function stageNumber(): string {
  return STAGE_LABELS[TARGET_STAGE]?.match(/^(\d+)/)?.[1] ?? "5";
}

const HERO_BY_SECTION: Record<
  PortSection,
  { label: string; getValue: (ctx: HeroContext) => string; unit?: string }
> = {
  "track-scan": {
    label: "Tracking code",
    getValue: (ctx) => ctx.trackingCode || "—",
  },
  "port-clearance": {
    label: "Target lifecycle stage",
    getValue: () => stageNumber(),
  },
  "custody-review": {
    label: "Custody events",
    getValue: (ctx) => (ctx.eventCount !== null ? String(ctx.eventCount) : "—"),
  },
};

interface HeroContext {
  trackingCode: string;
  eventCount: number | null;
}

export function PortDashboard() {
  const { operator } = useAuth();
  const { capture, toCoordinateString, loading: geoLoading } = useGeolocation();

  const [activeSection, setActiveSection] = useState<PortSection>("track-scan");
  const [trackingCode, setTrackingCode] = useState("");
  const [timeline, setTimeline] = useState<Awaited<
    ReturnType<typeof getLifecycleTimeline>
  > | null>(null);
  const [timelineLoading, setTimelineLoading] = useState(false);
  const [stageRecorded, setStageRecorded] = useState(false);
  const [message, setMessage] = useState<React.ReactNode | null>(null);
  const [error, setError] = useState<string | null>(null);

  const heroContext: HeroContext = {
    trackingCode,
    eventCount: timeline?.events.length ?? null,
  };
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
      setStageRecorded(data.currentStage === TARGET_STAGE || data.locked);
      setActiveSection("port-clearance");
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
      setActiveSection("custody-review");
    } catch (err) {
      setError(getApiErrorMessage(err, "Stage advance failed"));
    }
  };

  const heroSublabel =
    activeSection === "custody-review"
      ? timeline?.locked
        ? "Shipment locked — ready for export"
        : "Review full supply chain record"
      : STAGE_LABELS[TARGET_STAGE];

  return (
    <DashboardLayout title="Port" allowedRoles={ALLOWED_ROLES}>
      <DashboardHeroStrip
        label={heroConfig.label}
        value={heroValue}
        unit={heroConfig.unit}
        sublabel={heroSublabel}
        valueClassName={stageRecorded && activeSection === "port-clearance" ? "text-forest" : undefined}
      />

      <BodyText muted className="mb-4">
        Scan the <strong>container or pallet QR</strong> at port clearance. Record the final{" "}
        <strong>PORT_LOCKED</strong> stage with GPS — the last custody checkpoint before export
        departure.
      </BodyText>

      <PortSectionNav
        active={activeSection}
        onChange={setActiveSection}
        stageRecorded={stageRecorded}
      />

      {activeSection === "track-scan" ? (
        <PortTrackScanPanel
          trackingCode={trackingCode}
          loading={timelineLoading}
          timeline={timeline}
          onTrackingCodeChange={setTrackingCode}
          onScan={onScan}
          onLoadTimeline={loadTimeline}
        />
      ) : null}

      {activeSection === "port-clearance" ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <PortClearancePanel
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
                {timeline.locked ? "This shipment is locked and ready for export." : "Awaiting final port lock at this checkpoint."}
              </p>
            </div>
          ) : null}
        </div>
      ) : null}

      {activeSection === "custody-review" ? (
        <CustodyReviewPanel trackingCode={trackingCode} timeline={timeline} />
      ) : null}

      {error ? <FormErrorBanner className="mt-6">{error}</FormErrorBanner> : null}
      {message ? <FormSuccessBanner className="mt-6">{message}</FormSuccessBanner> : null}
    </DashboardLayout>
  );
}
