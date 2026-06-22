import type { GameType, Question } from "../content/types";

// A curated, generator-based practice unit. Unlike chapter content, a topic
// produces its questions programmatically, so practice never runs out.
export interface Exercise {
  id: string;
  title: string;
  blurb: string;
  // which game UI renders this exercise's questions
  game: GameType;
  // generate a fresh batch of questions (already shuffled / ready to play)
  generate: (count: number) => Question[];
}

export interface Topic {
  id: string;
  title: string;
  blurb: string;
  exercises: Exercise[];
}
