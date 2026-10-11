const SHORT_DATE_FORMATTER = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

export function formatShortDate(value: string | Date): string {
  return SHORT_DATE_FORMATTER.format(value instanceof Date ? value : new Date(value));
}
