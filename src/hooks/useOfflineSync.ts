"use client";

import { useCallback, useEffect, useState } from "react";
import { submitDelivery } from "@/services/api";
import {
  countFailedDeliveries,
  countPendingDeliveries,
  getFailedDeliveries,
  getPendingDeliveries,
  markDeliveryFailed,
  markDeliveryPending,
  markDeliverySynced,
} from "@/services/offlineDb";

export function useOfflineSync() {
  const [pendingCount, setPendingCount] = useState(0);
  const [failedCount, setFailedCount] = useState(0);
  const [failedRecords, setFailedRecords] = useState<
    Awaited<ReturnType<typeof getFailedDeliveries>>
  >([]);
  const [syncing, setSyncing] = useState(false);

  const refreshCount = useCallback(async () => {
    const [pending, failed, failedList] = await Promise.all([
      countPendingDeliveries(),
      countFailedDeliveries(),
      getFailedDeliveries(),
    ]);
    setPendingCount(pending);
    setFailedCount(failed);
    setFailedRecords(failedList);
  }, []);

  const syncPending = useCallback(async () => {
    if (!navigator.onLine) return;

    setSyncing(true);
    try {
      const pending = await getPendingDeliveries();
      for (const record of pending) {
        if (!record.id) continue;
        try {
          const { id: _id, createdAt: _c, syncStatus: _s, errorMessage: _e, ...payload } = record;
          await submitDelivery(payload);
          await markDeliverySynced(record.id);
        } catch (error) {
          const message = error instanceof Error ? error.message : "Sync failed";
          await markDeliveryFailed(record.id, message);
        }
      }
    } finally {
      await refreshCount();
      setSyncing(false);
    }
  }, [refreshCount]);

  const retryFailed = useCallback(async () => {
    for (const record of failedRecords) {
      if (record.id) {
        await markDeliveryPending(record.id);
      }
    }
    await refreshCount();
    await syncPending();
  }, [failedRecords, refreshCount, syncPending]);

  useEffect(() => {
    refreshCount();
    const onOnline = () => syncPending();
    window.addEventListener("online", onOnline);
    return () => window.removeEventListener("online", onOnline);
  }, [refreshCount, syncPending]);

  return {
    pendingCount,
    failedCount,
    failedRecords,
    syncing,
    syncPending,
    retryFailed,
    refreshCount,
  };
}
