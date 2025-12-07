export namespace DateHandler {
  export function toDate(value: Date | string | null | undefined): Date | null {
    if (value == null) return null;
    if (value instanceof Date && !isNaN(value.getTime())) return value;
    const parsed = new Date(value as string);
    return isNaN(parsed.getTime()) ? null : parsed;
  }
}
