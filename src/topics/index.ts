import type { Topic, Exercise } from "./types";
import { timeTopic } from "./time";
import { numbersTopic } from "./numbers";
import { datesTopic } from "./dates";
import { pricesTopic } from "./prices";
import { perfectTopic } from "./perfect";
import { bodyTopic } from "./body";

export type { Topic, Exercise };

// Order shown in the UI. Time first — it's the headline topic.
export const TOPICS: Topic[] = [
  timeTopic,
  numbersTopic,
  datesTopic,
  pricesTopic,
  perfectTopic,
  bodyTopic,
];

export function getTopic(id: string): Topic | undefined {
  return TOPICS.find((t) => t.id === id);
}

export function getExercise(
  topicId: string,
  exerciseId: string,
): { topic: Topic; exercise: Exercise } | undefined {
  const topic = getTopic(topicId);
  const exercise = topic?.exercises.find((e) => e.id === exerciseId);
  if (!topic || !exercise) return undefined;
  return { topic, exercise };
}
