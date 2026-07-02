"use client";

import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { EmptyStatePanel } from "@/components/ui/EmptyStatePanel";
import { LifecycleTimeline } from "@/components/lifecycle/LifecycleTimeline";
import { BodyText, DataValue } from "@/components/ui/typography";
import type { LifecycleStage } from "@/lib/lifecycle";

interface TimelineData {
  currentStage: LifecycleStage;
  locked: boolean;
  events: { stage: string; gps_coordinates: string; recorded_at: string }[];
  passportSlug?: string | null;
}

interface Props {
  trackingCode: string;
  timeline: TimelineData | null;
}

export function CustodyReviewPanel({ trackingCode, timeline }: Props) {
  if (!timeline) {
    return (
      <Card title="Custody review" weight="tertiary">
        <EmptyStatePanel
          compact
          icon="chain"
          title="No shipment loaded"
          description="Scan and load a tracking code in Track scan first, then return here to review the full custody record."
        />
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-forest/10 bg-inset/30 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Tracking code
          </p>
          <p className="mt-2 font-data text-sm font-semibold text-forest">{trackingCode || "—"}</p>
        </div>
        <div className="rounded-xl border border-forest/10 bg-inset/30 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Current stage
          </p>
          <p className="mt-2 font-data text-sm font-semibold text-forest">
            {timeline.currentStage.replace(/_/g, " ")}
          </p>
        </div>
        <div className="rounded-xl border border-forest/10 bg-inset/30 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Status</p>
          <p className="mt-2 text-sm font-semibold text-forest">
            {timeline.locked ? (
              <span className="locked-badge">Locked at port</span>
            ) : (
              <span className="text-amber-800">Awaiting final lock</span>
            )}
          </p>
        </div>
      </div>

      <Card title="Full custody timeline" weight="secondary">
        {timeline.passportSlug ? (
          <BodyText className="mb-3 font-medium text-forest">
            Public passport:{" "}
            <Link
              href={`/verify/passport/${encodeURIComponent(timeline.passportSlug)}`}
              className="font-data font-semibold text-amber-800 hover:underline"
            >
              {timeline.passportSlug}
            </Link>
          </BodyText>
        ) : null}
        <p className="mb-4 text-sm text-slate-600">
          <DataValue className="font-semibold">{timeline.events.length}</DataValue> custody event
          {timeline.events.length === 1 ? "" : "s"} on record for this shipment.
        </p>
        <LifecycleTimeline
          currentStage={timeline.currentStage}
          locked={timeline.locked}
          events={timeline.events}
        />
      </Card>
    </div>
  );
}
