import { useState } from "react";
import lettersData from "../data/letters.json";
import quotesData from "../data/quotes.json";
import type { Letter, Quote } from "../types";
import { getFavorites } from "../lib/favorites";
import { QuoteCard } from "../components/QuoteCard";

const quotes = quotesData as Quote[];
const letters = lettersData as Letter[];
const quoteById = new Map(quotes.map((q) => [q.id, q]));
const letterByNum = new Map(letters.map((l) => [l.number, l]));

export function Favorites() {
  // снимок на момент открытия экрана
  const [fav] = useState(() => getFavorites());

  const favQuotes = fav.quotes
    .map((id) => quoteById.get(id))
    .filter((q): q is Quote => Boolean(q));
  const favLetters = fav.letters
    .map((n) => letterByNum.get(n))
    .filter((l): l is Letter => Boolean(l))
    .sort((a, b) => a.number - b.number);

  const empty = favQuotes.length === 0 && favLetters.length === 0;

  return (
    <>
      <p className="eyebrow">Избранное</p>
      <h1>Сохранённое</h1>

      {empty && (
        <p className="empty">
          Пусто. Отмечай ★ цитаты и письма — они соберутся здесь.
        </p>
      )}

      {favQuotes.length > 0 && (
        <>
          <p className="field-label">Цитаты</p>
          {favQuotes.map((q) => (
            <QuoteCard key={q.id} quote={q} />
          ))}
        </>
      )}

      {favLetters.length > 0 && (
        <>
          <p className="field-label">Письма</p>
          <div className="list">
            {favLetters.map((l) => (
              <a key={l.number} className="letter-row" href={`#/read/${l.number}`}>
                <span className="num">{l.number}</span>
                <span className="snippet">{l.paragraphs[0]}</span>
              </a>
            ))}
          </div>
        </>
      )}
    </>
  );
}
