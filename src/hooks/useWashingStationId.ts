"use client";

import { useEffect, useState } from "react";
import type { Operator } from "@/lib/auth";

/**
 * Washing-station scope for dashboards. Operators bound to a station use that ID;
 * ADMIN (or unscoped roles) must pick a station explicitly — no silent fallback.
 */
export function useWashingStationId(operator: Operator | null | undefined) {
  const [stationId, setStationId] = useState(operator?.washingStationId ?? "");

  useEffect(() => {
    if (operator?.washingStationId) {
      setStationId(operator.washingStationId);
    }
  }, [operator?.washingStationId]);

  const editable = !operator?.washingStationId || operator.role === "ADMIN";
  const isReady = stationId.trim().length > 0;

  return { stationId, setStationId, editable, isReady };
}
