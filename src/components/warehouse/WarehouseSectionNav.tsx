"use client";

export type WarehouseSection = "track-scan" | "storage-intake" | "lot-operations";

export const WAREHOUSE_SECTIONS: {
  id: WarehouseSection;
  label: string;
  description: string;
}[] = [
  {
    id: "track-scan",
    label: "Track scan",
    description: "Scan internal TRACK QR and review custody history",
  },
  {
    id: "storage-intake",
    label: "Storage intake",
    description: "Record warehouse stage with GPS location",
  },
  {
    id: "lot-operations",
    label: "Lot trace",
    description: "Trace and validate export lots in storage",
  },
];

interface Props {
  active: WarehouseSection;
  onChange: (section: WarehouseSection) => void;
  stageRecorded?: boolean;
}

export function WarehouseSectionNav({ active, onChange, stageRecorded = false }: Props) {
  return (
    <nav
      className="mb-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-stretch"
      aria-label="Warehouse portal sections"
    >
      {WAREHOUSE_SECTIONS.map((section) => {
        const isActive = active === section.id;
        const showBadge = section.id === "storage-intake" && stageRecorded;

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
