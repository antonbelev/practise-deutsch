const KEYS = ["ä", "ö", "ü", "ß", "Ä", "Ö", "Ü"];

// Inserts a German special character into a text input. Used by type-answer games.
export function UmlautBar({ onInsert }: { onInsert: (ch: string) => void }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {KEYS.map((k) => (
        <button
          key={k}
          type="button"
          tabIndex={-1}
          onClick={() => onInsert(k)}
          className="h-9 w-9 rounded-lg border border-border bg-surface text-sm font-medium text-muted transition-theme hover:bg-surface-2 hover:text-text"
        >
          {k}
        </button>
      ))}
    </div>
  );
}
