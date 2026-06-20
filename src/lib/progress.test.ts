import { beforeEach, describe, expect, it } from "vitest";
import { installMemoryStorage } from "../test/memoryStorage";
import { getRead, isRead, toggleRead } from "./progress";

beforeEach(() => installMemoryStorage());

describe("progress", () => {
  it("отмечает письмо прочитанным и снимает отметку", () => {
    expect(toggleRead(1)).toBe(true);
    expect(isRead(1)).toBe(true);
    expect(toggleRead(1)).toBe(false);
    expect(isRead(1)).toBe(false);
  });

  it("getRead возвращает только прочитанные номера", () => {
    toggleRead(2);
    toggleRead(5);
    expect(getRead().sort((a, b) => a - b)).toEqual([2, 5]);
  });
});
