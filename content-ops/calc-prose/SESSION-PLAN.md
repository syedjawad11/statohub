# Calculator teaching-block — active-session writing plan

**Goal:** finish the remaining standalone-calculator teaching blocks faster than the
1/day cloud routine by writing them in active Claude Code sessions, **3 pages per
session**.

**Status (2026-06-25, verified against `origin/main`):** 7 of 25 blocks published
(`standard-deviation`, `mean`, `average`, `variance`, `range`, `percentile`,
`weighted-average`). **18 remaining.** (An earlier local snapshot showed only 3 done;
that working tree was 26 commits behind `origin/main` — the routine had already
shipped variance/range/percentile/weighted-average. Always check `origin/main`, not
the local tree, before picking targets.)

**The daily cloud routine is now DISABLED** (`trig_01M1XqCSGchNEjJsKjJG3hix`,
"statohub calc-prose 06:00 Malta", set `enabled: false` on 2026-06-25). It is not
deleted — re-enable it via the RemoteTrigger API if you ever want to fall back to
hands-off draining. While these sessions run, the routine must stay off so the two
don't write the same slug.

## Cadence

3 pages per session × 6 sessions = the 18 remaining (no leftover).

| Session | Slugs (in queue order) |
|---------|------------------------|
| 1 | `mean-absolute-deviation`, `frequency-table`, `z-score` |
| 2 | `z-table`, `normal-distribution`, `probability` |
| 3 | `binomial-distribution`, `combination`, `factorial` |
| 4 | `correlation-coefficient`, `linear-regression`, `confidence-interval` |
| 5 | `sample-size`, `t-test`, `t-table` |
| 6 | `p-value`, `chi-square`, `proportion` |

Keywords for each slug live in [`QUEUE.md`](QUEUE.md). The source of truth for "done"
is the MDX file existing with `draft: false`; flip the `QUEUE.md` status cell to `done`
at publish time too (human visibility).

## Per-session procedure (what Claude does each session)

1. **Confirm targets** — take the next 3 pending slugs from the table above /
   `QUEUE.md` (skip any already published).
2. **Write** — deploy **3 subagents in parallel**, one per slug. Each subagent writes
   ONLY its own `src/content/calculator-content/<slug>.mdx` as **`draft: true`**,
   following the binding spec in
   [`../cloud-routine/publish-next-calc-prose.md`](../cloud-routine/publish-next-calc-prose.md)
   (Steps 2–3), the gold-standard pilot
   [`../../src/content/calculator-content/standard-deviation.mdx`](../../src/content/calculator-content/standard-deviation.mdx),
   the schema in [`../../src/content/config.ts`](../../src/content/config.ts), and the
   voice rules in [`../../.claude/seo-playbook.md`](../../.claude/seo-playbook.md).
   Each subagent is handed a **pre-verified worked example** (numbers computed from the
   real engine in `src/calc/<slug>.ts`) so the prose matches the live tool exactly.
3. **Review** — Claude reads all 3 drafts: correct structure (no body H1, ≥2 H2,
   How-to + Worked example + FAQ), primary keyword in the lead, supporting keywords
   woven into the FAQ, one authoritative external link with a descriptive anchor
   (prefer the NIST/OpenStax allowlist in the spec), no LaTeX, internal links only
   `/calculators/` or `/`, numbers match the engine, no AI-tell filler.
4. **QA gate** — run the Step 4 light QA gate (no body H1, ≥2 H2, primary keyword
   present, ≥200 words, no LaTeX, authoritative link w/ good anchor, internal-link
   rule) + the broken-link curl check on each new file. Hard fails block; warnings
   don't.
5. **Build gate** — flip all 3 to `draft: false`, then `npx astro check` + `npm run
   build` (includes the link gate). Must be green.
6. **Publish together** — mark the 3 `QUEUE.md` rows `done`, stage ONLY the 3 new MDX
   files + `QUEUE.md` (leave the unrelated in-progress doc restructure untouched),
   one commit, push to `main` → GitHub Actions → Cloudflare. Verify the run is green
   and spot-check one page live at `https://statohub.com/calculators/<slug>/`.

## Hard rules (same as the routine's light tier)

- Body starts at **H2** (the calculator title is the page's only H1). Never skip
  heading levels.
- **~300–700 words.** Short teaching block, NOT a 2000-word article. The full
  `/{slug}/` article is the long-form home; this complements, never duplicates it.
- **No LaTeX** — fenced plain/Unicode formulas only (MDX parses `{` as JS and breaks).
- **≥1 authoritative external link** (.gov/.edu/NIST/SEMATECH/OpenStax) with a
  descriptive anchor — never a bare URL or "click here". Prefer the curated allowlist.
- Internal links only `/calculators/` or `/` (trailing slash), or none.
- Every number in the worked example must be one actually computed from the engine.
- Don't touch sibling concerns (engines, articles, CI config, CLAUDE.md).

## Progress log

- **Session 1 (2026-06-25):** `mean-absolute-deviation`, `frequency-table`, `z-score` —
  ✅ published (build green, 53 pages, 0 link violations). 10 of 25 done, 15 remaining.
- **Session 2 (2026-06-25):** `z-table`, `normal-distribution`, `probability` —
  ✅ published (commit `1ab0a76`, build green 53 pages / 0 link violations, Actions run
  `28188634889` green incl. Cloudflare deploy, all 3 pages verified live HTTP 200).
  **13 of 25 done, 12 remaining.** Next = Session 3: `binomial-distribution`,
  `combination`, `factorial` (queue rows 14–16).
- **Session 3 (2026-06-26):** `binomial-distribution`, `combination`, `factorial` —
  ✅ published (build green 55 pages / 0 link violations). Worked examples computed from
  the engines: binomial n=10/p=0.5/k=5 exactly → C(10,5)=252, 252/1024 = 0.2461;
  combination n=10,r=3 nCr → 120 (nPr=720); factorial 5! → 120. Links: NIST eda366
  (binomial) + OpenStax College Algebra 9.5 counting principles (combination, factorial),
  both curl-verified 200. **16 of 25 done, 9 remaining.** Next = Session 4:
  `correlation-coefficient`, `linear-regression`, `confidence-interval` (queue rows 17–19).
