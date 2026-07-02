import { CheckCircle2, AlertTriangle, Clock } from "lucide-react";

type Status = "VERIFIED_ON_CHAIN" | "TAMPER_ALERT" | "PENDING_ANCHOR" | "LOCAL_MISMATCH" | "LOCAL_OK";

const config: Record<Status, { label: string; className: string; icon: typeof CheckCircle2 }> = {
  VERIFIED_ON_CHAIN: {
    label: "Verified on Blockchain",
    className: "status-highlight",
    icon: CheckCircle2,
  },
  TAMPER_ALERT: {
    label: "Tamper Alert: Data Mismatch",
    className: "bg-red-50 text-red-800 border-red-200",
    icon: AlertTriangle,
  },
  PENDING_ANCHOR: {
    label: "Pending Anchor",
    className: "status-highlight-subtle",
    icon: Clock,
  },
  LOCAL_MISMATCH: {
    label: "Local Data Mismatch",
    className: "bg-red-50 text-red-800 border-red-200",
    icon: AlertTriangle,
  },
  LOCAL_OK: {
    label: "Locally Valid",
    className: "bg-slate-50 text-slate-700 border-slate-200",
    icon: CheckCircle2,
  },
};

export function VerificationBadge({ status }: { status: Status }) {
  const item = config[status] ?? config.PENDING_ANCHOR;
  const Icon = item.icon;

  return (
    <span
      className={`font-data inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold tracking-wide ${item.className}`}
    >
      <Icon className="h-3.5 w-3.5" />
      {item.label}
    </span>
  );
}
