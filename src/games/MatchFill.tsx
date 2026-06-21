import { useEffect, useMemo, useState } from "react";
import type { Question } from "../content/types";
import { norm } from "../content/buildQuestions";
import { FeedbackBar } from "./MultipleChoice";
import { UmlautBar } from "./UmlautBar";

// MatchFill has two modes:
//  - "fill": a single gap-fill (phrases / grammar) answered by typing.
//  - "match": a batch of vocab pairs matched against the clock.
// The Session decides which by the question kind and passes a batch for matching.

interface Props {
  question: Question;
  batch?: Question[]; // present for match mode
  onAnswer: (correct: boolean) => void;
  onNext: () => void;
  onBatchDone?: (results: boolean[]) => void;
  isLast: boolean;
}

export function MatchFill(props: Props) {
  if (props.question.kind === "fill") return <FillGame {...props} />;
  return <MatchGame {...props} />;
}

/* ---------------------------------- fill ---------------------------------- */

function FillGame({ question, onAnswer, onNext, isLast }: Props) {
  const [value, setValue] = useState("");
  const [result, setResult] = useState<null | boolean>(null);

  useEffect(() => {
    setValue("");
    setResult(null);
  }, [question.sourceId]);

  function check() {
    if (result !== null) return onNext();
    if (!value.trim()) return;
    const ok = norm(value) === norm(question.answer);
    setResult(ok);
    onAnswer(ok);
  }

  const answered = result !== null;
  return (
    <div className="space-y-6">
      {question.hint && (
        <p className="text-center text-xs font-medium uppercase tracking-wide text-muted">
          {question.hint}
        </p>
      )}
      <p className="text-center text-2xl font-semibold tracking-tight">
        {question.prompt}
      </p>
      <div className="space-y-3">
        <input
          value={value}
          disabled={answered}
          autoFocus
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), check())}
          placeholder="Fill the gap…"
          autoComplete="off"
          spellCheck={false}
          className={`w-full rounded-xl border bg-surface px-4 py-3.5 text-lg outline-none transition-theme ${
            answered
              ? result
                ? "border-correct"
                : "animate-shake border-wrong"
              : "border-border focus:border-accent"
          }`}
        />
        {!answered && <UmlautBar onInsert={(c) => setValue((v) => v + c)} />}
      </div>
      {answered ? (
        <div className="space-y-3">
          {!result && (
            <p className="text-sm">
              <span className="text-muted">Answer: </span>
              <span className="font-semibold text-correct">{question.answer}</span>
            </p>
          )}
          <FeedbackBar correct={result} example={question.example} onNext={onNext} isLast={isLast} />
        </div>
      ) : (
        <button className="btn-primary w-full" onClick={check} disabled={!value.trim()}>
          Check
        </button>
      )}
    </div>
  );
}

/* --------------------------------- match ---------------------------------- */

interface Tile {
  id: string;
  text: string;
  pairId: string;
  side: "left" | "right";
}

function MatchGame({ batch, question, onAnswer, onBatchDone, onNext, isLast }: Props) {
  const items = useMemo(() => (batch && batch.length ? batch : [question]), [batch, question]);

  const tiles = useMemo<Tile[]>(() => {
    const left: Tile[] = items.map((q) => ({
      id: q.sourceId + "-l",
      text: q.prompt,
      pairId: q.sourceId,
      side: "left",
    }));
    const right: Tile[] = shuffle(
      items.map((q) => ({
        id: q.sourceId + "-r",
        text: q.answer,
        pairId: q.sourceId,
        side: "right" as const,
      })),
    );
    return [...left, ...right];
  }, [items]);

  const [picked, setPicked] = useState<Tile | null>(null);
  const [done, setDone] = useState<Set<string>>(new Set());
  const [wrongPair, setWrongPair] = useState<[string, string] | null>(null);
  const resultsRef = useState<boolean[]>(() => [])[0];

  useEffect(() => {
    setPicked(null);
    setDone(new Set());
    setWrongPair(null);
  }, [items]);

  const finished = done.size === items.length;

  function tap(tile: Tile) {
    if (done.has(tile.pairId)) return;
    if (!picked) {
      setPicked(tile);
      return;
    }
    if (picked.id === tile.id) {
      setPicked(null);
      return;
    }
    if (picked.side === tile.side) {
      setPicked(tile);
      return;
    }
    const correct = picked.pairId === tile.pairId;
    onAnswer(correct);
    resultsRef.push(correct);
    if (correct) {
      const next = new Set(done);
      next.add(tile.pairId);
      setDone(next);
      setPicked(null);
      if (next.size === items.length) onBatchDone?.(resultsRef);
    } else {
      setWrongPair([picked.id, tile.id]);
      setTimeout(() => setWrongPair(null), 450);
      setPicked(null);
    }
  }

  return (
    <div className="space-y-6">
      <p className="text-center text-sm text-muted">Match each pair</p>
      <div className="grid grid-cols-2 gap-2.5">
        {tiles.map((t) => {
          const isDone = done.has(t.pairId);
          const isPicked = picked?.id === t.id;
          const isWrong = wrongPair?.includes(t.id);
          let tone = "border-border bg-surface hover:border-accent/60";
          if (isDone) tone = "border-correct/40 bg-correct/5 text-correct opacity-70";
          else if (isWrong) tone = "animate-shake border-wrong bg-wrong/10 text-wrong";
          else if (isPicked) tone = "border-accent bg-accent-soft text-accent";
          return (
            <button
              key={t.id}
              onClick={() => tap(t)}
              disabled={isDone}
              className={`min-h-[56px] rounded-xl border p-3 text-sm font-medium transition-theme ${tone}`}
            >
              {t.text}
            </button>
          );
        })}
      </div>
      {finished && (
        <div className="animate-slide-up rounded-xl border border-correct/40 bg-correct/5 p-3">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-correct">All matched</span>
            <button className="btn-primary ml-auto" onClick={onNext} autoFocus>
              {isLast ? "Finish" : "Next"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
