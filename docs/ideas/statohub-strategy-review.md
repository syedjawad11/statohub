# Statohub: Workflow, Product, and Growth Strategy Review
*July 2026 — companion to the memory-system report and the Claude Code workspace-audit prompt*

**Scope honesty:** the repository could not be inspected from this session (it lives on your machine), and statohub.com's pages could not be fetched or found in search results from here. Everything below marked **[verify]** is an assumption the Claude Code audit must confirm. Everything else is strategy that holds regardless of repo details.

---

## 1. Executive Summary

**Current condition.** Live site, early content stage, strong and well-reasoned design system, disciplined strategic decisions already on record (wedge model, flat URLs, no premature scaffolding). The binding constraint is not features, architecture, or workflow — it is **distribution**. The site does not yet appear in search results for its own name **[verify in GSC]**, which means every hour spent on product expansion right now has near-zero audience to land on.

**Most important problems.** (1) No traffic base yet — everything else is downstream. (2) Competitive validation cuts both ways: statstudyhub.com launched (indexed Feb 2026) with the identical "tutorials + calculators" wedge, so the thesis is proven but the window for topical-authority land-grab is open *now*, not indefinitely. (3) Workflow knowledge lives in chat histories and your head rather than the repo — the memory-system report addresses this; it is a prerequisite for everything in Phase 1 here.

**Strongest opportunities.** (1) Depth-first content velocity while competitors are still thin. (2) No-login quizzes as the first interactive expansion — they compound SEO ("[topic] quiz / practice questions" queries), reinforce the wedge, and need zero backend. (3) Guided projects as the second expansion — "statistics project ideas," "EDA project for beginners" style queries have durable demand and almost no one pairs them with embedded calculators.

**Recommended product direction.** Remain a calculator-and-content platform for 3–6 months; layer in quizzes (validated, no login) as the third content type; projects fourth; defer games, accounts, and everything community-shaped. Option B (learning hub) is the destination — it already was, per your course-platform horizon — but you earn it with traffic, not code.

**Top five immediate priorities** — see Section 8 for the full verdict, but in one line each: run the workspace audit; implement the memory MVP; hold content velocity; build the static quiz system for two silos as a validation experiment; do one internal-linking + schema pass.

---

## 2. Phase 1 — AI Workflow Optimization

### 2.1 What the audit must establish first

The Claude Code audit prompt (separate file) covers Objective 1 exhaustively. The findings that most affect the recommendations below: framework and build setup **[verify — likely Astro or similar static generator given GitHub Pages history]**, whether calculators share a component architecture or are hand-built per page, whether content schemas enforce your standards, and what `CLAUDE.md`/instruction files currently exist.

### 2.2 Agentic workflow — right-sized, not maximal

Your brief lists ~15 candidate subagents. For a solo founder on a static content site, that is over-orchestration: every agent is a context boundary you must define, review, and maintain, and most of the listed roles collapse into phases of one pipeline. Recommendation: **six agents, two pipelines, one orchestrator.** Add more only when a specific bottleneck recurs.

**Orchestrator (you + top-level Claude Code session — Opus-class).** Plans, decomposes, dispatches, reviews diffs, merges. Never writes article prose or CSS itself in a multi-step task; its context stays small (router `CLAUDE.md`, `NOW.md`, decisions index). Final decision-maker on anything touching an ADR.

**Explorer (Haiku).** Purpose: answer "where is X / how does Y currently work" questions cheaply. Inputs: a specific question + `REPO-MAP.md`. Output: file paths and a ≤20-line summary. Must not: edit anything, load whole directories. Invoked: whenever the orchestrator would otherwise grep around itself. Review: spot-check paths only. This agent plus a maintained repo map eliminates the single largest token sink in most Claude Code projects — repeated exploration.

**Content Writer (Sonnet).** Inputs: cluster file entry, `standards/content.md`, `standards/seo.md`, the pillar page, 2–3 sibling spokes for linking context. Output: complete article in your content-collection format, internal links included, calculator embed slotted. Must not: touch templates, components, or any file outside `content/`; invent internal links to nonexistent pages (the cluster file is the allowed-link list). Review: SEO Reviewer pass, then your read.

