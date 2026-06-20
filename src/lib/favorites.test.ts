import { beforeEach, describe, expect, it } from "vitest";
import { installMemoryStorage } from "../test/memoryStorage";
import { getFavorites, isLetterFav, isQuoteFav, toggleLetter, toggleQuote } from "./favorites";

beforeEach(() => installMemoryStorage());

describe("favorites", () => {
  it("переключает цитату туда и обратно", () => {
    toggleQuote("q1");
    expect(isQuoteFav("q1")).toBe(true);
    toggleQuote("q1");
    expect(isQuoteFav("q1")).toBe(false);
  });

  it("переключает письмо", () => {
    toggleLetter(7);
    expect(isLetterFav(7)).toBe(true);
    expect(getFavorites().letters).toContain(7);
  });

  it("хранит цитаты и письма независимо", () => {
    toggleQuote("q2");
    toggleLetter(3);
    const f = getFavorites();
    expect(f.quotes).toEqual(["q2"]);
    expect(f.letters).toEqual([3]);
  });
});
