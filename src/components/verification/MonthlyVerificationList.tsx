import { VerificationBadge } from "@/components/ui/VerificationBadge";
import { DataValue } from "@/components/ui/typography";
import type { VerificationStatus } from "@/components/verification/resolveVerificationTone";

interface MonthRow {
  targetPeriod: string;
  aggregatedYieldKg: number;
  wageComplianceFlag: string;
  verification: { status: string };
}

export function MonthlyVerificationList({ months }: { months: MonthRow[] }) {
  if (!months.length) return null;

  return (
    <div className="space-y-2">
      {months.map((month) => (
        <div
          key={month.targetPeriod}
          className={`surface-inset flex flex-wrap items-center justify-between gap-2 px-3 py-2.5 ${
            month.verification.status === "VERIFIED_ON_CHAIN"
              ? "border-l-[3px] border-l-amber"
              : ""
          }`}
        >
          <div>
            <p className="font-medium">
              <DataValue className="font-semibold">{month.targetPeriod}</DataValue>
            </p>
            <p className="text-xs text-slate-500">
              <DataValue>{month.aggregatedYieldKg} kg</DataValue> ·{" "}
              <DataValue>{month.wageComplianceFlag.replace(/_/g, " ")}</DataValue>
            </p>
          </div>
          <VerificationBadge status={month.verification.status as VerificationStatus} />
        </div>
      ))}
    </div>
  );
}
