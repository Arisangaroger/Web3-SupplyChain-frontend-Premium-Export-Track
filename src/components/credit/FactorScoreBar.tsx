import { BodyText, DataValue, TypeLabel } from "@/components/ui/typography";
import { scoreRangeStyle } from "@/lib/scoreVisuals";

interface Props {
  label: string;
  score: number;
  detail: string;
  weight?: number;
}

export function FactorScoreBar({ label, score, detail, weight }: Props) {
  const styles = scoreRangeStyle(score);
  const fillWidth = Math.min(Math.max(score, 0), 100);
  const showInlineScore = fillWidth >= 12;

  return (
    <div className="space-y-2">
      <div className="flex items-end justify-between gap-3">
        <div>
      <BodyText className="font-medium text-slate-800">{label}</BodyText>
      {weight != null ? (
        <TypeLabel>
          Weight <DataValue size="xs">{Math.round(weight * 100)}%</DataValue>
        </TypeLabel>
          ) : null}
        </div>
        <DataValue size="sm" className={`font-bold ${styles.label}`}>
          {score}/100
        </DataValue>
      </div>
      <div
        className={`relative h-3.5 overflow-hidden rounded-full ${styles.track}`}
        role="progressbar"
        aria-valuenow={score}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${label}: ${score} out of 100`}
      >
        <div
          className={`relative flex h-full min-w-[2.75rem] items-center justify-end rounded-full pr-2 transition-all duration-500 ease-out ${styles.fill}`}
          style={{ width: `${Math.max(fillWidth, fillWidth > 0 ? 8 : 0)}%` }}
        >
          {showInlineScore ? (
            <span className="font-data text-[11px] font-bold leading-none text-white drop-shadow-sm">
              {score}
            </span>
          ) : null}
        </div>
        {!showInlineScore && fillWidth > 0 ? (
          <span
            className={`absolute top-1/2 -translate-y-1/2 font-data text-[11px] font-bold ${styles.label}`}
            style={{ left: `calc(${fillWidth}% + 6px)` }}
          >
            {score}
          </span>
        ) : null}
      </div>
      <TypeLabel className="leading-relaxed">{detail}</TypeLabel>
    </div>
  );
}
