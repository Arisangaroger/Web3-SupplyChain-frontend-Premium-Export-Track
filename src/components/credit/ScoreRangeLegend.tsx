import { SCORE_RANGE_LEGEND } from "@/lib/scoreVisuals";

export function ScoreRangeLegend() {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-2">
      {SCORE_RANGE_LEGEND.map(({ label, range, className }) => (
        <div key={label} className="flex items-center gap-2 text-xs text-slate-600">
          <span className={`h-2.5 w-8 shrink-0 rounded-full ${className}`} aria-hidden />
          <span>
            <span className="font-medium text-slate-700">{label}</span> ({range})
          </span>
        </div>
      ))}
    </div>
  );
}
