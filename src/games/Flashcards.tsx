import { useEffect, useState } from "react";
import type { GameProps } from "./types";

export function Flashcards({ question, onAnswer, onNext, isLast }: GameProps) {
  const [flipped, setFlipped] = useState(false);

  useEffect(() => setFlipped(false), [question.sourceId]);

  function grade(correct: boolean) {
    onAnswer(correct);
    onNext();
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        if (!flipped) setFlipped(true);
      } else if (flipped && (e.key.toLowerCase() === "z" || e.key === "1")) {
        e.preventDefault();
        grade(false);
      } else if (flipped && (e.key.toLowerCase() === "x" || e.key === "2")) {
        e.preventDefault();
        grade(true);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <div className="space-y-6">
      <button
        onClick={() => setFlipped((f) => !f)}
        className="card grid min-h-[220px] w-full place-items-center p-8 text-center transition-theme hover:border-accent/60"
      >
        <div className="space-y-3">
          {question.hint && !flipped && (
            <span className="text-xs font-medium uppercase tracking-wide text-muted">
              {question.hint}
            </span>
          )}
          <p className="text-3xl font-semibold tracking-tight">
            {flipped ? question.answer : question.prompt}
          </p>
          {flipped && question.example && (
            <p className="text-sm text-muted">{question.example}</p>
          )}
          {!flipped && (
            <p className="hidden text-xs text-muted sm:block">Space to flip</p>
          )}
          {flipped && (
            <p className="hidden text-xs text-muted sm:block">Z — Again · Got it — X</p>
          )}
        </div>
      </button>

      {flipped ? (
        <div className="grid grid-cols-2 gap-2.5 animate-slide-up">
          <button
            className="btn border border-wrong/40 bg-wrong/5 py-3 text-wrong hover:bg-wrong/10"
            onClick={() => grade(false)}
          >
            <kbd className="hidden rounded border border-wrong/30 px-1 text-xs opacity-60 sm:inline">Z</kbd>
            Again
          </button>
          <button
            className="btn border border-correct/40 bg-correct/5 py-3 text-correct hover:bg-correct/10"
            onClick={() => grade(true)}
          >
            Got it
            <kbd className="hidden rounded border border-correct/30 px-1 text-xs opacity-60 sm:inline">X</kbd>
          </button>
        </div>
      ) : (
        <button className="btn-ghost w-full" onClick={() => setFlipped(true)}>
          Show answer
        </button>
      )}
      <p className="text-center text-xs text-muted">
        {isLast ? "Last card" : ""}
      </p>
    </div>
  );
}
