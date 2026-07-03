"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { VerificationBadge } from "@/components/ui/VerificationBadge";
import { FormErrorBanner, FormSuccessBanner } from "@/components/ui/FormFeedback";
import { EmptyStatePanel } from "@/components/ui/EmptyStatePanel";
import { LoadingStatePanel } from "@/components/ui/LoadingStatePanel";
import { BodyText, DataTextArea, DataValue, TypeLabel } from "@/components/ui/typography";
import {
  createCooperativeBatch,
  getApiErrorMessage,
  getLotTrace,
  mergeLots,
  splitLot,
  validateLot,
} from "@/services/api";

interface AllocationRow {
  cooperativeBatchId: string;
  allocatedWeightKg: string;
}

interface Props {
  mode: "exporter" | "warehouse";
  washingStationId?: string;
  stationEditable?: boolean;
  onStationIdChange?: (value: string) => void;
}

export function LotOperationsPanel({
  mode,
  washingStationId = "",
  stationEditable = false,
  onStationIdChange,
}: Props) {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [batchFarmerId, setBatchFarmerId] = useState("");
  const [batchPeriod, setBatchPeriod] = useState(new Date().toISOString().slice(0, 7));
  const [batchResult, setBatchResult] = useState<{
    cooperativeBatchId: number;
    totalWeightKg: number;
  } | null>(null);

  const [splitLotCode, setSplitLotCode] = useState("");
  const [allocations, setAllocations] = useState<AllocationRow[]>([
    { cooperativeBatchId: "", allocatedWeightKg: "" },
  ]);

  const [mergeTarget, setMergeTarget] = useState("");
  const [mergeSources, setMergeSources] = useState("");

  const [traceLotCode, setTraceLotCode] = useState("");
  const [traceResult, setTraceResult] = useState<Awaited<
    ReturnType<typeof getLotTrace>
  > | null>(null);

  const [validateLotCode, setValidateLotCode] = useState("");
  const [validateResult, setValidateResult] = useState<Awaited<
    ReturnType<typeof validateLot>
  > | null>(null);

  const run = async (action: () => Promise<void>) => {
    setLoading(true);
    setMessage(null);
    setError(null);
    try {
      await action();
    } catch (err) {
      setError(getApiErrorMessage(err, "Operation failed"));
    } finally {
      setLoading(false);
    }
  };

  const onCreateBatch = () =>
    run(async () => {
      if (!washingStationId.trim()) {
        throw new Error("Washing station ID is required");
      }
      const result = await createCooperativeBatch(
        Number(batchFarmerId),
        washingStationId,
        batchPeriod,
      );
      setBatchResult(result);
      setMessage(`Farmer batch #${result.cooperativeBatchId} ready (${result.totalWeightKg} kg).`);
    });

  const onSplit = () =>
    run(async () => {
      const parsed = allocations
        .filter((row) => row.cooperativeBatchId && row.allocatedWeightKg)
        .map((row) => ({
          cooperativeBatchId: Number(row.cooperativeBatchId),
          allocatedWeightKg: Number(row.allocatedWeightKg),
        }));

      if (!splitLotCode.trim() || parsed.length === 0) {
        throw new Error("Lot code and at least one farmer share are required");
      }

      const result = await splitLot(splitLotCode.trim(), parsed);
      setMessage(`Lot ${result.lotCode} split with ${result.allocations?.length ?? 0} farmer share(s).`);
    });

  const onMerge = () =>
    run(async () => {
      const sources = mergeSources
        .split(/[,\n]/)
        .map((s) => s.trim())
        .filter(Boolean);

      if (!mergeTarget.trim() || sources.length < 2) {
        throw new Error("Target lot and at least two source lots are required");
      }

      const result = await mergeLots(mergeTarget.trim(), sources);
      setMessage(`Merged ${result.mergedSources?.length ?? 0} lots into ${result.targetLotCode}.`);
    });

  const onTrace = () =>
    run(async () => {
      const result = await getLotTrace(traceLotCode.trim());
      setTraceResult(result);
      setMessage(`Trace loaded for lot ${result.lotCode}.`);
    });

  const onValidate = () =>
    run(async () => {
      const result = await validateLot(validateLotCode.trim());
      setValidateResult(result);
      setMessage(`Check complete for lot ${result.lotCode}.`);
    });

  return (
    <div className="space-y-6">
      {mode === "exporter" ? (
        <>
          <Card step="1" title="Create farmer batch" weight="secondary">
            <div className="grid gap-3 sm:grid-cols-2">
              <Input
                label="Farmer ID"
                mono
                value={batchFarmerId}
                onChange={(e) => setBatchFarmerId(e.target.value)}
                placeholder="e.g. 101"
              />
              <Input
                label="Target period (YYYY-MM)"
                mono
                value={batchPeriod}
                onChange={(e) => setBatchPeriod(e.target.value)}
                placeholder="2026-07"
              />
              <Input
                label="Washing station ID"
                mono
                value={washingStationId}
                onChange={(e) => onStationIdChange?.(e.target.value)}
                readOnly={!stationEditable}
                placeholder="WS-001"
              />
            </div>
            <Button className="mt-3" onClick={onCreateBatch} disabled={loading}>
              Create batch
            </Button>
            {batchResult ? (
              <TypeLabel className="mt-2">
                Batch ID:{" "}
                <DataValue className="font-semibold text-forest">
                  {batchResult.cooperativeBatchId}
                </DataValue>{" "}
                · <DataValue>{batchResult.totalWeightKg} kg</DataValue> available
              </TypeLabel>
            ) : null}
          </Card>

          <Card step="2" title="Add batch to export lot" weight="primary" badge="Main step">
            <div className="space-y-3">
              <Input
                label="Export lot code"
                mono
                value={splitLotCode}
                onChange={(e) => setSplitLotCode(e.target.value)}
                placeholder="LOT-2026-001"
              />
              {allocations.map((row, index) => (
                <div key={index} className="grid gap-2 sm:grid-cols-2">
                  <Input
                    label={`Batch ID #${index + 1}`}
                    mono
                    value={row.cooperativeBatchId}
                    onChange={(e) => {
                      const next = [...allocations];
                      next[index] = { ...next[index], cooperativeBatchId: e.target.value };
                      setAllocations(next);
                    }}
                  />
                  <Input
                    label="Weight (kg)"
                    mono
                    value={row.allocatedWeightKg}
                    onChange={(e) => {
                      const next = [...allocations];
                      next[index] = { ...next[index], allocatedWeightKg: e.target.value };
                      setAllocations(next);
                    }}
                  />
                </div>
              ))}
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="ghost"
                  onClick={() =>
                    setAllocations([...allocations, { cooperativeBatchId: "", allocatedWeightKg: "" }])
                  }
                >
                  Add another share
                </Button>
                <Button onClick={onSplit} disabled={loading}>
                  Split into lot
                </Button>
              </div>
            </div>
          </Card>

          <Card step="3" title="Merge export lots" weight="secondary">
            <div className="space-y-3">
              <Input
                label="Target lot code (merged result)"
                mono
                value={mergeTarget}
                onChange={(e) => setMergeTarget(e.target.value)}
              />
              <DataTextArea
                label="Source lot codes (comma or newline separated)"
                value={mergeSources}
                onChange={setMergeSources}
                placeholder="LOT-2026-001, LOT-2026-002"
              />
              <Button onClick={onMerge} disabled={loading}>
                Merge lots
              </Button>
            </div>
          </Card>
        </>
      ) : null}

      <Card
        step={mode === "exporter" ? "4" : "1"}
        title="Lot lookup"
        weight="tertiary"
      >
        <div className="flex flex-wrap items-end gap-3">
          <Input
            label="Lot code"
            mono
            value={traceLotCode}
            onChange={(e) => setTraceLotCode(e.target.value)}
          />
          <Button onClick={onTrace} disabled={loading || !traceLotCode.trim()}>
            Load trace
          </Button>
        </div>
        {traceResult ? (
          <div className="mt-4 space-y-3">
            <BodyText>
              Status:{" "}
              <DataValue className="font-semibold uppercase">{traceResult.status}</DataValue>
            </BodyText>
            {traceResult.allocations?.length ? (
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead>
                    <tr className="border-b text-slate-500">
                      <th className="py-2 pr-4">Farmer</th>
                      <th className="py-2 pr-4">Period</th>
                      <th className="py-2 pr-4">Weight (kg)</th>
                      <th className="py-2">Share (bps)</th>
                    </tr>
                  </thead>
                  <tbody className="font-data text-xs">
                    {traceResult.allocations.map(
                      (row: {
                        id: string;
                        farmer_id: string;
                        target_period: string;
                        allocated_weight_kg: string;
                        allocation_share_bps: number;
                      }) => (
                        <tr key={row.id} className="border-b border-slate-100">
                          <td className="py-2 pr-4">{row.farmer_id}</td>
                          <td className="py-2 pr-4">{row.target_period}</td>
                          <td className="py-2 pr-4">{row.allocated_weight_kg}</td>
                          <td className="py-2">{row.allocation_share_bps}</td>
                        </tr>
                      ),
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyStatePanel
                compact
                icon="package"
                title="No farmer shares on this lot"
                description="Add batch weight to this lot first. Then you can load lot details here."
              />
            )}
          </div>
        ) : null}
      </Card>

      <Card
        step={mode === "exporter" ? "5" : "2"}
        title="Check lot"
        weight="secondary"
      >
        <div className="flex flex-wrap items-end gap-3">
          <Input
            label="Lot code"
            mono
            value={validateLotCode}
            onChange={(e) => setValidateLotCode(e.target.value)}
          />
          <Button onClick={onValidate} disabled={loading || !validateLotCode.trim()}>
            Validate
          </Button>
        </div>
        {validateResult ? (
          <div className="mt-4 space-y-3 type-body text-slate-700">
            <p>
              Lot:{" "}
              <DataValue className="font-semibold text-forest">{validateResult.lotCode}</DataValue> ·
              Lot status:{" "}
              <DataValue className="font-semibold uppercase">
                {validateResult.traceability?.status ?? "—"}
              </DataValue>
            </p>
            {validateResult.verification?.found === false ? (
              <BodyText className="text-amber-800">
                No buyer check record for this lot.
              </BodyText>
            ) : null}
            {validateResult.verification?.found &&
            validateResult.verification.mode === "SPLIT_LOT" &&
            validateResult.verification.allocations?.length ? (
              <div className="space-y-2">
                {validateResult.verification.allocations.map(
                  (alloc: {
                    farmerId: number;
                    targetPeriod: string;
                    allocatedWeightKg: number;
                    verification: { status: string } | null;
                  }, index: number) => (
                    <div key={`${alloc.farmerId}-${index}`} className="surface-inset p-3">
                      <p>
                        Farmer{" "}
                        <DataValue className="font-semibold text-forest">
                          #{alloc.farmerId}
                        </DataValue>{" "}
                        · <DataValue>{alloc.targetPeriod}</DataValue> ·{" "}
                        <DataValue>{alloc.allocatedWeightKg} kg</DataValue>
                      </p>
                      {alloc.verification ? (
                        <VerificationBadge status={alloc.verification.status as "VERIFIED_ON_CHAIN"} />
                      ) : (
                        <TypeLabel className="text-amber-800">Not yet checked on ledger</TypeLabel>
                      )}
                    </div>
                  ),
                )}
              </div>
            ) : null}
            {validateResult.verification?.found &&
            validateResult.verification.mode === "LEGACY_LOT" &&
            validateResult.verification.month ? (
              <div className="surface-inset p-3">
                <VerificationBadge
                  status={
                    validateResult.verification.month.verification.status as "VERIFIED_ON_CHAIN"
                  }
                />
                <span className="ml-2">
                  <DataValue className="font-semibold">
                    {validateResult.verification.month.targetPeriod}
                  </DataValue>
                </span>
              </div>
            ) : null}
          </div>
        ) : null}
      </Card>

      {loading ? <LoadingStatePanel label="Processing lot operation…" /> : null}
      {message ? <FormSuccessBanner>{message}</FormSuccessBanner> : null}
      {error ? <FormErrorBanner>{error}</FormErrorBanner> : null}
    </div>
  );
}
