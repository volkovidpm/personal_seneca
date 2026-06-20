import themesData from "../data/themes.json";
import quotesData from "../data/quotes.json";
import type { Quote, Theme } from "../types";
import { QuoteCard } from "../components/QuoteCard";
import { go } from "../lib/useHashRoute";

const themes = themesData as Theme[];
const quotes = quotesData as Quote[];
const quoteById = new Map(quotes.map((q) => [q.id, q]));

export function Themes({ param }: { param?: string }) {
  const theme = param ? themes.find((t) => t.id === param) : undefined;
  if (theme) return <ThemeDetail theme={theme} />;
  return <ThemeGrid />;
}

function ThemeGrid() {
  return (
    <>
      <p className="eyebrow">Принципы</p>
      <h1>Темы стоицизма</h1>
      <p className="muted">
        Что Сенека говорит о главных вопросах жизни. Выбери тему — получишь
        подборку цитат и ссылки на письма.
      </p>
      <div className="theme-grid">
        {themes.map((t) => (
          <button key={t.id} className="theme-card" onClick={() => go("themes", t.id)}>
            <h3>{t.title}</h3>
            <p>{t.description}</p>
          </button>
        ))}
      </div>
    </>
  );
}

function ThemeDetail({ theme }: { theme: Theme }) {
  const list = theme.quoteIds
    .map((id) => quoteById.get(id))
    .filter((q): q is Quote => Boolean(q));

  return (
    <>
      <a className="quote-source" href="#/themes">
        ← Все темы
      </a>
      <h1>{theme.title}</h1>
      <p className="muted">{theme.description}</p>

      {list.map((q) => (
        <QuoteCard key={q.id} quote={q} />
      ))}

      <div className="card">
        <p className="field-label">Письма по теме</p>
        <div className="row">
          {theme.letterNumbers.map((n) => (
            <a key={n} className="tag" href={`#/read/${n}`}>
              Письмо {n}
            </a>
          ))}
        </div>
      </div>
    </>
  );
}
