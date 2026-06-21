# Deutsch A1 — Practise

A clean, static web app for drilling German A1 vocabulary, phrases, and grammar.
Pick a chapter (or a range, or all of them), choose a focus and a game, and practise.
Progress, streaks, and theme are stored locally in your browser.

## Develop

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # static bundle in dist/
npm run preview  # serve the built bundle
```

## Content

Course content lives as JSON in `src/data/`, generated from the source PDFs in
`static-docs/` by `scripts/parse_pdf.py`. Regenerate with:

```bash
npm run parse    # = python3 scripts/parse_pdf.py  (needs: pip install pypdf)
```

See [`scripts/README.md`](scripts/README.md) for details on parsing.

## Architecture

- **Vite + React + TypeScript + Tailwind**, deployed as a static SPA.
- `src/content/` — typed loaders over the JSON (`content.ts`) and the game-question
  engine (`buildQuestions.ts`). Pages/games never import the JSON directly.
- `src/storage/progress.ts` — the only module that touches `localStorage`, with
  async-shaped functions and a versioned schema. This is the single seam to swap for
  an accounts + server/Postgres backend later.
- `src/games/` — the four games (Flashcards, Multiple choice, Type the answer,
  Match & fill) behind a shared `GameShell`.
- `src/pages/` — Home (selection), Session (play), Reference, Stats.

## Games

| Game            | What it tests                                        |
| --------------- | ---------------------------------------------------- |
| Flashcards      | Recognition; flip and self-grade                     |
| Multiple choice | Recall against plausible distractors (keys 1–4)      |
| Type the answer | Recall + spelling, with `ä ö ü ß` helpers            |
| Match & fill    | Pair matching (vocab) and gap-fill (phrases/grammar) |
