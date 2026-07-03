"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SurfaceInset } from "@/components/ui/SurfaceInset";
import { BodyText, DataValue } from "@/components/ui/typography";
import { getFailedDeliveries } from "@/services/offlineDb";

type FailedOfflineRecord = Awaited<ReturnType<typeof getFailedDeliveries>>[number];

interface Props {
  pendingCount: number;
  failedCount: number;
  failedRecords: FailedOfflineRecord[];
  syncing: boolean;
  onSyncPending: () => void;
  onRetryFailed: () => void;
  onClearFailed: () => void;
}

export function OfflineSyncPanel({
  pendingCount,
  failedCount,
  failedRecords,
  syncing,
  onSyncPending,
  onRetryFailed,
  onClearFailed,
}: Props) {
  return (
    <Card title="Offline sync queue" weight="tertiary">
      <SurfaceInset className="space-y-3 p-4">
        <BodyText muted>
          Pending offline deliveries:{" "}
          <DataValue className="font-semibold">{pendingCount}</DataValue>
          {failedCount > 0 ? (
            <>
              {" "}
              · Failed:{" "}
              <DataValue className="font-semibold text-red-600">{failedCount}</DataValue>
            </>
          ) : null}
        </BodyText>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button
            variant="secondary"
            onClick={onSyncPending}
            disabled={syncing || pendingCount === 0}
          >
            {syncing ? "Syncing..." : "Sync pending deliveries now"}
          </Button>
          {failedCount > 0 ? (
            <Button variant="ghost" onClick={onRetryFailed} disabled={syncing}>
              Retry failed deliveries
            </Button>
          ) : null}
          {failedCount > 0 ? (
            <Button variant="ghost" onClick={onClearFailed} disabled={syncing}>
              Clear failed list
            </Button>
          ) : null}
        </div>
      </SurfaceInset>
      {failedRecords.length > 0 ? (
        <ul className="mt-3 space-y-2 text-sm text-red-700">
          {failedRecords.map((record) => (
            <li
              key={record.id}
              className="rounded border border-red-100 bg-red-50 p-2 font-data text-xs"
            >
              Farmer <DataValue>{record.farmerId}</DataValue> ·{" "}
              <DataValue>{record.weightKg} kg</DataValue> —{" "}
              <span className="font-sans">{record.errorMessage ?? "Sync failed"}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </Card>
  );
}
