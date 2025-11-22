export function parsePrice(raw: string): number {
  if (!raw) return 0;
  const cleaned = raw.replace(/[^0-9,]/g, "");
  const normalized = cleaned.replace(/,/g, ".");
  const numeric = Number(normalized);
  return Number.isFinite(numeric) ? numeric : 0;
}
