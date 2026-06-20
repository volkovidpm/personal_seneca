// Дневник практики: CRUD записей в localStorage.
import { read, write, KEYS } from "./storage";
import { isoDate } from "./dates";
import type { JournalEntry } from "../types";

function genId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

/** Все записи, новые сверху. */
export function listEntries(): JournalEntry[] {
  const all = read<JournalEntry[]>(KEYS.journal, []);
  return [...all].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : b.id.localeCompare(a.id)));
}

export function addEntry(
  data: Omit<JournalEntry, "id" | "date"> & { date?: string }
): JournalEntry {
  const entry: JournalEntry = {
    id: genId(),
    date: data.date ?? isoDate(),
    situation: data.situation,
    principle: data.principle,
    takeaway: data.takeaway,
    themeId: data.themeId,
    quoteId: data.quoteId,
  };
  const all = read<JournalEntry[]>(KEYS.journal, []);
  all.push(entry);
  write(KEYS.journal, all);
  return entry;
}

export function updateEntry(id: string, patch: Partial<JournalEntry>): void {
  const all = read<JournalEntry[]>(KEYS.journal, []);
  const next = all.map((e) => (e.id === id ? { ...e, ...patch, id: e.id } : e));
  write(KEYS.journal, next);
}

export function deleteEntry(id: string): void {
  const all = read<JournalEntry[]>(KEYS.journal, []);
  write(
    KEYS.journal,
    all.filter((e) => e.id !== id)
  );
}
