import type { Topic } from "./types";
import type { Question } from "../content/types";
import { VERBS, type PerfectVerb } from "./verbs";
import { shuffle } from "./helpers";

// Build a plausible-but-wrong participle for a given verb, so multiple-choice
// distractors look like real learner mistakes rather than random noise.
function wrongParticiples(v: PerfectVerb): string[] {
  const stem = v.infinitive.replace(/en$/, "").replace(/n$/, "");
  const out = new Set<string>();

  // Over-regularised form: ge- + stem + -t (the classic "gegeht" error).
  if (v.group !== "regular") out.add(`ge${stem}t`);
  // Strong-looking -en ending applied to a weak verb.
  if (v.group === "regular") out.add(`ge${stem}en`);
  // Wrong: kept the ge- on a -ieren / inseparable verb.
  if (!v.partizip.startsWith("ge")) out.add(`ge${v.partizip}`);
  // Wrong: dropped the ge- where it belongs.
  if (v.partizip.startsWith("ge")) out.add(v.partizip.slice(2));
  // Borrow other real participles as filler distractors.
  for (const other of shuffle(VERBS)) {
    if (out.size >= 5) break;
    if (other.partizip !== v.partizip) out.add(other.partizip);
  }
  out.delete(v.partizip);
  return [...out];
}

// Deriving Perfekt from an arbitrary Präsens sentence isn't reliably automatable,
// so "build the perfect" asks the learner to produce the verbal bracket directly:
// given "er (machen)", the answer is the auxiliary + participle → "hat gemacht".
// For separable verbs the answer is still a single participle word (already fused),
// e.g. "sie (aufstehen)" → "ist aufgestanden".
function buildPerfectClause(v: PerfectVerb): { prompt: string; answer: string; accept: string[] } {
  const aux = v.aux === "haben" ? "hat" : "ist";
  return {
    prompt: `er/sie (${v.infinitive})`,
    answer: `${aux} ${v.partizip}`,
    // tolerate extra spaces; the exact two words are what matters
    accept: [`${aux} ${v.partizip}`.replace(/\s+/g, " ")],
  };
}

export const perfectTopic: Topic = {
  id: "perfect",
  title: "The Perfect Tense (Partizip II)",
  blurb: "Talk about the past: haben/sein + Participle II. Drill the participles and pick the right auxiliary.",
  exercises: [
    {
      id: "perf-part-type",
      title: "Participle II · type",
      blurb: "See the verb & meaning, type its Partizip II.",
      game: "type-answer",
      generate: (n) => {
        const chosen = shuffle(VERBS).slice(0, n);
        return chosen.map<Question>((v, i) => ({
          kind: "type",
          sourceId: `perf-part-type-${i}`,
          chapter: 0,
          prompt: v.infinitive,
          answer: v.partizip,
          hint: `${v.en} · Partizip II`,
          example: `${v.example} — ${v.exampleEn}`,
        }));
      },
    },
    {
      id: "perf-part-mc",
      title: "Participle II · choose",
      blurb: "Pick the correct Partizip II among close look-alikes.",
      game: "multiple-choice",
      generate: (n) => {
        const chosen = shuffle(VERBS).slice(0, n);
        return chosen.map<Question>((v, i) => {
          const wrongs = shuffle(wrongParticiples(v)).slice(0, 3);
          return {
            kind: "mc",
            sourceId: `perf-part-mc-${i}`,
            chapter: 0,
            prompt: v.infinitive,
            answer: v.partizip,
            choices: shuffle([v.partizip, ...wrongs]),
            hint: `${v.en} · Partizip II`,
            example: `${v.example} — ${v.exampleEn}`,
          };
        });
      },
    },
    {
      id: "perf-aux-mc",
      title: "haben or sein? · choose",
      blurb: "Movement & change-of-state take sein — pick the auxiliary.",
      game: "multiple-choice",
      generate: (n) => {
        const chosen = shuffle(VERBS).slice(0, n);
        return chosen.map<Question>((v, i) => ({
          kind: "mc",
          sourceId: `perf-aux-mc-${i}`,
          chapter: 0,
          prompt: `sie ___ ${v.partizip}`,
          answer: v.aux === "haben" ? "hat" : "ist",
          choices: shuffle(["hat", "ist"]),
          hint: `${v.infinitive} — ${v.en}`,
          example: `${v.example} — ${v.exampleEn}`,
        }));
      },
    },
    {
      id: "perf-build-type",
      title: "Build the Perfect · type",
      blurb: "Complete the sentence bracket: type auxiliary + participle.",
      game: "type-answer",
      generate: (n) => {
        const chosen = shuffle(VERBS).slice(0, n);
        return chosen.map<Question>((v, i) => {
          const { prompt, answer, accept } = buildPerfectClause(v);
          return {
            kind: "type",
            sourceId: `perf-build-type-${i}`,
            chapter: 0,
            prompt,
            answer,
            accept,
            hint: `${v.infinitive} — ${v.en} · fill the bracket`,
            example: `${v.example} — ${v.exampleEn}`,
          };
        });
      },
    },
  ],
};
