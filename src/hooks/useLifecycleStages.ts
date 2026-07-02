"use client";

import { useEffect, useState } from "react";
import { getLifecycleStages } from "@/services/api";
import { LIFECYCLE_STAGES, STAGE_LABELS, type LifecycleStage } from "@/lib/lifecycle";

export function useLifecycleStages() {
  const [labels, setLabels] = useState<Record<string, string>>(STAGE_LABELS);

  useEffect(() => {
    getLifecycleStages()
      .then((data) => {
        if (data && typeof data === "object" && !Array.isArray(data)) {
          setLabels((prev) => ({ ...prev, ...(data as Record<string, string>) }));
        }
      })
      .catch(() => {
        /* keep local fallback */
      });
  }, []);

  return { stages: LIFECYCLE_STAGES, labels };
}
