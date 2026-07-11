# Keyword research needed: wrong-intent articles

**Created:** 2026-07-11. **Status:** RESOLVED 2026-07-11 -- fresh keyword
research delivered in `22-wrongintent-reseed-keyword-research.md` and merged
into `content-ops/seed.json` + `content-ops/content.db` same day. Kept below
for historical context only; do not action further from this file.

## Why this file exists

3 articles on the board had keyword lists that read as the wrong subject
(physics or algebra), not statistics. On 2026-07-11 the current DB entries
for these 3 were edited down to a single "safe" keyword each (extended with
"in statistics") so they could be unblocked and queued. This file preserves
the **original full keyword list** for each so fresh keyword research can be
done from scratch, without needing to dig through git history.

**Once you've done the research:** send the updated keyword lists (with
volume/KD if you have them) back and the content-ops board
(`content-ops/seed.json` + `content-ops/content.db`) will be updated to match
-- this may mean re-adding some of the original keywords, adding new ones,
or leaving the current trimmed version as-is.

---

## 1. `how-to-find-frequency-statistics`

- **Title (current):** How to Find Frequency in Statistics
- **Category:** descriptive-statistics
- **Original title:** How to Find Frequency (Waves & Wavelength)
- **Problem:** all 11 non-primary keywords are wave/wavelength physics
  conversion queries, not statistical frequency (frequency distribution,
  frequency table, relative frequency).
- **Current DB keyword (post-edit):** `how to find frequency in statistics`
- **Original full keyword list (pre-edit), KD 0-14, combined volume 64,800:**

| # | Keyword | Intent |
|---|---|---|
| 1 | how to find frequency | ambiguous (kept, extended) |
| 2 | how to find wave frequency | physics |
| 3 | how to calculate frequency of a wavelength | physics |
| 4 | how to find wavelength with frequency | physics |
| 5 | how to find wavelength and frequency | physics |
| 6 | how to find frequency with wavelength | physics |
| 7 | how do you find the frequency of a wavelength | physics |
| 8 | how to find frequency and wavelength | physics |
| 9 | how to calculate frequency and wavelength | physics |
| 10 | how to calculate wavelength and frequency | physics |
| 11 | how to calculate frequency with wavelength | physics |
| 12 | how to find wavelength from frequency | physics |

**Research needed:** real search volume/KD for statistics-frequency terms
(e.g. "frequency in statistics", "relative frequency", "frequency
distribution", "frequency table statistics", "cumulative frequency") --
and a decision on whether any of #2-12 above are worth keeping as
statistics-adjacent queries once "in statistics" is appended.

---

## 2. `range-of-a-function-statistics`

- **Title (current):** Range of a Function in Statistics: How to Find It
- **Category:** descriptive-statistics
- **Original title:** How to Find the Range of a Function (Domain & Range)
- **Problem:** all 3 keywords are algebra (function domain/range), not
  statistical range (max - min as a measure of spread).
- **Current DB keyword (post-edit):** `range of a function in statistics`
- **Original full keyword list (pre-edit), KD 0-5, combined volume 27,400:**

| # | Keyword | Intent |
|---|---|---|
| 1 | how to find range of a function | algebra (kept, extended) |
| 2 | how to find the range of a graph | algebra |
| 3 | find the range of the following piecewise function | algebra |

**Research needed:** real search volume/KD for statistical-range terms
(e.g. "range in statistics", "how to find range statistics", "range
formula statistics") -- this site already has `how-to-find-the-range` on
the board (see notes on that article for overlap risk before adding new
keywords here).

---

## 3. `proportions-in-statistics`

- **Title:** Proportions in Statistics: Meaning, Formula & How to Solve Them
  (unchanged -- title/slug were already statistics-scoped)
- **Category:** statistics-basics
- **Problem:** 2 of 4 keywords are pure algebra/ratio-solving queries, not
  statistical proportion (sample proportion, population proportion).
- **Current DB keywords (post-edit):** `proportion means in statistics`,
  `proportion definition in statistics`
- **Original full keyword list (pre-edit), KD 0-29, combined volume 46,000:**

| # | Keyword | Intent |
|---|---|---|
| 1 | proportion means | ambiguous (kept, extended) |
| 2 | proportion definition | ambiguous (kept, extended) |
| 3 | indirect proportion | algebra |
| 4 | what value of x makes this proportion true | algebra (homework-style) |

**Research needed:** real search volume/KD for statistics-proportion terms
(e.g. "sample proportion", "population proportion formula", "proportion
statistics formula") to replace #3-4.

---

## Not included (checked, no intent problem)

- `statistics-symbols-cheatsheet` -- keywords already statistics-scoped
  (statistics symbols, statistics and or symbols, what is mu 0 in
  statistics). Only the title/slug changed (rebranded as a cheat sheet).
- `regression-to-the-mean`, `confidence-interval` -- no intent issue,
  unflagged and queued as-is.
