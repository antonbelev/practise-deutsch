import { useState } from "react";
import {
  GENDER_EXCEPTIONS,
  GENDER_RULES,
  type Gender,
  type GenderRule,
} from "../content/genderRules";

// Fixed classes per gender (Tailwind can't see dynamically-built class strings).
const GENDER_STYLE: Record<Gender, { chip: string; label: string }> = {
  der: { chip: "bg-blue-500/15 text-blue-600 dark:text-blue-400", label: "der" },
  die: { chip: "bg-rose-500/15 text-rose-600 dark:text-rose-400", label: "die" },
  das: { chip: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400", label: "das" },
};

const ORDER: Gender[] = ["der", "die", "das"];

/**
 * Collapsible cheat-sheet of German gender rules. Defaults collapsed so it never
 * competes with the game; when `highlight` is set (the rule behind the current
 * noun) that row is emphasised so the learner can place it in the bigger picture.
 */
export function GenderRulesSheet({ highlight }: { highlight?: GenderRule }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-xl border border-border bg-surface">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-2 px-3.5 py-2.5 text-left text-sm font-medium text-muted hover:text-text"
        aria-expanded={open}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          className={`transition-transform ${open ? "rotate-90" : ""}`}
        >
          <path d="M9 6l6 6-6 6" />
        </svg>
        Gender rules cheat-sheet
        <span className="ml-auto text-xs text-muted/70">der · die · das</span>
      </button>

      {open && (
        <div className="space-y-4 border-t border-border p-3.5">
          {ORDER.map((g) => {
            const rules = GENDER_RULES.filter((r) => r.gender === g);
            const style = GENDER_STYLE[g];
            return (
              <div key={g}>
                <div className="mb-1.5 flex items-center gap-2">
                  <span
                    className={`rounded-md px-2 py-0.5 text-sm font-bold ${style.chip}`}
                  >
                    {style.label}
                  </span>
                </div>
                <ul className="space-y-1.5">
                  {rules.map((r, i) => {
                    const active = highlight === r;
                    return (
                      <li
                        key={i}
                        className={`rounded-lg px-2.5 py-1.5 text-sm ${
                          active
                            ? "bg-accent-soft ring-1 ring-accent"
                            : ""
                        }`}
                      >
                        <span className="font-medium text-text">{r.label}</span>
                        <span className="mt-0.5 block text-xs text-muted">
                          {r.examples.join(" · ")}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}

          <div className="rounded-lg border border-border bg-surface-2/50 p-2.5">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted">
              Watch out
            </p>
            <ul className="space-y-0.5 text-xs text-muted">
              {GENDER_EXCEPTIONS.map((e) => (
                <li key={e.word}>
                  <span className="font-medium text-text">{e.word}</span> — {e.note}
                </li>
              ))}
            </ul>
          </div>

          <p className="text-xs italic text-muted/80">
            Rules are guidelines with exceptions — the surest way to learn gender is
            to memorise each noun together with its article.
          </p>
        </div>
      )}
    </div>
  );
}
