"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { DashboardLayout } from "@/components/Layout";
import { RollupJobPanel } from "@/components/rollup/RollupJobPanel";
import { CherryIntakePanel } from "@/components/washing-station/CherryIntakePanel";
import { FarmersPanel } from "@/components/washing-station/FarmersPanel";
import { OfflineSyncPanel } from "@/components/washing-station/OfflineSyncPanel";
import { SackQrPanel } from "@/components/washing-station/SackQrPanel";
import { StationScopePanel } from "@/components/washing-station/StationScopePanel";
import {
  WashingStationSectionNav,
  type WashingStationSection,
} from "@/components/washing-station/WashingStationSectionNav";
import { FormErrorBanner, FormSuccessBanner } from "@/components/ui/FormFeedback";
import { BodyText, DashboardHeroStrip } from "@/components/ui/typography";
import { useAuth } from "@/hooks/useAuth";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useOfflineSync } from "@/hooks/useOfflineSync";
import { useWashingStationId } from "@/hooks/useWashingStationId";
import { parseTrackingCode } from "@/lib/lifecycle";
import type { OperatorRole } from "@/lib/roles";
import {
  getApiErrorMessage,
  isOfflineEligibleError,
  listIntakeFarmers,
  registerPrePrintedTrackingQr,
  submitDelivery,
  type FarmerSummary,
} from "@/services/api";
import { queueOfflineDelivery } from "@/services/offlineDb";

const ALLOWED_ROLES: OperatorRole[] = ["WASHING_STATION", "ADMIN"];

const HERO_BY_SECTION: Record<
  WashingStationSection,
  { label: string; getValue: (ctx: HeroContext) => string; unit?: string }
> = {
  farmers: {
    label: "Registered farmers",
    getValue: (ctx) => String(ctx.farmerCount),
  },
  intake: {
    label: "Cherry intake weight",
    getValue: (ctx) => ctx.weightKg,
    unit: "kg",
  },
  "sack-qr": {
    label: "Tracking code",
    getValue: (ctx) => ctx.trackingCode || "—",
  },
  rollup: {
    label: "Rollup period",
    getValue: (ctx) => ctx.targetPeriod,
  },
  offline: {
    label: "Pending sync",
    getValue: (ctx) => String(ctx.pendingCount),
  },
};

interface HeroContext {
  weightKg: string;
  trackingCode: string;
  targetPeriod: string;
  pendingCount: number;
  farmerId: string;
  farmerCount: number;
  washingStationId: string;
}

