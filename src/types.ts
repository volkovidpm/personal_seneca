// Общие типы данных приложения.

export interface Letter {
  number: number;
  title: string;
  paragraphs: string[];
}

export interface Quote {
  id: string;
  text: string;
  letterNumber: number;
  themes: string[];
}

export interface Theme {
  id: string;
  title: string;
  description: string;
  quoteIds: string[];
  letterNumbers: number[];
}

export interface JournalEntry {
  id: string;
  date: string; // ISO yyyy-mm-dd
  situation: string;
  principle: string;
  takeaway: string;
  themeId?: string;
  quoteId?: string;
}

export interface StreakState {
  current: number;
  longest: number;
  lastVisit: string | null; // ISO yyyy-mm-dd
}

export interface Favorites {
  quotes: string[]; // quote ids
  letters: number[]; // letter numbers
}
