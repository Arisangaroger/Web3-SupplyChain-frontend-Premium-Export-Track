import { AlertTriangle } from "lucide-react";

export function TamperAlertBanner({ count }: { count: number }) {
  if (count <= 0) return null;

  return (
    <div
      className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900"
      role="alert"
    >
      <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" aria-hidden />
      <div>
        <p className="font-semibold">Record check failed</p>
        <p className="mt-1 text-red-800">
          {count} month{count === 1 ? "" : "s"} did not match the ledger. Contact your exporter
          before accepting this shipment.
        </p>
      </div>
    </div>
  );
}
