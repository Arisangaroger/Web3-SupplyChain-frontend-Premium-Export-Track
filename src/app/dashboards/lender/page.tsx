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
import { BodyText, DataValue, TypeLabel } from "@/components/ui/typography";
import { EmptyStatePanel } from "@/components/ui/EmptyStatePanel";
import { FormErrorBanner } from "@/components/ui/FormFeedback";
import { LoadingStatePanel } from "@/components/ui/LoadingStatePanel";
import { PublicPageLayout } from "@/components/layout/PublicPageLayout";
import { getApiErrorMessage, getFarmerCreditScoreHistory, verifyFarmerForLender } from "@/services/api";

export default function LenderPortalPage() {
  const [farmerId, setFarmerId] = useState("");
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
      setError(getApiErrorMessage(err, "Check failed"));
    } finally {
      setLoading(false);
    }
  };

  const creditScore = data?.creditScore;

  return (
    <PublicPageLayout
      title="Lender credit check"
      subtitle="Check a farmer's score and monthly records"
      maxWidth="6xl"
    >
      <Card title="Check farmer credit" weight="primary" badge="Start here">
        <div className="flex flex-wrap items-end gap-3">
          <Input
            label="Farmer ID"
            mono
            value={farmerId}
            onChange={(e) => setFarmerId(e.target.value)}
            placeholder="e.g. 101"
          />
          <Button onClick={onAudit} disabled={loading || !farmerId.trim()}>
            {loading ? "Checking..." : "Run check"}
          </Button>
        </div>
        {error ? <FormErrorBanner>{error}</FormErrorBanner> : null}
      </Card>

      {loading && !data ? <LoadingStatePanel label="Loading farmer data…" /> : null}

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
          description="This is the first score for this farmer. Run more checks later to see a trend."
          compact
        />
      ) : null}

      {!data && !loading && !error ? (
        <EmptyStatePanel
          icon="search"
          title="No check run yet"
          description="Enter a farmer ID above to see credit score and monthly records."
        />
      ) : null}

      {data ? (
        <Card title="Monthly records" weight="secondary">
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
                description="No records yet. They appear after cherry intake and monthly rollup at the washing station."
              />
            )}
          </div>
        </Card>
      ) : null}
    </PublicPageLayout>
  );
}
