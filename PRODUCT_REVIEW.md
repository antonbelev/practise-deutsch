# Product / UX Review — Deutsch A1 Practise

Reviewed: 2026-06-21. Reviewer brief: act as a demanding product critic, find every
issue across the app, document them, document the fix, and don't stop until the
experience is something to be proud of.

Severity: **P0** = breaks trust / makes the feature useless · **P1** = clearly wrong,
hurts learning · **P2** = polish / nice-to-have.

---

## P0 — Content data quality (root cause of the worst UX)

### P0-1. ~41% of vocab entries are broken column-bleed garbage
The vocabulary PDF has 3 visual columns (German · English · example). The parser
linearises them and frequently mis-aligns, producing entries like:

- `ihn` → `wichtig.` (pronoun "him" glossed as "important")
- `von` → `Beruf sein to be`
- `Ski` → `fahren to ski Stefan`
- `sich` → `vorstellen to introduce oneself Stellen`

Measured: **764 `other`-pos entries** (mostly junk) + **80+** entries with a stray
capitalised German token bleeding into the English gloss. Combined ≈ **943 / 2291
(41%)** entries are untrustworthy.

**Impact:** This is the issue in screenshot #1 — `ihn → wichtig.` shown as a "correct"
answer, and `gehen to go for a walk` as a distractor. Every game built on vocab inherits
this. A learner cannot trust anything they see. This is the single most damaging problem.

**Fix:** Stop shipping low-confidence entries.
1. Keep only `noun` (1245) and `verb` (282) entries — these parse cleanly from
   article/infinitive patterns. Drop `other` from the **question pool** entirely.
2. Add a validation pass that drops any entry whose English gloss ends in a capitalised
   German-looking token (column bleed), or whose `de`/`en` is a known function word with
   a mismatched gloss.
3. Clean residual trailing-token noise from `en` (`to ski Stefan` → `to ski`).
4. Result target: ~1500 clean entries, 0 obvious nonsense.

### P0-2. Grammar Reference renders as unreadable word-salad
60 of 74 grammar blocks have no parsed `table`; they fall back to `<pre>{raw}</pre>`.
The `raw` is a column dump linearised one token-per-line, so the Reference shows:

```
Sie
Am Abend
hat
hat
am Abend
sie
oft Konzerte.
```

**Impact:** screenshot #2. The user literally said "no idea what I'm looking at." The
Reference page — the *study* surface — is its weakest page. 20 blocks are pure salad.

**Fix:** Re-parse grammar into a structured shape the UI can render meaningfully:
- Detect example/explanation blocks: group German example lines together, separate the
  English explanation sentence, and render examples as a clean list with the explanation
  as a caption — not raw newlines.
- Reconstruct columnar example tables (statement / question word order) into a real
  table where the column pattern is detectable.
- Where structure genuinely can't be recovered, collapse single-word lines back into
  sentences (join short fragment lines) so it reads as prose, never as a vertical list.

---

## P1 — Game logic & learning correctness

### P1-1. MC distractors can be near-duplicates or wrong register
Distractors are sampled from the same selection but not filtered for similarity to the
answer or to each other. A learner can see two options that mean the same thing.
**Fix:** dedupe distractors by normalised meaning; when answering en→de or de→en, keep
distractors in the same direction and same `pos`.

### P1-2. Type-answer accepts only one gloss when several are valid
Many entries have multi-sense glosses ("to think (so), to believe"). Typing "to believe"
is marked wrong because we compare against the whole string.
**Fix:** split the answer on `,` / `;` / `/` and accept any sense; strip parenthetical
hints like "(so)" and "here:" prefixes before comparing.

### P1-3. Phrase fill-in blanks a random word — often trivial or ambiguous
`buildPhrases` blanks a random >2-char word. Sometimes that's an article or a word that
appears twice, making the answer ambiguous or guessable.
**Fix:** prefer blanking the content word (noun/verb), avoid blanking when the target
appears more than once in the phrase, and show the English as a hint.

