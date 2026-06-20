import { describe, expect, it } from "vitest";
import letters from "./letters.json";
import quotes from "./quotes.json";
import themes from "./themes.json";
import type { Letter, Quote, Theme } from "../types";

const L = letters as Letter[];
const Q = quotes as Quote[];
const T = themes as Theme[];

describe("letters.json", () => {
  it("не пустой и номера уникальны", () => {
    expect(L.length).toBeGreaterThan(50);
    expect(new Set(L.map((l) => l.number)).size).toBe(L.length);
  });

  it("в тексте не осталось сносок [n - ...]", () => {
    const bad = L.flatMap((l) => l.paragraphs).some((p) => /\[\d+\s*-/.test(p));
    expect(bad).toBe(false);
  });
});

describe("quotes.json", () => {
  it("id уникальны и ссылаются на существующие письма", () => {
    const nums = new Set(L.map((l) => l.number));
    expect(new Set(Q.map((q) => q.id)).size).toBe(Q.length);
    expect(Q.every((q) => nums.has(q.letterNumber))).toBe(true);
  });
});

describe("themes.json", () => {
  it("ссылается на существующие цитаты и письма", () => {
    const qids = new Set(Q.map((q) => q.id));
    const nums = new Set(L.map((l) => l.number));
    for (const t of T) {
      expect(t.quoteIds.every((id) => qids.has(id))).toBe(true);
      expect(t.letterNumbers.every((n) => nums.has(n))).toBe(true);
    }
  });
});
