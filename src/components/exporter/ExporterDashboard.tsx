"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/Layout";
import { BuyerPassportPanel } from "@/components/exporter/BuyerPassportPanel";
import {
  ExporterSectionNav,
  type ExporterSection,
} from "@/components/exporter/ExporterSectionNav";
import { LotOperationsSection } from "@/components/exporter/LotOperationsSection";
import { TrackScanPanel } from "@/components/exporter/TrackScanPanel";
import { StationScopePanel } from "@/components/washing-station/StationScopePanel";
import { FormErrorBanner, FormSuccessBanner } from "@/components/ui/FormFeedback";
import { BodyText, DashboardHeroStrip, DataValue } from "@/components/ui/typography";
import { useAuth } from "@/hooks/useAuth";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useWashingStationId } from "@/hooks/useWashingStationId";
import { STAGE_LABELS, parseTrackingCode } from "@/lib/lifecycle";
import type { OperatorRole } from "@/lib/roles";
import { getApiErrorMessage, getLifecycleTimeline, issueBuyerPassport } from "@/services/api";

const ALLOWED_ROLES: OperatorRole[] = ["EXPORTER", "ADMIN"];

const HERO_BY_SECTION: Record<
  ExporterSection,
  {
    label: string;
    getValue: (ctx: HeroContext) => string;
    unit?: string;
    valueClassName?: string;
  }
> = {
  "track-scan": {
    label: "Tracking code",
    getValue: (ctx) => ctx.trackingCode || "—",
  },
  "buyer-passport": {
    label: "Buyer passport",
    getValue: (ctx) =>
      ctx.passportSlug
        ? ctx.passportSlug.replace(/^PASSPORT-/i, "").slice(-6).toUpperCase()
        : ctx.finalizedWeightKg || "2",
    unit: undefined,
    valueClassName: undefined,
  },
  "lot-operations": {
    label: "Station scope",
    getValue: (ctx) => ctx.stationId || "Set station ID",
  },
};

interface HeroContext {
  trackingCode: string;
  finalizedWeightKg: string;
  passportSlug: string | null;
  stationId: string;
}

export function ExporterDashboard() {
  const { operator } = useAuth();
  const { stationId, setStationId, editable: stationEditable, isReady } =
    useWashingStationId(operator);
  const { capture, toCoordinateString, loading: geoLoading } = useGeolocation();

  const [activeSection, setActiveSection] = useState<ExporterSection>("track-scan");
  const [trackingCode, setTrackingCode] = useState("");
  const [finalizedWeightKg, setFinalizedWeightKg] = useState("");
  const [timeline, setTimeline] = useState<Awaited<
    ReturnType<typeof getLifecycleTimeline>
  > | null>(null);
  const [timelineLoading, setTimelineLoading] = useState(false);
  const [passport, setPassport] = useState<{
    passportSlug: string;
    passportQrPayload: string;
    buyerPassportPath: string;
  } | null>(null);
  const [message, setMessage] = useState<React.ReactNode | null>(null);
  const [error, setError] = useState<string | null>(null);

  const heroContext: HeroContext = {
    trackingCode,
    finalizedWeightKg,
    passportSlug: passport?.passportSlug ?? timeline?.passportSlug ?? null,
    stationId,
  };

  const heroConfig = HERO_BY_SECTION[activeSection];
  let heroValue = heroConfig.getValue(heroContext);
  let heroUnit = heroConfig.unit;
  let heroValueClassName = heroConfig.valueClassName;

  if (activeSection === "buyer-passport") {
    if (finalizedWeightKg && !passport) {
      heroValue = finalizedWeightKg;
      heroUnit = "kg";
      heroValueClassName = "text-forest";
    } else if (passport || timeline?.passportSlug) {
      heroValueClassName = "text-forest";
    } else {
      heroValueClassName = "text-amber";
    }
  }

  const clearFeedback = () => {
    setMessage(null);
    setError(null);
  };

  const onScan = (code: string) => {
    const parsed = parseTrackingCode(code);
    setTrackingCode(parsed);
    setMessage(
      <>
        Scanned internal tracking QR: <DataValue className="font-semibold">{parsed}</DataValue>
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
      setActiveSection("buyer-passport");
    } catch (err) {
      setTimeline(null);
      setError(getApiErrorMessage(err, "Timeline not found"));
    } finally {
      setTimelineLoading(false);
    }
  };

  const onIssuePassport = async () => {
    clearFeedback();
    setPassport(null);

    if (!trackingCode.trim()) {
      setError("Scan the internal TRACK QR from the export sack first.");
      return;
    }

    try {
      const point = await capture();
      const gps = toCoordinateString(point);
      const code = parseTrackingCode(trackingCode);
      const result = await issueBuyerPassport({
        trackingCode: code,
        gpsCoordinates: gps,
        finalizedWeightKg: finalizedWeightKg ? Number(finalizedWeightKg) : undefined,
      });
      setTimeline(result.timeline);
      setPassport({
        passportSlug: result.passportSlug,
        passportQrPayload: result.passportQrPayload,
        buyerPassportPath: result.buyerPassportPath,
      });
      setMessage(result.message);
    } catch (err) {
      setError(getApiErrorMessage(err, "Export lot sealing failed"));
    }
  };

  const heroSublabel =
    activeSection === "buyer-passport" && (passport?.passportSlug ?? timeline?.passportSlug)
      ? (passport?.passportSlug ?? timeline?.passportSlug)!
      : activeSection === "lot-operations"
        ? "Batch split, merge & validation"
        : STAGE_LABELS.AT_EXPORT_LOT;

  return (
    <DashboardLayout title="Exporter" allowedRoles={ALLOWED_ROLES}>
      <DashboardHeroStrip
        label={heroConfig.label}
        value={heroValue}
        unit={heroUnit}
        sublabel={heroSublabel}
        valueClassName={heroValueClassName}
      />

      <BodyText muted className="mb-4">
        Scan the <strong>tracking code</strong> from the washing station sack. After sorting, seal
        the lot and print the <strong>buyer passport QR</strong> for importers.
      </BodyText>

      <StationScopePanel
        stationId={stationId}
        onStationIdChange={setStationId}
        isReady={isReady}
        editable={stationEditable}
      />

      <ExporterSectionNav
        active={activeSection}
        onChange={setActiveSection}
        passportReady={Boolean(passport ?? timeline?.passportSlug)}
      />

      {activeSection === "track-scan" ? (
        <TrackScanPanel
          trackingCode={trackingCode}
          loading={timelineLoading}
          timeline={timeline}
          onTrackingCodeChange={setTrackingCode}
          onScan={onScan}
          onLoadTimeline={loadTimeline}
        />
      ) : null}

      {activeSection === "buyer-passport" ? (
        <BuyerPassportPanel
          trackingCode={trackingCode}
          finalizedWeightKg={finalizedWeightKg}
          geoLoading={geoLoading}
          passport={passport}
          onTrackingCodeChange={setTrackingCode}
          onFinalizedWeightKgChange={setFinalizedWeightKg}
          onIssuePassport={onIssuePassport}
        />
      ) : null}

      {activeSection === "lot-operations" ? (
        <LotOperationsSection
          isReady={isReady}
          stationId={stationId}
          stationEditable={stationEditable}
          onStationIdChange={setStationId}
        />
      ) : null}

      {error ? <FormErrorBanner className="mt-6">{error}</FormErrorBanner> : null}
      {message ? <FormSuccessBanner className="mt-6">{message}</FormSuccessBanner> : null}
    </DashboardLayout>
  );
}
