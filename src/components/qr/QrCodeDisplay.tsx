"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

interface Props {
  value: string;
  label?: string;
  size?: number;
}

export function QrCodeDisplay({ value, label, size = 180 }: Props) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!value.trim()) {
      setDataUrl(null);
      return;
    }

    QRCode.toDataURL(value, { width: size, margin: 2, errorCorrectionLevel: "M" })
      .then(setDataUrl)
      .catch(() => setDataUrl(null));
  }, [value, size]);

  if (!value.trim()) {
    return null;
  }

  return (
    <div className="surface-inset flex flex-col items-center gap-2 p-4">
      {dataUrl ? (
        <img
          src={dataUrl}
          alt={label ?? "QR code"}
          width={size}
          height={size}
          className="rounded-md"
        />
      ) : (
        <div
          className="flex items-center justify-center rounded-md bg-inset text-xs text-slate-500"
          style={{ width: size, height: size }}
        >
          Generating QR…
        </div>
      )}
      {label ? <p className="text-sm font-medium text-forest">{label}</p> : null}
      <p className="max-w-full break-all text-center font-data text-xs text-slate-500">{value}</p>
    </div>
  );
}
