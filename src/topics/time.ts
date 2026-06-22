import type { Topic } from "./types";
import { buildMc, buildType, pick, randInt } from "./helpers";
import {
  digital,
  formalTime,
  informalTime,
  type ClockTime,
} from "./german";

// "nice" minutes for the informal everyday style (o'clock, quarters, half, fives)
const INFORMAL_MINUTES = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

function randInformalTime(): ClockTime {
  return { h24: randInt(1, 12), m: pick(INFORMAL_MINUTES) };
}

function randFormalTime(): ClockTime {
  // any 24h time, minutes in 5s to keep it readable
  return { h24: randInt(0, 23), m: pick([0, 5, 10, 15, 20, 30, 40, 45, 50, 55]) };
}

// a few plausible-but-wrong informal readings near the target
function informalWrongs(t: ClockTime): string[] {
  const variants: ClockTime[] = [
    { h24: t.h24, m: (t.m + 15) % 60 },
    { h24: t.h24, m: (t.m + 30) % 60 },
    { h24: (t.h24 % 12) + 1, m: t.m },
    { h24: t.h24, m: t.m === 30 ? 0 : 30 },
    { h24: ((t.h24 + 10) % 12) + 1, m: t.m },
  ];
  return variants.map(informalTime);
}

function formalWrongs(t: ClockTime): string[] {
  const variants: ClockTime[] = [
    { h24: (t.h24 + 1) % 24, m: t.m },
    { h24: t.h24, m: (t.m + 5) % 60 },
    { h24: (t.h24 + 12) % 24, m: t.m },
    { h24: t.h24, m: t.m === 0 ? 30 : 0 },
  ];
  return variants.map(formalTime);
}

export const timeTopic: Topic = {
  id: "time",
  title: "Telling the time",
  blurb: "Read clocks the everyday and the official way.",
  exercises: [
    {
      id: "time-informal-mc",
      title: "Everyday time · choose",
      blurb: "Pick the informal reading (Viertel nach, halb, vor).",
      game: "multiple-choice",
      generate: (n) =>
        buildMc(n, "time-inf-mc", () => {
          const t = randInformalTime();
          return {
            prompt: digital(t),
            answer: informalTime(t),
            wrongs: informalWrongs(t),
            hint: "everyday",
            clock: t,
          };
        }),
    },
    {
      id: "time-informal-type",
      title: "Everyday time · type",
      blurb: "Read the clock and write it the everyday way.",
      game: "type-answer",
      generate: (n) =>
        buildType(n, "time-inf-type", () => {
          const t = randInformalTime();
          return {
            prompt: digital(t),
            answer: informalTime(t),
            hint: "everyday",
            clock: t,
          };
        }),
    },
    {
      id: "time-formal-mc",
      title: "Official time · choose",
      blurb: "Pick the 24-hour reading (… Uhr …).",
      game: "multiple-choice",
      generate: (n) =>
        buildMc(n, "time-for-mc", () => {
          const t = randFormalTime();
          return {
            prompt: digital(t),
            answer: formalTime(t),
            wrongs: formalWrongs(t),
            hint: "official · 24h",
            clock: t,
          };
        }),
    },
    {
      id: "time-formal-type",
      title: "Official time · type",
      blurb: "Write the 24-hour reading for the clock.",
      game: "type-answer",
      generate: (n) =>
        buildType(n, "time-for-type", () => {
          const t = randFormalTime();
          return {
            prompt: digital(t),
            answer: formalTime(t),
            hint: "official · 24h",
            clock: t,
          };
        }),
    },
    {
      id: "time-ask-mc",
      title: "Asking & answering",
      blurb: "The phrases around times: Wie spät ist es?",
      game: "multiple-choice",
      generate: (n) => askingExercise(n),
    },
  ],
};

// Conversational frame around telling time. A small curated phrase bank.
const ASK_BANK: { prompt: string; answer: string; wrongs: string[]; hint: string }[] = [
  {
    prompt: "“What time is it?” (informally)",
    answer: "Wie spät ist es?",
    wrongs: ["Wie viel kostet es?", "Wann kommst du?", "Welcher Tag ist es?"],
    hint: "asking the time",
  },
  {
    prompt: "“What time is it?” (also correct)",
    answer: "Wie viel Uhr ist es?",
    wrongs: ["Wie alt bist du?", "Wo ist die Uhr?", "Wie geht es dir?"],
    hint: "asking the time",
  },
  {
    prompt: "“At what time …?”",
    answer: "Um wie viel Uhr …?",
    wrongs: ["Wie lange …?", "Seit wann …?", "Wie oft …?"],
    hint: "asking when",
  },
  {
    prompt: "Start an answer: “It is …”",
    answer: "Es ist …",
    wrongs: ["Es gibt …", "Ich bin …", "Es war …"],
    hint: "answering",
  },
  {
    prompt: "“The train leaves at 8.” → Der Zug fährt …",
    answer: "um acht Uhr",
    wrongs: ["am acht Uhr", "in acht Uhr", "zu acht Uhr"],
    hint: "‘at’ a clock time = um",
  },
  {
    prompt: "“in the morning” (e.g. 7 a.m.)",
    answer: "am Morgen",
    wrongs: ["in der Morgen", "zu Morgen", "an Morgen"],
    hint: "part of the day",
  },
  {
    prompt: "“in the evening” (e.g. 8 p.m.)",
    answer: "am Abend",
    wrongs: ["in Abend", "zu Abend", "an dem Abends"],
    hint: "part of the day",
  },
  {
    prompt: "“at night”",
    answer: "in der Nacht",
    wrongs: ["am Nacht", "zu Nacht", "an Nacht"],
    hint: "part of the day",
  },
  {
    prompt: "“at noon / midday”",
    answer: "am Mittag",
    wrongs: ["in Mittag", "zu Mittag Uhr", "an Mittag"],
    hint: "part of the day",
  },
  {
    prompt: "“on time / punctually”",
    answer: "pünktlich",
    wrongs: ["spät", "früh", "langsam"],
    hint: "adverb",
  },
];

import type { Question } from "../content/types";
function askingExercise(n: number): Question[] {
  return buildMc(n, "time-ask", () => {
    const item = pick(ASK_BANK);
    return {
      prompt: item.prompt,
      answer: item.answer,
      wrongs: item.wrongs,
      hint: item.hint,
    };
  });
}
