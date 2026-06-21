import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  addSeconds as addSecondsStore,
  getProgress,
  recordAnswer as recordAnswerStore,
  resetProgress as resetStore,
} from "../storage/progress";
import { emptyProgress, type Progress } from "../storage/schema";

interface ProgressCtx {
  progress: Progress;
  recordAnswer: (chapter: number, correct: boolean) => Promise<void>;
  addSeconds: (seconds: number) => Promise<void>;
  reset: () => Promise<void>;
}

const Ctx = createContext<ProgressCtx | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<Progress>(emptyProgress);

  useEffect(() => {
    void getProgress().then(setProgress);
  }, []);

  const recordAnswer = useCallback(async (chapter: number, correct: boolean) => {
    setProgress(await recordAnswerStore(chapter, correct));
  }, []);

  const addSeconds = useCallback(async (seconds: number) => {
    setProgress(await addSecondsStore(seconds));
  }, []);

  const reset = useCallback(async () => {
    setProgress(await resetStore());
  }, []);

  return (
    <Ctx.Provider value={{ progress, recordAnswer, addSeconds, reset }}>
      {children}
    </Ctx.Provider>
  );
}

export function useProgress(): ProgressCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useProgress must be used within ProgressProvider");
  return ctx;
}
