export function parseLocalYmd(ymd: string): Date {
  const s = ymd.trim().split("T")[0];
  const parts = s.split("-");
  if (parts.length !== 3) {
    return new Date(NaN);
  }
  const y = Number(parts[0]);
  const m = Number(parts[1]);
  const d = Number(parts[2]);
  if (!y || !m || !d) {
    return new Date(NaN);
  }
  return new Date(y, m - 1, d);
}

export function todayYmdLocal(): string {
  const t = new Date();
  const y = t.getFullYear();
  const mo = String(t.getMonth() + 1).padStart(2, "0");
  const da = String(t.getDate()).padStart(2, "0");
  return `${y}-${mo}-${da}`;
}

export function parseDateStringForDisplay(value: string): Date {
  const head = value.trim().split("T")[0];
  if (/^\d{4}-\d{2}-\d{2}$/.test(head)) {
    return parseLocalYmd(head);
  }
  return new Date(value);
}
