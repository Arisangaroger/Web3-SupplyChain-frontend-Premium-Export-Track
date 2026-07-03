"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { ComplianceMapLinks } from "@/components/maps/ComplianceMapLinks";
import { CreditScorePanel } from "@/components/credit/CreditScorePanel";
import { QrCodeDisplay } from "@/components/qr/QrCodeDisplay";
import { BodyText, DataValue } from "@/components/ui/typography";
import { PublicPageLayout } from "@/components/layout/PublicPageLayout";
import { PassportVerificationHero } from "@/components/passport/PassportVerificationHero";
import { BlockchainProofPanel } from "@/components/verification/BlockchainProofPanel";
import { MonthlyVerificationList } from "@/components/verification/MonthlyVerificationList";
import { TamperAlertBanner } from "@/components/verification/TamperAlertBanner";
import { VerifyLookupPanel } from "@/components/verification/VerifyLookupPanel";
import { VerificationEmptyState } from "@/components/verification/VerificationEmptyState";
import { VerificationNotFound } from "@/components/verification/VerificationNotFound";
import { parsePassportSlug } from "@/lib/verificationCodes";
import { getApiErrorMessage, verifyByPassportSlug } from "@/services/api";

type PassportData = Awaited<ReturnType<typeof verifyByPassportSlug>>;

