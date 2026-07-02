import { scoreRangeStyle } from "@/lib/scoreVisuals";

interface Props {
  score: number | null;
  size?: number;
  label?: string;
}

export function ScoreRing({ score, size = 168, label = "Credit score" }: Props) {
  const strokeWidth = 7;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const hasScore = score != null;
  const normalized = hasScore ? Math.min(Math.max(score, 0), 100) : 0;
  const offset = circumference - (normalized / 100) * circumference;
  const styles = scoreRangeStyle(normalized);
  const fontSize =
    size >= 220 ? "4.5rem" : size >= 168 ? "3.5rem" : size >= 140 ? "2.75rem" : "2.25rem";

  return (
    <div
      className="relative shrink-0"
      style={{ width: size, height: size }}
      role="img"
      aria-label={
        hasScore ? `${label}: ${score} out of 100` : `${label}: not yet available`
      }
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
        aria-hidden
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth={strokeWidth}
        />
        {hasScore ? (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={styles.arc}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-[stroke-dashoffset] duration-700 ease-out"
          />
        ) : null}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className={`font-data font-bold leading-none tracking-tight ${hasScore ? styles.label : "text-slate-300"}`}
          style={{ fontSize }}
        >
          {hasScore ? score : "—"}
        </span>
        <span className="mt-1 text-[11px] font-medium uppercase tracking-wider text-slate-400">
          out of 100
        </span>
      </div>
    </div>
  );
}
