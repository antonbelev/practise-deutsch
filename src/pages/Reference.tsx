import { useState, type ReactNode } from "react";
import { getChapters, grammarFor, phrasesFor } from "../content/content";
import type { GrammarBlock } from "../content/types";

export function Reference() {
  const chapters = getChapters();
  const [chapter, setChapter] = useState(chapters[0]?.id ?? 1);
  const [tab, setTab] = useState<"phrases" | "grammar">("phrases");

  const phrases = phrasesFor([chapter]);
  const grammar = grammarFor([chapter]);

  // group phrases by category
  const byCategory = phrases.reduce<Record<string, typeof phrases>>((acc, p) => {
    (acc[p.category] ??= []).push(p);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Reference</h1>
        <p className="mt-1 text-muted">Phrases and grammar, chapter by chapter.</p>
      </div>

      {/* chapter selector */}
      <div className="flex flex-wrap gap-1.5">
        {chapters.map((c) => (
          <button
            key={c.id}
            onClick={() => setChapter(c.id)}
            className={`chip ${chapter === c.id ? "chip-active" : ""}`}
          >
            {c.id}
          </button>
        ))}
      </div>

      <h2 className="text-lg font-semibold">
        Kapitel {chapter}
        <span className="ml-2 font-normal text-muted">
          {chapters.find((c) => c.id === chapter)?.title}
        </span>
      </h2>

      {/* tabs */}
      <div className="flex gap-1 rounded-xl border border-border bg-surface p-1">
        {(["phrases", "grammar"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium capitalize transition-theme ${
              tab === t ? "bg-surface-2 text-text" : "text-muted hover:text-text"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "phrases" ? (
        <div className="space-y-5">
          {Object.entries(byCategory).map(([cat, items]) => (
            <div key={cat} className="card p-4">
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted">
                {cat}
              </h3>
              <ul className="space-y-1.5">
                {items.map((p) => (
                  <li key={p.id} className="flex items-start gap-2 text-[15px]">
                    {p.register && (
                      <span className="mt-0.5 rounded border border-border px-1.5 py-0.5 text-[10px] uppercase text-muted">
                        {p.register}
                      </span>
                    )}
                    <span>{p.de}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {!phrases.length && <Empty>No phrases recorded for this chapter.</Empty>}
        </div>
      ) : (
        <div className="space-y-4">
          {grammar.map((g) => (
            <GrammarCard key={g.id} block={g} />
          ))}
          {!grammar.length && <Empty>No grammar recorded for this chapter.</Empty>}
        </div>
      )}
    </div>
  );
}

function GrammarCard({ block }: { block: GrammarBlock }) {
  return (
    <div className="card p-4">
      <h3 className="mb-3 text-sm font-semibold">{block.heading}</h3>
      {block.table ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                {block.table.headers.map((h, i) => (
                  <th
                    key={i}
                    className="border-b border-border px-2.5 py-1.5 text-left font-semibold text-muted"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.table.rows.map((row, r) => (
                <tr key={r}>
                  {row.map((cell, c) => (
                    <td
                      key={c}
                      className={`border-b border-border/60 px-2.5 py-1.5 ${
                        c === 0 ? "font-medium text-muted" : ""
                      }`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : block.items.length ? (
        <div className="space-y-3">
          {block.items.some((i) => i.type === "note") && (
            <div className="space-y-1.5">
              {block.items
                .filter((i) => i.type === "note")
                .map((i, idx) => (
                  <p key={idx} className="text-[15px] leading-relaxed text-text">
                    {i.text}
                  </p>
                ))}
            </div>
          )}
          {block.items.some((i) => i.type === "example") && (
            <ul className="space-y-1.5 rounded-xl border border-border bg-surface-2/50 p-3">
              {block.items
                .filter((i) => i.type === "example")
                .map((i, idx) => (
                  <li
                    key={idx}
                    className="text-[15px] leading-relaxed text-text"
                    lang="de"
                  >
                    {i.text}
                  </li>
                ))}
            </ul>
          )}
        </div>
      ) : (
        <p className="text-[15px] leading-relaxed text-muted">{block.raw}</p>
      )}
    </div>
  );
}

function Empty({ children }: { children: ReactNode }) {
  return (
    <div className="card p-8 text-center text-muted">{children}</div>
  );
}