**SEO Reviewer (Sonnet).** Inputs: the diff of new/changed content + `standards/seo.md`. Output: pass/fail checklist — title/meta lengths, heading hierarchy, intent match vs. the cluster file's target query, internal-link count and validity, schema presence. Must not: rewrite the article (it reports; the writer or you fix). Invoked: after every content batch, before commit. This is a checklist agent — cheap, high-consistency value.

**Frontend Builder (Sonnet).** Inputs: `DESIGN-SYSTEM.md`, `ARCHITECTURE.md`, the specific component/template task. Output: diff-scoped changes to layout/component files. Must not: touch content, alter design tokens without an ADR reference, do full-file rewrites where a diff suffices. Review: orchestrator diff review + visual check by you.

**Calculator Validator (Sonnet + test runner).** Inputs: a calculator's source + a test-case file of known input→output pairs (build this file once per calculator; textbooks give you canonical values). Output: pass/fail with numeric diffs. Must not: "fix" a failing calculator silently — it reports. Invoked: whenever any calculator or shared math utility changes, and monthly as a sweep. **This is the highest-stakes agent on the site: a statistics site that returns wrong numbers is dead.** If you build only one piece of automation from this whole report, build the calculator test harness.

**Growth Researcher (Sonnet, chat-side mostly).** Your existing pattern — DataForSEO via Code, synthesis in chat — already is this agent. Formalize the output: every research session must end by updating a cluster file, or its findings are considered lost.

**Model routing rule of thumb:** Haiku for lookup/exploration/link-checking; Sonnet for all production work (writing, components, review checklists); Opus-class only for planning, architecture, and anything that touches a decision record.

### 2.3 Loops, hooks, commands

Three loops cover everything: **Plan → Implement → Review → Correct** for features (orchestrator plans, builder implements, orchestrator reviews the diff, one correction cycle max before escalating to you); **Write → SEO-check → Fix → Commit** for content; **Change → Validate → Report** for calculators. Stopping condition everywhere: two correction attempts, then stop and surface to you — unbounded agent loops are the token sink your brief worries about.

Skills/commands worth creating (each solves a named recurring problem): `/new-article <cluster> <slug>` (scaffolds frontmatter, loads the content context pack); `/seo-review` (runs the reviewer checklist on staged changes); `/validate-calcs` (runs the test harness); `/session-end` (updates `NOW.md`, drafts handoff); `/repo-map` (regenerates `REPO-MAP.md`). Hooks: pre-commit — internal-link check + calculator tests on touched files; post-session — prompt for `NOW.md` update. Do not build hooks beyond these until a specific failure has happened twice.

### 2.4 Token and context efficiency

Covered structurally by the memory-system report (router `CLAUDE.md`, context packs, repo map, layer model). Additions specific to this review: content writing should never load templates or components; frontend work should never load articles; the Explorer agent absorbs exploration cost at Haiku prices; diffs, not files, are the unit of review; and the session-handoff discipline replaces re-explaining state at every session start — which, in a chat-heavy workflow like yours, is likely the largest single recurring token cost today **[verify against your actual usage]**.

---

## 3. Phase 2 — Product Direction

### 3.1 The three options, decided

**Option A (blog + calculators, as-is): correct for the next 3–6 months, insufficient as an endpoint.** Advantages: zero backend, zero moderation, pure SEO compounding, lowest possible operational burden, ad/affiliate monetization works fine on it. Limitations: shallow engagement (one-and-done visits), weak returning-visitor loop, revenue ceiling of display ads, and thin differentiation once competitors copy the calculator-embed pattern — which statstudyhub.com already has.

**Option B (learning hub): the destination.** Quizzes, exercises, projects, and eventually learning paths deepen dwell time, earn return visits, create new SEO surface area, and set up the course/certificate monetization layer you already planned. Critically, most of Option B is achievable **without accounts** — which is what makes it the right expansion rather than a trap. Differentiation: reference sites teach, calculator sites compute, quiz sites drill; nobody credibly does all three per topic. That page-level trifecta (learn → compute → test yourself, on one URL cluster) is the defensible version of your wedge.

**Option C (community platform): no.** Cold-start dynamics mean an empty forum signals a dead site; moderation, spam, and UGC liability are a part-time job you don't have; and none of it drives search traffic in year one. There is no strong strategic reason at this stage, and your brief rightly demanded one. Revisit only if/when a course platform has paying cohorts who need discussion — and even then, a Discord costs nothing and de-risks it.

### 3.2 Feature-priority matrix

