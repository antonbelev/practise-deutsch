import type { Question } from "../content/types";

// Every game receives one question and reports the outcome, then advances.
export interface GameProps {
  question: Question;
  // report correctness exactly once per question
  onAnswer: (correct: boolean) => void;
  // advance to the next question (after the learner has seen feedback)
  onNext: () => void;
  // index info for "match" which may batch several items
  isLast: boolean;
}
