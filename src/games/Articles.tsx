import { useEffect, useState } from "react";
import type { GameProps } from "./types";
import { FeedbackBar } from "./MultipleChoice";

// The three German definite articles, in the order shown. Each maps to a keyboard
// digit (1/2/3) and an arrow key (←/↓/→) for fast, mouse-free play.
const ARTICLES = [
  { id: "der", label: "der", keyHint: "1" },
  { id: "die", label: "die", keyHint: "2" },
  { id: "das", label: "das", keyHint: "3" },
] as const;

const ARROW: Record<string, string> = {
  ArrowLeft: "der",
  ArrowDown: "die",
  ArrowRight: "das",
};

/**
 * Der · Die · Das trainer. Isolates the single hardest A1 skill — noun gender.
 * The learner sees a bare noun and picks its article; the English meaning is
 * revealed as the reward on every answer.
 */
export function Articles({ question, onAnswer, onNext, isLast }: GameProps) {
  const [picked, setPicked] = useState<string | null>(null);
  const answered = picked !== null;
  const answer = question.answer; // "der" | "die" | "das"

  useEffect(() => setPicked(null), [question.sourceId]);

  function choose(id: string) {
    if (answered) return;
    setPicked(id);
    onAnswer(id === answer);
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!answered) {
        if (e.key === "1") choose("der");
        else if (e.key === "2") choose("die");
        else if (e.key === "3") choose("das");
        else if (ARROW[e.key]) choose(ARROW[e.key]);
      } else if (e.key === "Enter" || e.key === " ") {
        onNext();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <div className="space-y-7">
      <div className="text-center">
        <span className="text-xs font-medium uppercase tracking-wide text-muted">
          Which article?
        </span>
        <p className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          {question.prompt}
        </p>
        {/* Meaning stays hidden until answered so gender is recalled, not read off. */}
        <p
          className={`mt-1 text-muted transition-opacity ${
            answered ? "opacity-100" : "opacity-0"
          }`}
        >
          {question.example || " "}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        {ARTICLES.map((a) => {
          const isAnswer = a.id === answer;
          const isPicked = picked === a.id;
          let tone =
            "border-border bg-surface hover:border-accent/60 hover:-translate-y-0.5";
          if (answered && isAnswer) tone = "border-correct bg-correct/10 text-correct";
          else if (answered && isPicked) tone = "border-wrong bg-wrong/10 text-wrong";
          else if (answered) tone = "border-border bg-surface opacity-50";
          return (
            <button
              key={a.id}
              onClick={() => choose(a.id)}
              disabled={answered}
              className={`flex flex-col items-center gap-1 rounded-2xl border py-6 text-2xl font-bold transition-all sm:text-3xl ${tone}`}
            >
              {a.label}
              <kbd className="rounded-md border border-border bg-surface-2 px-1.5 text-[11px] font-medium text-muted">
                {a.keyHint}
              </kbd>
            </button>
          );
        })}
      </div>

      {answered && (
        <FeedbackBar
          correct={picked === answer}
          example={question.hint}
          solution={`${answer} ${question.prompt}${
            question.example ? `  —  ${question.example}` : ""
          }`}
          onNext={onNext}
          isLast={isLast}
        />
      )}
    </div>
  );
}
