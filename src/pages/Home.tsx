import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CHAPTER_RANGE,
  countFor,
  getChapters,
} from "../content/content";
import type { ContentType, Direction, GameType } from "../content/types";
import { ProgressBar } from "../components/ProgressBar";
import { useProgress } from "../state/progress";

const SEL_KEY = "gp.selection";

function defaults(allIds: number[]) {
  return {
    selected: new Set(allIds),
    content: "vocab" as ContentType,
    game: "multiple-choice" as GameType,
    direction: "de-en" as Direction,
    from: 1,
    to: 18,
  };
}

function loadSelection(allIds: number[]) {
  try {
    const raw = localStorage.getItem(SEL_KEY);
    if (!raw) return defaults(allIds);
    const p = JSON.parse(raw);
    return {
      selected: new Set<number>(Array.isArray(p.selected) ? p.selected : allIds),
      content: (p.content ?? "vocab") as ContentType,
      game: (p.game ?? "multiple-choice") as GameType,
      direction: (p.direction ?? "de-en") as Direction,
      from: p.from ?? 1,
      to: p.to ?? 18,
    };
  } catch {
    return defaults(allIds);
  }
}

function saveSelection(s: {
  selected: Set<number>;
  content: ContentType;
  game: GameType;
  direction: Direction;
  from: number;
  to: number;
}) {
  try {
    localStorage.setItem(
      SEL_KEY,
      JSON.stringify({ ...s, selected: [...s.selected] }),
    );
  } catch { /* non-fatal */ }
}

const CONTENT: { id: ContentType; label: string; blurb: string }[] = [
  { id: "vocab", label: "Vocabulary", blurb: "Words & meanings" },
  { id: "phrases", label: "Phrases", blurb: "Everyday expressions" },
  { id: "grammar", label: "Grammar", blurb: "Verb conjugations" },
];

const GAMES: { id: GameType; label: string; blurb: string }[] = [
  { id: "flashcards", label: "Flashcards", blurb: "Flip & self-grade" },
  { id: "multiple-choice", label: "Multiple choice", blurb: "Pick the answer" },
  { id: "type-answer", label: "Type the answer", blurb: "Recall & spell" },
  { id: "match-fill", label: "Match & fill", blurb: "Pairs & gaps" },
];

