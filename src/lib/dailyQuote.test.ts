import { describe, expect, it } from "vitest";
import { quoteForDate } from "./dailyQuote";
import type { Quote } from "../types";

const quotes: Quote[] = Array.from({ length: 10 }, (_, i) => ({
  id: `q${i}`,
  text: `цитата ${i}`,
  letterNumber: i + 1,
  themes: [],
}));

describe("dailyQuote", () => {
  it("одна и та же дата → одна и та же цитата", () => {
    const a = quoteForDate(quotes, "2026-06-20");
    const b = quoteForDate(quotes, "2026-06-20");
    expect(a.id).toBe(b.id);
  });

  it("разные даты дают разнообразие (не всё одно и то же)", () => {
    const ids = new Set<string>();
    const base = new Date("2026-01-01");
    for (let i = 0; i < 60; i++) {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      ids.add(quoteForDate(quotes, d.toISOString().slice(0, 10)).id);
    }
    expect(ids.size).toBeGreaterThan(3);
  });

  it("пустой список — ошибка", () => {
    expect(() => quoteForDate([], "2026-06-20")).toThrow();
  });
});
