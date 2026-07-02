"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { VerificationBadge } from "@/components/ui/VerificationBadge";
import { SurfaceInset } from "@/components/ui/SurfaceInset";
import { CreditScorePanel } from "@/components/credit/CreditScorePanel";
import { CreditScoreHistoryTable } from "@/components/credit/CreditScoreHistoryTable";
import { InsufficientHistoryPanel } from "@/components/credit/InsufficientHistoryPanel";
import { BodyText, DashboardHeroStrip, DataValue, TypeLabel } from "@/components/ui/typography";
import { EmptyStatePanel } from "@/components/ui/EmptyStatePanel";
import { FormErrorBanner } from "@/components/ui/FormFeedback";
import { LoadingStatePanel } from "@/components/ui/LoadingStatePanel";
import { PublicPageLayout } from "@/components/layout/PublicPageLayout";
import { getApiErrorMessage, getFarmerCreditScoreHistory, verifyFarmerForLender } from "@/services/api";

export default function LenderPortalPage() {
  const [farmerId, setFarmerId] = useState("101");
  const [data, setData] = useState<Awaited<ReturnType<typeof verifyFarmerForLender>> | null>(null);
  const [history, setHistory] = useState<Awaited<
    ReturnType<typeof getFarmerCreditScoreHistory>
  > | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onAudit = async () => {
    setLoading(true);
    setError(null);
    setData(null);
    setHistory(null);
    try {
      const id = Number(farmerId);
      const [result, scoreHistory] = await Promise.all([
        verifyFarmerForLender(id),
        getFarmerCreditScoreHistory(id),
      ]);
      setData(result);
      setHistory(scoreHistory);
    } catch (err) {
      setError(getApiErrorMessage(err, "Audit failed"));
    } finally {
      setLoading(false);
    }
  };

  const creditScore = data?.creditScore;

  return (
    <PublicPageLayout
      title="Lender Credit Audit Portal"
      subtitle="Instant cryptographic farmer audit"
      maxWidth="6xl"
    >
      <Card title="Instant Cryptographic Audit (Gasless)" weight="primary" badge="Start here">
        <div className="flex flex-wrap items-end gap-3">
          <Input
            label="Farmer ID"
            mono
            value={farmerId}
            onChange={(e) => setFarmerId(e.target.value)}
          />
          <Button onClick={onAudit} disabled={loading}>
            {loading ? "Auditing..." : "Run Audit & Score"}
          </Button>
        </div>
        {error ? <FormErrorBanner>{error}</FormErrorBanner> : null}
      </Card>

      {loading && !data ? <LoadingStatePanel label="Running cryptographic audit…" /> : null}

      {creditScore?.insufficientHistory ? (
        <InsufficientHistoryPanel
          minMonthsRequired={creditScore.minMonthsRequired}
          totalMonths={creditScore.totalMonths}
          creditReadiness={creditScore.creditReadiness}
        />
      ) : creditScore ? (
        <CreditScorePanel creditScore={creditScore} weight="primary" />
      ) : null}

      {history?.history?.length ? (
        <CreditScoreHistoryTable history={history.history} />
      ) : data && creditScore && !creditScore.insufficientHistory ? (
        <EmptyStatePanel
          icon="history"
          title="No score history yet"
          description="This is the first computed credit score for this farmer. Run future audits to build a trend line over time."
          compact
        />
      ) : null}

      {!data && !loading && !error ? (
        <EmptyStatePanel
          icon="search"
          title="No audit run yet"
          description="Enter a farmer ID above and run the gasless cryptographic audit to see credit score, factor breakdown, and monthly compliance records."
        />
      ) : null}

      {data ? (
        <Card title="Monthly farmer records" weight="secondary">
          <TypeLabel className="mb-3">
            Farmer ID:{" "}
            <DataValue className="font-semibold text-forest">{data.farmerId}</DataValue>
          </TypeLabel>
          <div className="space-y-4">
            {data.months?.length ? (
              data.months.map((month: {
                targetPeriod: string;
                aggregatedYieldKg: number;
                wageComplianceFlag: string;
                verification: { status: string };
              }) => (
                <SurfaceInset
                  key={month.targetPeriod}
                  className="flex flex-wrap items-center justify-between gap-2"
                >
                  <div>
                    <p className="font-medium">
                      <DataValue className="font-semibold text-forest">
                        {month.targetPeriod}
                      </DataValue>
                    </p>
                    <BodyText muted>
                      <DataValue>{month.aggregatedYieldKg} kg</DataValue> ·{" "}
                      <DataValue>{month.wageComplianceFlag.replace(/_/g, " ")}</DataValue>
                    </BodyText>
                  </div>
                  <VerificationBadge status={month.verification.status as "VERIFIED_ON_CHAIN"} />
                </SurfaceInset>
              ))
            ) : (
              <EmptyStatePanel
                compact
                icon="leaf"
                title="No monthly records"
                description="This farmer has no verified monthly compliance rows yet. Records appear after washing-station intake and Merkle rollup."
              />
            )}
          </div>
        </Card>
      ) : null}
    </PublicPageLayout>
  );
}
