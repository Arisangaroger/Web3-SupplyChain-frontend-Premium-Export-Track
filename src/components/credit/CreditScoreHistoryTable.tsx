import { Card } from "@/components/ui/Card";
import { DataValue } from "@/components/ui/typography";
import { GradeBadge } from "@/components/credit/GradeBadge";
import { scoreRangeStyle } from "@/lib/scoreVisuals";

interface HistoryEntry {
  computedAt: string;
  score: number | null;
  grade: string | null;
  creditReadiness: string;
}

export function CreditScoreHistoryTable({ history }: { history: HistoryEntry[] }) {
  if (!history.length) return null;

  return (
    <Card title="Score history" weight="tertiary">
      <div className="surface-inset overflow-x-auto p-0">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b text-slate-500">
              <th className="py-2 pr-4 font-medium">Date</th>
              <th className="py-2 pr-4 font-medium">Score</th>
              <th className="py-2 pr-4 font-medium">Grade</th>
              <th className="py-2 font-medium">Readiness</th>
            </tr>
          </thead>
          <tbody>
            {history.map((entry, index) => {
              const isLatest = index === 0;
              const scoreStyles =
                entry.score != null ? scoreRangeStyle(entry.score) : null;

              return (
                <tr
                  key={entry.computedAt}
                  className={`border-b border-forest/[0.06] ${isLatest ? scoreStyles?.bg ?? "bg-inset/80" : ""}`}
                >
                  <td className="py-3 pr-4">
                    <DataValue size="xs" className="text-slate-600">
                      {new Date(entry.computedAt).toLocaleString()}
                    </DataValue>
                    {isLatest ? (
                      <span className="status-highlight-subtle ml-2 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide">
                        Latest
                      </span>
                    ) : null}
                  </td>
                  <td className="py-3 pr-4">
                    {entry.score != null ? (
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-data text-lg font-bold leading-none ${scoreStyles?.label}`}
                        >
                          {entry.score}
                        </span>
                        <div
                          className={`hidden h-2 w-16 overflow-hidden rounded-full sm:block ${scoreStyles?.track}`}
                        >
                          <div
                            className={`h-full rounded-full ${scoreStyles?.fill}`}
                            style={{ width: `${entry.score}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  <td className="py-3 pr-4">
                    <GradeBadge grade={entry.grade} size="sm" />
                  </td>
                  <td className="py-3 text-slate-700">{entry.creditReadiness}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
