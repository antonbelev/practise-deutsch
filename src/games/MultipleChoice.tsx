import { useEffect, useState } from "react";
import type { GameProps } from "./types";
import { norm } from "../content/buildQuestions";

export function MultipleChoice({ question, onAnswer, onNext, isLast }: GameProps) {
  const [picked, setPicked] = useState<string | null>(null);
  const choices = question.choices ?? [question.answer];
  const answered = picked !== null;

  // reset when the question changes
  useEffect(() => setPicked(null), [question.sourceId]);

  function choose(choice: string) {
    if (answered) return;
    setPicked(choice);
    onAnswer(norm(choice) === norm(question.answer));
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!answered && /^[1-9]$/.test(e.key)) {
        const idx = Number(e.key) - 1;
        if (idx < choices.length) choose(choices[idx]);
      } else if (answered && (e.key === "Enter" || e.key === " ")) {
        onNext();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <div className="space-y-6">
      <Prompt question={question} />
      <div className="grid gap-2.5">
        {choices.map((choice, i) => {
          const isAnswer = norm(choice) === norm(question.answer);
          const isPicked = picked === choice;
          let tone = "border-border bg-surface hover:border-accent/60";
          if (answered && isAnswer) tone = "border-correct bg-correct/10 text-correct";
          else if (answered && isPicked) tone = "border-wrong bg-wrong/10 text-wrong";
          else if (answered) tone = "border-border bg-surface opacity-60";
          return (
            <button
              key={choice + i}
              onClick={() => choose(choice)}
              disabled={answered}
              className={`flex items-center gap-3 rounded-xl border p-3.5 text-left text-base transition-theme ${tone}`}
            >
              <kbd className="grid h-6 w-6 shrink-0 place-items-center rounded-md border border-border bg-surface-2 text-xs text-muted">
                {i + 1}
              </kbd>
              <span className="font-medium">{choice}</span>
            </button>
          );
        })}
      </div>
      {answered && (
        <FeedbackBar
          correct={norm(picked!) === norm(question.answer)}
          example={question.example}
          onNext={onNext}
          isLast={isLast}
        />
      )}
    </div>
  );
}

export function Prompt({ question }: { question: Question }) {
  return (
    <div className="text-center">
      {question.hint && (
        <span className="text-xs font-medium uppercase tracking-wide text-muted">
          {question.hint}
        </span>
      )}
      <p className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
        {question.prompt}
      </p>
    </div>
  );
}

import type { Question } from "../content/types";

export function FeedbackBar({
  correct,
  example,
  onNext,
  isLast,
}: {
  correct: boolean;
  example?: string | null;
  onNext: () => void;
  isLast: boolean;
}) {
  return (
    <div
      className={`animate-slide-up rounded-xl border p-3 ${
        correct ? "border-correct/40 bg-correct/5" : "border-wrong/40 bg-wrong/5"
      }`}
    >
      <div className="flex items-center gap-3">
        <span className={`text-sm font-semibold ${correct ? "text-correct" : "text-wrong"}`}>
          {correct ? "Correct" : "Not quite"}
        </span>
        {example && <span className="line-clamp-1 text-sm text-muted">{example}</span>}
        <button className="btn-primary ml-auto" onClick={onNext} autoFocus>
          {isLast ? "Finish" : "Next"}
        </button>
      </div>
    </div>
  );
}
