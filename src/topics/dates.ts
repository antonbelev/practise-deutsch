import type { Topic } from "./types";
import { buildMc, pick, randInt, shuffle } from "./helpers";
import {
  MONTHS,
  WEEKDAYS,
  inMonth,
  onWeekday,
  ordinal,
  spokenDate,
} from "./german";

export const datesTopic: Topic = {
  id: "dates",
  title: "Dates & weekdays",
  blurb: "Days, months and saying which date it is.",
  exercises: [
    {
      id: "date-weekday-mc",
      title: "Weekdays · choose",
      blurb: "Match the English day to “am …”.",
      game: "multiple-choice",
      generate: (n) =>
        buildMc(n, "date-wd", () => {
          const dow = randInt(0, 6);
          const englishDays = [
            "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
          ];
          const wrongs = shuffle(WEEKDAYS.filter((_, i) => i !== dow))
            .slice(0, 3)
            .map((d) => `am ${d}`);
          return {
            prompt: `on ${englishDays[dow]}`,
            answer: onWeekday(dow),
            wrongs,
            hint: "am + weekday",
          };
        }),
    },
    {
      id: "date-month-mc",
      title: "Months · choose",
      blurb: "Match the English month to “im …”.",
      game: "multiple-choice",
      generate: (n) =>
        buildMc(n, "date-mo", () => {
          const mi = randInt(0, 11);
          const englishMonths = [
            "January", "February", "March", "April", "May", "June", "July",
            "August", "September", "October", "November", "December",
          ];
          const wrongs = shuffle(MONTHS.filter((_, i) => i !== mi))
            .slice(0, 3)
            .map((m) => `im ${m}`);
          return {
            prompt: `in ${englishMonths[mi]}`,
            answer: inMonth(mi),
            wrongs,
            hint: "im + month",
          };
        }),
    },
    {
      id: "date-ordinal-mc",
      title: "The date · choose",
      blurb: "Say the spoken date (der dritte Mai).",
      game: "multiple-choice",
      generate: (n) =>
        buildMc(n, "date-ord", () => {
          const day = randInt(1, 28);
          const mi = randInt(0, 11);
          // wrongs: wrong ordinal, wrong month, swapped
          const wrongs = [
            spokenDate(day + 1 > 28 ? day - 1 : day + 1, mi),
            spokenDate(day, (mi + 1) % 12),
            `der ${ordinal(day)} ${pick(MONTHS.filter((m) => m !== MONTHS[mi]))}`,
            spokenDate(day === 1 ? 2 : 1, mi),
          ];
          return {
            prompt: `${day}. ${MONTHS[mi]}`,
            answer: spokenDate(day, mi),
            wrongs,
            hint: "der + ordinal + month",
          };
        }),
    },
  ],
};
