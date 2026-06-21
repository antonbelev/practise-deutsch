import type { ReactNode } from "react";
import { ProgressBar } from "../components/ProgressBar";

interface Props {
  step: number; // 0-based
  total: number;
  score: number;
  onQuit: () => void;
  children: ReactNode;
}

export function GameShell({ step, total, score, onQuit, children }: Props) {
  const progress = total ? step / total : 0;
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onQuit}
          aria-label="Quit session"
          className="grid h-9 w-9 place-items-center rounded-xl border border-border bg-surface text-muted transition-theme hover:bg-surface-2 hover:text-text"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
        <ProgressBar value={progress} className="flex-1" />
        <span className="min-w-[3rem] text-right text-sm font-semibold text-muted tabular-nums">
          {step}/{total}
        </span>
      </div>
      <div className="card animate-pop-in p-5 sm:p-8">{children}</div>
      <p className="text-center text-sm text-muted">
        Score <span className="font-semibold text-text">{score}</span>
      </p>
    </div>
  );
}
