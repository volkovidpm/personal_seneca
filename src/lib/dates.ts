// Утилиты для работы с календарными датами (без времени).

/** Локальная дата в формате yyyy-mm-dd. */
export function isoDate(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Разница в целых днях между двумя yyyy-mm-dd (b - a). */
export function dayDiff(a: string, b: string): number {
  const ta = Date.parse(a + "T00:00:00");
  const tb = Date.parse(b + "T00:00:00");
  return Math.round((tb - ta) / 86_400_000);
}
