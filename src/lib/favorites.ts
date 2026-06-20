// Избранное: сохранённые цитаты (по id) и письма (по номеру).
import { read, write, KEYS } from "./storage";
import type { Favorites } from "../types";

const EMPTY: Favorites = { quotes: [], letters: [] };

export function getFavorites(): Favorites {
  return read<Favorites>(KEYS.favorites, EMPTY);
}

export function isQuoteFav(id: string): boolean {
  return getFavorites().quotes.includes(id);
}

export function isLetterFav(num: number): boolean {
  return getFavorites().letters.includes(num);
}

export function toggleQuote(id: string): Favorites {
  const f = getFavorites();
  const quotes = f.quotes.includes(id)
    ? f.quotes.filter((x) => x !== id)
    : [...f.quotes, id];
  const next = { ...f, quotes };
  write(KEYS.favorites, next);
  return next;
}

export function toggleLetter(num: number): Favorites {
  const f = getFavorites();
  const letters = f.letters.includes(num)
    ? f.letters.filter((x) => x !== num)
    : [...f.letters, num];
  const next = { ...f, letters };
  write(KEYS.favorites, next);
  return next;
}
