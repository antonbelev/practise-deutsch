import type { Topic } from "./types";
import { buildMc, buildType, randInt, pick } from "./helpers";
import { numberToGerman, priceLabel, spokenPrice } from "./german";

function randPrice(): { euros: number; cents: number } {
  const euros = randInt(1, 99);
  const cents = pick([0, 0, 10, 20, 25, 30, 50, 75, 90, 95, 99]);
  return { euros, cents };
}

function priceWrongs(euros: number, cents: number): string[] {
  return [
    spokenPrice(euros + 1, cents),
    spokenPrice(euros, cents === 0 ? 50 : 0),
    spokenPrice(euros, (cents + 5) % 100),
    spokenPrice(Math.max(1, euros - 1), cents),
  ];
}

export const pricesTopic: Topic = {
  id: "prices",
  title: "Prices & shopping",
  blurb: "Read prices the way they’re said at the till.",
  exercises: [
    {
      id: "price-read-mc",
      title: "Read the price · choose",
      blurb: "See 3,50 €, pick “drei Euro fünfzig”.",
      game: "multiple-choice",
      generate: (n) =>
        buildMc(n, "price-mc", () => {
          const { euros, cents } = randPrice();
          return {
            prompt: priceLabel(euros, cents),
            answer: spokenPrice(euros, cents),
            wrongs: priceWrongs(euros, cents),
            hint: "Euro … (cents)",
          };
        }),
    },
    {
      id: "price-write-type",
      title: "Read the price · type",
      blurb: "Write the spoken price for the amount.",
      game: "type-answer",
      generate: (n) =>
        buildType(n, "price-type", () => {
          const { euros, cents } = randPrice();
          return {
            prompt: priceLabel(euros, cents),
            answer: spokenPrice(euros, cents),
            hint: "say it out loud",
          };
        }),
    },
    {
      id: "price-phrase-mc",
      title: "Shopping phrases · choose",
      blurb: "The phrases you need at the shop.",
      game: "multiple-choice",
      generate: (n) =>
        buildMc(n, "price-phrase", () => {
          const bank = [
            {
              prompt: "“How much does it cost?”",
              answer: "Wie viel kostet das?",
              wrongs: ["Wie spät ist es?", "Wo ist das?", "Was ist das?"],
            },
            {
              prompt: "“I’d like …”",
              answer: "Ich möchte …",
              wrongs: ["Ich muss …", "Ich habe …", "Ich bin …"],
            },
            {
              prompt: "“That’s too expensive.”",
              answer: "Das ist zu teuer.",
              wrongs: ["Das ist zu billig.", "Das ist zu groß.", "Das ist zu klein."],
            },
            {
              prompt: "“The bill, please.”",
              answer: "Die Rechnung, bitte.",
              wrongs: ["Die Speisekarte, bitte.", "Das Wasser, bitte.", "Die Tür, bitte."],
            },
            {
              prompt: `pay “${numberToGerman(20, true)} euros”`,
              answer: "zwanzig Euro",
              wrongs: ["zwanzig Euros", "zwanzig Cent", "zwölf Euro"],
            },
          ];
          const item = pick(bank);
          return { prompt: item.prompt, answer: item.answer, wrongs: item.wrongs, hint: "shopping" };
        }),
    },
  ],
};
