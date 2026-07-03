"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { QrScanner } from "@/components/qr/QrScanner";
import { FormErrorBanner } from "@/components/ui/FormFeedback";
import { LoadingStatePanel } from "@/components/ui/LoadingStatePanel";
import { BodyText, dataFieldClassName } from "@/components/ui/typography";

interface Props {
  input: string;
  loading: boolean;
  error: string | null;
  hasResult: boolean;
  scannerContainerId: string;
  scannerTitle: string;
  placeholder: string;
  verifyLabel?: string;
  title?: string;
  titleAfterResult?: string;
  description?: string;
  descriptionAfterResult?: string;
  onInputChange: (value: string) => void;
  onVerify: () => void;
  onScan: (code: string) => void;
}

export function VerifyLookupPanel({
  input,
  loading,
  error,
  hasResult,
  scannerContainerId,
  scannerTitle,
  placeholder,
  verifyLabel = "Verify",
  title = "Look up record",
  titleAfterResult = "Look up another record",
  description = "Scan the QR code or enter the code manually.",
  descriptionAfterResult = "Scan or enter a different code to check another record.",
  onInputChange,
  onVerify,
  onScan,
}: Props) {
  const [scannerOpen, setScannerOpen] = useState(!hasResult);

  useEffect(() => {
    if (hasResult) setScannerOpen(false);
  }, [hasResult]);

  if (loading && !hasResult) {
    return <LoadingStatePanel label="Checking…" />;
  }

  return (
    <Card
      title={hasResult ? titleAfterResult : title}
      weight={hasResult ? "tertiary" : "primary"}
      badge={hasResult ? undefined : "Look up"}
    >
      <BodyText muted className="mb-4">
        {hasResult ? descriptionAfterResult : description}
      </BodyText>

      {scannerOpen || !hasResult ? (
        <div className="mb-4">
          <QrScanner
            bare
            containerId={scannerContainerId}
            title={scannerTitle}
            onScan={(code) => {
              onScan(code);
              setScannerOpen(false);
            }}
          />
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setScannerOpen(true)}
          className="mb-4 type-body font-medium text-amber-800 transition hover:text-forest hover:underline"
        >
          Open QR scanner
        </button>
      )}

      <div className="flex flex-wrap gap-2">
        <div className="relative min-w-[200px] flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            aria-hidden
          />
          <input
            className={dataFieldClassName(
              "type-body w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3",
            )}
            placeholder={placeholder}
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onVerify();
            }}
          />
        </div>
        <button
          type="button"
          onClick={onVerify}
          className="rounded-lg bg-forest px-5 py-2 type-body font-medium text-white transition hover:bg-forest-light disabled:opacity-60"
          disabled={loading || !input.trim()}
        >
          {loading ? "Checking…" : verifyLabel}
        </button>
      </div>
      {error ? <FormErrorBanner>{error}</FormErrorBanner> : null}
    </Card>
  );
}
