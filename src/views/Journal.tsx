import { useMemo, useState } from "react";
import themesData from "../data/themes.json";
import quotesData from "../data/quotes.json";
import type { JournalEntry, Quote, Theme } from "../types";
import { addEntry, deleteEntry, listEntries } from "../lib/journal";

const themes = themesData as Theme[];
const quotes = quotesData as Quote[];
const themeById = new Map(themes.map((t) => [t.id, t]));
const quoteById = new Map(quotes.map((q) => [q.id, q]));

export function Journal() {
  const [entries, setEntries] = useState<JournalEntry[]>(() => listEntries());
  const [situation, setSituation] = useState("");
  const [principle, setPrinciple] = useState("");
  const [takeaway, setTakeaway] = useState("");
  const [themeId, setThemeId] = useState("");

  const canSave = situation.trim() && takeaway.trim();

  function save() {
    if (!canSave) return;
    addEntry({
      situation: situation.trim(),
      principle: principle.trim(),
      takeaway: takeaway.trim(),
      themeId: themeId || undefined,
    });
    setSituation("");
    setPrinciple("");
    setTakeaway("");
    setThemeId("");
    setEntries(listEntries());
  }

  function remove(id: string) {
    deleteEntry(id);
    setEntries(listEntries());
  }

  return (
    <>
      <p className="eyebrow">Практика</p>
      <h1>Дневник</h1>
      <p className="muted">
        Зафиксируй ситуацию, какой принцип применил и что вынес. Записи хранятся
        только в этом браузере.
      </p>

      <div className="card">
        <label htmlFor="situation">Ситуация</label>
        <textarea
          id="situation"
          placeholder="Что произошло? Что задело?"
          value={situation}
          onChange={(e) => setSituation(e.target.value)}
        />
        <label htmlFor="principle">Какой принцип применил</label>
        <input
          id="principle"
          placeholder="Например: различай подвластное и неподвластное"
          value={principle}
          onChange={(e) => setPrinciple(e.target.value)}
        />
        <label htmlFor="takeaway">Вывод</label>
        <textarea
          id="takeaway"
          placeholder="Что понял, как поступлю в следующий раз?"
          value={takeaway}
          onChange={(e) => setTakeaway(e.target.value)}
        />
        <label htmlFor="theme">Тема (необязательно)</label>
        <select id="theme" value={themeId} onChange={(e) => setThemeId(e.target.value)}>
          <option value="">— без темы —</option>
          {themes.map((t) => (
            <option key={t.id} value={t.id}>
              {t.title}
            </option>
          ))}
        </select>
        <div className="row" style={{ marginTop: 16 }}>
          <button className="btn" disabled={!canSave} onClick={save}>
            Сохранить запись
          </button>
        </div>
      </div>

      <EntryList entries={entries} onDelete={remove} />
    </>
  );
}

function EntryList({
  entries,
  onDelete,
}: {
  entries: JournalEntry[];
  onDelete: (id: string) => void;
}) {
  const count = useMemo(() => entries.length, [entries]);
  if (count === 0) {
    return <p className="empty">Пока нет записей. Первая мысль — впереди.</p>;
  }
  return (
    <div className="card">
      <p className="field-label">Записи ({count})</p>
      {entries.map((e) => {
        const theme = e.themeId ? themeById.get(e.themeId) : undefined;
        const quote = e.quoteId ? quoteById.get(e.quoteId) : undefined;
        return (
          <div key={e.id} className="entry">
            <div className="row spread">
              <span className="date">{e.date}</span>
              <button className="fav-btn" title="Удалить" onClick={() => onDelete(e.id)}>
                ✕
              </button>
            </div>
            <div className="field-label">Ситуация</div>
            <div>{e.situation}</div>
            {e.principle && (
              <>
                <div className="field-label">Принцип</div>
                <div>{e.principle}</div>
              </>
            )}
            <div className="field-label">Вывод</div>
            <div>{e.takeaway}</div>
            {theme && (
              <a className="tag" href={`#/themes/${theme.id}`} style={{ marginTop: 8 }}>
                {theme.title}
              </a>
            )}
            {quote && <div className="muted" style={{ marginTop: 6 }}>«{quote.text}»</div>}
          </div>
        );
      })}
    </div>
  );
}
