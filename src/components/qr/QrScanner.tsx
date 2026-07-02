"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Button } from "@/components/ui/Button";
import { Card, type CardWeight } from "@/components/ui/Card";

interface QrScannerProps {
  onScan: (decodedText: string) => void;
  title?: string;
  containerId?: string;
  bare?: boolean;
  weight?: CardWeight;
}

export function QrScanner({
  onScan,
  title = "Scan QR Sticker",
  containerId: containerIdProp,
  bare = false,
  weight = "secondary",
}: QrScannerProps) {
  const [active, setActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerId = containerIdProp ?? "qr-reader-container";

  useEffect(() => {
    return () => {
      scannerRef.current?.stop().catch(() => undefined);
    };
  }, []);

  const startScanner = async () => {
    setError(null);
    try {
      const scanner = new Html5Qrcode(containerId);
      scannerRef.current = scanner;
      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 240, height: 240 } },
        (decoded) => {
          onScan(decoded);
          scanner.stop().catch(() => undefined);
          setActive(false);
        },
        () => undefined,
      );
      setActive(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Camera access failed");
    }
  };

  const stopScanner = async () => {
    await scannerRef.current?.stop().catch(() => undefined);
    setActive(false);
  };

  const body = (
    <>
      {bare && title ? <p className="mb-2 text-sm font-medium text-forest">{title}</p> : null}
      <div id={containerId} className="overflow-hidden rounded-lg bg-black/5" />
      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
      <div className="mt-3 flex gap-2">
        {!active ? (
          <Button type="button" onClick={startScanner}>
            Start Camera
          </Button>
        ) : (
          <Button type="button" variant="ghost" onClick={stopScanner}>
            Stop Camera
          </Button>
        )}
      </div>
    </>
  );

  if (bare) return body;

  return (
    <Card title={title} weight={weight}>
      {body}
    </Card>
  );
}
