"use client";

export type ExporterSection = "track-scan" | "buyer-passport" | "lot-operations";

export const EXPORTER_SECTIONS: {
  id: ExporterSection;
  label: string;
  description: string;
}[] = [
  {
    id: "track-scan",
    label: "Track scan",
    description: "Scan tracking code and see progress",
  },
  {
    id: "buyer-passport",
    label: "Buyer passport",
    description: "Seal lot and print buyer QR",
  },
  {
    id: "lot-operations",
    label: "Lot operations",
    description: "Create, split, and check export lots",
  },
];

interface Props {
  active: ExporterSection;
  onChange: (section: ExporterSection) => void;
  passportReady?: boolean;
}

export function ExporterSectionNav({ active, onChange, passportReady = false }: Props) {
  return (
    <nav
      className="mb-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-stretch"
      aria-label="Exporter portal sections"
    >
      {EXPORTER_SECTIONS.map((section) => {
        const isActive = active === section.id;
        const showBadge = section.id === "buyer-passport" && passportReady;

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
                <span className="inline-flex min-w-[1.25rem] items-center justify-center rounded-full bg-forest/10 px-1.5 py-0.5 font-data text-[10px] font-semibold text-forest">
                  ✓
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
