// Прогресс чтения: какие письма отмечены прочитанными.
import { read, write, KEYS } from "./storage";

type ProgressMap = Record<number, boolean>;

export function getRead(): number[] {
  const map = read<ProgressMap>(KEYS.progress, {});
  return Object.keys(map)
    .filter((k) => map[Number(k)])
    .map(Number);
}

export function isRead(num: number): boolean {
  return read<ProgressMap>(KEYS.progress, {})[num] === true;
}

export function setRead(num: number, value: boolean): void {
  const map = read<ProgressMap>(KEYS.progress, {});
  if (value) map[num] = true;
  else delete map[num];
  write(KEYS.progress, map);
}

export function toggleRead(num: number): boolean {
  const next = !isRead(num);
  setRead(num, next);
  return next;
}
