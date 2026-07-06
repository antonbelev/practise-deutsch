// German noun-gender rules, adapted from Duolingo's "der/die/das" guide.
// https://blog.duolingo.com/german-gender-der-die-das/
//
// These are heuristics, not laws — German gender has many exceptions, and the
// single most reliable strategy is still to learn each noun *with* its article.
// We use them for two things: a browsable cheat-sheet, and a contextual "why"
// tip shown in the Der/Die/Das game after each answer.

export type Gender = "der" | "die" | "das";

export interface GenderRule {
  gender: Gender;
  /** short human label for the cheat-sheet, e.g. "-ung, -heit, -keit" */
  label: string;
  /** fuller explanation */
  detail: string;
  /** suffixes that trigger this rule (lowercase, no leading dash) */
  suffixes?: string[];
  /** example words (already include their article) */
  examples: string[];
}

// Ordered roughly by usefulness. Suffix lists drive both the cheat-sheet and the
// runtime matcher. Longer/more-specific suffixes must be matched before short
// ones (handled by sorting in matchGenderRule), so "-ung" wins over a bare "-e".
export const GENDER_RULES: GenderRule[] = [
  // ---- FEMININE (die) ----
  {
    gender: "die",
    label: "-ung, -heit, -keit, -schaft, -tät, -ion, -ik, -ur",
    detail:
      "Nouns with these endings are almost always feminine — this is one of the most reliable rules in German.",
    suffixes: [
      "ung",
      "heit",
      "keit",
      "schaft",
      "tät",
      "tion",
      "sion",
      "ion",
      "ik",
      "enz",
      "anz",
      "ei",
      "ie",
      "ur",
      "age",
      "ade",
    ],
    examples: ["die Zeitung", "die Freiheit", "die Musik", "die Kultur"],
  },
  {
    gender: "die",
    label: "-e (most words)",
    detail:
      "Most nouns ending in -e are feminine (with common exceptions like der Junge, der Name).",
    suffixes: ["e"],
    examples: ["die Sprache", "die Blume", "die Katze"],
  },
  {
    gender: "die",
    label: "Female people, numbers, many trees",
    detail:
      "Words for women and female roles, cardinal numbers, and most trees are feminine.",
    examples: ["die Mutter", "die Ärztin", "die Eiche (oak)"],
  },

  // ---- NEUTER (das) ----
  {
    gender: "das",
    label: "-chen, -lein (diminutives)",
    detail:
      "Diminutives ending in -chen or -lein are always neuter — even das Mädchen (girl).",
    suffixes: ["chen", "lein"],
    examples: ["das Mädchen", "das Brötchen", "das Fräulein"],
  },
  {
    gender: "das",
    label: "-um, -ium, -o, -nis, -tum",
    detail: "Nouns with these (often borrowed) endings are typically neuter.",
    // -ment/-ma dropped from matching: unreliable in the A1 set (das Moment vs.
    // der Moment, die Firma). Kept out to avoid over-confident tips.
    suffixes: ["ium", "um", "nis", "tum", "ial", "o"],
    examples: ["das Museum", "das Auto", "das Ergebnis"],
  },
  {
    gender: "das",
    label: "Colours, metals, verb & adjective nouns",
    detail:
      "Colours used as nouns, metals and elements, fractions, and nouns made from verbs or adjectives are neuter.",
    examples: ["das Blau", "das Kupfer (copper)", "das Schreiben"],
  },

  // ---- MASCULINE (der) ----
  {
    gender: "der",
    label: "-er, -ling, -or, -ismus, -ist",
    detail:
      "Agent nouns and -isms are usually masculine. Note -er is only a weak signal (das Wasser, die Mutter also end in -er).",
    // -ant/-ich dropped from matching (too many neuter exceptions like das
    // Restaurant); -er kept but it's the weakest masculine ending.
    suffixes: ["ismus", "ling", "ner", "ist", "or", "ig", "er"],
    examples: ["der Lehrer", "der Lehrling", "der Motor", "der Tourist"],
  },
  {
    gender: "der",
    label: "Male people, seasons, months, days, weather",
    detail:
      "Words for men and male roles, plus seasons, months, days, compass directions and most weather are masculine.",
    examples: ["der Bruder", "der Herbst", "der Montag", "der Schnee"],
  },
];

// A handful of high-frequency A1 exceptions worth calling out.
export const GENDER_EXCEPTIONS: { word: string; note: string }[] = [
  { word: "das Mädchen", note: "girl — neuter because of the -chen ending" },
  { word: "der Junge", note: "boy — masculine despite the -e ending" },
  { word: "der Name", note: "name — masculine despite the -e ending" },
  { word: "der Euro", note: "euro — masculine despite the -o ending" },
];

/**
 * Find the rule that best explains a noun's gender. Only returns a rule whose
 * gender matches `gender` (so we never show a rule the word contradicts), and
 * prefers the most specific suffix match. Returns null when no suffix rule fits.
 */
export function matchGenderRule(
  bareNoun: string,
  gender: Gender,
): GenderRule | null {
  const word = bareNoun.trim().toLowerCase();
  let best: { rule: GenderRule; len: number } | null = null;

  for (const rule of GENDER_RULES) {
    if (rule.gender !== gender || !rule.suffixes) continue;
    for (const suf of rule.suffixes) {
      // require at least one letter before the suffix so "-e" doesn't match "e" itself
      if (word.length > suf.length && word.endsWith(suf)) {
        if (!best || suf.length > best.len) best = { rule, len: suf.length };
      }
    }
  }
  return best?.rule ?? null;
}
