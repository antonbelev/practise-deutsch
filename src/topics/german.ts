// German number / time / date / price language engine.
//
// Pure, dependency-free functions that turn values into correct German. These power
// the curated "Topics" exercises (telling the time, numbers, dates, prices). Unlike
// the PDF-derived content, this is generated, so practice is effectively infinite.
//
// Correctness notes that trip up learners (and are handled here):
//  - "halb X" means half TO hour X, so 3:30 is "halb vier" (not "halb drei").
//  - 21–99 read units-before-tens joined by "und": 45 = "fünfundvierzig".
//  - "eins" loses its -s before a noun: "ein Uhr", "einundzwanzig".
//  - Informal clock uses a 12-hour value; formal uses 24-hour + "Uhr".

const ONES = [
  "null", "eins", "zwei", "drei", "vier", "fünf", "sechs", "sieben", "acht",
  "neun", "zehn", "elf", "zwölf", "dreizehn", "vierzehn", "fünfzehn",
  "sechzehn", "siebzehn", "achtzehn", "neunzehn",
];
const TENS = [
  "", "", "zwanzig", "dreißig", "vierzig", "fünfzig", "sechzig", "siebzig",
  "achtzig", "neunzig",
];

/** Cardinal number in German for 0..999. `attributive` drops the -s of "eins". */
export function numberToGerman(n: number, attributive = false): string {
  if (n < 0) return `minus ${numberToGerman(-n, attributive)}`;
  if (n < 20) {
    if (n === 1) return attributive ? "ein" : "eins";
    return ONES[n];
  }
  if (n < 100) {
    const tens = Math.floor(n / 10);
    const ones = n % 10;
    if (ones === 0) return TENS[tens];
    const onesWord = ones === 1 ? "ein" : ONES[ones];
    return `${onesWord}und${TENS[tens]}`;
  }
  if (n < 1000) {
    const hundreds = Math.floor(n / 100);
    const rest = n % 100;
    const h = `${hundreds === 1 ? "ein" : ONES[hundreds]}hundert`;
    return rest ? `${h}${numberToGerman(rest, attributive)}` : h;
  }
  return String(n); // out of A1 scope
}

// ---------------------------------------------------------------------------
// Time
// ---------------------------------------------------------------------------

export interface ClockTime {
  h24: number; // 0..23
  m: number; // 0..59
}

/** "13:45" style label for a clock. */
export function digital(t: ClockTime): string {
  return `${String(t.h24).padStart(2, "0")}:${String(t.m).padStart(2, "0")}`;
}

/** Formal / official 24-hour reading: "13:45" → "dreizehn Uhr fünfundvierzig". */
export function formalTime(t: ClockTime): string {
  const hour = `${t.h24 === 1 ? "ein" : numberToGerman(t.h24, true)} Uhr`;
  if (t.m === 0) return hour;
  return `${hour} ${numberToGerman(t.m, true)}`;
}

/** Informal / everyday 12-hour reading, e.g. "Viertel vor zwei", "halb vier". */
export function informalTime(t: ClockTime): string {
  const h12 = ((t.h24 % 12) || 12); // 1..12
  const next = (h12 % 12) + 1; // hour we count toward for half/quarter-to
  const hourName = (n: number) => numberToGerman(n === 0 ? 12 : n, false);

  // full hour: "ein Uhr" (not "eins Uhr") even colloquially
  if (t.m === 0) return `${h12 === 1 ? "ein" : hourName(h12)} Uhr`;
  if (t.m === 15) return `Viertel nach ${hourName(h12)}`;
  if (t.m === 30) return `halb ${hourName(next)}`;
  if (t.m === 45) return `Viertel vor ${hourName(next)}`;
  if (t.m < 30) return `${numberToGerman(t.m)} nach ${hourName(h12)}`;
  // 31..59: count minutes "vor" the next hour
  return `${numberToGerman(60 - t.m)} vor ${hourName(next)}`;
}

// ---------------------------------------------------------------------------
// Dates & weekdays
// ---------------------------------------------------------------------------

export const WEEKDAYS = [
  "Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag",
];
export const MONTHS = [
  "Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August",
  "September", "Oktober", "November", "Dezember",
];

// Ordinals 1..31 for dates: "der erste", "der zweite", ... irregular 1,3,7,8 then +te/+ste.
const ORDINAL_IRREGULAR: Record<number, string> = {
  1: "erste", 3: "dritte", 7: "siebte", 8: "achte",
};
export function ordinal(n: number): string {
  if (ORDINAL_IRREGULAR[n]) return ORDINAL_IRREGULAR[n];
  const stem = numberToGerman(n, true).replace(/^ein$/, "ein");
  return n < 20 ? `${stem}te` : `${stem}ste`;
}

/** "am" + weekday, e.g. "am Montag". */
export function onWeekday(dow: number): string {
  return `am ${WEEKDAYS[dow]}`;
}

/** "im" + month, e.g. "im Juni". */
export function inMonth(monthIndex: number): string {
  return `im ${MONTHS[monthIndex]}`;
}

/** Spoken date, e.g. "der dritte Mai" for (3, "Mai"). */
export function spokenDate(day: number, monthIndex: number): string {
  return `der ${ordinal(day)} ${MONTHS[monthIndex]}`;
}

// ---------------------------------------------------------------------------
// Prices
// ---------------------------------------------------------------------------

/** "3,50 €" style numeric label. */
export function priceLabel(euros: number, cents: number): string {
  return `${euros},${String(cents).padStart(2, "0")} €`;
}

/** Spoken price: 3,50 → "drei Euro fünfzig"; whole euros → "vier Euro". */
export function spokenPrice(euros: number, cents: number): string {
  const e = `${numberToGerman(euros, true)} Euro`;
  if (cents === 0) return e;
  return `${e} ${numberToGerman(cents, true)}`;
}
