import { useEffect, useRef, useState } from "react";
import type { GameProps } from "./types";
import { norm } from "../content/buildQuestions";
import { Prompt, FeedbackBar } from "./MultipleChoice";
import { UmlautBar } from "./UmlautBar";

// lenient: ignore case/punctuation, a leading article, and parenthetical hints.
// Accept any one sense of a multi-sense gloss ("to think, to believe" → "believe" ok).
function lenientEqual(input: string, answer: string): boolean {
  const strip = (s: string) =>
    norm(s.replace(/\(.*?\)/g, "").replace(/^here:\s*/, "")).replace(
      /^(der|die|das|to|a|an|the)\s+/,
      "",
    );
  const a = strip(input);
  if (!a) return false;
  // split the expected answer into its senses and accept any match
  const senses = answer
    .split(/[,;/]| or /i)
    .map(strip)
    .filter(Boolean);
  return senses.includes(a) || strip(answer) === a;
}

export function TypeAnswer({ question, onAnswer, onNext, isLast }: GameProps) {
  const [value, setValue] = useState("");
  const [result, setResult] = useState<null | boolean>(null);
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setValue("");
    setResult(null);
    ref.current?.focus();
  }, [question.sourceId]);

  function check() {
    if (result !== null) {
      onNext();
      return;
    }
    if (!value.trim()) return;
    const ok = lenientEqual(value, question.answer);
    setResult(ok);
    onAnswer(ok);
  }

  function insert(ch: string) {
    const el = ref.current;
    if (!el) {
      setValue((v) => v + ch);
      return;
    }
    const start = el.selectionStart ?? value.length;
    const end = el.selectionEnd ?? value.length;
    const next = value.slice(0, start) + ch + value.slice(end);
    setValue(next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + ch.length, start + ch.length);
    });
  }

  const answered = result !== null;

  return (
    <div className="space-y-6">
      <Prompt question={question} />
      <div className="space-y-3">
        <input
          ref={ref}
          value={value}
          disabled={answered}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              check();
            }
          }}
          placeholder="Type your answer…"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          className={`w-full rounded-xl border bg-surface px-4 py-3.5 text-lg outline-none transition-theme ${
            answered
              ? result
                ? "border-correct"
                : "animate-shake border-wrong"
              : "border-border focus:border-accent"
          }`}
        />
        {!answered && <UmlautBar onInsert={insert} />}
      </div>

      {answered ? (
        <div className="space-y-3">
          <FeedbackBar
            correct={result}
            example={question.example}
            solution={!result ? `${question.prompt} → ${question.answer}` : undefined}
            onNext={onNext}
            isLast={isLast}
          />
        </div>
      ) : (
        <button className="btn-primary w-full" onClick={check} disabled={!value.trim()}>
          Check
        </button>
      )}
    </div>
  );
}
