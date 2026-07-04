// Content access layer. Today it loads committed static JSON; in the future this
// is the single seam to swap for an API call without touching pages/games.

import chaptersJson from "../data/chapters.json";
import vocabJson from "../data/vocab.json";
import phrasesJson from "../data/phrases.json";
import grammarJson from "../data/grammar.json";
import type {
  Chapter,
  ChapterId,
  ContentType,
  GrammarBlock,
  Phrase,
  VocabEntry,
} from "./types";

const chapters = chaptersJson as Chapter[];
const vocab = vocabJson as VocabEntry[];
const phrases = phrasesJson as Phrase[];
const grammar = grammarJson as GrammarBlock[];

export function getChapters(): Chapter[] {
  return chapters;
}

export function getChapter(id: ChapterId): Chapter | undefined {
  return chapters.find((c) => c.id === id);
}

export const CHAPTER_RANGE = {
  min: chapters.length ? chapters[0].id : 1,
  max: chapters.length ? chapters[chapters.length - 1].id : 18,
};

/** Vocab entries restricted to the selected chapters. */
export function vocabFor(chapterIds: Iterable<ChapterId>): VocabEntry[] {
  const set = new Set(chapterIds);
  return vocab.filter((v) => set.has(v.chapter));
}

export function phrasesFor(chapterIds: Iterable<ChapterId>): Phrase[] {
  const set = new Set(chapterIds);
  return phrases.filter((p) => set.has(p.chapter));
}

export function grammarFor(chapterIds: Iterable<ChapterId>): GrammarBlock[] {
  const set = new Set(chapterIds);
  return grammar.filter((g) => set.has(g.chapter));
}

/** How many gendered nouns (der/die/das) exist in a chapter selection. */
export function articleNounCountFor(chapterIds: Iterable<ChapterId>): number {
  return vocabFor(chapterIds).filter((v) => v.pos === "noun" && v.article).length;
}

/** How many practiseable items exist for a content type in a chapter selection. */
export function countFor(
  type: ContentType,
  chapterIds: Iterable<ChapterId>,
): number {
  switch (type) {
    case "vocab":
      return vocabFor(chapterIds).length;
    case "phrases":
      return phrasesFor(chapterIds).length;
    case "grammar":
      // grammar drills come from conjugation tables; count those
      return grammarFor(chapterIds).filter((g) => g.table).length;
  }
}
