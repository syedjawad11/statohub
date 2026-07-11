# Wrong-intent re-seed: keyword research (RESULTS)

**Created:** 2026-07-11. **Status:** COMPLETE — ready to hand back to the
content-ops board (`content-ops/seed.json` + `content-ops/content.db`).
**Resolves:** `keyword-research-needed.md` (the 3 wrong-intent articles).

**Data source:** live DataForSEO, US (loc 2840), exact-match `search_volume` +
`bulk_keyword_difficulty`. Raw: `00-data/wrongintent_exact_raw.json` ·
merged: `00-data/wrongintent_exact_merged.json`. Pull cost this round: **$0.106**
(plus $0.108 on a first discovery pull that drifted off-topic and was discarded —
see method note at bottom).

**Rules applied (per user):** statistics-pure intent only; no "how to"
keyword-stuffing (prefix stripped, extended with "statistics"); where pure
volume was thin, seeds were *extended* ("frequency" → "frequency in
statistics") rather than invented.

---

## 1. `how-to-find-frequency-statistics` — REPLACE keyword list

Old list: 11 of 12 were wave/wavelength **physics**. All dropped.
Every keyword below is genuinely statistical and **very winnable (KD ≤ 20,
mostly ≤ 5).**

**Recommended primary:** `frequency in statistics` — 1,000 vol, KD 15 (matches
title + slug exactly, clean intent).

**Supporting keywords (fold into this article):**

| Keyword | Vol | KD |
|---|---|---|
| what is frequency in statistics | 1,000 | 3 |
| frequency statistics | 1,000 | 10 |
| frequency distribution statistics | 590 | 5 |
| grouped frequency distribution | 1,000 | 1 |
| class frequency | 110 | 0 |

**⚠ SPLIT CANDIDATES — do NOT bury these as secondaries.** Each is a distinct
statistics sub-topic with high volume and near-zero KD; each likely deserves its
own article/calculator. **Check `seed.json` first — some may already exist:**

| Keyword | Vol | KD | Note |
|---|---|---|---|
| frequency table | 22,200 | 1 | own article/calculator |
| relative frequency | 18,100 | 2 | own article/calculator |
| frequency distribution | 8,100 | 20 | own article (hub concept) |
| relative frequency table | 6,600 | 1 | pairs with relative frequency |
| cumulative frequency | 5,400 | 0 | own article/calculator |
| frequency polygon | 5,400 | 0 | own article |
| frequency distribution table | 3,600 | 7 | pairs with freq. distribution |
| relative frequency formula | 3,600 | 0 | pairs with relative frequency |
| cumulative frequency table | 720 | 0 | pairs with cumulative frequency |

---

## 2. `range-of-a-function-statistics` — RETIRE (merge into existing range article)

**Decision (user, 2026-07-11):** merge/drop. In statistics "range" = max − min,
which the existing **`how-to-find-the-range`** article already owns. Retire
`range-of-a-function-statistics` (its 3 keywords were all algebra) and fold the
clean statistics-range keywords below into the existing range article.

**Feed into `how-to-find-the-range`:**

| Keyword | Vol | KD |
|---|---|---|
| how to find the range | 22,200 | 8 | (likely already its primary) |
| range in statistics | 2,900 | 8 |
| what is range in statistics | 2,900 | 5 |
| range formula | 2,900 | 7 |
| range of data | 1,600 | 9 |
| range in statistics formula | 260 | 7 |

`range statistics` (2,900, KD 25) is higher-difficulty and its SERP is mixed —
optional, treat as stretch.

**⚠ SPLIT CANDIDATE:** `interquartile range` — **33,100 vol, KD 22.** This is a
different concept (IQR / Q1–Q3), not basic range. Do **not** fold it into the
range article — it's a strong standalone article/calculator. Check `seed.json`.

---

## 3. `proportions-in-statistics` — REPLACE algebra keywords, DROP dead keyword

Old list: #3–4 were pure algebra/ratio. `proportion means in statistics`
(a current DB keyword) returned **null volume** — dead, drop it.

**Recommended primary:** `proportion in statistics` — 880 vol, KD 3 (matches
title/slug, clean intent).

**Supporting keywords (fold into this article):**

| Keyword | Vol | KD |
|---|---|---|
| sample proportion | 1,600 | 4 |
| population proportion | 1,000 | 1 |
| confidence interval for a proportion | 1,000 | 13 |
| proportion statistics | 880 | 1 |
| sample proportion formula | 590 | 0 |
| hypothesis test for a proportion | 390 | 0 |
| population proportion formula | 210 | 0 |
| proportion formula statistics | 210 | 1 |
| pooled proportion | 210 | 0 |
| proportion definition in statistics | 170 | 0 | (keep — already in DB) |
| sampling distribution of the sample proportion | 140 | 0 |
| point estimate of proportion | 40 | 0 |

**Drop:** `proportion means in statistics` — null volume (no confirmed data).

**Note (lighter split flag):** `sample proportion` (1,600) and
`population proportion` (1,000) are distinct inferential-stats concepts. Volumes
are modest, so folding into one "proportions in statistics" hub is reasonable —
but if the board wants depth, they could each become their own page later.

---

## Method note (why two pulls)

The first pull used DataForSEO's `keyword_ideas` *discovery* endpoint. For these
narrow sub-topics it drifted to the whole statistics universe and returned
contaminated results (e.g. "frequency of alleles" = genetics, "law of multiple
proportions" = chemistry, geometry volume formulas under "range"). It was
discarded. The numbers above come from an **exact-match** pull on a hand-curated
candidate list — real volume/KD for the exact keywords we intend to use.

**Anti-fabrication:** every number above traces to
`00-data/wrongintent_exact_merged.json`. The one keyword with no data is labeled
null, not guessed.
