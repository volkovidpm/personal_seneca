import { useState } from "react";
import type { Quote } from "../types";
import { isQuoteFav, toggleQuote } from "../lib/favorites";

export function QuoteCard({ quote }: { quote: Quote }) {
  const [fav, setFav] = useState(() => isQuoteFav(quote.id));
  return (
    <div className="card">
      <blockquote className="quote">«{quote.text}»</blockquote>
      <div className="row spread">
        <a className="quote-source" href={`#/read/${quote.letterNumber}`}>
          Письмо {quote.letterNumber} →
        </a>
        <button
          className={fav ? "fav-btn on" : "fav-btn"}
          title="В избранное"
          onClick={() => {
            toggleQuote(quote.id);
            setFav(isQuoteFav(quote.id));
          }}
        >
          {fav ? "★" : "☆"}
        </button>
      </div>
    </div>
  );
}
