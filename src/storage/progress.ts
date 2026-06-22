// The ONLY module that touches localStorage. Async-shaped so a future swap to a
// server/Postgres-backed API is a drop-in reimplementation, not a refactor.

import {
  emptyProgress,
  PROGRESS_VERSION,
  type ChapterProgress,
  type Progress,
  type ThemePref,
} from "./schema";

const KEY = "gp.progress.v1";
const MASTERY_ALPHA = 0.2; // EWMA weight for newest attempt

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function migrate(raw: unknown): Progress {
  const base = emptyProgress();
  if (!raw || typeof raw !== "object") return base;
  const data = raw as Partial<Progress>;
  // version guard — future migrations branch here on data.version
  return {
    ...base,
    ...data,
    version: PROGRESS_VERSION,
    streak: { ...base.streak, ...data.streak },
    totals: { ...base.totals, ...data.totals },
    perChapter: { ...data.perChapter },
    settings: { ...base.settings, ...data.settings },
  };
}

export async function getProgress(): Promise<Progress> {
  try {
    const raw = localStorage.getItem(KEY);
    return migrate(raw ? JSON.parse(raw) : null);
  } catch {
    return emptyProgress();
  }
}

export async function saveProgress(p: Progress): Promise<void> {
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    /* storage full / unavailable — non-fatal */
  }
}

function bumpStreak(p: Progress): void {
  const today = todayISO();
  if (p.streak.lastDay === today) return;
  const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);
  p.streak.count = p.streak.lastDay === yesterday ? p.streak.count + 1 : 1;
  p.streak.lastDay = today;
}

/** Record one answer; updates totals, chapter mastery, and the daily streak. */
export async function recordAnswer(
  chapter: number,
  correct: boolean,
): Promise<Progress> {
  const p = await getProgress();
  bumpStreak(p);

  p.totals.seen += 1;
  if (correct) p.totals.correct += 1;

  // chapter 0 is the sentinel for curated Topic exercises: they contribute to
  // totals + streak, but there is no chapter mastery bar to update.
  if (chapter !== 0) {
    const cp: ChapterProgress =
      p.perChapter[chapter] ?? { seen: 0, correct: 0, mastery: 0 };
    cp.seen += 1;
    if (correct) cp.correct += 1;
    cp.mastery = cp.mastery + MASTERY_ALPHA * ((correct ? 1 : 0) - cp.mastery);
    p.perChapter[chapter] = cp;
  }

  await saveProgress(p);
  return p;
}

/** Add elapsed practice seconds (called when a session ends). */
export async function addSeconds(seconds: number): Promise<Progress> {
  const p = await getProgress();
  p.totals.seconds += Math.max(0, Math.round(seconds));
  await saveProgress(p);
  return p;
}

export async function setTheme(theme: ThemePref): Promise<void> {
  const p = await getProgress();
  p.settings.theme = theme;
  await saveProgress(p);
}

export async function resetProgress(): Promise<Progress> {
  const fresh = emptyProgress();
  await saveProgress(fresh);
  return fresh;
}
