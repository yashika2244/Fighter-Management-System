export function parseDate(value: unknown): Date | null | undefined {
  if (value === "" || value === null || value === undefined) return undefined;
  if (typeof value === "number") {
    // Excel serialized date number: days since 1899-12-30
    const epoch = new Date(Date.UTC(1899, 11, 30));
    const ms = value * 24 * 60 * 60 * 1000;
    return new Date(epoch.getTime() + ms);
  }
  if (typeof value === "string") {
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
  }
  if (value instanceof Date) return value;
  return null;
}


