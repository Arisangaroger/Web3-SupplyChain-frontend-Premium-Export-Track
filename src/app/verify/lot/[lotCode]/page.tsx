"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { EmptyStatePanel } from "@/components/ui/EmptyStatePanel";
import { VerificationBadge } from "@/components/ui/VerificationBadge";
import { BodyText, DataValue } from "@/components/ui/typography";
import { PublicPageLayout } from "@/components/layout/PublicPageLayout";
import { LotVerificationHero } from "@/components/lot/LotVerificationHero";
import { BlockchainProofPanel } from "@/components/verification/BlockchainProofPanel";
import { TamperAlertBanner } from "@/components/verification/TamperAlertBanner";
import { VerifyLookupPanel } from "@/components/verification/VerifyLookupPanel";
import { VerificationEmptyState } from "@/components/verification/VerificationEmptyState";
import { VerificationNotFound } from "@/components/verification/VerificationNotFound";
import { parseLotCode } from "@/lib/verificationCodes";
import { getApiErrorMessage, verifyLotForBuyer } from "@/services/api";

type LotData = Awaited<ReturnType<typeof verifyLotForBuyer>>;

export default function BuyerLotVerifyPage({ params }: { params: { lotCode: string } }) {
  const router = useRouter();
  const routeCode = params.lotCode === "demo" ? "" : parseLotCode(params.lotCode);
  const [input, setInput] = useState(routeCode);
  const [data, setData] = useState<LotData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const load = async (lotCode: string, updateUrl = true) => {
    const code = parseLotCode(lotCode);
    if (!code) return;
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const result = await verifyLotForBuyer(code);
      setData(result);
      if (updateUrl && code !== routeCode) {
        router.replace(`/verify/lot/${encodeURIComponent(code)}`, { scroll: false });
      }
      if (result.found) {
        requestAnimationFrame(() => {
          resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      }
    } catch (err) {
      setError(getApiErrorMessage(err, "Lot verification failed"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (routeCode) load(routeCode, false);
  }, [routeCode]);

  const handleScan = (code: string) => {
    const parsed = parseLotCode(code);
    setInput(parsed);
    load(parsed);
  };

  const hasResult = Boolean(data?.found);
  const showEmpty = !data && !loading && !error;
  const tamperedCount =
    data?.found && data.mode === "SPLIT_LOT"
      ? (data.allocations ?? []).filter(
          (a: { verification: { status: string } | null }) =>
            a.verification?.status === "TAMPER_ALERT" ||
            a.verification?.status === "LOCAL_MISMATCH",
        ).length
      : 0;

  return (
    <PublicPageLayout
      title="Export Lot Verification"
      subtitle="Buyer & auditor lot traceability check"
      maxWidth="6xl"
    >
      <VerifyLookupPanel
        input={input}
        loading={loading}
        error={error}
        hasResult={hasResult}
        scannerContainerId="buyer-lot-scanner"
        scannerTitle="Scan export lot QR"
        placeholder="LOT-2026-001"
        verifyLabel="Verify lot"
        title="Find an export lot"
        titleAfterResult="Look up another lot"
        description="Scan the lot QR code or enter the export lot code to verify farmer allocations."
        descriptionAfterResult="Scan or enter a different lot code to verify another export batch."
        onInputChange={setInput}
        onVerify={() => load(input)}
        onScan={handleScan}
      />

      {showEmpty ? (
        <VerificationEmptyState
          icon="leaf"
          title="No lot loaded yet"
          description="Enter an export lot code above to see verification status and traceability for each farmer allocation in the batch."
        />
      ) : null}

      {data?.found === false ? (
        <VerificationNotFound
          eyebrow="Lot not found"
          title="No record for this code"
          codeLabel="export lot"
          code={data.lotCode}
          hint="Check the lot code on the export documentation and try again."
        />
      ) : null}

      {data?.found ? (
        <div ref={resultsRef} className="scroll-mt-24 space-y-6">
          <LotVerificationHero
            lotCode={data.lotCode}
            mode={data.mode}
            allocations={data.allocations ?? []}
            month={data.mode === "LEGACY_LOT" ? data.month : null}
            farmerId={data.mode === "LEGACY_LOT" ? data.farmerId : undefined}
          />

          {tamperedCount > 0 ? <TamperAlertBanner count={tamperedCount} /> : null}

          {data.mode === "EMPTY_LOT" ? (
            <Card title="Empty lot" weight="secondary">
              <EmptyStatePanel
                compact
                icon="package"
                title="No allocations yet"
                description="This lot exists but has no farmer allocations yet. Check back after the exporter splits cooperative batches into this lot."
              />
            </Card>
          ) : (
            <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
              <div className="space-y-6">
                {data.mode === "SPLIT_LOT" && data.allocations?.length ? (
                  <Card title="Verified allocations" weight="primary" badge="Verification result">
                    <div className="space-y-3">
                      {data.allocations.map(
                        (alloc: {
                          farmerId: number;
                          targetPeriod: string;
                          allocatedWeightKg: number;
                          verification: {
                            status: string;
                            message?: string;
                          } | null;
                        }, index: number) => (
                          <div
                            key={`${alloc.farmerId}-${index}`}
                            className="surface-inset p-3"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <p className="font-medium">
                                Farmer{" "}
                                <DataValue className="font-semibold text-forest">
                                  #{alloc.farmerId}
                                </DataValue>{" "}
                                ·{" "}
                                <DataValue className="font-semibold">{alloc.targetPeriod}</DataValue>
                              </p>
                              {alloc.verification ? (
                                <VerificationBadge
                                  status={alloc.verification.status as "VERIFIED_ON_CHAIN"}
                                />
                              ) : (
                                <span className="text-xs text-amber-700">
                                  Pending on-chain proof
                                </span>
                              )}
                            </div>
                            <p className="mt-1 text-sm text-slate-600">
                              <DataValue>{alloc.allocatedWeightKg} kg</DataValue> allocated
                            </p>
                            {alloc.verification?.message ? (
                              <p className="mt-2 text-xs text-slate-500">
                                {alloc.verification.message}
                              </p>
                            ) : null}
                          </div>
                        ),
                      )}
                    </div>
                  </Card>
                ) : null}

                {data.mode === "LEGACY_LOT" && data.month ? (
                  <Card title="Monthly compliance record" weight="primary" badge="Verification result">
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="font-medium">
                          Period{" "}
                          <DataValue className="font-semibold text-forest">
                            {data.month.targetPeriod}
                          </DataValue>
                        </p>
                        <VerificationBadge
                          status={data.month.verification.status as "VERIFIED_ON_CHAIN"}
                        />
                      </div>
                      <p className="text-sm text-slate-600">
                        Farmer{" "}
                        <DataValue className="font-semibold text-forest">{data.farmerId}</DataValue>{" "}
                        · <DataValue>{data.month.aggregatedYieldKg} kg</DataValue> ·{" "}
                        <DataValue>{data.month.wageComplianceFlag.replace(/_/g, " ")}</DataValue>
                      </p>
                      {data.month.verification.message ? (
                        <p className="text-sm text-slate-600">{data.month.verification.message}</p>
                      ) : null}
                      <BlockchainProofPanel
                        txHash={data.month.txHash}
                        anchoredAt={data.month.anchoredAt}
                      />
                    </div>
                  </Card>
                ) : null}
              </div>

              <div className="space-y-6">
                {data.mode === "SPLIT_LOT" ? (
                  <Card title="Lot summary" weight="tertiary">
                    <dl className="grid gap-3 sm:grid-cols-2">
                      <div className="surface-inset p-3">
                        <dt className="eyebrow text-slate-400">Farmers</dt>
                        <dd className="mt-1 font-data text-2xl font-bold text-forest">
                          {data.allocations?.length ?? 0}
                        </dd>
                      </div>
                      <div className="surface-inset p-3">
                        <dt className="eyebrow text-slate-400">Total allocated</dt>
                        <dd className="mt-1 font-data text-2xl font-bold text-forest">
                          {(data.allocations ?? []).reduce(
                            (sum: number, a: { allocatedWeightKg: number }) =>
                              sum + a.allocatedWeightKg,
                            0,
                          )}{" "}
                          kg
                        </dd>
                      </div>
                    </dl>
                    <p className="mt-4 text-sm text-slate-600">
                      Each allocation links a farmer&apos;s verified cooperative batch to this export
                      lot. Failed verifications require exporter review before acceptance.
                    </p>
                  </Card>
                ) : null}
              </div>
            </div>
          )}
        </div>
      ) : null}
    </PublicPageLayout>
  );
}
