// Domain types for the course content. These mirror the JSON emitted by
// scripts/parse_pdf.py. Pages/games import from `content.ts`, never the JSON.

export type ChapterId = number; // 1..18

export type Pos = "noun" | "verb" | "other";

export interface Chapter {
  id: ChapterId;
  title: string;
  sequenceCount: number;
  vocabCount: number;
  phraseCount: number;
}

export interface VocabEntry {
  id: string;
  chapter: ChapterId;
  sequence: number | null;
  theme: string | null;
  de: string;
  en: string;
  example: string | null;
  pos: Pos;
  article: string | null;
  plural: string | null;
}

export interface Phrase {
  id: string;
  chapter: ChapterId;
  category: string;
  de: string;
  en: string | null;
  register: "familiar" | "formal" | null;
}

export interface GrammarTable {
  headers: string[];
  rows: string[][];
}

export interface GrammarItem {
  type: "example" | "note";
  text: string;
}

export interface GrammarBlock {
  id: string;
  chapter: ChapterId;
  heading: string;
  kind: "conjugation" | "table" | "note";
  table: GrammarTable | null;
  items: GrammarItem[];
  raw: string;
}

export type ContentType = "vocab" | "phrases" | "grammar";
export type GameType =
  | "flashcards"
  | "multiple-choice"
  | "type-answer"
  | "match-fill"
  | "articles";
// Prompt direction for vocab: show German→recall English, or the reverse.
export type Direction = "de-en" | "en-de";

// A single normalised question consumed by the game components.
export interface Question {
  kind: "flashcard" | "mc" | "type" | "match" | "fill" | "article";
  sourceId: string;
  chapter: ChapterId;
  prompt: string; // what the learner sees
  answer: string; // the expected answer
  example?: string | null; // supporting sentence, when available
  hint?: string | null; // e.g. article / part of speech
  choices?: string[]; // for multiple choice
  // Optional clock face to render above the prompt (topic exercises only).
  clock?: { h24: number; m: number };
  // Accepted alternative answers for lenient type-checking (topic exercises).
  accept?: string[];
}