export function Home() {
  const navigate = useNavigate();
  const { progress } = useProgress();
  const chapters = getChapters();
  const { min, max } = CHAPTER_RANGE;
  const allIds = chapters.map((c) => c.id);

  const [all, setAll] = useState(() => loadSelection(allIds));
  const { selected, content, game, direction, from, to } = all;

  // merge a partial change, persist, and return the next state
  const update = (patch: Partial<typeof all>) =>
    setAll((prev) => {
      const next = { ...prev, ...patch };
      saveSelection(next);
      return next;
    });

  const setSelected = (fn: (prev: Set<number>) => Set<number>) =>
    setAll((prev) => {
      const next = { ...prev, selected: fn(prev.selected) };
      saveSelection(next);
      return next;
    });
  const setContent = (v: ContentType) => update({ content: v });
  const setGame = (v: GameType) => update({ game: v });
  const setDirection = (v: Direction) => update({ direction: v });
  const setFrom = (v: number) => update({ from: v });
  const setTo = (v: number) => update({ to: v });

  const selectedIds = useMemo(
    () => [...selected].sort((a, b) => a - b),
    [selected],
  );
  const available = countFor(content, selectedIds);
  const canStart = selectedIds.length > 0 && available > 0;

  function toggle(id: number) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }
  const selectAll = () => setSelected(() => new Set(allIds));
  const clearAll = () => setSelected(() => new Set());
  function selectRange(f: number, t: number) {
    const lo = Math.min(f, t);
    const hi = Math.max(f, t);
    const next = new Set<number>();
    for (let i = lo; i <= hi; i++) next.add(i);
    setSelected(() => next);
  }

  function start() {
    if (!canStart) return;
    navigate("/play", {
      state: {
        chapters: selectedIds,
        content,
        game,
        // direction only affects vocab; harmless for other content types
        direction: content === "vocab" ? direction : undefined,
      },
    });
  }

  return (
    <div className="space-y-8">
      <section className="animate-slide-up">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          What do you want to practise?
        </h1>
        <p className="mt-1 text-muted">
          Pick your chapters, choose a focus, and play.
        </p>
      </section>

      {/* chapter selection */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-muted">Chapters</span>
          <div className="ml-auto flex gap-2">
            <button className="chip" onClick={selectAll}>
              All {min}–{max}
            </button>
            <button className="chip" onClick={clearAll}>
              Clear
            </button>
          </div>
        </div>

        {/* range */}
        <div className="card flex flex-wrap items-center gap-3 p-3 text-sm">
          <span className="text-muted">Range</span>
          <RangeNum value={from} min={min} max={max} onChange={setFrom} />
          <span className="text-muted">to</span>
          <RangeNum value={to} min={min} max={max} onChange={setTo} />
          <button className="btn-ghost ml-auto py-1.5" onClick={() => selectRange(from, to)} type="button">
            Select range
          </button>
        </div>

        {/* chapter grid */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {chapters.map((c) => {
            const active = selected.has(c.id);
            const mastery = progress.perChapter[c.id]?.mastery ?? 0;
            return (
              <button
                key={c.id}
                onClick={() => toggle(c.id)}
                aria-pressed={active}
                className={`card flex flex-col gap-2 p-3 text-left transition-theme hover:border-accent/60 ${
                  active ? "border-accent ring-1 ring-accent" : ""
                }`}
              >
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-xs font-semibold text-muted">
                    Kapitel {c.id}
                  </span>
                  <span className="text-[11px] text-muted">{c.vocabCount} words</span>
                </div>
                <span className="line-clamp-1 text-sm font-medium">{c.title}</span>
                <ProgressBar value={mastery} />
              </button>
            );
          })}
        </div>
      </section>

      {/* content + game */}
      <section className="grid gap-6 sm:grid-cols-2">
        <Picker
          title="Focus"
          items={CONTENT}
          value={content}
          onChange={(v) => setContent(v as ContentType)}
        />
        <Picker
          title="Game"
          items={GAMES}
          value={game}
          onChange={(v) => setGame(v as GameType)}
        />
      </section>

      {/* direction — only meaningful for vocabulary (German ↔ English) */}
      {content === "vocab" && (
        <section className="space-y-2">
          <span className="text-sm font-semibold text-muted">Direction</span>
          <div className="flex gap-1 rounded-xl border border-border bg-surface p-1">
            {(
              [
                { id: "de-en", label: "German → English", blurb: "See German, recall English" },
                { id: "en-de", label: "English → German", blurb: "See English, recall German" },
              ] as const
            ).map((d) => {
              const active = direction === d.id;
              return (
                <button
                  key={d.id}
                  onClick={() => setDirection(d.id)}
                  aria-pressed={active}
                  className={`flex-1 rounded-lg px-3 py-2 text-center transition-theme ${
                    active ? "bg-surface-2 text-text" : "text-muted hover:text-text"
                  }`}
                >
                  <span className="block text-sm font-semibold">{d.label}</span>
                  <span className="hidden text-xs text-muted sm:block">{d.blurb}</span>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* start bar */}
      <div className="sticky bottom-4 z-30">
        <div className="card flex items-center gap-4 p-3 shadow-card">
          <div className="text-sm text-muted">
            {selectedIds.length
              ? `${selectedIds.length} chapter${selectedIds.length > 1 ? "s" : ""} · ${available} items`
              : "Select at least one chapter"}
          </div>
          <button className="btn-primary ml-auto px-6" disabled={!canStart} onClick={start}>
            Start
          </button>
        </div>
      </div>
    </div>
  );
}

function RangeNum({
  value,
  min,
  max,
  onChange,
}: {
  value: number;
  min: number;
  max: number;
  onChange: (n: number) => void;
}) {
  return (
    <input
      type="number"
      min={min}
      max={max}
      value={value}
      onChange={(e) => {
        const n = Number(e.target.value);
        if (!Number.isNaN(n)) onChange(Math.max(min, Math.min(max, n)));
      }}
      className="w-16 rounded-lg border border-border bg-surface px-2 py-1.5 text-center text-text"
    />
  );
}

function Picker<T extends string>({
  title,
  items,
  value,
  onChange,
}: {
  title: string;
  items: { id: T; label: string; blurb: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="space-y-2">
      <span className="text-sm font-semibold text-muted">{title}</span>
      <div className="grid gap-2">
        {items.map((it) => {
          const active = it.id === value;
          return (
            <button
              key={it.id}
              onClick={() => onChange(it.id)}
              aria-pressed={active}
              className={`card flex items-center justify-between p-3 text-left transition-theme hover:border-accent/60 ${
                active ? "border-accent ring-1 ring-accent" : ""
              }`}
            >
              <span>
                <span className="block text-sm font-semibold">{it.label}</span>
                <span className="block text-xs text-muted">{it.blurb}</span>
              </span>
              <span
                className={`grid h-5 w-5 place-items-center rounded-full border ${
                  active ? "border-accent bg-accent text-white" : "border-border"
                }`}
              >
                {active ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M5 12l5 5L20 6" />
                  </svg>
                ) : null}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
