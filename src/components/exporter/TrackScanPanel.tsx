"use client";

import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { EmptyStatePanel } from "@/components/ui/EmptyStatePanel";
import { LoadingStatePanel } from "@/components/ui/LoadingStatePanel";
import { LifecycleTimeline } from "@/components/lifecycle/LifecycleTimeline";
import { QrScanner } from "@/components/qr/QrScanner";
import { BodyText } from "@/components/ui/typography";
import type { LifecycleStage } from "@/lib/lifecycle";

interface TimelineData {
  currentStage: LifecycleStage;
  locked: boolean;
  events: { stage: string; gps_coordinates: string; recorded_at: string }[];
  passportSlug?: string | null;
}

interface Props {
  trackingCode: string;
  loading: boolean;
  timeline: TimelineData | null;
  onTrackingCodeChange: (value: string) => void;
  onScan: (code: string) => void;
  onLoadTimeline: () => void;
}

export function TrackScanPanel({
  trackingCode,
  loading,
  timeline,
  onTrackingCodeChange,
  onScan,
  onLoadTimeline,
}: Props) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <QrScanner onScan={onScan} title="Scan internal TRACK QR at export lot" weight="secondary" />

      <Card step="1" title="Load supply chain timeline" weight="secondary">
        <div className="space-y-3">
          <Input
            label="Internal tracking code"
            mono
            value={trackingCode}
            onChange={(e) => onTrackingCodeChange(e.target.value)}
            placeholder="WS-QR-00012345"
          />
          <Button onClick={onLoadTimeline} disabled={loading || !trackingCode.trim()}>
            {loading ? "Loading…" : "Load timeline"}
          </Button>
        </div>
      </Card>

      {loading ? (
        <div className="lg:col-span-2">
          <LoadingStatePanel label="Loading supply chain timeline…" />
        </div>
      ) : timeline ? (
        <Card title="Supply chain progress" weight="primary" badge="Verification result" className="lg:col-span-2">
          {timeline.passportSlug ? (
            <BodyText className="mb-3 font-medium text-forest">
              Buyer passport issued:{" "}
              <Link
                href={`/verify/passport/${encodeURIComponent(timeline.passportSlug)}`}
                className="font-data font-semibold text-amber-800 hover:underline"
              >
                {timeline.passportSlug}
              </Link>
            </BodyText>
          ) : null}
          <LifecycleTimeline
            currentStage={timeline.currentStage}
            locked={timeline.locked}
            events={timeline.events}
          />
        </Card>
      ) : (
        <Card title="Supply chain progress" weight="tertiary" className="lg:col-span-2">
          <EmptyStatePanel
            compact
            icon="chain"
            title="No timeline loaded"
            description="Scan the internal TRACK QR from the export sack, then load the timeline to confirm prior custody stages before sealing the lot."
          />
        </Card>
      )}
    </div>
  );
}
