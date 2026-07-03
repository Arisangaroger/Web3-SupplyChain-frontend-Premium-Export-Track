"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { SurfaceInset } from "@/components/ui/SurfaceInset";
import { FormErrorBanner } from "@/components/ui/FormFeedback";
import { EmptyStatePanel } from "@/components/ui/EmptyStatePanel";
import { LoadingStatePanel } from "@/components/ui/LoadingStatePanel";
import { BodyText, DashboardHeroStrip, DataValue, TypeLabel } from "@/components/ui/typography";
import { getApiErrorMessage, getRollupJobStatus, runRollup } from "@/services/api";

interface RollupResult {
  merkleRoot?: string;
  queueJobId?: string | null;
  anchorStatus?: string;
  farmerCount?: number;
  targetPeriod?: string;
}

interface JobStatus {
  found: boolean;
  state?: string;
  returnvalue?: { txHash?: string; blockNumber?: number; contractAddress?: string };
  failedReason?: string;
}

interface Props {
  washingStationId: string;
  defaultTargetPeriod?: string;
}

export function RollupJobPanel({ washingStationId, defaultTargetPeriod }: Props) {
  const today = new Date().toISOString().slice(0, 7);
  const [targetPeriod, setTargetPeriod] = useState(defaultTargetPeriod ?? today);
  const [skipAnchor, setSkipAnchor] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rollupResult, setRollupResult] = useState<RollupResult | null>(null);
  const [jobStatus, setJobStatus] = useState<JobStatus | null>(null);
  const [message, setMessage] = useState<React.ReactNode | null>(null);
  const [isError, setIsError] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  const pollJob = useCallback(
    (jobId: string) => {
      stopPolling();
      pollRef.current = setInterval(async () => {
        try {
          const status = (await getRollupJobStatus(jobId)) as JobStatus;
          setJobStatus(status);

          if (!status.found) {
            stopPolling();
            return;
          }

          const terminal = ["completed", "failed"];
          if (status.state && terminal.includes(status.state)) {
            stopPolling();
            if (status.state === "completed" && status.returnvalue?.txHash) {
              setMessage(
                <>
                  Anchor confirmed on-chain. Tx:{" "}
                  <DataValue size="xs" className="break-all">
                    {status.returnvalue.txHash}
                  </DataValue>
                </>,
              );
              setIsError(false);
            } else if (status.state === "failed") {
              setMessage(status.failedReason ?? "Blockchain anchor job failed");
              setIsError(true);
            }
          }
        } catch {
          stopPolling();
        }
      }, 2000);
    },
    [stopPolling],
  );

  useEffect(() => () => stopPolling(), [stopPolling]);

  const onRunRollup = async () => {
    setLoading(true);
    setMessage(null);
    setIsError(false);
    setRollupResult(null);
    setJobStatus(null);
    stopPolling();

    try {
      const result = (await runRollup(washingStationId, targetPeriod, {
        skipAnchor,
      })) as RollupResult;
      setRollupResult(result);

      if (result.queueJobId) {
        setMessage("Rollup computed — blockchain job queued. Tracking status…");
        setIsError(false);
        pollJob(result.queueJobId);
      } else if (skipAnchor) {
        setMessage("Rollup completed (anchor skipped). Merkle root stored in database.");
        setIsError(false);
      } else {
        setMessage("Rollup completed. No anchor job was queued.");
        setIsError(false);
      }
    } catch (err) {
      setMessage(getApiErrorMessage(err, "Rollup failed"));
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Monthly rollup" weight="secondary">
      {loading ? (
        <LoadingStatePanel label="Computing Merkle root…" />
      ) : rollupResult?.farmerCount != null ? (
        <DashboardHeroStrip
          label="Farmers in rollup"
          value={rollupResult.farmerCount}
          sublabel={`Period ${rollupResult.targetPeriod ?? targetPeriod} · ${rollupResult.anchorStatus ?? "pending"}`}
          className="mb-4 border-none pb-0"
        />
      ) : (
        <div className="mb-4">
          <EmptyStatePanel
            compact
            icon="chain"
            title="No rollup run yet"
            description="Pick a month and run the rollup to save farmer data on-chain."
          />
        </div>
      )}
      <SurfaceInset className="space-y-3 p-4">
        <Input
          label="Target period (YYYY-MM)"
          mono
          value={targetPeriod}
          onChange={(e) => setTargetPeriod(e.target.value)}
          placeholder="2026-06"
        />
        <label className="flex items-center gap-2 type-body text-slate-700">
          <input
            type="checkbox"
            checked={skipAnchor}
            onChange={(e) => setSkipAnchor(e.target.checked)}
            className="rounded border-slate-300"
          />
          Skip on-chain anchor (compute Merkle root only)
        </label>
        <Button onClick={onRunRollup} disabled={loading || !targetPeriod || !washingStationId.trim()}>
          {loading ? "Running rollup…" : "Run monthly rollup"}
        </Button>

        {rollupResult ? (
          <div className="surface-inset p-3 type-body">
            <TypeLabel>
              Period:{" "}
              <DataValue className="font-semibold">
                {rollupResult.targetPeriod ?? targetPeriod}
              </DataValue>
            </TypeLabel>
            <p>
              Farmers:{" "}
              <DataValue className="font-semibold">{rollupResult.farmerCount ?? "—"}</DataValue> ·
              Status:{" "}
              <DataValue className="font-semibold">{rollupResult.anchorStatus ?? "—"}</DataValue>
            </p>
            {rollupResult.merkleRoot ? (
              <p className="mt-1 break-all font-data text-xs">
                Root: {rollupResult.merkleRoot}
              </p>
            ) : null}
            {rollupResult.queueJobId ? (
              <p className="mt-1 font-data text-xs">
                Job ID: <DataValue size="xs">{rollupResult.queueJobId}</DataValue>
              </p>
            ) : null}
          </div>
        ) : null}

        {jobStatus?.found ? (
          <div className="surface-inset p-3 text-sm ring-1 ring-forest/10">
            <p>
              Queue state:{" "}
              <DataValue className="font-semibold uppercase">{jobStatus.state}</DataValue>
            </p>
            {jobStatus.returnvalue?.txHash ? (
              <p className="mt-1 break-all font-data text-xs">
                Tx hash: {jobStatus.returnvalue.txHash}
              </p>
            ) : null}
            {jobStatus.failedReason ? (
              <p className="mt-1 text-red-600">{jobStatus.failedReason}</p>
            ) : null}
          </div>
        ) : null}

        {message ? (
          <BodyText className={isError ? "text-red-600" : "text-forest"}>{message}</BodyText>
        ) : null}
      </SurfaceInset>
    </Card>
  );
}
