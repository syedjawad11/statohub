-- statohub.com content editorial board — schema (source of truth for structure)
-- Applied by content_db.py init (idempotent). SQLite, Python 3.x stdlib.
--
-- The board tracks every planned article from idea -> draft -> review -> publish,
-- holds the study's keyword map, and MECHANICALLY enforces the study's
-- "one keyword -> one article" cannibalization rule via a global UNIQUE index.

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS categories (
  slug        TEXT PRIMARY KEY,
  title       TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  nav_order   INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS calculators (
  slug          TEXT PRIMARY KEY,
  title         TEXT NOT NULL,
  engine        TEXT NOT NULL DEFAULT '',
  standalone    INTEGER NOT NULL DEFAULT 1,   -- 1 = has its own /calculators/{slug}/ page; 0 = embed-only
  category_slug TEXT REFERENCES categories(slug),
  tool_keyword  TEXT,                          -- the tool-intent keyword (standalone pages only; NULL = embed/widget only)
  kd            INTEGER,
  volume        INTEGER,
  phase         INTEGER
);

CREATE TABLE IF NOT EXISTS articles (
  slug             TEXT PRIMARY KEY,           -- flat URL slug (primary keyword only, no category in path)
  title            TEXT NOT NULL,
  category_slug    TEXT NOT NULL REFERENCES categories(slug),
  primary_keyword  TEXT NOT NULL,
  phase            INTEGER,                    -- 1 | 2 | 3 | NULL (stub, pending research)
  kd_min           INTEGER,
  kd_max           INTEGER,
  combined_volume  INTEGER,                    -- study "Combined US/mo" ceiling
  embed_calculator TEXT REFERENCES calculators(slug),  -- the <StatCalc> embedded in the article (NULL = concept-only)
  standalone_calc  INTEGER NOT NULL DEFAULT 0, -- 1 = this topic also ships a standalone /calculators/ page
  status           TEXT NOT NULL DEFAULT 'planned',
                   -- planned -> briefed -> drafting -> in_review -> changes_requested -> approved -> published
                   -- (changes_requested loops back to drafting; research_pending = stub, not writable yet)
  review_score     INTEGER,                    -- latest reviewer score (0-100)
  word_count       INTEGER,
  flagged          INTEGER NOT NULL DEFAULT 0, -- 1 = intent/thin flag from the study; surfaces but don't write blind
  notes            TEXT NOT NULL DEFAULT '',
  mdx_path         TEXT,                        -- src/content/articles/{slug}.mdx once drafted
  pub_date         TEXT,
  updated_at       TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS keywords (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  article_slug TEXT NOT NULL REFERENCES articles(slug) ON DELETE CASCADE,
  keyword      TEXT NOT NULL,                  -- stored trimmed + lowercased
  is_primary   INTEGER NOT NULL DEFAULT 0,
  UNIQUE(article_slug, keyword)
);

-- CANNIBALIZATION GATE: the same keyword cannot attach to two articles.
-- Seeding fails loudly if the study maps ever overlap.
CREATE UNIQUE INDEX IF NOT EXISTS idx_kw_global ON keywords(keyword);

CREATE TABLE IF NOT EXISTS reviews (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  article_slug TEXT NOT NULL REFERENCES articles(slug) ON DELETE CASCADE,
  score        INTEGER,
  passed       INTEGER NOT NULL DEFAULT 0,     -- 1 = PASS, 0 = CHANGES_REQUESTED
  notes        TEXT NOT NULL DEFAULT '',
  created_at   TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category_slug);
CREATE INDEX IF NOT EXISTS idx_keywords_article ON keywords(article_slug);
