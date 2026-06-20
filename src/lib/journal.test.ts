import { beforeEach, describe, expect, it } from "vitest";
import { installMemoryStorage } from "../test/memoryStorage";
import { addEntry, deleteEntry, listEntries, updateEntry } from "./journal";

beforeEach(() => installMemoryStorage());

const sample = { situation: "Опоздал поезд", principle: "Различай подвластное", takeaway: "Спокоен" };

describe("journal", () => {
  it("добавляет и читает запись", () => {
    addEntry({ ...sample, date: "2026-06-20" });
    const all = listEntries();
    expect(all).toHaveLength(1);
    expect(all[0].situation).toBe("Опоздал поезд");
  });

  it("сортирует новые сверху по дате", () => {
    addEntry({ ...sample, date: "2026-06-18" });
    addEntry({ ...sample, date: "2026-06-20" });
    addEntry({ ...sample, date: "2026-06-19" });
    expect(listEntries().map((e) => e.date)).toEqual(["2026-06-20", "2026-06-19", "2026-06-18"]);
  });

  it("обновляет запись, не теряя id", () => {
    const e = addEntry({ ...sample, date: "2026-06-20" });
    updateEntry(e.id, { takeaway: "Изменено" });
    expect(listEntries()[0]).toMatchObject({ id: e.id, takeaway: "Изменено" });
  });

  it("удаляет запись", () => {
    const e = addEntry({ ...sample, date: "2026-06-20" });
    deleteEntry(e.id);
    expect(listEntries()).toHaveLength(0);
  });
});
