#!/usr/bin/env python3
"""Overlap gate for content-plan articles ([[0028-content-plan-daily-routine]]).

Two pages that answer the same question split rankings and read as thin
content, so the plan pipeline checks a row against every live article before
and after writing it.

Usage:
    python3 content-ops/overlap_check.py outline <slug>   # writer, before drafting
    python3 content-ops/overlap_check.py check <slug>     # writer self-check + reviewer gate
    python3 content-ops/overlap_check.py titles <slug>    # title/H1 conflict only (plan-next uses it)

Checks (`check`):
  [1] title  - the row's primary keyword is the main topic of another live
               page's title or H1. FAIL. Inside a longer, narrower phrase
               ("interrupted time series analysis") it is only a WARN.
  [2] text   - shared 8-word passages with any live article. FAIL when 6%+ of
               the draft's passages are shared with one article, or one shared
               run is 25+ words (a copied paragraph).
  [3] h2     - near-identical H2s with the overlap-watch article, the parent,
               or a same-hub article. FAIL at 3+ with one article, else WARN.
  [4] desc   - the primary keyword appears in another live page's meta
               description. WARN only: link to that page.

Every finding prints a FIX line the writer can act on. Exit status 1 on any
FAIL. Read-only: never writes the board or any file.
"""
import re
import sqlite3
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
DB_PATH = HERE / "content.db"
ARTICLES_DIR = HERE.parent / "src" / "content" / "articles"

SHINGLE = 8
SHARE_FAIL = 0.06
RUN_FAIL = 25
RUN_SHOW = 15
H2_SIM = 0.7
H2_FAIL = 3
# A keyword right after one of these (or at the start) is the title's own topic.
SEPARATORS = {"and", "or", "vs", "vs.", "versus", "&", "the", "a", "an", "with",
              "to", "of", "for", "in", "on", "-", "–", "—", "|", "what", "is",
              "how", "guide", "explained"}
STOP = {"a", "an", "the", "and", "or", "of", "to", "in", "on", "for", "with", "is",
        "are", "do", "does", "how", "what", "when", "why", "which", "you", "your",
        "it", "its", "vs", "vs.", "versus", "by", "from", "can", "should", "be"}


def connect():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def frontmatter(text):
    parts = text.split("---", 2)
    return (parts[1], parts[2]) if len(parts) == 3 else ("", text)


def field(fm, key):
    m = re.search(rf'^{key}:\s*["\']?(.*?)["\']?\s*$', fm, re.M)
    return m.group(1) if m else ""


def clean_quotes(s):
    return s.replace("’", "'").replace("‘", "'").replace("&#39;", "'")


def load_articles():
    """slug -> dict for every article file (live flag included)."""
    out = {}
    for f in sorted(ARTICLES_DIR.glob("*.mdx")):
        text = f.read_text(encoding="utf-8")
        fm, body = frontmatter(text)
        out[f.stem] = {
            "live": not re.search(r"^draft:\s*true\s*$", fm, re.M),
            "title": clean_quotes(field(fm, "title")).lower(),
            "h1": clean_quotes(field(fm, "h1")).lower(),
            "description": clean_quotes(field(fm, "description")).lower(),
            "category": field(fm, "category"),
            "body": body,
        }
    return out


def plan_row(slug):
    conn = connect()
    row = conn.execute(
        "SELECT a.slug,a.primary_keyword,a.category_slug,p.plan_id,p.links_up_to,p.overlap_watch "
        "FROM articles a JOIN plan_rows p ON p.slug=a.slug WHERE a.slug=?", (slug,)).fetchone()
    conn.close()
    if not row:
        sys.exit(f"{slug}: no content-plan row on content.db")
    return row


def watch_slugs(row, articles):
    """Articles named in the row's overlap-watch note, plus its parent."""
    named = re.findall(r"[a-z0-9]+(?:-[a-z0-9]+)+", row["overlap_watch"] or "")
    slugs = [s for s in named if s in articles and s != row["slug"]]
    if row["links_up_to"] in articles:
        slugs.append(row["links_up_to"])
    return list(dict.fromkeys(slugs))


# ---------- [1] title / H1 ----------

