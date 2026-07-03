import type { FarmerSummary } from "@/services/api";

/** Dropdown / list label: `#101 — Jean Mukamana` */
export function formatFarmerOptionLabel(farmer: Pick<FarmerSummary, "id" | "fullName">): string {
  return `#${farmer.id} — ${farmer.fullName}`;
}

/** Resolve display label from a loaded farmer list; falls back to `#id` if name unknown. */
export function getFarmerDisplayLabel(
  farmers: FarmerSummary[],
  farmerId: string | number | null | undefined,
): string {
  if (farmerId === null || farmerId === undefined || farmerId === "") {
    return "—";
  }
  const id = typeof farmerId === "number" ? farmerId : Number(farmerId);
  if (!Number.isFinite(id)) {
    return String(farmerId);
  }
  const farmer = farmers.find((row) => row.id === id);
  return farmer ? formatFarmerOptionLabel(farmer) : `#${id}`;
}

export function buildFarmerLookup(farmers: FarmerSummary[]): Map<number, FarmerSummary> {
  return new Map(farmers.map((farmer) => [farmer.id, farmer]));
}
