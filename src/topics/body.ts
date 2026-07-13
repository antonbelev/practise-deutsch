import type { Topic } from "./types";
import type { Question } from "../content/types";
import { BODY_PARTS, enPlural, type Article } from "./bodyParts";
import { shuffle } from "./helpers";

const ARTICLES: Article[] = ["der", "die", "das"];

export const bodyTopic: Topic = {
  id: "body",
  title: "Body parts (der Körper)",
  blurb: "Head to toe: articles, plurals and meanings for the parts of the body.",
  exercises: [
    {
      id: "body-article-mc",
      title: "der · die · das · choose",
      blurb: "Pick the correct article for each body part.",
      game: "multiple-choice",
      generate: (n) => {
        const chosen = pickCycle(n);
        return chosen.map<Question>((p, i) => ({
          kind: "mc",
          sourceId: `body-article-mc-${i}`,
          chapter: 0,
          prompt: p.singular,
          answer: p.article,
          choices: [...ARTICLES],
          hint: `the ${p.en} · which article?`,
          example: `${p.article} ${p.singular} — the ${p.en}`,
        }));
      },
    },
    {
      id: "body-de-en-mc",
      title: "German → English · choose",
      blurb: "See the German body part, pick its English meaning.",
      game: "multiple-choice",
      generate: (n) => {
        const chosen = pickCycle(n);
        return chosen.map<Question>((p, i) => {
          const wrongs = shuffle(BODY_PARTS.filter((o) => o.en !== p.en))
            .slice(0, 3)
            .map((o) => o.en);
          return {
            kind: "mc",
            sourceId: `body-de-en-mc-${i}`,
            chapter: 0,
            prompt: `${p.article} ${p.singular}`,
            answer: p.en,
            choices: shuffle([p.en, ...wrongs]),
            hint: "which body part?",
            example: `${p.article} ${p.singular} — the ${p.en}`,
          };
        });
      },
    },
    {
      id: "body-en-de-type",
      title: "English → German · type",
      blurb: "See the English part, type it with its article.",
      game: "type-answer",
      generate: (n) => {
        const chosen = pickCycle(n);
        return chosen.map<Question>((p, i) => ({
          kind: "type",
          sourceId: `body-en-de-type-${i}`,
          chapter: 0,
          prompt: `the ${p.en}`,
          answer: `${p.article} ${p.singular}`,
          // accept the noun alone, and the Fuß/Fuss spelling variant
          accept: acceptForms(p.article, p.singular),
          hint: "type the German with its article",
          example: `${p.article} ${p.singular} — the ${p.en}`,
        }));
      },
    },
    {
      id: "body-plural-type",
      title: "Make it plural · type",
      blurb: "See the singular, type the plural form.",
      game: "type-answer",
      generate: (n) => {
        const chosen = pickCycle(n);
        return chosen.map<Question>((p, i) => ({
          kind: "type",
          sourceId: `body-plural-type-${i}`,
          chapter: 0,
          prompt: `${p.article} ${p.singular}`,
          answer: `die ${p.plural}`,
          accept: [p.plural, `die ${p.plural}`],
          hint: `plural · the ${enPlural(p.en)}`,
          example: `die ${p.plural} — the ${enPlural(p.en)}`,
        }));
      },
    },
  ],
};

// There are only 16 parts; for a 20-question round, cycle through a reshuffled
// list so every part is seen and the round still fills.
function pickCycle(n: number) {
  const out = [];
  let pool: typeof BODY_PARTS = [];
  for (let i = 0; i < n; i++) {
    if (!pool.length) pool = shuffle(BODY_PARTS);
    out.push(pool.pop()!);
  }
  return out;
}

function acceptForms(article: Article, singular: string): string[] {
  const forms = [singular, `${article} ${singular}`];
  if (singular.includes("ß")) {
    const ss = singular.replace(/ß/g, "ss");
    forms.push(ss, `${article} ${ss}`);
  }
  return forms;
}
