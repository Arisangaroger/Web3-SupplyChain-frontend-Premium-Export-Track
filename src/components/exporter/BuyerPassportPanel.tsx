"use client";

import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { SurfaceInset } from "@/components/ui/SurfaceInset";
import { QrCodeDisplay } from "@/components/qr/QrCodeDisplay";

interface PassportData {
  passportSlug: string;
  passportQrPayload: string;
  buyerPassportPath: string;
}

interface Props {
  trackingCode: string;
  finalizedWeightKg: string;
  geoLoading: boolean;
  passport: PassportData | null;
  onTrackingCodeChange: (value: string) => void;
  onFinalizedWeightKgChange: (value: string) => void;
  onIssuePassport: () => void;
}

export function BuyerPassportPanel({
  trackingCode,
  finalizedWeightKg,
  geoLoading,
  passport,
  onTrackingCodeChange,
  onFinalizedWeightKgChange,
  onIssuePassport,
}: Props) {
  return (
    <Card
      step="2"
      title="Seal export lot & issue buyer passport"
      weight="primary"
      badge="Main action"
    >
      <SurfaceInset className="space-y-3 p-4">
        <Input
          label="Internal tracking code"
          mono
          value={trackingCode}
          onChange={(e) => onTrackingCodeChange(e.target.value)}
          placeholder="WS-QR-00012345"
        />
        <Input
          label="Graded / finalized weight (kg, optional)"
          mono
          value={finalizedWeightKg}
          onChange={(e) => onFinalizedWeightKgChange(e.target.value)}
        />
        <Button onClick={onIssuePassport} disabled={geoLoading || !trackingCode.trim()}>
          {geoLoading ? "Capturing GPS…" : "Seal lot & issue buyer passport"}
        </Button>
        {passport ? (
          <div className="space-y-3">
            <QrCodeDisplay
              value={passport.passportQrPayload}
              label="Buyer passport QR — print for importers"
            />
            <div className="status-highlight-subtle rounded-lg p-3 text-sm">
              <p className="font-semibold text-amber-900">Public URL:</p>
              <Link
                href={passport.buyerPassportPath}
                className="font-data break-all text-amber-800 hover:underline"
              >
                {passport.buyerPassportPath}
              </Link>
            </div>
          </div>
        ) : null}
      </SurfaceInset>
    </Card>
  );
}
