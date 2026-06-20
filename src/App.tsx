import { useEffect, useState } from "react";
import { useHashRoute } from "./lib/useHashRoute";
import { read, write, KEYS } from "./lib/storage";
import { Today } from "./views/Today";
import { Read } from "./views/Read";
import { Themes } from "./views/Themes";
import { Journal } from "./views/Journal";
import { Favorites } from "./views/Favorites";

type ThemeMode = "light" | "dark";

const NAV: { view: string; label: string }[] = [
  { view: "today", label: "Сегодня" },
  { view: "read", label: "Читать" },
  { view: "themes", label: "Темы" },
  { view: "journal", label: "Дневник" },
  { view: "favorites", label: "Избранное" },
];

export function App() {
  const route = useHashRoute();
  const [theme, setTheme] = useState<ThemeMode>(() =>
    read<ThemeMode>(KEYS.theme, "light")
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    write(KEYS.theme, theme);
  }, [theme]);

  return (
    <div className="app">
      <header className="topbar">
        <a className="brand" href="#/today" aria-label="На главную">
          <span className="brand-mark">❦</span> Сенека
        </a>
        <nav className="nav">
          {NAV.map((n) => (
            <a
              key={n.view}
              href={`#/${n.view}`}
              className={route.view === n.view ? "nav-link active" : "nav-link"}
            >
              {n.label}
            </a>
          ))}
        </nav>
        <button
          className="theme-toggle"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          aria-label="Переключить тему"
          title="Светлая / тёмная тема"
        >
          {theme === "light" ? "☾" : "☀"}
        </button>
      </header>

      <main className="content">
        {route.view === "today" && <Today />}
        {route.view === "read" && <Read param={route.param} />}
        {route.view === "themes" && <Themes param={route.param} />}
        {route.view === "journal" && <Journal />}
        {route.view === "favorites" && <Favorites />}
      </main>

      <footer className="footer">
        Луций Анней Сенека · «Нравственные письма к Луцилию» ·{" "}
        <a href="#/read">Все письма</a>
      </footer>
    </div>
  );
}
