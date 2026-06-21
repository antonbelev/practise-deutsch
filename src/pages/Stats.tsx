import { getChapters } from "../content/content";
import { ProgressBar } from "../components/ProgressBar";
import { useProgress } from "../state/progress";

function fmtTime(seconds: number): string {
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const m = Math.floor(seconds / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  return `${h}h ${m % 60}m`;
}

export function Stats() {
  const { progress, reset } = useProgress();
  const chapters = getChapters();
  const { totals, streak } = progress;
  const accuracy = totals.seen ? Math.round((totals.correct / totals.seen) * 100) : 0;

  const stats = [
    { label: "Day streak", value: String(streak.count) },
    { label: "Words seen", value: String(totals.seen) },
    { label: "Accuracy", value: `${accuracy}%` },
    { label: "Time", value: fmtTime(totals.seconds) },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Your progress</h1>
        <p className="mt-1 text-muted">Stored on this device.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="card p-4">
            <p className="text-2xl font-bold tabular-nums">{s.value}</p>
            <p className="mt-0.5 text-xs font-medium uppercase tracking-wide text-muted">
              {s.label}
            </p>
          </div>
        ))}
      </div>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-muted">Mastery by chapter</h2>
        <div className="card divide-y divide-border">
          {chapters.map((c) => {
            const cp = progress.perChapter[c.id];
            const mastery = cp?.mastery ?? 0;
            return (
              <div key={c.id} className="flex items-center gap-4 p-3">
                <span className="w-7 shrink-0 text-sm font-semibold text-muted">
                  {c.id}
                </span>
                <span className="w-40 shrink-0 truncate text-sm font-medium">
                  {c.title}
                </span>
                <ProgressBar value={mastery} className="flex-1" />
                <span className="w-10 shrink-0 text-right text-xs tabular-nums text-muted">
                  {Math.round(mastery * 100)}%
                </span>
              </div>
            );
          })}
        </div>
      </section>

      <div>
        <button
          className="btn-ghost text-wrong"
          onClick={() => {
            if (confirm("Reset all progress on this device?")) void reset();
          }}
        >
          Reset progress
        </button>
      </div>
    </div>
  );
}
