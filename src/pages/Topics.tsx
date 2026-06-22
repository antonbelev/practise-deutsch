import { useNavigate } from "react-router-dom";
import { TOPICS } from "../topics";
import type { Exercise } from "../topics";
import { ClockFace } from "../components/ClockFace";

export function Topics() {
  const navigate = useNavigate();

  function play(topicId: string, ex: Exercise) {
    navigate("/play", {
      state: {
        chapters: [],
        content: "vocab",
        game: ex.game,
        topicId,
        exerciseId: ex.id,
      },
    });
  }

  return (
    <div className="space-y-8">
      <section className="animate-slide-up">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Topics</h1>
        <p className="mt-1 text-muted">
          Focused, hand-built drills for the everyday essentials. Endless practice —
          each round is freshly generated.
        </p>
      </section>

      {TOPICS.map((topic) => (
        <section key={topic.id} className="space-y-3">
          <div className="flex items-center gap-3">
            {topic.id === "time" && (
              <span className="hidden shrink-0 sm:block">
                <ClockFace h24={10} m={10} size={52} />
              </span>
            )}
            <div>
              <h2 className="text-lg font-semibold">{topic.title}</h2>
              <p className="text-sm text-muted">{topic.blurb}</p>
            </div>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {topic.exercises.map((ex) => (
              <button
                key={ex.id}
                onClick={() => play(topic.id, ex)}
                className="card flex items-center justify-between gap-3 p-3.5 text-left transition-theme hover:border-accent/60"
              >
                <span className="min-w-0">
                  <span className="block text-sm font-semibold">{ex.title}</span>
                  <span className="block truncate text-xs text-muted">{ex.blurb}</span>
                </span>
                <span className="shrink-0 text-muted">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 6l6 6-6 6" />
                  </svg>
                </span>
              </button>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
