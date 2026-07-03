export const LIFECYCLE_STAGES = [
  "AT_FARM",
  "AT_WASHING_STATION",
  "AT_EXPORT_LOT",
  "AT_WAREHOUSE",
  "PORT_LOCKED",
] as const;

export type LifecycleStage = (typeof LIFECYCLE_STAGES)[number];

export const STAGE_LABELS: Record<LifecycleStage, string> = {
  AT_FARM: "1. Farm — cherries delivered",
  AT_WASHING_STATION: "2. Washing station — scan sack QR",
  AT_EXPORT_LOT: "3. Exporter — seal lot and issue passport",
  AT_WAREHOUSE: "4. Warehouse — store goods",
  PORT_LOCKED: "5. Port — final lock",
};

export function parseTrackingCode(raw: string): string {
  const trimmed = raw.trim();
  const prefixed = trimmed.match(/^TRACK:(.+)$/i);
  return prefixed ? prefixed[1].trim() : trimmed;
}
