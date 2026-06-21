// Turns selected content into a shuffled list of Questions for a game.
// Distractors are sampled from the same selection so wrong answers stay plausible.

import { grammarFor, phrasesFor, vocabFor } from "./content";
import type {
  ChapterId,
  ContentType,
  GameType,
  Question,
  VocabEntry,
} from "./types";

export interface BuildOptions {
  chapters: ChapterId[];
  content: ContentType;
  game: GameType;
  /** direction for vocab: show German, answer English, or the reverse */
  direction?: "de-en" | "en-de";
  limit?: number;
}

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickDistractors(
  pool: string[],
  correct: string,
  n: number,
): string[] {
  const seen = new Set([norm(correct)]);
  const out: string[] = [];
  for (const candidate of shuffle(pool)) {
    if (out.length >= n) break;
    const key = norm(candidate);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(candidate);
  }
  return out;
}

export function norm(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/[.!?,;:"„“”]/g, "")
    .replace(/\s+/g, " ");
}

function vocabPrompt(v: VocabEntry, dir: "de-en" | "en-de") {
  return dir === "de-en"
    ? { prompt: v.de, answer: v.en }
    : { prompt: v.en, answer: v.de };
}

function buildVocab(opts: BuildOptions): Question[] {
  const dir = opts.direction ?? "de-en";
  const entries = vocabFor(opts.chapters).filter((v) => v.de && v.en);
  // a single answer pool used for distractors, biased to same part of speech
  const all = entries;

  const questions: Question[] = entries.map((v) => {
    const { prompt, answer } = vocabPrompt(v, dir);
    const samePos = all.filter((o) => o.pos === v.pos && o.id !== v.id);
    const pool = (samePos.length >= 8 ? samePos : all)
      .map((o) => (dir === "de-en" ? o.en : o.de))
      .filter(Boolean);

    const base: Question = {
      kind: kindForGame(opts.game),
      sourceId: v.id,
      chapter: v.chapter,
      prompt,
      answer,
      example: v.example,
      hint: v.article ? `${v.article} …` : v.pos === "verb" ? "verb" : null,
    };
    if (opts.game === "multiple-choice" || opts.game === "match-fill") {
      const distractors = pickDistractors(pool, answer, 3);
      base.choices = shuffle([answer, ...distractors]);
    }
    return base;
  });

  return finalize(questions, opts.limit);
}

function buildPhrases(opts: BuildOptions): Question[] {
  const phrases = phrasesFor(opts.chapters).filter((p) => p.de.length > 3);
  const questions: Question[] = [];

  // All phrase German strings — used as distractor pool for MC
  const allDe = phrases.map((p) => p.de);

  for (const p of phrases) {
    const words = p.de.split(" ").filter((w) => w.replace(/\W/g, "").length > 2);
    if (!words.length) continue;

    if (opts.game === "flashcards") {
      // Show German phrase, recall category / register
      questions.push({
        kind: "flashcard",
        sourceId: p.id,
        chapter: p.chapter,
        prompt: p.de,
        answer: p.en ?? p.category,
        example: null,
        hint: p.register,
      });
    } else if (opts.game === "multiple-choice") {
      // Show category label, pick the correct German phrase from 4 options
      const distractors = pickDistractors(allDe, p.de, 3);
      questions.push({
        kind: "mc",
        sourceId: p.id,
        chapter: p.chapter,
        prompt: p.category,
        answer: p.de,
        example: null,
        hint: p.register ?? undefined,
        choices: shuffle([p.de, ...distractors]),
      });
    } else {
      // type-answer and match-fill: fill in a blanked word from the phrase
      const target = words[Math.floor(Math.random() * words.length)];
      const blanked = p.de.replace(target, "____");
      questions.push({
        kind: "fill",
        sourceId: p.id,
        chapter: p.chapter,
        prompt: blanked,
        answer: target.replace(/[.,!?]/g, ""),
        example: p.de,
        hint: p.register,
      });
    }
  }
  return finalize(questions, opts.limit);
}

function buildGrammar(opts: BuildOptions): Question[] {
  // Conjugation drills: given a verb + pronoun, type/choose the correct form.
  const blocks = grammarFor(opts.chapters).filter((g) => g.table);
  const questions: Question[] = [];
  for (const g of blocks) {
    const t = g.table!;
    // headers: ["", verb1, verb2, ...]; rows: [pronoun, form1, form2, ...]
    for (const row of t.rows) {
      const pronoun = row[0];
      for (let c = 1; c < t.headers.length; c++) {
        const verb = t.headers[c];
        const form = row[c];
        if (!verb || !form) continue;
        const pool = t.rows.map((r) => r[c]).filter(Boolean);
        const base: Question = {
          kind: opts.game === "multiple-choice" || opts.game === "match-fill" ? "mc" : "type",
          sourceId: `${g.id}-${pronoun}-${verb}`,
          chapter: g.chapter,
          prompt: `${pronoun} … (${verb})`,
          answer: form,
          hint: g.heading,
          example: null,
        };
        if (base.kind === "mc") {
          base.choices = shuffle([form, ...pickDistractors(pool, form, 3)]);
        }
        questions.push(base);
      }
    }
  }
  return finalize(questions, opts.limit);
}

function kindForGame(game: GameType): Question["kind"] {
  switch (game) {
    case "flashcards":
      return "flashcard";
    case "multiple-choice":
      return "mc";
    case "type-answer":
      return "type";
    case "match-fill":
      return "match";
  }
}

function finalize(questions: Question[], limit?: number): Question[] {
  const shuffled = shuffle(questions);
  return typeof limit === "number" ? shuffled.slice(0, limit) : shuffled;
}

export function buildQuestions(opts: BuildOptions): Question[] {
  switch (opts.content) {
    case "vocab":
      return buildVocab(opts);
    case "phrases":
      return buildPhrases(opts);
    case "grammar":
      return buildGrammar(opts);
  }
}