export function WashingStationDashboard() {
  const { operator } = useAuth();
  const {
    stationId,
    setStationId,
    editable: stationEditable,
    isReady,
    isBoundToStation,
  } = useWashingStationId(operator);
  const { capture, toCoordinateString, loading: geoLoading } = useGeolocation();
  const { pendingCount, failedCount, failedRecords, syncing, syncPending, retryFailed, clearFailed, refreshCount } =
    useOfflineSync();

  const [activeSection, setActiveSection] = useState<WashingStationSection>("intake");
  const [farmerId, setFarmerId] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [sackWeightKg, setSackWeightKg] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [regionCode, setRegionCode] = useState("");
  const [trackingCode, setTrackingCode] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [registeredSack, setRegisteredSack] = useState<{
    trackingCode: string;
    trackingQrPayload: string;
    timeline: { currentStage: string; locked: boolean; events: unknown[] };
  } | null>(null);
  const [farmers, setFarmers] = useState<FarmerSummary[]>([]);
  const [farmerCount, setFarmerCount] = useState(0);
  const [farmersLoading, setFarmersLoading] = useState(false);

  const washingStationId = stationId;
  const today = new Date().toISOString().slice(0, 10);
  const targetPeriod = today.slice(0, 7);

  const heroContext: HeroContext = {
    weightKg,
    trackingCode,
    targetPeriod,
    pendingCount,
    farmerId,
    farmerCount,
    washingStationId,
  };

  const heroConfig = HERO_BY_SECTION[activeSection];
  const heroValue = heroConfig.getValue(heroContext);

  const clearFeedback = () => {
    setMessage(null);
    setError(null);
  };

  const refreshFarmersForDropdown = useCallback(async () => {
    if (!isReady) {
      setFarmers([]);
      setFarmerCount(0);
      return;
    }

    setFarmersLoading(true);
    try {
      const data = await listIntakeFarmers({
        washingStationId: isBoundToStation ? undefined : washingStationId,
        page: 1,
        limit: 500,
      });
      setFarmers(data.farmers);
      setFarmerCount(data.total);
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to load farmers for this station"));
    } finally {
      setFarmersLoading(false);
    }
  }, [isBoundToStation, isReady, washingStationId]);

  useEffect(() => {
    void refreshFarmersForDropdown();
  }, [refreshFarmersForDropdown]);

  const onScanTrackingQr = (raw: string) => {
    const code = parseTrackingCode(raw);
    setTrackingCode(code);
    setMessage(`Scanned pre-printed tracking QR: ${code}`);
    setError(null);
  };

  const onSubmitDelivery = async (event: FormEvent) => {
    event.preventDefault();
    clearFeedback();

    if (!isReady) {
      setError("Set a washing station ID before logging deliveries.");
      return;
    }

    if (!farmerId.trim() || !weightKg.trim() || !basePrice.trim() || !regionCode.trim()) {
      setError("Fill in all cherry intake fields.");
      return;
    }

    const payload = {
      farmerId: Number(farmerId),
      washingStationId,
      deliveryDate: today,
      weightKg: Number(weightKg),
      basePricePerKg: Number(basePrice),
      regionCode,
      eudrCoordinates: "",
    };

    try {
      const point = await capture();
      payload.eudrCoordinates = toCoordinateString(point);

      try {
        await submitDelivery(payload);
        setMessage(
          `Cherry intake logged for farmer ${farmerId}. Process coffee, then scan the pre-printed sack QR.`,
        );
        setActiveSection("sack-qr");
      } catch (submitError) {
        if (isOfflineEligibleError(submitError)) {
          await queueOfflineDelivery(payload);
          await refreshCount();
          setMessage(
            "Could not reach the server — delivery saved locally. Use Sync pending deliveries when the backend is available.",
          );
          setActiveSection("offline");
        } else {
          setError(getApiErrorMessage(submitError, "Failed to log cherry delivery"));
        }
      }
    } catch (err) {
      setError(getApiErrorMessage(err, "GPS required for farm provenance"));
    }
  };

  const onRegisterTrackingQr = async () => {
    clearFeedback();
    setRegisteredSack(null);

    if (!trackingCode.trim()) {
      setError("Scan or enter the pre-printed tracking QR on the sack.");
      return;
    }

    if (!isReady) {
      setError("Set a washing station ID before registering tracking QR.");
      return;
    }

    try {
      const point = await capture();
      const gps = toCoordinateString(point);
      const result = await registerPrePrintedTrackingQr({
        trackingCode: parseTrackingCode(trackingCode),
        washingStationId,
        farmerId: Number(farmerId),
        sackWeightKg: Number(sackWeightKg),
        gpsCoordinates: gps,
        eudrCoordinates: gps,
      });
      setRegisteredSack(result);
      setMessage(result.message);
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to register tracking QR"));
    }
  };

  return (
    <DashboardLayout title="Washing Station" allowedRoles={ALLOWED_ROLES}>
      <DashboardHeroStrip
        label={heroConfig.label}
        value={heroValue}
        unit={heroConfig.unit}
        sublabel={`Farmer ${farmerId.trim() ? `#${farmerId}` : "—"} · ${targetPeriod} · ${washingStationId || "Set station ID"}`}
      />

      <BodyText muted className="mb-4">
        Farmers deliver harvest only — no QR at farm. After processing, scan the{" "}
        <strong>pre-printed tracking QR</strong> on each export sack to bind it to farmer data.
        Exporter, warehouse, and port continue using this internal TRACK code. The public buyer
        passport QR is issued later at exporter.
      </BodyText>

      <StationScopePanel
        stationId={stationId}
        onStationIdChange={setStationId}
        isReady={isReady}
        editable={stationEditable}
        isBoundToStation={isBoundToStation}
      />

      <WashingStationSectionNav
        active={activeSection}
        onChange={setActiveSection}
        offlinePendingCount={pendingCount}
        offlineFailedCount={failedCount}
      />

      {activeSection === "farmers" ? (
        <FarmersPanel
          isReady={isReady}
          isBoundToStation={isBoundToStation}
          washingStationId={washingStationId}
          onFarmersChanged={refreshFarmersForDropdown}
        />
      ) : null}

      {activeSection === "intake" ? (
        <CherryIntakePanel
          farmerId={farmerId}
          farmers={farmers}
          farmersLoading={farmersLoading}
          weightKg={weightKg}
          basePrice={basePrice}
          regionCode={regionCode}
          geoLoading={geoLoading}
          isReady={isReady}
          onFarmerIdChange={setFarmerId}
          onWeightKgChange={setWeightKg}
          onBasePriceChange={setBasePrice}
          onRegionCodeChange={setRegionCode}
          onGoToFarmersTab={() => setActiveSection("farmers")}
          onSubmit={onSubmitDelivery}
        />
      ) : null}

      {activeSection === "sack-qr" ? (
        <SackQrPanel
          trackingCode={trackingCode}
          sackWeightKg={sackWeightKg}
          farmerId={farmerId}
          geoLoading={geoLoading}
          isReady={isReady}
          registeredSack={registeredSack}
          onTrackingCodeChange={setTrackingCode}
          onSackWeightKgChange={setSackWeightKg}
          onFarmerIdChange={setFarmerId}
          onScan={onScanTrackingQr}
          onRegister={onRegisterTrackingQr}
        />
      ) : null}

      {activeSection === "rollup" ? (
        <RollupJobPanel washingStationId={washingStationId} defaultTargetPeriod={targetPeriod} />
      ) : null}

      {activeSection === "offline" ? (
        <OfflineSyncPanel
          pendingCount={pendingCount}
          failedCount={failedCount}
          failedRecords={failedRecords}
          syncing={syncing}
          onSyncPending={syncPending}
          onRetryFailed={retryFailed}
          onClearFailed={clearFailed}
        />
      ) : null}

      {error ? <FormErrorBanner className="mt-6">{error}</FormErrorBanner> : null}
      {message ? <FormSuccessBanner className="mt-6">{message}</FormSuccessBanner> : null}
    </DashboardLayout>
  );
}
