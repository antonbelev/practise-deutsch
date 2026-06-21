import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { buildQuestions } from "../content/buildQuestions";
import type { ContentType, GameType, Question } from "../content/types";
import { GameShell } from "../games/GameShell";
import { Flashcards } from "../games/Flashcards";
import { MultipleChoice } from "../games/MultipleChoice";
import { TypeAnswer } from "../games/TypeAnswer";
import { MatchFill } from "../games/MatchFill";
import { Confetti } from "../components/Confetti";
import { useProgress } from "../state/progress";

interface SessionState {
  chapters: number[];
  content: ContentType;
  game: GameType;
}

const SESSION_LIMIT = 20; // questions per session (keeps it bite-sized)
const MATCH_BATCH = 5;

export function Session() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as SessionState | null;
  const { recordAnswer, addSeconds } = useProgress();

  // build questions once per session; location.key changes on every navigation
  // (incl. "Play again"), so a fresh, reshuffled set is built each time.
  const questions = useMemo<Question[]>(() => {
    if (!state) return [];
    return buildQuestions({
      chapters: state.chapters,
      content: state.content,
      game: state.game,
      limit: SESSION_LIMIT,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, location.key]);

  // group into steps; match mode batches several questions per step
  const steps = useMemo<Question[][]>(() => {
    if (!questions.length) return [];
    const isMatch = questions[0].kind === "match";
    if (!isMatch) return questions.map((q) => [q]);
    const out: Question[][] = [];
    for (let i = 0; i < questions.length; i += MATCH_BATCH) {
      out.push(questions.slice(i, i + MATCH_BATCH));
    }
    return out;
  }, [questions]);

  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [seen, setSeen] = useState(0);
  const [done, setDone] = useState(false);
  const startedAt = useRef(Date.now());
  const answeredThisStep = useRef(false);

  useEffect(() => {
    if (!state) navigate("/", { replace: true });
  }, [state, navigate]);

  // reset session when a new session starts (e.g. "Play again")
  useEffect(() => {
    setStep(0);
    setScore(0);
    setSeen(0);
    setDone(false);
    startedAt.current = Date.now();
    answeredThisStep.current = false;
  }, [location.key]);

  if (!state) return null;
  if (!questions.length) {
    return (
      <div className="card p-8 text-center">
        <p className="text-lg font-semibold">Nothing to practise here yet</p>
        <p className="mt-1 text-muted">Try a different focus or more chapters.</p>
        <button className="btn-primary mt-4" onClick={() => navigate("/")}>
          Back
        </button>
      </div>
    );
  }

  const total = steps.length;
  const current = steps[step];

  function handleAnswer(correct: boolean) {
    setSeen((s) => s + 1);
    if (correct) setScore((s) => s + 1);
    void recordAnswer(current[0].chapter, correct);
    answeredThisStep.current = true;
  }

  function handleNext() {
    answeredThisStep.current = false;
    if (step + 1 >= total) {
      const secs = (Date.now() - startedAt.current) / 1000;
      void addSeconds(secs);
      setDone(true);
    } else {
      setStep((s) => s + 1);
    }
  }

  if (done) {
    const accuracy = seen ? Math.round((score / seen) * 100) : 0;
    const perfect = seen > 0 && score === seen;
    return <Finish score={score} seen={seen} accuracy={accuracy} perfect={perfect} state={state} />;
  }

  const q = current[0];
  const isLast = step + 1 >= total;

  return (
    <GameShell step={step} total={total} score={score} onQuit={() => navigate("/")}>
      {state.game === "flashcards" && (
        <Flashcards question={q} onAnswer={handleAnswer} onNext={handleNext} isLast={isLast} />
      )}
      {state.game === "multiple-choice" && (
        <MultipleChoice question={q} onAnswer={handleAnswer} onNext={handleNext} isLast={isLast} />
      )}
      {state.game === "type-answer" && (
        <TypeAnswer question={q} onAnswer={handleAnswer} onNext={handleNext} isLast={isLast} />
      )}
      {state.game === "match-fill" && (
        <MatchFill
          question={q}
          batch={current}
          onAnswer={handleAnswer}
          onNext={handleNext}
          isLast={isLast}
        />
      )}
    </GameShell>
  );
}

function Finish({
  score,
  seen,
  accuracy,
  perfect,
  state,
}: {
  score: number;
  seen: number;
  accuracy: number;
  perfect: boolean;
  state: SessionState;
}) {
  const navigate = useNavigate();
  return (
    <>
      <Confetti active={perfect} />
      <div className="card animate-pop-in p-8 text-center">
        <p className="text-sm font-medium uppercase tracking-wide text-muted">
          {perfect ? "Perfect round" : "Session complete"}
        </p>
        <p className="mt-2 text-5xl font-bold tracking-tight tabular-nums">{accuracy}%</p>
        <p className="mt-1 text-muted">
          {score} of {seen} correct
        </p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <button
            className="btn-primary px-6"
            onClick={() => navigate("/play", { state, replace: true })}
          >
            Play again
          </button>
          <button className="btn-ghost px-6" onClick={() => navigate("/")}>
            Change selection
          </button>
        </div>
      </div>
    </>
  );
}
