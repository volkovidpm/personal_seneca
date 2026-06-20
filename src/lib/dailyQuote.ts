// Детерминированный выбор «мысли дня»: одна и та же дата → одна и та же цитата.
import type { Quote } from "../types";
import { isoDate } from "./dates";

// Простой стабильный хеш строки (FNV-1a).
function hash(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** Возвращает цитату дня для заданной даты (yyyy-mm-dd). */
export function quoteForDate(quotes: Quote[], date: string = isoDate()): Quote {
  if (quotes.length === 0) {
    throw new Error("Пустой список цитат");
  }
  const idx = hash(date) % quotes.length;
  return quotes[idx];
}
