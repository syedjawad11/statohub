PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS outsource_articles (
  slug                TEXT PRIMARY KEY,
  title               TEXT NOT NULL,
  category_slug       TEXT NOT NULL,
  queue_position      INTEGER NOT NULL,
  day_label           TEXT NOT NULL DEFAULT '',
  babylovegrowth_id   TEXT,
  status              TEXT NOT NULL DEFAULT 'queued',
  raw_path            TEXT,
  mdx_path            TEXT,
  images_removed      INTEGER NOT NULL DEFAULT 0,
  images_converted    INTEGER NOT NULL DEFAULT 0,
  citations_stripped  INTEGER NOT NULL DEFAULT 0,
  source_count        INTEGER,
  notes               TEXT NOT NULL DEFAULT '',
  created_at          TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at          TEXT NOT NULL DEFAULT (datetime('now'))
);

-- status values: queued -> fetched -> processing -> in_review ->
-- changes_requested -> approved -> published, plus a terminal 'blocked'
-- (needs a human; nothing auto-retries out of it).

CREATE TABLE IF NOT EXISTS outsource_reviews (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  article_slug   TEXT NOT NULL REFERENCES outsource_articles(slug) ON DELETE CASCADE,
  passed         INTEGER NOT NULL DEFAULT 0,
  notes          TEXT NOT NULL DEFAULT '',
  created_at     TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_outsource_status ON outsource_articles(status);
CREATE INDEX IF NOT EXISTS idx_outsource_queue ON outsource_articles(queue_position);
