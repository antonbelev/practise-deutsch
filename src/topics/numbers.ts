import type { Topic } from "./types";
import { buildMc, buildType, randInt } from "./helpers";
import { numberToGerman } from "./german";

function numberWrongs(n: number): string[] {
  const cands = new Set<number>();
  while (cands.size < 6) {
    const delta = randInt(-12, 12) || 1;
    const c = n + delta;
    if (c >= 0 && c !== n) cands.add(c);
    // a classic trap: swapped tens/units (45 ↔ 54)
    const swapped = (n % 10) * 10 + Math.floor((n % 100) / 10);
    if (swapped !== n && swapped >= 0) cands.add(swapped);
  }
  return [...cands].map((c) => numberToGerman(c));
}

export const numbersTopic: Topic = {
  id: "numbers",
  title: "Numbers",
  blurb: "Count, read and write German numbers 0–100.",
  exercises: [
    {
      id: "num-read-mc",
      title: "Read the number · choose",
      blurb: "See a digit, pick the German word.",
      game: "multiple-choice",
      generate: (n) =>
        buildMc(n, "num-read-mc", () => {
          const v = randInt(0, 100);
          return { prompt: String(v), answer: numberToGerman(v), wrongs: numberWrongs(v), hint: "number" };
        }),
    },
    {
      id: "num-write-type",
      title: "Write the number · type",
      blurb: "See a digit, write it out in German.",
      game: "type-answer",
      generate: (n) =>
        buildType(n, "num-write-type", () => {
          const v = randInt(0, 100);
          return { prompt: String(v), answer: numberToGerman(v), hint: "spell it out" };
        }),
    },
    {
      id: "num-hear-mc",
      title: "Word to digit · choose",
      blurb: "See the German word, pick the digit.",
      game: "multiple-choice",
      generate: (n) =>
        buildMc(n, "num-hear-mc", () => {
          const v = randInt(0, 100);
          const wrongs = new Set<number>();
          while (wrongs.size < 5) {
            const c = v + (randInt(-15, 15) || 1);
            if (c >= 0 && c !== v) wrongs.add(c);
          }
          return {
            prompt: numberToGerman(v),
            answer: String(v),
            wrongs: [...wrongs].map(String),
            hint: "which digit?",
          };
        }),
    },
  ],
};