def title_conflicts(slug, keyword, articles):
    """[(other_slug, where, 'FAIL'|'WARN')] for the keyword in live titles/H1s."""
    kw = clean_quotes(keyword).lower()
    found = []
    for other, a in articles.items():
        if other == slug or not a["live"]:
            continue
        for where in ("title", "h1"):
            m = re.search(r"(?<![\w'])" + re.escape(kw) + r"(?![\w'])", a[where])
            if not m:
                continue
            before = a[where][:m.start()].rstrip(" :,").split()
            narrower = bool(before) and before[-1] not in SEPARATORS
            found.append((other, where, "WARN" if narrower else "FAIL"))
    return found


# ---------- [2] shared text ----------

def prose_words(body):
    """Lower-cased prose words, without markup, URLs, numbers, Sources or Recommended."""
    body = re.sub(r"^import .*$", " ", body, flags=re.M)
    body = re.sub(r"^## (Sources|Recommended)\s*$.*?(?=^## |\Z)", " ", body, flags=re.M | re.S)
    body = re.sub(r"https?://\S+", " ", body)
    body = re.sub(r"routes\.\w+\([^)]*\)", " ", body)
    body = re.sub(r"\b[a-zA-Z]+=", " ", body)          # JSX prop names
    body = re.sub(r"</?[A-Za-z][^>]*>", " ", body)       # tags, keep inner text
    words = re.findall(r"[a-z0-9']+", clean_quotes(body).lower())
    return [w for w in words if not w.isdigit()]       # table numbers aren't prose


def shingles(words):
    return [" ".join(words[i:i + SHINGLE]) for i in range(len(words) - SHINGLE + 1)]


def shared_runs(words, other_set):
    """Longest runs of consecutive shared shingles -> list of (n_words, text)."""
    runs, start = [], None
    sh = shingles(words)
    for i, s in enumerate(sh + [None]):
        if s is not None and s in other_set:
            start = i if start is None else start
        elif start is not None:
            n = i - start + SHINGLE - 1
            runs.append((n, " ".join(words[start:start + n])))
            start = None
    return sorted(runs, reverse=True)


# ---------- [3] H2s ----------

def h2s(body):
    return [h.strip() for h in re.findall(r"^## (.+)$", body, re.M)]


def h2_tokens(h):
    return {w for w in re.findall(r"[a-z0-9']+", clean_quotes(h).lower()) if w not in STOP}


def similar(a, b):
    ta, tb = h2_tokens(a), h2_tokens(b)
    return len(ta & tb) / len(ta | tb) if ta and tb else 0.0


# Template and generic headings every article may share.
TEMPLATE_H2 = re.compile(r"^(quick checklist|sources|faq|frequently asked questions|recommended|"
                         r"statohub's take|put .* to work|common mistakes|a worked example|"
                         r"(a )?fully worked example|worked example|summary|conclusion|"
                         r"key takeaways|try the calculator|related)",
                         re.I)


# ---------- commands ----------

def cmd_titles(slug):
    row = plan_row(slug)
    articles = load_articles()
    fails = 0
    for other, where, level in title_conflicts(slug, row["primary_keyword"], articles):
        print(f"{level}: '{row['primary_keyword']}' is in {other}'s {where}")
        fails += level == "FAIL"
    return 1 if fails else 0


def cmd_outline(slug):
    row = plan_row(slug)
    articles = load_articles()
    print(f"# Overlap outline for {slug} ({row['plan_id']})\n")
    if row["overlap_watch"]:
        print(f"Overlap note: {row['overlap_watch']}\n")
    for other, where, level in title_conflicts(slug, row["primary_keyword"], articles):
        print(f"{level} [title]: '{row['primary_keyword']}' is in {other}'s {where}. "
              + ("Stop and report it as a blocker." if level == "FAIL"
                 else "Narrower topic: link to it once, don't cover its scope."))
    related = watch_slugs(row, articles)
    related += [s for s, a in articles.items()
                if a["live"] and a["category"] == row["category_slug"] and s not in related
                and s != slug]
    print("\nThese pages already cover the H2s below. Do not write an H2 that "
          "answers the same question; link to the page instead.\n")
    for s in related:
        a = articles[s]
        if not a["live"] and s not in watch_slugs(row, articles):
            continue
        tag = " (overlap watch / parent)" if s in watch_slugs(row, articles) else ""
        print(f"## {s}{tag}{'' if a['live'] else ' [draft, not live]'}")
        for h in h2s(a["body"]):
            if not TEMPLATE_H2.match(h):
                print(f"   - {h}")
    return 0


