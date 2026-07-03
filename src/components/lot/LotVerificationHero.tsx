import { AlertTriangle, CheckCircle2, Clock, Package } from "lucide-react";
import { DataValue } from "@/components/ui/typography";
import { VerificationBadge } from "@/components/ui/VerificationBadge";
import {
  heroToneStyles,
  resolveVerificationTone,
  type HeroTone,
  type VerificationStatus,
} from "@/components/verification/resolveVerificationTone";

type LotMode = "SPLIT_LOT" | "LEGACY_LOT" | "EMPTY_LOT";

interface Allocation {
  farmerId: number;
  allocatedWeightKg: number;
  verification: { status: VerificationStatus } | null;
}

interface LegacyMonth {
  verification: { status: VerificationStatus; message?: string };
  targetPeriod: string;
  aggregatedYieldKg: number;
}

function aggregateLotVerification(
  mode: LotMode,
  allocations: Allocation[],
  month: LegacyMonth | null,
): {
  latestStatus: VerificationStatus;
  tamperedCount: number;
  verifiedCount: number;
  latestMessage?: string;
} {
  if (mode === "EMPTY_LOT") {
    return {
      latestStatus: "PENDING_ANCHOR",
      tamperedCount: 0,
      verifiedCount: 0,
      latestMessage: "This lot exists but has no farmer shares yet.",
    };
  }

  if (mode === "LEGACY_LOT" && month) {
    const status = month.verification.status;
    return {
      latestStatus: status,
      tamperedCount: status === "TAMPER_ALERT" || status === "LOCAL_MISMATCH" ? 1 : 0,
      verifiedCount: status === "VERIFIED_ON_CHAIN" ? 1 : 0,
      latestMessage: month.verification.message,
    };
  }

  const statuses = allocations
    .map((a) => a.verification?.status)
    .filter(Boolean) as VerificationStatus[];

  const tamperedCount = statuses.filter(
    (s) => s === "TAMPER_ALERT" || s === "LOCAL_MISMATCH",
  ).length;
  const verifiedCount = statuses.filter((s) => s === "VERIFIED_ON_CHAIN").length;

  let latestStatus: VerificationStatus = "PENDING_ANCHOR";
  if (tamperedCount > 0) latestStatus = "TAMPER_ALERT";
  else if (verifiedCount === allocations.length && allocations.length > 0) {
    latestStatus = "VERIFIED_ON_CHAIN";
  } else if (statuses.some((s) => s === "LOCAL_OK")) {
    latestStatus = "LOCAL_OK";
  }

  return { latestStatus, tamperedCount, verifiedCount };
}

function HeroIcon({ tone }: { tone: HeroTone }) {
  const className = `h-10 w-10 sm:h-12 sm:w-12 ${heroToneStyles[tone].icon}`;
  if (tone === "verified") return <CheckCircle2 className={className} aria-hidden />;
  if (tone === "alert") return <AlertTriangle className={className} aria-hidden />;
  return <Clock className={className} aria-hidden />;
}

interface Props {
  lotCode: string;
  mode: LotMode;
  allocations: Allocation[];
  month: LegacyMonth | null;
  farmerId?: number;
  totalAllocatedKg?: number;
}

export function LotVerificationHero({
  lotCode,
  mode,
  allocations,
  month,
  farmerId,
  totalAllocatedKg,
}: Props) {
  const aggregate = aggregateLotVerification(mode, allocations, month);
  const { tone, headline, subtitle, status } = resolveVerificationTone({
    latestStatus: aggregate.latestStatus,
    tamperedMonthCount: aggregate.tamperedCount,
    latestMessage: aggregate.latestMessage,
  });
  const styles = heroToneStyles[tone];

  const farmerCount = mode === "SPLIT_LOT" ? allocations.length : farmerId ? 1 : 0;
  const totalKg =
    totalAllocatedKg ??
    (mode === "SPLIT_LOT"
      ? allocations.reduce((sum, a) => sum + a.allocatedWeightKg, 0)
      : month?.aggregatedYieldKg);

  return (
    <section
      className={`overflow-hidden rounded-2xl border-2 shadow-lg ${styles.shell}`}
      aria-live="polite"
    >
      <div className="p-6 sm:p-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex min-w-0 flex-1 items-start gap-4 sm:gap-5">
            <div
              className={`flex shrink-0 items-center justify-center rounded-2xl p-3 ring-2 sm:p-4 ${styles.iconWrap}`}
            >
              <HeroIcon tone={tone} />
            </div>
            <div className="min-w-0">
              <p className="eyebrow text-slate-500">Export lot check</p>
              <p
                className={`mt-1 font-display text-display-lg font-bold uppercase tracking-tight ${styles.headline}`}
              >
                {headline}
              </p>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-600">{subtitle}</p>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <VerificationBadge status={status} />
                <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">
                  <Package className="h-3.5 w-3.5" aria-hidden />
                  {mode.replace(/_/g, " ")}
                </span>
              </div>
            </div>
          </div>

          <div className="grid shrink-0 grid-cols-2 gap-6 sm:gap-10 lg:text-right">
            <div>
              <p className="eyebrow text-slate-500">Lot code</p>
              <p className="mt-1 font-data text-2xl font-bold leading-tight text-forest sm:text-3xl">
                {lotCode}
              </p>
            </div>
            <div>
              <p className="eyebrow text-slate-500">
                {mode === "SPLIT_LOT" ? "Farmers · weight" : "Farmer · yield"}
              </p>
              <p className="mt-1 font-data text-3xl font-bold leading-none text-forest sm:text-4xl">
                {mode === "SPLIT_LOT" ? (
                  <>
                    {farmerCount}
                    <span className="mx-1 text-xl text-slate-400">·</span>
                    {totalKg ?? "—"}
                    {totalKg != null ? (
                      <span className="ml-1 text-lg font-semibold text-slate-500">kg</span>
                    ) : null}
                  </>
                ) : farmerId ? (
                  <>
                    {farmerId}
                    {totalKg != null ? (
                      <>
                        <span className="mx-1 text-xl text-slate-400">·</span>
                        {totalKg}
                        <span className="ml-1 text-lg font-semibold text-slate-500">kg</span>
                      </>
                    ) : null}
                  </>
                ) : (
                  "—"
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 border-t border-black/5 pt-5 text-sm text-slate-600">
          {aggregate.verifiedCount > 0 ? (
            <p>
              <DataValue className="font-semibold">{aggregate.verifiedCount}</DataValue> verified
              verified share{aggregate.verifiedCount === 1 ? "" : "s"}
            </p>
          ) : null}
          {aggregate.tamperedCount > 0 ? (
            <p className="font-medium text-red-700">
              <DataValue className="font-semibold text-red-700">{aggregate.tamperedCount}</DataValue>{" "}
              failed share{aggregate.tamperedCount === 1 ? "" : "s"}
            </p>
          ) : null}
          {mode === "LEGACY_LOT" && month ? (
            <p>
              Period <DataValue className="font-semibold">{month.targetPeriod}</DataValue>
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
