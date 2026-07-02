export function parsePassportSlug(raw: string): string {
  const trimmed = raw.trim();
  const match = trimmed.match(/^PASSPORT:(.+)$/i);
  return match ? match[1].trim() : trimmed;
}

export function parseLotCode(raw: string): string {
  return raw.trim().replace(/^LOT:/i, "");
}
