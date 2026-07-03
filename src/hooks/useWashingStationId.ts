"use client";

import { useEffect, useState } from "react";
import type { Operator } from "@/lib/auth";

const DEMO_STATION_ID = "WS-001";

/**
 * Washing-station scope for dashboards.
 * Bound WS operators always use their account station (not editable).
 * ADMIN must pick a station explicitly.
 */
export function useWashingStationId(operator: Operator | null | undefined) {
  const boundStationId = operator?.washingStationId?.trim() ?? "";
  const [adminStationId, setAdminStationId] = useState(
    operator?.role === "ADMIN" ? DEMO_STATION_ID : "",
  );

  useEffect(() => {
    if (operator?.role === "ADMIN" && !boundStationId) {
      setAdminStationId((current) => current || DEMO_STATION_ID);
    }
  }, [operator?.role, boundStationId]);

  const isBoundToStation =
    operator?.role === "WASHING_STATION" && boundStationId.length > 0;
  const stationId = isBoundToStation ? boundStationId : adminStationId;
  const editable = operator?.role === "ADMIN" && !isBoundToStation;
  const isReady = stationId.trim().length > 0;

  return {
    stationId,
    setStationId: setAdminStationId,
    editable,
    isReady,
    isBoundToStation,
    boundStationId,
  };
}