export default function BuyerPassportPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const routeSlug = params.slug === "demo" ? "" : parsePassportSlug(params.slug);
  const [input, setInput] = useState(routeSlug);
  const [data, setData] = useState<PassportData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const load = async (slug: string, updateUrl = true) => {
    const parsed = parsePassportSlug(slug);
    if (!parsed) return;
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const result = await verifyByPassportSlug(parsed);
      setData(result);
      if (updateUrl && parsed !== routeSlug) {
        router.replace(`/verify/passport/${encodeURIComponent(parsed)}`, { scroll: false });
      }
      if (result.found) {
        requestAnimationFrame(() => {
          resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      }
    } catch (err) {
      setError(getApiErrorMessage(err, "Verification failed"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (routeSlug) load(routeSlug, false);
  }, [routeSlug]);

  const handleScan = (code: string) => {
    const parsed = parsePassportSlug(code);
    setInput(parsed);
    load(parsed);
  };

  const latestMonth = data?.found ? data.compliance?.latestMonth : null;
  const coordinates = latestMonth?.eudrCoordinates ?? null;
  const hasResult = Boolean(data?.found);
  const showEmpty = !data && !loading && !error;

  return (
    <PublicPageLayout
      title="Buyer passport"
      subtitle="Farm location · Fair pay · Record check"
      maxWidth="6xl"
    >
      <VerifyLookupPanel
        input={input}
        loading={loading}
        error={error}
        hasResult={hasResult}
        scannerContainerId="buyer-passport-scanner"
        scannerTitle="Scan buyer passport QR"
        placeholder="PASSPORT-2026-KE-ABC123"
        verifyLabel="Verify passport"
        title="Find a buyer passport"
        titleAfterResult="Look up another passport"
        description="Scan the QR on the sack or type the passport code."
        descriptionAfterResult="Scan or type another passport code."
        onInputChange={setInput}
        onVerify={() => load(input)}
        onScan={handleScan}
      />

      {showEmpty ? (
        <VerificationEmptyState
          icon="leaf"
          title="No passport loaded yet"
          description="Enter a passport code above to see farm data, pay checks, and map links."
        />
      ) : null}

      {data?.found === false ? (
        <VerificationNotFound
          eyebrow="Passport not found"
          title="No record for this code"
          codeLabel="passport"
          code={data.passportSlug}
          hint="Check the code on the sack label and try again."
        />
      ) : null}

      {data?.found ? (
        <div ref={resultsRef} className="scroll-mt-24 space-y-6">
          <PassportVerificationHero data={data} />

          {data.compliance.tamperedMonthCount > 0 ? (
            <TamperAlertBanner count={data.compliance.tamperedMonthCount} />
          ) : null}

          <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
            <div className="space-y-6">
              {latestMonth ? (
                <Card title="Latest monthly record" weight="secondary">
                  <div className="space-y-4">
                    <div>
                      <p className="eyebrow text-slate-400">Reporting period</p>
                      <p className="mt-1 font-data text-2xl font-bold text-forest">
                        {latestMonth.targetPeriod}
                      </p>
                    </div>
                    <dl className="grid gap-3 sm:grid-cols-2">
                      <div className="surface-inset p-3">
                        <dt className="eyebrow text-slate-400">Total weight</dt>
                        <dd className="mt-1 font-data text-xl font-semibold text-forest">
                          {latestMonth.aggregatedYieldKg} kg
                        </dd>
                      </div>
                      <div className="surface-inset p-3">
                        <dt className="eyebrow text-slate-400">Living wage</dt>
                      <BodyText className="font-medium text-slate-800">
                        <DataValue>{latestMonth.wageComplianceFlag.replace(/_/g, " ")}</DataValue>
                      </BodyText>
                      </div>
                      <div className="surface-inset p-3 sm:col-span-2">
                        <dt className="eyebrow text-slate-400">Washing station</dt>
                        <dd className="mt-1 font-data text-sm font-semibold text-forest">
                          {latestMonth.washingStationId}
                        </dd>
                      </div>
                    </dl>
                    {latestMonth.verification.message ? (
                      <BodyText muted>{latestMonth.verification.message}</BodyText>
                    ) : null}
                    <BlockchainProofPanel
                      txHash={latestMonth.txHash}
                      anchoredAt={latestMonth.anchoredAt}
                    />
                  </div>
                </Card>
              ) : null}

              {data.compliance.allMonths?.length ? (
                <Card title="All months" weight="tertiary">
                  <MonthlyVerificationList months={data.compliance.allMonths} />
                </Card>
              ) : null}

              {data.custodyTimeline?.length ? (
                <Card title="Shipment timeline" weight="tertiary">
                  <ol className="relative space-y-0 border-l-2 border-amber/25 pl-4">
                    {data.custodyTimeline.map((event: {
                      stage: string;
                      recordedAt: string;
                      operatorRole: string | null;
                    }, index: number) => {
                      const isLatest = index === data.custodyTimeline!.length - 1;
                      return (
                      <li key={`${event.stage}-${index}`} className="relative pb-4 last:pb-0">
                        <span
                          className={`absolute -left-[calc(0.5rem+1px)] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-white ${
                            isLatest ? "bg-amber ring-2 ring-amber/30" : "bg-forest"
                          }`}
                          aria-hidden
                        />
                        <p className="text-sm font-medium capitalize text-slate-800">
                          {event.stage.replace(/_/g, " ").toLowerCase()}
                        </p>
                        <p className="mt-0.5 text-xs text-slate-500">
                          <DataValue size="xs">
                            {new Date(event.recordedAt).toLocaleString()}
                          </DataValue>
                          {event.operatorRole ? (
                            <>
                              {" "}
                              · <DataValue size="xs">{event.operatorRole}</DataValue>
                            </>
                          ) : null}
                        </p>
                      </li>
                    );
                    })}
                  </ol>
                </Card>
              ) : null}
            </div>

            <div className="space-y-6">
              {data.compliance.creditScore ? (
                <CreditScorePanel creditScore={data.compliance.creditScore} compact weight="secondary" />
              ) : null}

              {coordinates ? (
                <Card title="Farm location map" weight="secondary">
                  <BodyText muted className="mb-4">
                    GPS from the farm. Open the map to check the area.
                  </BodyText>
                  <ComplianceMapLinks coordinates={coordinates} />
                </Card>
              ) : null}

              {data.passportSlug ? (
                <QrCodeDisplay value={`PASSPORT:${data.passportSlug}`} label="Share this passport" />
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </PublicPageLayout>
  );
}
