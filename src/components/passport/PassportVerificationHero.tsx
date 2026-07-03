"use client";

import { useEffect, useRef, useState } from "react";
import { AlertTriangle, CheckCircle2, Clock, ShieldCheck } from "lucide-react";
import { LIFECYCLE_STAGES, STAGE_LABELS, type LifecycleStage } from "@/lib/lifecycle";
import { DataValue } from "@/components/ui/typography";
import { VerificationBadge } from "@/components/ui/VerificationBadge";
import { scoreRangeStyle } from "@/lib/scoreVisuals";
import {
  heroToneStyles,
  resolveVerificationTone,
  type HeroTone,
  type VerificationStatus,
} from "@/components/verification/resolveVerificationTone";

export interface PassportHeroData {
  passportSlug: string;
  farmerId: number;
  sackWeightKg: number | null;
  lockedAtPort: boolean;
  passportIssuedAt?: string;
  lifecycleStage?: string;
  compliance: {
    verifiedMonthCount: number;
    tamperedMonthCount: number;
    creditReadiness: string;
    creditScore?: { score: number | null; grade: string | null } | null;
    latestMonth?: {
      verification: { status: VerificationStatus; message?: string };
      targetPeriod?: string;
    } | null;
  };
}

function HeroIcon({ tone }: { tone: HeroTone }) {
  const className = `h-10 w-10 sm:h-12 sm:w-12 ${heroToneStyles[tone].icon}`;
  if (tone === "verified") return <CheckCircle2 className={className} aria-hidden />;
  if (tone === "alert") return <AlertTriangle className={className} aria-hidden />;
  if (tone === "local") return <ShieldCheck className={className} aria-hidden />;
  return <Clock className={className} aria-hidden />;
}

function formatLifecycleStage(stage?: string): string | null {
  if (!stage) return null;
  if (LIFECYCLE_STAGES.includes(stage as LifecycleStage)) {
    return STAGE_LABELS[stage as LifecycleStage];
  }
  return stage.replace(/_/g, " ").toLowerCase();
}

export function PassportVerificationHero({ data }: { data: PassportHeroData }) {
  const { tone, headline, subtitle, status } = resolveVerificationTone({
    latestStatus: data.compliance.latestMonth?.verification?.status,
    tamperedMonthCount: data.compliance.tamperedMonthCount,
    latestMessage: data.compliance.latestMonth?.verification?.message,
  });
  const styles = heroToneStyles[tone];
  const stageLabel = formatLifecycleStage(data.lifecycleStage);

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
              <p className="eyebrow text-slate-500">Buyer passport</p>
              <p
                className={`mt-1 font-display text-display-lg font-bold uppercase tracking-tight ${styles.headline}`}
              >
                {headline}
              </p>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-600">{subtitle}</p>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <VerificationBadge status={status} />
                {data.lockedAtPort ? (
                  <span className="locked-badge px-3 py-1 text-xs normal-case tracking-normal">
                    <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
                    Export cleared at port
                  </span>
                ) : null}
              </div>
            </div>
          </div>

          <div className="grid shrink-0 grid-cols-2 gap-6 sm:gap-10 lg:text-right">
            <div>
              <p className="eyebrow text-slate-500">Farmer ID</p>
              <p className="mt-1 font-data text-4xl font-bold leading-none text-forest sm:text-5xl">
                {data.farmerId}
              </p>
            </div>
            <div>
              <p className="eyebrow text-slate-500">Sack weight</p>
              <p className="mt-1 font-data text-4xl font-bold leading-none text-forest sm:text-5xl">
                {data.sackWeightKg != null ? (
                  <>
                    {data.sackWeightKg}
                    <span className="ml-1 text-xl font-semibold text-slate-500 sm:text-2xl">kg</span>
                  </>
                ) : (
                  <span className="text-3xl text-slate-400">—</span>
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 border-t border-black/5 pt-5 text-sm text-slate-600">
          <p>
            Passport{" "}
            <DataValue size="sm" className="font-semibold text-forest">
              {data.passportSlug}
            </DataValue>
          </p>
          <p>
            <DataValue className="font-semibold">{data.compliance.verifiedMonthCount}</DataValue>{" "}
            verified month{data.compliance.verifiedMonthCount === 1 ? "" : "s"}
          </p>
          {data.compliance.tamperedMonthCount > 0 ? (
            <p className="font-medium text-red-700">
              <DataValue className="font-semibold text-red-700">
                {data.compliance.tamperedMonthCount}
              </DataValue>{" "}
              failed month{data.compliance.tamperedMonthCount === 1 ? "" : "s"}
            </p>
          ) : null}
          <p>
            Credit readiness{" "}
            <DataValue className="font-semibold text-forest">{data.compliance.creditReadiness}</DataValue>
          </p>
          {data.compliance.creditScore?.score != null ? (
            <p>
              Farmer score{" "}
              <DataValue
                size="sm"
                className={`font-bold ${scoreRangeStyle(data.compliance.creditScore.score).label}`}
              >
                {data.compliance.creditScore.score}
              </DataValue>
              {data.compliance.creditScore.grade ? (
                <>
                  {" "}
                  · Grade{" "}
                  <DataValue size="sm" className="font-semibold">
                    {data.compliance.creditScore.grade}
                  </DataValue>
                </>
              ) : null}
            </p>
          ) : null}
          {data.compliance.latestMonth?.targetPeriod ? (
            <p>
              Latest period{" "}
              <DataValue className="font-semibold">
                {data.compliance.latestMonth.targetPeriod}
              </DataValue>
            </p>
          ) : null}
          {stageLabel ? <p>Stage {stageLabel}</p> : null}
          {data.passportIssuedAt ? (
            <p>
              Issued{" "}
              <DataValue size="xs">{new Date(data.passportIssuedAt).toLocaleDateString()}</DataValue>
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
