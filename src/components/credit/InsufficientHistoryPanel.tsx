import { Card } from "@/components/ui/Card";
import {
  BodyText,
  DashboardHeroStrip,
  DataValue,
  TypeLabel,
} from "@/components/ui/typography";
import { SurfaceInset } from "@/components/ui/SurfaceInset";
import { ScoreRing } from "@/components/credit/ScoreRing";
import { scoreRangeStyle } from "@/lib/scoreVisuals";

interface Props {
  minMonthsRequired?: number;
  totalMonths?: number;
  creditReadiness: string;
}

export function InsufficientHistoryPanel({
  minMonthsRequired = 3,
  totalMonths = 0,
  creditReadiness,
}: Props) {
  const progress = Math.min((totalMonths / minMonthsRequired) * 100, 100);
  const styles = scoreRangeStyle(progress);

  return (
    <Card title="Credit Score" weight="secondary">
      <DashboardHeroStrip
        label="Verified months on record"
        value={totalMonths}
        unit={`/ ${minMonthsRequired} required`}
        sublabel={creditReadiness}
        valueClassName="text-slate-400"
        className="mb-6 border-none pb-0"
      />
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
        <ScoreRing score={null} size={140} label="Credit score unavailable" />
        <div className="min-w-0 flex-1 space-y-4">
          <BodyText muted>
            Insufficient history for a numeric score. Need at least{" "}
            <DataValue size="sm" className="font-semibold">
              {minMonthsRequired}
            </DataValue>{" "}
            verified months before the Bloomberg-style index is computed.
          </BodyText>
          <SurfaceInset className="space-y-3 p-4">
            <div className="mb-1.5 flex justify-between">
              <TypeLabel>History progress</TypeLabel>
              <DataValue size="xs">
                {totalMonths}/{minMonthsRequired} months
              </DataValue>
            </div>
            <div
              className={`relative h-3.5 overflow-hidden rounded-full ${styles.track}`}
              role="progressbar"
              aria-valuenow={totalMonths}
              aria-valuemin={0}
              aria-valuemax={minMonthsRequired}
              aria-label={`${totalMonths} of ${minMonthsRequired} months collected`}
            >
              <div
                className={`h-full rounded-full transition-all duration-500 ${styles.fill}`}
                style={{ width: `${progress}%` }}
              />
            </div>
            <TypeLabel>
              Score becomes available once enough verified monthly records are on file.
            </TypeLabel>
          </SurfaceInset>
        </div>
      </div>
    </Card>
  );
}