### P1-4. Flashcard "answer" for phrases can be a bare category label
When a phrase has no English, the flashcard answer is the category ("Personal
information") — not a translation. That teaches nothing.
**Finding:** the phrase data has **no English translation at all** (0/349) — the source
PDF doesn't provide one. So a German→English card is impossible.
**Fix shipped:** flip the card the useful direction — prompt with the usage *context*
(category · register, e.g. "Date And Time"), reveal the German phrase. This is a
"how do I say X?" recall drill, which is what these phrase lists are for.

---

## P1 — Session & flow

### P1-5. No way to see the correct answer's *meaning* in MC feedback
The feedback bar shows "Correct/Not quite" + the example, but for a wrong MC answer it
doesn't restate prompt→answer clearly. Learner doesn't reinforce the right pairing.
**Fix:** in the feedback bar, always show `prompt → answer` on a wrong answer.

### P1-6. Session length fixed at 20 with no choice
No control over round length; 20 can be too long on mobile.
**Fix (P2-ish):** offer 10 / 20 / all, persisted. (Lower priority — defer unless quick.)

---

## P2 — Visual / interaction polish

### P2-1. MC answered state: chosen-wrong + correct both highlighted is good, but the
unselected options dim to 60% opacity which makes the correct one (also dimmed if not
hovered) slightly muddy. Verify the correct answer always reads as clearly green.

### P2-2. Reference chapter selector is a long row of bare numbers with no titles.
On first visit it's unclear they're chapters. **Fix:** label the active chapter title
prominently (already shown) and consider a "Ch." prefix or tooltip. Minor.

### P2-3. Progress bar at 0/20 is invisible (no fill). Consider a faint track + a
"0%" affordance so the bar reads as a progress element from the start. (Already has a
track — confirm contrast in light mode.)

### P2-4. Empty/disabled states verified on Home (start guard). Confirm Stats reads well
with zero data on a fresh profile (currently shows 0s — acceptable).

---

## Fix plan (execution order)

1. **Re-parse vocab** with a strict validator → drop `other` + column-bleed; clean
   trailing-token noise. (P0-1)
2. **Re-parse grammar** into structured blocks (examples list + explanation, tables) and
   rewrite `GrammarCard` to render them; never dump raw newlines. (P0-2)
3. **buildQuestions**: dedupe/same-direction distractors (P1-1), multi-sense answer
   matching (P1-2), smarter phrase blanks (P1-3), skip empty-gloss flashcards (P1-4).
4. **Feedback bar**: always show prompt → answer on wrong. (P1-5)
5. Visual polish pass (P2s) + re-screenshot every surface to verify.

---

## Resolution log (2026-06-21)

- **P0-1 vocab quality — FIXED.** Parser now drops all `other`-pos entries and column
  bleed. Vocab went **2291 → 1521 clean entries** (dropped 946 junk, incl. every
  `ihn → wichtig.`-style nonsense). 94% have an example sentence. Verified: 0
  `other`/`ihn` entries remain in the pool.
- **P0-2 grammar reference — FIXED.** Parser emits a structured `items[]` (example /
  note). `GrammarCard` now leads with the explanation note, then shows German examples
  grouped in a soft panel; conjugation tables render as real tables. Screenshot #2's
  word-salad is gone — verified on chapter 6 (Modal Verbs table, Modal Verbs in a
  Sentence, Position in a Sentence, Dates all read cleanly).
- **P1-1 distractors — FIXED.** Sense-aware dedup: options can't share any meaning.
- **P1-2 multi-sense type answers — FIXED.** Accepts any sense; strips `(…)`, `here:`,
  leading articles.
- **P1-3 phrase blanks — FIXED.** Blanks an unambiguous content word (capitalised
  nouns preferred, words appearing twice avoided).
- **P1-4 phrase flashcards — FIXED** (see above; context→phrase recall).
- **P1-5 feedback reinforcement — FIXED.** Wrong MC/type answers now show
  `prompt → answer` + example. Verified: `der Müll (Singular) → rubbish`.
- **P1-6 / P2-x** — deferred (non-blocking polish); noted for a future pass.

### Verification
`npx tsc --noEmit` clean · `npm run build` clean · visual audit of Reference (ch 6),
vocab MC feedback, and phrase flashcards all confirmed against the fixes.
