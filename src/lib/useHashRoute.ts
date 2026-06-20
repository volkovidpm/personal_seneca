// Простейший роутинг по hash: #/read/12, #/themes/fear и т.п.
import { useEffect, useState } from "react";

export interface Route {
  view: string; // today | read | themes | journal | favorites
  param?: string; // номер письма, id темы
}

function parse(): Route {
  const raw = window.location.hash.replace(/^#\/?/, "");
  const [view, param] = raw.split("/");
  return { view: view || "today", param: param || undefined };
}

export function useHashRoute(): Route {
  const [route, setRoute] = useState<Route>(parse);
  useEffect(() => {
    const onChange = () => setRoute(parse());
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  return route;
}

export function go(view: string, param?: string): void {
  window.location.hash = param ? `#/${view}/${param}` : `#/${view}`;
}
