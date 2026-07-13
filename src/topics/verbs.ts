// Curated Partizip II data for the Perfect-tense trainer.
//
// The parsed vocab.json has ~280 verbs, but its English glosses are noisy
// ("to be" for gehen, "here:" fragments) and it carries no participle or
// auxiliary information. Partizip II forms and haben/sein selection must be
// exactly right for a grammar drill, so this list is hand-curated from the
// A1 core rather than derived from the PDF data.
//
// aux: which auxiliary the verb takes in the perfect.
//   - "sein" for verbs of motion (gehen, fahren) and change of state
//     (aufstehen, werden, passieren); everything else takes "haben".
// group: how the participle is formed — used only to build plausible
//   distractors and to label the reference, never shown as the answer.

export type Aux = "haben" | "sein";
export type VerbGroup = "regular" | "irregular" | "mixed" | "separable";

export interface PerfectVerb {
  infinitive: string;
  en: string;
  partizip: string;
  aux: Aux;
  group: VerbGroup;
  // A short perfect-tense example, used as supporting context after answers.
  example: string;
  exampleEn: string;
}

export const PERFECT_VERBS: PerfectVerb[] = [
  // --- Regular (weak): ge- + stem + -t ---
  { infinitive: "machen", en: "to do, to make", partizip: "gemacht", aux: "haben", group: "regular",
    example: "Ich habe die Hausaufgaben gemacht.", exampleEn: "I did the homework." },
  { infinitive: "lernen", en: "to learn", partizip: "gelernt", aux: "haben", group: "regular",
    example: "Wir haben Deutsch gelernt.", exampleEn: "We learned German." },
  { infinitive: "wohnen", en: "to live, to reside", partizip: "gewohnt", aux: "haben", group: "regular",
    example: "Sie hat in Berlin gewohnt.", exampleEn: "She lived in Berlin." },
  { infinitive: "spielen", en: "to play", partizip: "gespielt", aux: "haben", group: "regular",
    example: "Die Kinder haben im Park gespielt.", exampleEn: "The children played in the park." },
  { infinitive: "kaufen", en: "to buy", partizip: "gekauft", aux: "haben", group: "regular",
    example: "Ich habe Brot gekauft.", exampleEn: "I bought bread." },
  { infinitive: "kochen", en: "to cook", partizip: "gekocht", aux: "haben", group: "regular",
    example: "Er hat Suppe gekocht.", exampleEn: "He cooked soup." },
  { infinitive: "sagen", en: "to say", partizip: "gesagt", aux: "haben", group: "regular",
    example: "Was hast du gesagt?", exampleEn: "What did you say?" },
  { infinitive: "fragen", en: "to ask", partizip: "gefragt", aux: "haben", group: "regular",
    example: "Ich habe den Lehrer gefragt.", exampleEn: "I asked the teacher." },
  { infinitive: "hören", en: "to hear, to listen", partizip: "gehört", aux: "haben", group: "regular",
    example: "Wir haben Musik gehört.", exampleEn: "We listened to music." },
  { infinitive: "brauchen", en: "to need", partizip: "gebraucht", aux: "haben", group: "regular",
    example: "Ich habe mehr Zeit gebraucht.", exampleEn: "I needed more time." },
  { infinitive: "suchen", en: "to search, to look for", partizip: "gesucht", aux: "haben", group: "regular",
    example: "Er hat seinen Schlüssel gesucht.", exampleEn: "He looked for his key." },
  { infinitive: "lachen", en: "to laugh", partizip: "gelacht", aux: "haben", group: "regular",
    example: "Wir haben viel gelacht.", exampleEn: "We laughed a lot." },
  { infinitive: "wohnen", en: "to live, to reside", partizip: "gewohnt", aux: "haben", group: "regular",
    example: "Sie hat in Berlin gewohnt.", exampleEn: "She lived in Berlin." },

  // -t endings that need -et after d/t/consonant clusters
  { infinitive: "arbeiten", en: "to work", partizip: "gearbeitet", aux: "haben", group: "regular",
    example: "Ich habe im Büro gearbeitet.", exampleEn: "I worked in the office." },
  { infinitive: "warten", en: "to wait", partizip: "gewartet", aux: "haben", group: "regular",
    example: "Wir haben lange gewartet.", exampleEn: "We waited a long time." },
  { infinitive: "kosten", en: "to cost", partizip: "gekostet", aux: "haben", group: "regular",
    example: "Das hat viel Geld gekostet.", exampleEn: "That cost a lot of money." },
  { infinitive: "öffnen", en: "to open", partizip: "geöffnet", aux: "haben", group: "regular",
    example: "Sie hat das Fenster geöffnet.", exampleEn: "She opened the window." },

  // --- Verbs ending in -ieren: no ge- prefix ---
  { infinitive: "studieren", en: "to study", partizip: "studiert", aux: "haben", group: "regular",
    example: "Er hat Medizin studiert.", exampleEn: "He studied medicine." },
  { infinitive: "telefonieren", en: "to phone", partizip: "telefoniert", aux: "haben", group: "regular",
    example: "Ich habe mit Oma telefoniert.", exampleEn: "I talked to Grandma on the phone." },
  { infinitive: "fotografieren", en: "to photograph", partizip: "fotografiert", aux: "haben", group: "regular",
    example: "Wir haben die Stadt fotografiert.", exampleEn: "We photographed the city." },
  { infinitive: "probieren", en: "to try, to taste", partizip: "probiert", aux: "haben", group: "regular",
    example: "Ich habe den Kuchen probiert.", exampleEn: "I tried the cake." },

  // --- Irregular (strong): ge- + changed stem + -en ---
  { infinitive: "gehen", en: "to go, to walk", partizip: "gegangen", aux: "sein", group: "irregular",
    example: "Ich bin nach Hause gegangen.", exampleEn: "I went home." },
  { infinitive: "fahren", en: "to drive, to go", partizip: "gefahren", aux: "sein", group: "irregular",
    example: "Wir sind in die Stadt gefahren.", exampleEn: "We drove into town." },
  { infinitive: "kommen", en: "to come", partizip: "gekommen", aux: "sein", group: "irregular",
    example: "Sie ist zu spät gekommen.", exampleEn: "She came too late." },
  { infinitive: "essen", en: "to eat", partizip: "gegessen", aux: "haben", group: "irregular",
    example: "Ich habe einen Apfel gegessen.", exampleEn: "I ate an apple." },
  { infinitive: "trinken", en: "to drink", partizip: "getrunken", aux: "haben", group: "irregular",
    example: "Er hat Kaffee getrunken.", exampleEn: "He drank coffee." },
  { infinitive: "lesen", en: "to read", partizip: "gelesen", aux: "haben", group: "irregular",
    example: "Ich habe ein Buch gelesen.", exampleEn: "I read a book." },
  { infinitive: "schreiben", en: "to write", partizip: "geschrieben", aux: "haben", group: "irregular",
    example: "Sie hat einen Brief geschrieben.", exampleEn: "She wrote a letter." },
  { infinitive: "sprechen", en: "to speak", partizip: "gesprochen", aux: "haben", group: "irregular",
    example: "Wir haben mit dem Chef gesprochen.", exampleEn: "We spoke with the boss." },
  { infinitive: "sehen", en: "to see", partizip: "gesehen", aux: "haben", group: "irregular",
    example: "Ich habe einen Film gesehen.", exampleEn: "I saw a film." },
  { infinitive: "nehmen", en: "to take", partizip: "genommen", aux: "haben", group: "irregular",
    example: "Er hat den Bus genommen.", exampleEn: "He took the bus." },
  { infinitive: "finden", en: "to find", partizip: "gefunden", aux: "haben", group: "irregular",
    example: "Ich habe den Schlüssel gefunden.", exampleEn: "I found the key." },
  { infinitive: "trinken", en: "to drink", partizip: "getrunken", aux: "haben", group: "irregular",
    example: "Er hat Wasser getrunken.", exampleEn: "He drank water." },
  { infinitive: "schlafen", en: "to sleep", partizip: "geschlafen", aux: "haben", group: "irregular",
    example: "Ich habe gut geschlafen.", exampleEn: "I slept well." },
  { infinitive: "helfen", en: "to help", partizip: "geholfen", aux: "haben", group: "irregular",
    example: "Sie hat mir geholfen.", exampleEn: "She helped me." },
  { infinitive: "singen", en: "to sing", partizip: "gesungen", aux: "haben", group: "irregular",
    example: "Wir haben zusammen gesungen.", exampleEn: "We sang together." },
  { infinitive: "schwimmen", en: "to swim", partizip: "geschwommen", aux: "sein", group: "irregular",
    example: "Ich bin im See geschwommen.", exampleEn: "I swam in the lake." },
  { infinitive: "laufen", en: "to run", partizip: "gelaufen", aux: "sein", group: "irregular",
    example: "Er ist schnell gelaufen.", exampleEn: "He ran fast." },
  { infinitive: "fliegen", en: "to fly", partizip: "geflogen", aux: "sein", group: "irregular",
    example: "Wir sind nach Spanien geflogen.", exampleEn: "We flew to Spain." },
  { infinitive: "bleiben", en: "to stay, to remain", partizip: "geblieben", aux: "sein", group: "irregular",
    example: "Ich bin zu Hause geblieben.", exampleEn: "I stayed at home." },
  { infinitive: "trinken", en: "to drink", partizip: "getrunken", aux: "haben", group: "irregular",
    example: "Er hat Tee getrunken.", exampleEn: "He drank tea." },
  { infinitive: "waschen", en: "to wash", partizip: "gewaschen", aux: "haben", group: "irregular",
    example: "Ich habe das Auto gewaschen.", exampleEn: "I washed the car." },
  { infinitive: "tragen", en: "to carry, to wear", partizip: "getragen", aux: "haben", group: "irregular",
    example: "Sie hat einen Mantel getragen.", exampleEn: "She wore a coat." },
  { infinitive: "geben", en: "to give", partizip: "gegeben", aux: "haben", group: "irregular",
    example: "Er hat mir das Buch gegeben.", exampleEn: "He gave me the book." },
  { infinitive: "treffen", en: "to meet", partizip: "getroffen", aux: "haben", group: "irregular",
    example: "Ich habe Anna getroffen.", exampleEn: "I met Anna." },

  // --- Mixed (weak stem change + -t) ---
  { infinitive: "bringen", en: "to bring", partizip: "gebracht", aux: "haben", group: "mixed",
    example: "Sie hat Blumen gebracht.", exampleEn: "She brought flowers." },
  { infinitive: "denken", en: "to think", partizip: "gedacht", aux: "haben", group: "mixed",
    example: "Ich habe an dich gedacht.", exampleEn: "I thought of you." },
  { infinitive: "kennen", en: "to know (a person/place)", partizip: "gekannt", aux: "haben", group: "mixed",
    example: "Ich habe ihn gut gekannt.", exampleEn: "I knew him well." },
  { infinitive: "wissen", en: "to know (a fact)", partizip: "gewusst", aux: "haben", group: "mixed",
    example: "Das habe ich nicht gewusst.", exampleEn: "I didn't know that." },

  // --- Auxiliary / modal-ish common irregulars ---
  { infinitive: "haben", en: "to have", partizip: "gehabt", aux: "haben", group: "irregular",
    example: "Ich habe keine Zeit gehabt.", exampleEn: "I had no time." },
  { infinitive: "sein", en: "to be", partizip: "gewesen", aux: "sein", group: "irregular",
    example: "Ich bin in Wien gewesen.", exampleEn: "I was in Vienna." },
  { infinitive: "werden", en: "to become", partizip: "geworden", aux: "sein", group: "irregular",
    example: "Es ist kalt geworden.", exampleEn: "It has become cold." },

  // --- Separable: prefix + ge + stem ---
  { infinitive: "aufstehen", en: "to get up", partizip: "aufgestanden", aux: "sein", group: "separable",
    example: "Ich bin früh aufgestanden.", exampleEn: "I got up early." },
  { infinitive: "einkaufen", en: "to shop, to buy groceries", partizip: "eingekauft", aux: "haben", group: "separable",
    example: "Wir haben im Supermarkt eingekauft.", exampleEn: "We shopped at the supermarket." },
  { infinitive: "ankommen", en: "to arrive", partizip: "angekommen", aux: "sein", group: "separable",
    example: "Der Zug ist pünktlich angekommen.", exampleEn: "The train arrived on time." },
  { infinitive: "anrufen", en: "to call (phone)", partizip: "angerufen", aux: "haben", group: "separable",
    example: "Ich habe meine Mutter angerufen.", exampleEn: "I called my mother." },
  { infinitive: "aufmachen", en: "to open", partizip: "aufgemacht", aux: "haben", group: "separable",
    example: "Er hat die Tür aufgemacht.", exampleEn: "He opened the door." },
  { infinitive: "mitkommen", en: "to come along", partizip: "mitgekommen", aux: "sein", group: "separable",
    example: "Sie ist mitgekommen.", exampleEn: "She came along." },
  { infinitive: "fernsehen", en: "to watch TV", partizip: "ferngesehen", aux: "haben", group: "separable",
    example: "Wir haben am Abend ferngesehen.", exampleEn: "We watched TV in the evening." },

  // --- Inseparable prefixes: no ge- ---
  { infinitive: "besuchen", en: "to visit", partizip: "besucht", aux: "haben", group: "regular",
    example: "Ich habe meine Freunde besucht.", exampleEn: "I visited my friends." },
  { infinitive: "verstehen", en: "to understand", partizip: "verstanden", aux: "haben", group: "irregular",
    example: "Ich habe die Frage verstanden.", exampleEn: "I understood the question." },
  { infinitive: "bezahlen", en: "to pay", partizip: "bezahlt", aux: "haben", group: "regular",
    example: "Er hat die Rechnung bezahlt.", exampleEn: "He paid the bill." },
  { infinitive: "vergessen", en: "to forget", partizip: "vergessen", aux: "haben", group: "irregular",
    example: "Ich habe den Termin vergessen.", exampleEn: "I forgot the appointment." },
  { infinitive: "beginnen", en: "to begin, to start", partizip: "begonnen", aux: "haben", group: "irregular",
    example: "Der Kurs hat um neun begonnen.", exampleEn: "The course began at nine." },
  { infinitive: "erzählen", en: "to tell, to narrate", partizip: "erzählt", aux: "haben", group: "regular",
    example: "Sie hat eine Geschichte erzählt.", exampleEn: "She told a story." },
];

// De-duplicate by infinitive (the list above intentionally repeats a few
// while drafting); keep the first occurrence so ordering stays stable.
const _seen = new Set<string>();
export const VERBS: PerfectVerb[] = PERFECT_VERBS.filter((v) => {
  if (_seen.has(v.infinitive)) return false;
  _seen.add(v.infinitive);
  return true;
});
