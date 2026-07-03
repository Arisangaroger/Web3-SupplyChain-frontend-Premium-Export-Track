"use client";

import { Card, type CardWeight } from "@/components/ui/Card";
import {
  BodyText,
  DataValue,
  HeroMetric,
  TypeLabel,
} from "@/components/ui/typography";
import { SurfaceInset } from "@/components/ui/SurfaceInset";
import { FactorScoreBar } from "@/components/credit/FactorScoreBar";
import { GradeBadge } from "@/components/credit/GradeBadge";
import { InsufficientHistoryPanel } from "@/components/credit/InsufficientHistoryPanel";
import { ScoreRangeLegend } from "@/components/credit/ScoreRangeLegend";
import { ScoreRing } from "@/components/credit/ScoreRing";
import { scoreRangeStyle } from "@/lib/scoreVisuals";

interface FactorBreakdown {
  score: number;
  weight: number;
  weighted: number;
  detail: string;
}

export interface CreditScoreData {
  score: number | null;
  grade: string | null;
  creditReadiness: string;
  insufficientHistory?: boolean;
  minMonthsRequired?: number;
  totalMonths?: number;
  modelVersion?: string;
  computedAt?: string;
  factors?: {
    onChainVerification: FactorBreakdown;
    integrity: FactorBreakdown;
    wageCompliance: FactorBreakdown;
    deliveryConsistency: FactorBreakdown;
    yieldStability: FactorBreakdown;
  };
  explanations?: string[];
  disclaimer?: string;
}

interface Props {
  creditScore: CreditScoreData;
  compact?: boolean;
  weight?: CardWeight;
}

const FACTOR_LABELS: Record<string, string> = {
  onChainVerification: "Ledger check",
  integrity: "Record integrity",
  wageCompliance: "Living wage",
  deliveryConsistency: "Regular deliveries",
  yieldStability: "Stable harvest",
};

export function CreditScorePanel({
  creditScore,
  compact = false,
  weight = "primary",
}: Props) {
  if (creditScore.insufficientHistory) {
    return (
      <InsufficientHistoryPanel
        minMonthsRequired={creditScore.minMonthsRequired}
        totalMonths={creditScore.totalMonths}
        creditReadiness={creditScore.creditReadiness}
      />
    );
  }

  const score = creditScore.score ?? 0;
  const scoreStyles = scoreRangeStyle(score);

  return (
    <Card title={compact ? "Numerical Credit Score" : undefined} weight={weight}>
      {!compact ? (
        <div className="mb-8 border-b border-forest/10 pb-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0">
              <p className="eyebrow text-slate-500">Numerical credit score</p>
              <HeroMetric size="xl" className={scoreStyles.label}>
                {score}
              </HeroMetric>
              <TypeLabel className="mt-2">Out of 100 · Bloomberg-style tabular index</TypeLabel>
            </div>
            <GradeBadge grade={creditScore.grade} />
          </div>
          <BodyText className="mt-4 font-medium">{creditScore.creditReadiness}</BodyText>
          {creditScore.modelVersion || creditScore.computedAt ? (
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
              {creditScore.modelVersion ? (
                <TypeLabel>
                  Model{" "}
                  <DataValue size="xs" className="text-slate-500">
                    {creditScore.modelVersion}
                  </DataValue>
                </TypeLabel>
              ) : null}
              {creditScore.computedAt ? (
                <TypeLabel>
                  Computed{" "}
                  <DataValue size="xs">
                    {new Date(creditScore.computedAt).toLocaleString()}
                  </DataValue>
                </TypeLabel>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="mb-6">
        <SurfaceInset className="p-3">
          <ScoreRangeLegend />
        </SurfaceInset>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        {compact ? (
          <div className="flex shrink-0 flex-col items-center gap-4 sm:flex-row sm:items-center lg:flex-col">
            <ScoreRing score={score} size={140} />
            <div className="flex flex-col items-center gap-3">
              <GradeBadge grade={creditScore.grade} />
              <div className="max-w-[200px] text-center">
                <BodyText className="font-medium">{creditScore.creditReadiness}</BodyText>
              </div>
            </div>
          </div>
        ) : null}

        {!compact && creditScore.factors ? (
          <SurfaceInset className="min-w-0 flex-1 space-y-5 lg:ml-0">
            <p className="eyebrow text-slate-400">Factor breakdown</p>
            {Object.entries(creditScore.factors).map(([key, factor]) => (
              <FactorScoreBar
                key={key}
                label={FACTOR_LABELS[key] ?? key}
                score={factor.score}
                weight={factor.weight}
                detail={factor.detail}
              />
            ))}
          </SurfaceInset>
        ) : null}

        {compact && creditScore.factors ? (
          <SurfaceInset className="min-w-0 flex-1 space-y-4">
            <p className="eyebrow text-slate-400">Top factors</p>
            {Object.entries(creditScore.factors)
              .sort(([, a], [, b]) => b.weight - a.weight)
              .slice(0, 3)
              .map(([key, factor]) => (
                <FactorScoreBar
                  key={key}
                  label={FACTOR_LABELS[key] ?? key}
                  score={factor.score}
                  weight={factor.weight}
                  detail={factor.detail}
                />
              ))}
          </SurfaceInset>
        ) : null}
      </div>

      {!compact && creditScore.explanations?.length ? (
        <SurfaceInset className="mt-6 p-4">
          <p className="eyebrow">Score explanations</p>
          <ul className="type-body mt-2 list-disc space-y-1.5 pl-4">
            {creditScore.explanations.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </SurfaceInset>
      ) : null}

      {creditScore.disclaimer ? (
        <TypeLabel className="mt-4 block leading-relaxed">{creditScore.disclaimer}</TypeLabel>
      ) : null}
    </Card>
  );
}
