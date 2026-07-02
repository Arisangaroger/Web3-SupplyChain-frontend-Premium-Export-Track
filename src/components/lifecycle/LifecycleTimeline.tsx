"use client";

import { Check, Lock, MapPin } from "lucide-react";
import { useLifecycleStages } from "@/hooks/useLifecycleStages";
import type { LifecycleStage } from "@/lib/lifecycle";

export interface LifecycleTimelineEvent {
  stage: string;
  gps_coordinates: string;
  recorded_at: string;
}

function formatRecordedAt(iso: string): string {
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function StageDot({
  isCurrent,
  isCompleted,
}: {
  isCurrent: boolean;
  isCompleted: boolean;
}) {
  const size = isCurrent ? "h-4 w-4" : "h-2.5 w-2.5";

  if (isCompleted && !isCurrent) {
    return (
      <span
        className="relative z-10 flex h-3 w-3 shrink-0 items-center justify-center rounded-full bg-forest text-white shadow-sm"
        aria-hidden
      >
        <Check className="h-2 w-2" strokeWidth={3} />
      </span>
    );
  }

  if (isCurrent) {
    return (
      <span
        className={`relative z-10 ${size} shrink-0 rounded-full active-step-dot`}
        aria-hidden
      />
    );
  }

  return (
    <span
      className={`relative z-10 ${size} shrink-0 rounded-full border-2 border-slate-300 bg-white`}
      aria-hidden
    />
  );
}

export function LifecycleTimeline({
  currentStage,
  locked,
  events,
}: {
  currentStage: LifecycleStage;
  locked?: boolean;
  events?: LifecycleTimelineEvent[];
}) {
  const { stages, labels } = useLifecycleStages();
  const currentIndex = stages.indexOf(currentStage);

  const eventByStage = new Map(
    (events ?? []).map((event) => [event.stage, event] as const),
  );

  return (
    <ol className="relative m-0 list-none p-0" aria-label="Supply chain lifecycle">
      {stages.map((stage, index) => {
        const isLast = index === stages.length - 1;
        const isCurrent = stage === currentStage;
        const isPast = index < currentIndex;
        const event = eventByStage.get(stage);
        const isCompleted = isPast || Boolean(event);
        const label = labels[stage] ?? stage.replace(/_/g, " ");
        const connectorSolid = index < currentIndex;

        return (
          <li key={stage} className="relative flex gap-4 pb-8 last:pb-0">
            {/* Left rail: connector + dot */}
            <div className="relative flex w-4 shrink-0 flex-col items-center">
              {!isLast ? (
                <div
                  className={`absolute left-1/2 top-4 z-0 -translate-x-1/2 ${
                    connectorSolid
                      ? "w-0.5 bg-forest"
                      : "w-0 border-l-2 border-dashed border-slate-300"
                  }`}
                  style={{ height: "calc(100% + 0.5rem)" }}
                  aria-hidden
                />
              ) : null}

              <div className={`relative z-10 ${isCurrent ? "mt-0" : "mt-0.5"}`}>
                <StageDot isCurrent={isCurrent} isCompleted={isCompleted} />
              </div>
            </div>

            {/* Stage content */}
            <div className={`min-w-0 flex-1 ${isCurrent ? "pt-0" : "pt-0.5"}`}>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <p
                  className={`text-sm leading-snug ${
                    isCurrent
                      ? "active-step-label"
                      : isCompleted
                        ? "font-medium text-slate-800"
                        : "text-slate-400"
                  }`}
                >
                  {label}
                </p>
                <div className="flex shrink-0 items-center gap-2">
                  {isCurrent ? (
                    <span className="status-highlight-subtle rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide">
                      Current
                    </span>
                  ) : null}
                  {stage === "PORT_LOCKED" && locked ? (
                    <span className="locked-badge">
                      <Lock className="h-3 w-3" />
                      Locked
                    </span>
                  ) : null}
                </div>
              </div>

              {event ? (
                <div className="surface-inset mt-2 space-y-1 px-2.5 py-2">
                  <p className="flex items-start gap-1.5 font-data text-[11px] leading-relaxed text-slate-600">
                    <MapPin className="mt-0.5 h-3 w-3 shrink-0 text-forest/70" aria-hidden />
                    <span>{event.gps_coordinates || "GPS not recorded"}</span>
                  </p>
                  <p className="font-data text-[11px] text-slate-500">
                    {formatRecordedAt(event.recorded_at)}
                  </p>
                </div>
              ) : isPast ? (
                <p className="mt-1.5 font-data text-[11px] text-slate-400">
                  Stage completed · no GPS stamp stored
                </p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
