import { NavLink, Route, Routes } from "react-router-dom";
import { ThemeToggle } from "./components/ThemeToggle";
import { useProgress } from "./state/progress";
import { Home } from "./pages/Home";
import { Session } from "./pages/Session";
import { Reference } from "./pages/Reference";
import { Stats } from "./pages/Stats";

function StreakBadge() {
  const { progress } = useProgress();
  const today = new Date().toISOString().slice(0, 10);
  const live = progress.streak.lastDay === today;
  if (!progress.streak.count) return null;
  return (
    <span
      title={live ? "Practised today" : "Practise today to keep your streak"}
      className={`inline-flex items-center gap-1.5 rounded-xl border px-2.5 py-1 text-sm font-semibold ${
        live
          ? "border-accent bg-accent-soft text-accent"
          : "border-border bg-surface text-muted"
      }`}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2c1 3-1 4-2 6s0 4 0 4-3-1-3-4c0 0-3 2-3 6a8 8 0 0 0 16 0c0-5-4-7-4-9 0-1 .5-2 .5-3 0 0-3 .5-4.5 0z" />
      </svg>
      {progress.streak.count}
    </span>
  );
}

const navClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-lg px-3 py-1.5 text-sm font-medium transition-theme ${
    isActive ? "bg-surface-2 text-text" : "text-muted hover:text-text"
  }`;

export default function App() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-border bg-bg/80 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-2 px-4 py-3">
          <NavLink to="/" className="mr-1 flex items-center gap-2 font-bold tracking-tight">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-accent text-sm text-white">
              D
            </span>
            <span className="hidden sm:inline">Deutsch&nbsp;A1</span>
          </NavLink>
          <nav className="flex items-center gap-1">
            <NavLink to="/" end className={navClass}>
              Practise
            </NavLink>
            <NavLink to="/reference" className={navClass}>
              Reference
            </NavLink>
            <NavLink to="/stats" className={navClass}>
              Stats
            </NavLink>
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <StreakBadge />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-6 sm:py-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/play" element={<Session />} />
          <Route path="/reference" element={<Reference />} />
          <Route path="/stats" element={<Stats />} />
        </Routes>
      </main>

      <footer className="border-t border-border py-5 text-center text-xs text-muted">
        Built by{" "}
        <a
          href="https://belev.me/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-text underline-offset-2 hover:underline"
        >
          Anton Belev
        </a>
      </footer>
    </div>
  );
}