def cmd_check(slug):
    row = plan_row(slug)
    articles = load_articles()
    if slug not in articles:
        sys.exit(f"{slug}: src/content/articles/{slug}.mdx not found")
    me = articles[slug]
    fails = warns = 0

    def report(level, check, msg, fix):
        nonlocal fails, warns
        fails += level == "FAIL"
        warns += level == "WARN"
        print(f"{level} [{check}] {msg}\n      FIX: {fix}")

    # [1] title / H1
    for other, where, level in title_conflicts(slug, row["primary_keyword"], articles):
        if level == "FAIL":
            report("FAIL", "title", f"'{row['primary_keyword']}' is the topic of {other}'s {where}.",
                   f"Not fixable in the draft. Set the row `blocked` with note "
                   f"'keyword is {other}'s {where} topic'; a human either re-angles the "
                   f"row or folds the topic into {other}.")
        else:
            report("WARN", "title", f"'{row['primary_keyword']}' appears in {other}'s {where} "
                   f"as part of a narrower topic.",
                   f"Link to {other} once with descriptive anchor text and don't "
                   f"explain its narrower method beyond one sentence.")

    # [4] descriptions
    kw = clean_quotes(row["primary_keyword"]).lower()
    for other, a in articles.items():
        if other != slug and a["live"] and re.search(
                r"(?<![\w'])" + re.escape(kw) + r"(?![\w'])", a["description"]):
            report("WARN", "desc", f"{other}'s meta description mentions '{kw}'.",
                   f"Link to {other} from the section where it is relevant.")

    # [2] shared text
    my_words = prose_words(me["body"])
    my_sh = shingles(my_words)
    if my_sh:
        for other, a in articles.items():
            if other == slug or not a["live"]:
                continue
            other_set = set(shingles(prose_words(a["body"])))
            share = sum(s in other_set for s in my_sh) / len(my_sh)
            runs = shared_runs(my_words, other_set)
            longest = runs[0][0] if runs else 0
            if share >= SHARE_FAIL or longest >= RUN_FAIL:
                shown = "; ".join(f'"{t[:120]}…" ({n} words)' for n, t in runs[:3])
                report("FAIL", "text", f"{share:.0%} of passages shared with {other}, "
                       f"longest run {longest} words. {shown}",
                       f"Rewrite each listed passage in new words with this article's own "
                       f"example. If a whole section repeats {other}, cut it to a 2-3 "
                       f"sentence summary that links to {other}.")
            elif longest >= RUN_SHOW:
                report("WARN", "text", f"{longest}-word passage shared with {other}: "
                       f'"{runs[0][1][:120]}…"',
                       "Reword it unless it is a standard definition or formula.")

    # [3] H2s
    watched = set(watch_slugs(row, articles))
    peers = watched | {s for s, a in articles.items()
                       if a["live"] and a["category"] == row["category_slug"]}
    mine = [h for h in h2s(me["body"]) if not TEMPLATE_H2.match(h)]
    for other in sorted(peers - {slug}):
        theirs = [h for h in h2s(articles[other]["body"]) if not TEMPLATE_H2.match(h)]
        pairs = [(h, t) for h in mine for t in theirs if similar(h, t) >= H2_SIM]
        if not pairs:
            continue
        listed = "; ".join(f'"{h}" ~ "{t}"' for h, t in pairs)
        level = "FAIL" if len(pairs) >= H2_FAIL else "WARN"
        report(level, "h2", f"{len(pairs)} H2(s) match {other}: {listed}",
               f"For each pair, either take the angle the overlap note gives "
               f"(rename the H2 and answer a different question), or cut the section "
               f"to a short summary linking to {other}. Then refill the word count "
               f"from the row's 'covers' list, not from {other}'s scope.")

    # Overlap-watch angle is a judged check (reviewer reads both pages).
    if row["overlap_watch"]:
        print(f"JUDGE [angle] Overlap note: {row['overlap_watch']}\n"
              f"      Reviewer: read {', '.join(sorted(watched)) or 'the named page'} and "
              f"confirm the draft takes this angle.")

    print(f"\n{fails} FAIL, {warns} WARN")
    return 1 if fails else 0


def main():
    if len(sys.argv) != 3 or sys.argv[1] not in ("outline", "check", "titles"):
        sys.exit(__doc__)
    cmd, slug = sys.argv[1], sys.argv[2]
    sys.exit({"outline": cmd_outline, "check": cmd_check, "titles": cmd_titles}[cmd](slug))


if __name__ == "__main__":
    main()
