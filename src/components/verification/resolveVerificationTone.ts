export type VerificationStatus =
  | "VERIFIED_ON_CHAIN"
  | "TAMPER_ALERT"
  | "PENDING_ANCHOR"
  | "LOCAL_MISMATCH"
  | "LOCAL_OK";

export type HeroTone = "verified" | "pending" | "local" | "alert";

export function resolveVerificationTone(params: {
  latestStatus?: VerificationStatus;
  tamperedMonthCount?: number;
  latestMessage?: string;
}): {
  tone: HeroTone;
  headline: string;
  subtitle: string;
  status: VerificationStatus;
} {
  const latestStatus = params.latestStatus ?? "PENDING_ANCHOR";
  const tampered = params.tamperedMonthCount ?? 0;
  const tamperNote =
    tampered > 0
      ? `${tampered} compliance month${tampered === 1 ? "" : "s"} failed verification. `
      : "";

  if (
    tampered > 0 ||
    latestStatus === "TAMPER_ALERT" ||
    latestStatus === "LOCAL_MISMATCH"
  ) {
    return {
      tone: "alert",
      headline: "Not verified",
      subtitle:
        tamperNote +
        (params.latestMessage ?? "Compliance records failed blockchain verification."),
      status: latestStatus,
    };
  }

  if (latestStatus === "VERIFIED_ON_CHAIN") {
    return {
      tone: "verified",
      headline: "Verified",
      subtitle: "Blockchain proof confirmed — this coffee meets on-chain compliance checks.",
      status: latestStatus,
    };
  }

  if (latestStatus === "LOCAL_OK") {
    return {
      tone: "local",
      headline: "Locally verified",
      subtitle:
        params.latestMessage ??
        "Records validated in the system — on-chain anchoring is not yet configured.",
      status: latestStatus,
    };
  }

  return {
    tone: "pending",
    headline: "Pending",
    subtitle:
      params.latestMessage ??
      "Compliance data recorded — awaiting on-chain anchor confirmation.",
    status: latestStatus,
  };
}

export const heroToneStyles: Record<
  HeroTone,
  { shell: string; iconWrap: string; icon: string; headline: string }
> = {
  verified: {
    shell:
      "border-amber-300/80 bg-gradient-to-br from-amber-50 via-white to-amber-50/40 shadow-amber-100/50",
    iconWrap: "bg-amber-100 ring-amber/25",
    icon: "text-amber-800",
    headline: "text-amber-900",
  },
  pending: {
    shell:
      "border-amber-200/80 bg-gradient-to-br from-amber-50/80 via-white to-white shadow-amber-50/40",
    iconWrap: "bg-amber-50 ring-amber/15",
    icon: "text-amber-700",
    headline: "text-amber-800",
  },
  local: {
    shell:
      "border-slate-300/80 bg-gradient-to-br from-slate-50 via-white to-slate-50/40 shadow-slate-100/50",
    iconWrap: "bg-slate-100 ring-slate-200/80",
    icon: "text-slate-700",
    headline: "text-slate-900",
  },
  alert: {
    shell:
      "border-red-300/80 bg-gradient-to-br from-red-50 via-white to-red-50/40 shadow-red-100/50",
    iconWrap: "bg-red-100 ring-red-200/80",
    icon: "text-red-700",
    headline: "text-red-900",
  },
};
