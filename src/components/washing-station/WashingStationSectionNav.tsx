"use client";

export type WashingStationSection = "farmers" | "intake" | "sack-qr" | "rollup" | "offline";

export const WASHING_STATION_SECTIONS: {
  id: WashingStationSection;
  label: string;
  description: string;
}[] = [
  {
    id: "farmers",
    label: "Farmers",
    description: "Add farmers and view their records",
  },
  {
    id: "intake",
    label: "Cherry intake",
    description: "Log cherry deliveries with GPS",
  },
  {
    id: "sack-qr",
    label: "Sack QR",
    description: "Scan sack sticker and link to farmer",
  },
  {
    id: "rollup",
    label: "Monthly rollup",
    description: "Sum monthly data and save on-chain",
  },
  {
    id: "offline",
    label: "Offline queue",
    description: "Sync deliveries saved without internet",
  },
];

interface Props {
  active: WashingStationSection;
  onChange: (section: WashingStationSection) => void;
  offlinePendingCount?: number;
  offlineFailedCount?: number;
}

export function WashingStationSectionNav({
  active,
  onChange,
  offlinePendingCount = 0,
  offlineFailedCount = 0,
}: Props) {
  const offlineBadgeCount = offlinePendingCount + offlineFailedCount;

  return (
    <nav
      className="mb-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-stretch"
      aria-label="Washing station sections"
    >
      {WASHING_STATION_SECTIONS.map((section) => {
        const isActive = active === section.id;
        const showBadge = section.id === "offline" && offlineBadgeCount > 0;

        return (
          <button
            key={section.id}
            type="button"
            onClick={() => onChange(section.id)}
            aria-current={isActive ? "page" : undefined}
            className={`flex min-w-0 flex-1 flex-col rounded-xl border px-4 py-3 text-left transition sm:min-w-[10rem] sm:max-w-[14rem] ${
              isActive
                ? "border-forest/25 bg-white shadow-sm ring-1 ring-forest/10"
                : "border-forest/10 bg-white/60 hover:border-forest/20 hover:bg-white"
            }`}
          >
            <span className="flex items-center gap-2">
              <span
                className={`text-sm font-semibold ${isActive ? "text-forest" : "text-slate-700"}`}
              >
                {section.label}
              </span>
              {showBadge ? (
                <span
                  className={`inline-flex min-w-[1.25rem] items-center justify-center rounded-full px-1.5 py-0.5 font-data text-[10px] font-semibold tabular-nums ${
                    offlineFailedCount > 0
                      ? "bg-red-100 text-red-700"
                      : "bg-amber/20 text-amber-900"
                  }`}
                >
                  {offlineBadgeCount}
                </span>
              ) : null}
            </span>
            <span className="mt-0.5 text-xs leading-snug text-slate-500">{section.description}</span>
          </button>
        );
      })}
    </nav>
  );
}
