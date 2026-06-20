import { useEffect, useMemo, useState } from "react";
import lettersData from "../data/letters.json";
import type { Letter } from "../types";
import { isLetterFav, toggleLetter } from "../lib/favorites";
import { isRead, toggleRead, getRead } from "../lib/progress";
import { go } from "../lib/useHashRoute";

const letters = (lettersData as Letter[]).slice().sort((a, b) => a.number - b.number);
const byNum = new Map(letters.map((l) => [l.number, l]));

export function Read({ param }: { param?: string }) {
  const num = param ? Number(param) : null;
  if (num && byNum.has(num)) return <Reader letter={byNum.get(num)!} />;
  return <LetterList />;
}

function LetterList() {
  const [readSet, setReadSet] = useState<Set<number>>(() => new Set(getRead()));
  useEffect(() => setReadSet(new Set(getRead())), []);
  const total = letters.length;
  const done = readSet.size;

  return (
    <>
      <p className="eyebrow">Чтение</p>
      <h1>Письма к Луцилию</h1>
      <p className="muted">
        Прочитано {done} из {total}.
      </p>
      <div className="list">
        {letters.map((l) => (
          <a key={l.number} className="letter-row" href={`#/read/${l.number}`}>
            <span className="num">{l.number}</span>
            <span className="snippet">{l.paragraphs[0]}</span>
            {readSet.has(l.number) && <span className="dot" title="Прочитано" />}
          </a>
        ))}
      </div>
    </>
  );
}

function Reader({ letter }: { letter: Letter }) {
  const [fav, setFav] = useState(() => isLetterFav(letter.number));
  const [done, setDone] = useState(() => isRead(letter.number));

  const idx = letters.findIndex((l) => l.number === letter.number);
  const prev = idx > 0 ? letters[idx - 1] : null;
  const next = idx < letters.length - 1 ? letters[idx + 1] : null;

  // прокрутка наверх при смене письма
  const key = useMemo(() => letter.number, [letter.number]);
  useEffect(() => {
    window.scrollTo({ top: 0 });
    setFav(isLetterFav(letter.number));
    setDone(isRead(letter.number));
  }, [key, letter.number]);

  return (
    <article className="reader">
      <div className="row spread">
        <a className="quote-source" href="#/read">
          ← Все письма
        </a>
        <button
          className={fav ? "fav-btn on" : "fav-btn"}
          title="В избранное"
          onClick={() => {
            toggleLetter(letter.number);
            setFav(isLetterFav(letter.number));
          }}
        >
          {fav ? "★" : "☆"}
        </button>
      </div>

      <h1>{letter.title}</h1>
      <p className="muted">Сенека приветствует Луцилия</p>

      {letter.paragraphs.map((p, i) => (
        <p key={i}>
          <span className="pnum">{i + 1}</span>
          {p}
        </p>
      ))}

      <div className="card">
        <div className="row spread">
          <button
            className={done ? "btn" : "btn ghost"}
            onClick={() => setDone(toggleRead(letter.number))}
          >
            {done ? "✓ Прочитано" : "Отметить прочитанным"}
          </button>
          <div className="row">
            {prev && (
              <button className="btn ghost" onClick={() => go("read", String(prev.number))}>
                ← {prev.number}
              </button>
            )}
            {next && (
              <button className="btn ghost" onClick={() => go("read", String(next.number))}>
                {next.number} →
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
