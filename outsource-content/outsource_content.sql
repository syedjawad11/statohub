BEGIN TRANSACTION;
CREATE TABLE outsource_articles (
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
INSERT INTO "outsource_articles" VALUES('nonparametric-tests','Nonparametric Tests: When to Use Them','data-analysis',1,'18','741024','published','outsource-content/raw/nonparametric-tests.json','src/content/articles/nonparametric-tests.mdx',2,1,1,8,'','2026-08-20 19:37:40','2026-08-20 20:30:51');
INSERT INTO "outsource_articles" VALUES('bonferroni-correction','Bonferroni Correction: A Practical Guide','experiments-causality',2,'19','741025','published',NULL,NULL,0,0,0,NULL,'','2026-08-20 19:37:40','2026-09-01 18:16:24');
INSERT INTO "outsource_articles" VALUES('mediation-analysis','Mediation Analysis','experiments-causality',3,'20','750156','published',NULL,NULL,0,0,0,NULL,'','2026-08-20 19:37:40','2026-09-01 18:16:24');
INSERT INTO "outsource_articles" VALUES('randomized-controlled-trial','Randomized Controlled Trial','experiments-causality',4,'21',NULL,'published',NULL,NULL,0,0,0,NULL,'','2026-08-20 19:37:40','2026-09-01 18:16:25');
INSERT INTO "outsource_articles" VALUES('intention-to-treat','Intention to Treat','experiments-causality',5,'22',NULL,'queued',NULL,NULL,0,0,0,NULL,'','2026-08-20 19:37:40','2026-08-20 19:37:40');
INSERT INTO "outsource_articles" VALUES('multiple-comparisons-problem','Multiple Comparisons Problem','experiments-causality',6,'23',NULL,'queued',NULL,NULL,0,0,0,NULL,'','2026-08-20 19:37:40','2026-08-20 19:37:40');
INSERT INTO "outsource_articles" VALUES('normality-tests','Normality Tests','data-analysis',7,'24',NULL,'queued',NULL,NULL,0,0,0,NULL,'','2026-08-20 19:37:40','2026-08-20 19:37:40');
INSERT INTO "outsource_articles" VALUES('holt-winters','Holt-Winters','time-series-forecasting',8,'25',NULL,'queued',NULL,NULL,0,0,0,NULL,'','2026-08-20 19:37:40','2026-08-20 19:37:40');
INSERT INTO "outsource_articles" VALUES('pearson-vs-spearman','Pearson vs Spearman','data-analysis',9,'26',NULL,'queued',NULL,NULL,0,0,0,NULL,'','2026-08-20 19:37:40','2026-08-20 19:37:40');
INSERT INTO "outsource_articles" VALUES('log-transform-data','Log Transform Data','data-analysis',10,'27',NULL,'queued',NULL,NULL,0,0,0,NULL,'','2026-08-20 19:37:40','2026-08-20 19:37:40');
INSERT INTO "outsource_articles" VALUES('scatter-plot-interpretation','Scatter Plot Interpretation','data-analysis',11,'28',NULL,'queued',NULL,NULL,0,0,0,NULL,'','2026-08-20 19:37:40','2026-08-20 19:37:40');
INSERT INTO "outsource_articles" VALUES('propensity-score-matching','Propensity Score Matching','experiments-causality',12,'29',NULL,'queued',NULL,NULL,0,0,0,NULL,'','2026-08-20 19:37:40','2026-08-20 19:37:40');
INSERT INTO "outsource_articles" VALUES('confidence-level-vs-significance-level','Confidence Level vs Significance Level','data-analysis',13,'30',NULL,'queued',NULL,NULL,0,0,0,NULL,'','2026-08-20 19:37:40','2026-08-20 19:37:40');
INSERT INTO "outsource_articles" VALUES('sequential-testing','Sequential Testing','experiments-causality',14,'31',NULL,'queued',NULL,NULL,0,0,0,NULL,'','2026-08-20 19:37:40','2026-08-20 19:37:40');
INSERT INTO "outsource_articles" VALUES('heteroscedasticity-test','Heteroscedasticity Test','data-analysis',15,'1',NULL,'queued',NULL,NULL,0,0,0,NULL,'','2026-08-20 19:37:40','2026-08-20 19:37:40');
INSERT INTO "outsource_articles" VALUES('data-visualization-best-practices','Data Visualization Best Practices','data-analysis',16,'2',NULL,'queued',NULL,NULL,0,0,0,NULL,'','2026-08-20 19:37:40','2026-08-20 19:37:40');
INSERT INTO "outsource_articles" VALUES('confusion-matrix-explained','Confusion Matrix Explained','machine-learning-statistics',17,'3',NULL,'queued',NULL,NULL,0,0,0,NULL,'','2026-08-20 19:37:40','2026-08-20 19:37:40');
INSERT INTO "outsource_articles" VALUES('f1-score-explained','F1 Score Explained','machine-learning-statistics',18,'4',NULL,'queued',NULL,NULL,0,0,0,NULL,'','2026-08-20 19:37:40','2026-08-20 19:37:40');
INSERT INTO "outsource_articles" VALUES('sarima-model','SARIMA Model','time-series-forecasting',19,'5',NULL,'queued',NULL,NULL,0,0,0,NULL,'','2026-08-20 19:37:40','2026-08-20 19:37:40');
INSERT INTO "outsource_articles" VALUES('granger-causality','Granger Causality','time-series-forecasting',20,'6',NULL,'queued',NULL,NULL,0,0,0,NULL,'','2026-08-20 19:37:40','2026-08-20 19:37:40');
CREATE TABLE outsource_reviews (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  article_slug   TEXT NOT NULL REFERENCES outsource_articles(slug) ON DELETE CASCADE,
  passed         INTEGER NOT NULL DEFAULT 0,
  notes          TEXT NOT NULL DEFAULT '',
  created_at     TEXT NOT NULL DEFAULT (datetime('now'))
);
INSERT INTO "outsource_reviews" VALUES(1,'nonparametric-tests',1,'Manual first-article checkpoint: check_sanitized.py 14/14, astro check 0 errors, 121/121 tests, full build 0 link violations (4530 links) / 0 meta-description violations, all 8 Sources verified 200 (Mayo Clinic dropped, verified 403), all 6 internal route ids verified real, 0 keyword collisions. Fixed primaryKeyword (was a lowercased full title w/ colon, now matches site convention) and related (was empty, now the 3 in-body Learn siblings) before publish. Published by explicit user go-ahead.','2026-08-20 20:30:50');
CREATE INDEX idx_outsource_status ON outsource_articles(status);
CREATE INDEX idx_outsource_queue ON outsource_articles(queue_position);
DELETE FROM "sqlite_sequence";
INSERT INTO "sqlite_sequence" VALUES('outsource_reviews',1);
COMMIT;
