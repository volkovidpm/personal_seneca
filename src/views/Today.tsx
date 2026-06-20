import { useEffect, useMemo, useState } from "react";
import quotesData from "../data/quotes.json";
import type { Quote } from "../types";
import { quoteForDate } from "../lib/dailyQuote";
import { recordVisit } from "../lib/streak";
import { QuoteCard } from "../components/QuoteCard";
import { go } from "../lib/useHashRoute";

const quotes = quotesData as Quote[];

function plural(n: number, forms: [string, string, string]): string {
  const a = Math.abs(n) % 100;
  const b = a % 10;
  if (a > 10 && a < 20) return forms[2];
  if (b > 1 && b < 5) return forms[1];
  if (b === 1) return forms[0];
  return forms[2];
}

export function Today() {
  const quote = useMemo(() => quoteForDate(quotes), []);
  const [streak, setStreak] = useState(() => recordVisit());

  // recordVisit уже вызван при инициализации; перечитываем на случай смены дня.
  useEffect(() => {
    setStreak(recordVisit());
  }, []);

  return (
    <>
      <p className="eyebrow">Мысль дня</p>
      <h1>Сегодня</h1>
      <div className="row" style={{ margin: "10px 0 20px" }}>
        <span className="streak">
          🔥 <b>{streak.current}</b>{" "}
          {plural(streak.current, ["день", "дня", "дней"])} подряд
        </span>
        {streak.longest > streak.current && (
          <span className="muted">рекорд: {streak.longest}</span>
        )}
      </div>

      <QuoteCard quote={quote} />

      <div className="card">
        <p className="muted" style={{ marginTop: 0 }}>
          Прочитал мысль — примени её. Запиши, где сегодня это пригодилось.
        </p>
        <div className="row">
          <button className="btn" onClick={() => go("journal")}>
            ✎ Записать в дневник
          </button>
          <a className="btn ghost" href={`#/read/${quote.letterNumber}`}>
            Читать письмо целиком
          </a>
        </div>
      </div>
    </>
  );
}
