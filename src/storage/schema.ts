// Versioned shape of persisted progress. The `version` field lets a future
// migration (incl. a move to a server/Postgres backend) reshape old data safely.

export const PROGRESS_VERSION = 1;

export type ThemePref = "light" | "dark";

export interface ChapterProgress {
  seen: number;
  correct: number;
  /** rolling correct-rate 0..1 over recent attempts */
  mastery: number;
}

export interface Streak {
  count: number;
  /** ISO date (YYYY-MM-DD) of the last day the user practised */
  lastDay: string | null;
}

export interface Totals {
  seen: number;
  correct: number;
  seconds: number;
}

export interface Progress {
  version: number;
  streak: Streak;
  perChapter: Record<number, ChapterProgress>;
  totals: Totals;
  settings: { theme: ThemePref | null };
}

export function emptyProgress(): Progress {
  return {
    version: PROGRESS_VERSION,
    streak: { count: 0, lastDay: null },
    perChapter: {},
    totals: { seen: 0, correct: 0, seconds: 0 },
    settings: { theme: null },
  };
}
