"use client";

import { TypeLabel } from "@/components/ui/typography";
import { formatFarmerOptionLabel } from "@/lib/farmers";
import type { FarmerSummary } from "@/services/api";

interface Props {
  label?: string;
  farmerId: string;
  farmers: FarmerSummary[];
  loading: boolean;
  required?: boolean;
  disabled?: boolean;
  onChange: (farmerId: string) => void;
  onGoToFarmersTab?: () => void;
}

export function FarmerSelect({
  label = "Farmer",
  farmerId,
  farmers,
  loading,
  required = true,
  disabled = false,
  onChange,
  onGoToFarmersTab,
}: Props) {
  const isDisabled = disabled || loading || farmers.length === 0;

  return (
    <div className="space-y-1">
      <label htmlFor="farmer-select" className="block">
        <span className="eyebrow text-slate-600">{label}</span>
        <select
          id="farmer-select"
          className="type-body mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 font-data text-sm outline-none focus:border-forest focus:ring-2 focus:ring-forest/20 disabled:bg-slate-50 disabled:text-slate-500"
          value={farmerId}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          disabled={isDisabled}
        >
          <option value="">
            {loading
              ? "Loading farmers..."
              : farmers.length === 0
                ? "No farmers registered"
                : "Select farmer"}
          </option>
          {farmers.map((farmer) => (
            <option key={farmer.id} value={String(farmer.id)}>
              {formatFarmerOptionLabel(farmer)}
            </option>
          ))}
        </select>
      </label>
      {!loading && farmers.length === 0 && onGoToFarmersTab ? (
        <TypeLabel className="text-slate-600">
          Register farmers in the{" "}
          <button
            type="button"
            className="font-semibold text-forest underline"
            onClick={onGoToFarmersTab}
          >
            Farmers
          </button>{" "}
          tab first.
        </TypeLabel>
      ) : null}
      {farmerId && farmers.length > 0 ? (
        <TypeLabel className="font-data text-xs text-slate-500">
          Stored as farmer ID #{farmerId}
        </TypeLabel>
      ) : null}
    </div>
  );
}
