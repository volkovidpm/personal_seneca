import { beforeEach, describe, expect, it } from "vitest";
import { installMemoryStorage } from "../test/memoryStorage";
import { getStreak, recordVisit } from "./streak";

beforeEach(() => installMemoryStorage());

describe("streak", () => {
  it("первый заход даёт стрик 1", () => {
    expect(recordVisit("2026-06-20")).toMatchObject({ current: 1, longest: 1 });
  });

  it("повторный заход в тот же день не меняет стрик", () => {
    recordVisit("2026-06-20");
    expect(recordVisit("2026-06-20").current).toBe(1);
  });

  it("заход на следующий день растит стрик", () => {
    recordVisit("2026-06-20");
    recordVisit("2026-06-21");
    expect(recordVisit("2026-06-22")).toMatchObject({ current: 3, longest: 3 });
  });

  it("пропуск дня сбрасывает текущий, но хранит рекорд", () => {
    recordVisit("2026-06-20");
    recordVisit("2026-06-21");
    recordVisit("2026-06-22"); // longest = 3
    const after = recordVisit("2026-06-24"); // пропущен 23-е
    expect(after.current).toBe(1);
    expect(after.longest).toBe(3);
  });

  it("getStreak возвращает сохранённое состояние", () => {
    recordVisit("2026-06-20");
    expect(getStreak().lastVisit).toBe("2026-06-20");
  });
});
