// Curated body-part vocabulary for the "Body parts" topic.
//
// Each entry carries article + singular + plural + English, plus an optional
// (x, y) anchor in the 0–100 coordinate space of the <BodyFigure> diagram so
// the reference illustration can label it. Anchors are approximate; leave
// undefined for parts the figure doesn't depict.

export type Article = "der" | "die" | "das";

export interface BodyPart {
  article: Article;
  singular: string;
  plural: string;
  en: string; // "arm", "eye" (singular noun; UI adds "the …")
  // label anchor on the figure (percent of viewBox). side hints label placement.
  anchor?: { x: number; y: number; side: "left" | "right" };
}

export const BODY_PARTS: BodyPart[] = [
  { article: "der", singular: "Kopf", plural: "Köpfe", en: "head", anchor: { x: 50, y: 8, side: "right" } },
  { article: "das", singular: "Haar", plural: "Haare", en: "hair", anchor: { x: 50, y: 3, side: "left" } },
  { article: "das", singular: "Auge", plural: "Augen", en: "eye", anchor: { x: 50, y: 7, side: "left" } },
  { article: "die", singular: "Nase", plural: "Nasen", en: "nose", anchor: { x: 50, y: 9, side: "right" } },
  { article: "der", singular: "Mund", plural: "Münder", en: "mouth", anchor: { x: 50, y: 11, side: "right" } },
  { article: "das", singular: "Ohr", plural: "Ohren", en: "ear", anchor: { x: 43, y: 8, side: "left" } },
  { article: "der", singular: "Hals", plural: "Hälse", en: "neck", anchor: { x: 50, y: 16, side: "right" } },
  { article: "die", singular: "Schulter", plural: "Schultern", en: "shoulder", anchor: { x: 38, y: 21, side: "left" } },
  { article: "die", singular: "Brust", plural: "Brüste", en: "chest", anchor: { x: 50, y: 27, side: "right" } },
  { article: "der", singular: "Arm", plural: "Arme", en: "arm", anchor: { x: 30, y: 33, side: "left" } },
  { article: "die", singular: "Hand", plural: "Hände", en: "hand", anchor: { x: 24, y: 46, side: "left" } },
  { article: "der", singular: "Bauch", plural: "Bäuche", en: "belly", anchor: { x: 50, y: 40, side: "right" } },
  { article: "der", singular: "Rücken", plural: "Rücken", en: "back", anchor: { x: 66, y: 34, side: "right" } },
  { article: "das", singular: "Bein", plural: "Beine", en: "leg", anchor: { x: 44, y: 62, side: "left" } },
  { article: "das", singular: "Knie", plural: "Knie", en: "knee", anchor: { x: 44, y: 72, side: "left" } },
  // "der Fuß" — the ß spelling; accept "Fuss" too when typing.
  { article: "der", singular: "Fuß", plural: "Füße", en: "foot", anchor: { x: 44, y: 94, side: "left" } },
];

// English irregular plurals, for the "singular / plural" gloss shown in prompts.
export const EN_PLURAL: Record<string, string> = {
  foot: "feet",
  belly: "bellies",
};

export function enPlural(en: string): string {
  return EN_PLURAL[en] ?? `${en}s`;
}
