import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { setTheme as persistTheme } from "../storage/progress";
import type { ThemePref } from "../storage/schema";

interface ThemeCtx {
  theme: ThemePref;
  toggle: () => void;
}

const Ctx = createContext<ThemeCtx | null>(null);

function currentDomTheme(): ThemePref {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  // initial value is whatever the pre-paint inline script decided
  const [theme, setThemeState] = useState<ThemePref>(currentDomTheme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    localStorage.setItem("gp.theme", theme);
    void persistTheme(theme);
  }, [theme]);

  const toggle = useCallback(() => {
    setThemeState((t) => (t === "dark" ? "light" : "dark"));
  }, []);

  return <Ctx.Provider value={{ theme, toggle }}>{children}</Ctx.Provider>;
}

export function useTheme(): ThemeCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
