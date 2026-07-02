export const LIFECYCLE_STAGES = [
  "AT_FARM",
  "AT_WASHING_STATION",
  "AT_EXPORT_LOT",
  "AT_WAREHOUSE",
  "PORT_LOCKED",
] as const;

export type LifecycleStage = (typeof LIFECYCLE_STAGES)[number];

export const STAGE_LABELS: Record<LifecycleStage, string> = {
  AT_FARM: "1. Farm — harvest delivered (no QR)",
  AT_WASHING_STATION: "2. Washing Station — scan pre-printed tracking QR",
  AT_EXPORT_LOT: "3. Export Lot — seal lot & issue buyer passport",
  AT_WAREHOUSE: "4. Warehouse — pallet stored",
  PORT_LOCKED: "5. Port — goods locked (final)",
};

export function parseTrackingCode(raw: string): string {
  const trimmed = raw.trim();
  const prefixed = trimmed.match(/^TRACK:(.+)$/i);
  return prefixed ? prefixed[1].trim() : trimmed;
}
