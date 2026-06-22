import type { Question } from "../content/types";

export function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function randInt(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max - min + 1));
}

export function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Build N MC questions from a generator that yields {prompt, answer, wrongs, ...}. */
export function buildMc(
  count: number,
  idPrefix: string,
  gen: () => {
    prompt: string;
    answer: string;
    wrongs: string[];
    hint?: string;
    clock?: { h24: number; m: number };
    example?: string;
  },
): Question[] {
  const out: Question[] = [];
  const seenPrompts = new Set<string>();
  let guard = 0;
  while (out.length < count && guard++ < count * 40) {
    const q = gen();
    if (seenPrompts.has(q.prompt)) continue; // avoid duplicate prompts in one round
    seenPrompts.add(q.prompt);
    const choices = shuffle([q.answer, ...dedupeWrongs(q.answer, q.wrongs, 3)]);
    out.push({
      kind: "mc",
      sourceId: `${idPrefix}-${out.length}`,
      chapter: 0,
      prompt: q.prompt,
      answer: q.answer,
      choices,
      hint: q.hint ?? null,
      clock: q.clock,
      example: q.example ?? null,
    });
  }
  return out;
}

/** Build N type-answer questions. */
export function buildType(
  count: number,
  idPrefix: string,
  gen: () => {
    prompt: string;
    answer: string;
    accept?: string[];
    hint?: string;
    clock?: { h24: number; m: number };
    example?: string;
  },
): Question[] {
  const out: Question[] = [];
  const seen = new Set<string>();
  let guard = 0;
  while (out.length < count && guard++ < count * 40) {
    const q = gen();
    if (seen.has(q.prompt)) continue;
    seen.add(q.prompt);
    out.push({
      kind: "type",
      sourceId: `${idPrefix}-${out.length}`,
      chapter: 0,
      prompt: q.prompt,
      answer: q.answer,
      accept: q.accept,
      hint: q.hint ?? null,
      clock: q.clock,
      example: q.example ?? null,
    });
  }
  return out;
}

function dedupeWrongs(answer: string, wrongs: string[], n: number): string[] {
  const seen = new Set([norm(answer)]);
  const out: string[] = [];
  for (const w of shuffle(wrongs)) {
    if (out.length >= n) break;
    const k = norm(w);
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(w);
  }
  return out;
}

function norm(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, " ");
}