| Feature | User value | SEO value | Build cost | Backend? | Login? | Verdict |
|---|---|---|---|---|---|---|
| Topic quizzes (no login) | High | High | Low–Med | No | No | **Build next** |
| Quiz landing pages per silo | Med | High | Low | No | No | **Build next** |
| Guided projects | High | High | Med (content-heavy) | No | No | **Build after quizzes** |
| Glossary pages | Med | High | Low | No | No | **Build now** (it's just content) |
| Practice exercises | Med | Med | Low–Med | No | No | Validate — may merge into quizzes |
| Statistics games (1–2 proven formats) | Med | Low–Med | Med–High | No | No | **Validate before building** |
| Daily challenge | Med | Low | Low (once quizzes exist) | No | No | Long-term possibility |
| Learning paths (curated sequences) | Med | Med | Low as static pages | No | No | Build with course layer |
| Progress tracking | Med | None | Med | localStorage: No / real: Yes | Eventually | localStorage version with quizzes; account version later |
| Saved results / bookmarks | Low–Med | None | Med | Yes | Yes | **Do not build yet** |
| User accounts / profiles | Low now | None | High | Yes | Yes | **Do not build yet** |
| Badges / certificates | Med later | Low | Med | Yes | Yes | With course layer (certificates monetize) |
| Leaderboards | Low | None | Med | Yes | Yes | **Do not build** (invites cheating, needs accounts, serves no one yet) |
| Community/discussions/UGC | Low | Low | Very high | Yes | Yes | **Do not build** |
| Personalized dashboards | Low | None | High | Yes | Yes | **Do not build yet** |

### 3.3 Quiz system (the recommended first expansion)

**Architecture: fully static.** Question banks as JSON in the repo (versioned, agent-writable, validated by schema), rendered client-side with randomization, per-answer explanations, and scoring. No backend, no accounts. History and streaks in localStorage. Shareable results via URL parameters ("I scored 8/10 on the Hypothesis Testing quiz") — free distribution mechanic. Structure: one quiz landing page per silo (targets "[topic] quiz," "[topic] practice questions with answers") plus embedded 3–5-question mini-quizzes at the bottom of pillar articles (dwell time + internal linking to the full quiz). Difficulty tiers within one bank rather than separate pages — avoids thin/duplicate pages, which your brief flagged correctly as the SEO risk of interactive features. Question banks are a perfect Content Writer + SEO Reviewer pipeline product: high volume, formulaic, cheap to generate and validate.

**Validation experiment before scaling:** build banks for two silos only (Descriptive Stats, Probability — highest existing content depth **[verify]**). Success criteria after 60 days: quiz pages earn impressions in GSC, on-page quiz-start rate >10% of page visitors, completion rate >50% of starts. If met, roll to all silos; if not, you've spent days, not months.

### 3.4 Projects (second expansion)

Projects out-earn games on every axis that matters now: search demand is real and evergreen ("statistics project ideas," "hypothesis testing project," "EDA project beginner"), they attract the exact student/researcher audience, and they're *content*, not software — your pipeline already produces content. Use your 12-part structure (problem → dataset → objectives → steps → hints → solution → interpretation → mistakes → extensions → assessment) as a content-collection schema so every project page is consistent and each ships with a downloadable dataset (CSV in the repo) and embeds the relevant calculator — the wedge, again. Start with no-code/spreadsheet and calculator-driven projects (broadest audience, fully self-contained on your site); add Python/R variants later as tabs, not separate pages. Idea sourcing: your GSC queries once traffic exists, r/AskStatistics and r/statistics recurring questions, public datasets (WHO, World Bank, Kaggle-style open data), and intro-course syllabus topic lists — structures and topics are not copyrightable, but never reproduce any course's actual exercises or datasets.

### 3.5 Games (validate, mostly defer)

Honest assessment: games are the weakest of the three. Search demand for "statistics games" is modest and largely teacher-intent; discovery for games is social, not search; build and maintenance cost per game is the highest of any content type; replay value is hard. Two formats have proven precedent and could earn a place *after* quizzes validate: **Guess the Correlation** (scatterplot shown, guess r, scored on error — the classic guessthecorrelation.com format demonstrates the loop works; your version differentiates by linking each round to your correlation guide and calculator) and **Spot the Misleading Chart** (real-world-style chart pairs, identify the deception — strong shareability, natural Reddit/social content, feeds the data-literacy audience). Both: client-side only, procedurally generated or JSON-driven data, no login, localStorage best-scores. Treat each as a growth asset (linkable, shareable) rather than a retention product, and build at most one, only after quiz metrics justify interactive investment.

### 3.6 Authentication: not now

**No-login model wins decisively at this stage.** Everything recommended above works anonymously with localStorage. Accounts add: an auth provider, a database, session security, email verification, account deletion, GDPR data-subject handling, abuse prevention — a permanent operational tax purchased before a single user has asked for it. Friction also cuts conversion: an anonymous quiz gets taken; a quiz behind signup gets bounced.

**Trigger conditions for optional accounts** (revisit when *any* is true): sustained ~10–20k organic sessions/month; the course layer launches (progress + certificates genuinely need identity); or localStorage complaints become a real user signal. When that day comes: managed auth (Supabase or Clerk — never hand-rolled), passwordless email + Google OAuth, minimal schema (user, quiz_attempts, progress, bookmarks), accounts always optional with anonymous mode preserved. Full community accounts: see Option C — no.

### 3.7 Frontend and backend evolution

Frontend **[all verify against repo]**: the design system is a confirmed strength — the work now is production templates, not more mockups. IA additions when quizzes/projects ship: "Practice" (quizzes) and "Projects" as first-class hub pages parallel to Calculators, each silo hub gaining Learn / Calculate / Practice sections — the wedge made navigational. Add client-side search (Pagefind or similar — static, no backend) once page count makes browsing insufficient, likely ~100+ pages. Audit must check: mobile calculator ergonomics, heading hierarchy, keyboard/contrast accessibility (dark mode palettes often fail contrast **[verify]**), and Core Web Vitals.

Backend: **none.** The correct amount of backend for the next six months is zero. The site should remain static + client-side; when accounts eventually arrive, serverless + managed Postgres (e.g., Supabase) is the affordable path — a decision to record as an ADR *now* with its trigger conditions, so no future session relitigates it.

Proposed sitemap (target state, post-quizzes/projects):

```
/                     — home: silo catalog, calculator band, recent
/{article-slug}       — flat URLs (per ADR 0003)
/calculators/         — hub → /calculators/{slug}
/quizzes/             — hub → /quizzes/{silo}
/projects/            — hub → /projects/{slug}
/glossary/            — hub → /{term} or /glossary/{term} (decide via ADR)
/{silo-hub}           — six silo hubs: learn / calculate / practice
```

---

## 4. Phase 3 — Growth, Distribution, Monetization

### 4.1 SEO growth strategy

Priorities in order of leverage: **(1) Velocity + depth-first clusters** — unchanged from your strategy; it's correct. The one addition: every cluster now ships with its quiz page and, later, a project — three content types interlinked per topic is how topical authority reads to a modern SERP. **(2) Internal linking as a system** — cluster files define the link graph; the SEO Reviewer enforces it; the pre-commit hook catches breakage. Hub pages (silo, calculators, quizzes) concentrate equity. **(3) Structured data** — `HowTo`/`Article` on guides, `Quiz` schema on quiz pages, `SoftwareApplication` or `WebApplication` on calculators, `FAQPage` where genuine FAQs exist; this is a one-time template task plus a checklist line. **(4) Featured-snippet targeting** — definition-first paragraphs on glossary and concept pages; your content standard should mandate a ≤50-word direct answer under the H1. **(5) Refresh cycle** — from month 6, a monthly GSC review: pages ranking 5–15 get a refresh pass (the highest-ROI SEO work that exists); pages with impressions but no clicks get title/meta rework. **(6) Programmatic SEO — mostly resist.** The tempting version (auto-generated pages per distribution × parameter, per test × dataset) is exactly what post-Helpful-Content Google demotes and what your quality thesis opposes. The defensible narrow version: critical-value / z-table style lookup pages, where a "page per lookup" genuinely matches intent — small set, hand-checked. **(7) Backlinks** — earned, not begged: the misleading-charts game and free datasets are natural link magnets; teacher/classroom resource pages attract .edu links; a yearly "state of X" data piece is the classic linkable asset. Skip outreach spam entirely.

Interactive features avoid thin-page risk by the rule already embedded above: interactivity lives *on* substantive pages (quiz page = intro + instructions + the quiz + explanations + links into the cluster), never as hundreds of near-empty variants.

### 4.2 Distribution: sequenced, not scattered

The realistic constraint: you cannot run six channels. **Pick one primary (Reddit) and one asset channel (email), defer the rest.**

**Reddit playbook.** Communities: r/AskStatistics, r/statistics, r/learnmath, r/HomeworkHelp, r/dataisbeautiful (for chart content), r/datascience (sparingly). Method: answer questions genuinely and completely *in the comment* — the answer must stand alone without clicking anything; link your relevant guide/calculator only when it directly serves the asker, roughly one link per 8–10 substantive comments; never post bare links to your site as submissions; build karma and flair-recognition in the first month with zero links at all. Content that earns submissions (not just comments) once you have standing: misleading-chart breakdowns, "counterintuitive probability result, here's the math" posts, original small analyses of public datasets. Feedback loop: recurring question themes → project and article ideas. Ban-avoidance is simple: if a moderator would describe the account as "a person who helps and happens to have a site" you're fine; "a site that comments" gets removed.

**Email from day one.** One embedded capture ("Weekly stats problem + solution in your inbox") — a list is the only audience asset you own, it compounds from zero, and it later launches the course. Buttondown/ConvertKit-tier tooling; one email/week maximum; the weekly problem doubles as future quiz-bank content.

**Deferred:** YouTube/Shorts/TikTok (video is a different production pipeline — revisit at 6–12 months, where calculator demos and misleading-chart shorts are the natural formats); LinkedIn/X (low intent-match for students); Quora (declining ROI); Facebook groups (moderation-hostile to links).

### 4.3 Product-led growth

In priority order: shareable quiz scores (URL-param results pages — ships with the quiz system); **embeddable calculators** (an `<iframe>`/script embed per calculator with a "Powered by Statohub" backlink — teachers and bloggers embed, every embed is a durable backlink; this is the single strongest PLG mechanic available to you and cheap once calculators are componentized **[verify architecture first]**); downloadable project datasets and printable worksheets (teacher-bait, .edu links); classroom packs (a curated page per intro-course unit); certificates and referral mechanics — deferred to the account/course era.

### 4.4 Monetization: staged

| Stage | Trigger | Model | Notes |
|---|---|---|---|
| 0 (now) | — | None. Email capture only. | Ads on a 50-visitor/day site earn pennies and cost trust; skip AdSense entirely |
| 1 | ~50k sessions/mo | Display ads via premium network (Raptive/Mediavine-tier) | The threshold *is* the strategy: hold quality until you qualify; expect roughly $15–30 RPM on US-heavy edu traffic |
| 2 | Alongside 1 | Affiliate: stats software, TI calculators, textbooks, course platforms | Modest but real; only in genuinely relevant contexts (a "best statistics courses" cluster, tool comparisons) |
| 3 | Course layer + accounts | Premium: course, certificates, ad-free supporter tier | This is the real ceiling; everything before it funds runway and builds the email list that launches it |
| Distant | Product maturity | Calculator embed licensing / API, teacher plans, partnerships | Record as ideas, do not design |

Avoid now: premium calculators (paywalling the wedge kills the wedge), sponsorships (no leverage yet), donations (noise).

### 4.5 Analytics and success criteria

Stack: GSC (the primary instrument for the next year) + one privacy-friendly analytics (Plausible/Fathom — or GA4 if free matters more than clean) + custom events: calculator computations, quiz starts/completions, email signups, embed loads. Also track the meta-metrics your brief lists: articles/week actually shipped vs. target, and rough token cost per article (the workflow section's efficiency claims should be measurable).

Success criteria: **90 days** — 60–90+ new pages live, all six silos at minimum viable cluster depth, quiz experiment shipped and measured, GSC impressions clearly trending, email list exists, Reddit account has standing. **6 months** — several hundred pages, 5–15k organic sessions/mo, quiz verdict actioned, first project set live, refresh cycle running. **12 months** — ad-network threshold reached or clearly in sight, decision point on accounts + course layer taken *from data*, one game or embed program live as a link engine.

---

## 5. Prioritized Roadmap

**Immediate (this week):** run the workspace audit in Claude Code (separate prompt file); implement the memory MVP (6 files, prior report); backfill the ~5 ADRs; write the calculator test-case file for existing calculators.

**Next 30 days:** production templates from the theme preview; content pipeline agents (Writer + SEO Reviewer + `/new-article`); publishing at target velocity; email capture live; Reddit account in pure-contribution mode; schema + internal-link pass on existing pages.

**30–90 days:** quiz system for two silos (the validation experiment); glossary rollout; calculator validator in pre-commit; first monthly GSC review; quiz verdict at day ~60–90.

**3–6 months:** quizzes to all silos (if validated); first 5–10 guided projects with datasets; embeddable calculators + "powered by" program; client-side search; refresh cycle begins.

**6–12 months:** ad network application at threshold; accounts/course-layer decision from data (ADR with trigger conditions written now); optionally one game as a link asset; video channel evaluation.

## 6. Decision Matrix (major recommendations)

| Recommendation | Reason | Impact | Complexity | Risk | Depends on | Priority |
|---|---|---|---|---|---|---|
| Stay calculators+content 3–6 mo | Traffic is the bottleneck | High | — | Low | — | P0 |
| Memory system + audit | Compounds every future session | High | Low | Low | — | P0 |
| Calculator test harness | Wrong numbers = dead site | High | Low–Med | Low | Audit | P0 |
| Content velocity, depth-first | Topical authority race is live (statstudyhub) | High | Med (discipline) | Low | Pipeline agents | P0 |
| Static quiz system (2 silos) | New SEO surface + wedge deepening, no backend | Med–High | Low–Med | Low | Templates | P1 |
| Email capture | Only owned audience asset | Med (compounds) | Low | Low | — | P1 |
| Reddit contribution channel | Only viable near-term non-SEO channel | Med | Low (time) | Med (ban if greedy) | — | P1 |
| Guided projects | Durable demand, pure content | Med–High | Med | Low | Quiz validation optional | P2 |
| Embeddable calculators | Strongest PLG/backlink mechanic | Med–High | Med | Low | Calculator architecture | P2 |
| No accounts / no backend now | Cost before value; friction | High (cost avoided) | — | Low | ADR w/ triggers | P0 (a "don't") |
| No community platform | Cold start + moderation tax | High (cost avoided) | — | — | — | P0 (a "don't") |
| Games | Weak search demand, high cost | Low–Med | High | Med | Quiz validation | P3 |

## 7. What NOT to build (explicit)

User accounts, any database, leaderboards, profiles, comments, discussion boards, UGC of any kind, personalized dashboards, badges (pre-course), progress tracking beyond localStorage, programmatic page generation at scale, premium/paywalled calculators, a second CMS, more than two distribution channels, and more than ~6 agents. Every one of these has a recorded trigger condition or a standing "no" — write the two big ones (accounts, community) as ADRs so they stay decided.

## 8. Final Verdict — direct answers

**Remain primarily a calculator + content website for now?** Yes, for 3–6 months. Distribution is the constraint; features without audience are furniture in an empty house.

**Games, quizzes, projects — which?** Quizzes and projects yes, in that order. Games: at most one, later, as a link asset, and only if quiz metrics validate interactive investment.

**First feature to develop?** The static no-login quiz system for two silos, run as a 60-day validation experiment with defined success criteria.

**Login now or later?** Later — at ~10–20k organic sessions/month or course-layer launch, whichever comes first. Record the trigger as an ADR today.

**Eventually a learning hub?** Yes — that was already your plan, and this review confirms it: Option B is the destination, reached through content-shaped steps (quizzes, projects, paths) that never require a backend until the course layer.

**A social community?** No. Not as currently conceivable. A course-cohort Discord is the cheap future test if demand ever appears.

**Avoid building?** Everything in Section 7 — most expensively: accounts, backend, and community features before traffic.

**Most realistic route to traffic and monetization?** Depth-first SEO velocity + quizzes/projects widening the keyword surface → email list from day one → premium ad network at ~50k sessions → affiliate garnish → course + certificates as the real business, launched to the email list. Reddit and embeddable calculators as the non-SEO accelerants.

**Five highest-priority actions?**
1. Run the workspace audit in Claude Code and implement the memory-system MVP — every subsequent session gets cheaper and more accurate.
2. Build the calculator test harness — correctness is the brand.
3. Ship content at target velocity, depth-first, with the Writer + SEO Reviewer pipeline.
4. Build and measure the two-silo quiz experiment.
5. Open the two distribution assets that compound from zero: email capture and a genuinely helpful Reddit presence.
