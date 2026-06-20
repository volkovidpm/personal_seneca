// Стрик заходов: сколько дней подряд пользователь открывает сайт.
import { read, write, KEYS } from "./storage";
import { isoDate, dayDiff } from "./dates";
import type { StreakState } from "../types";

const EMPTY: StreakState = { current: 0, longest: 0, lastVisit: null };

export function getStreak(): StreakState {
  return read<StreakState>(KEYS.streak, EMPTY);
}

/**
 * Зафиксировать заход в указанный день (по умолчанию сегодня) и вернуть
 * обновлённое состояние.
 * - тот же день → без изменений;
 * - следующий день → +1;
 * - пропуск дня → сброс до 1.
 */
export function recordVisit(today: string = isoDate()): StreakState {
  const prev = getStreak();
  let next: StreakState;

  if (prev.lastVisit === null) {
    next = { current: 1, longest: 1, lastVisit: today };
  } else if (prev.lastVisit === today) {
    next = prev;
  } else {
    const gap = dayDiff(prev.lastVisit, today);
    const current = gap === 1 ? prev.current + 1 : 1;
    next = {
      current,
      longest: Math.max(prev.longest, current),
      lastVisit: today,
    };
  }

  write(KEYS.streak, next);
  return next;
}
