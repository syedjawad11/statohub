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
INSERT INTO "outsource_articles" VALUES('pearson-vs-spearman','Pearson vs Spearman','data-analysis',9,'26','795714','published','outsource-content/raw/pearson-vs-spearman.json','src/content/articles/pearson-vs-spearman.mdx',1,2,0,6,'','2026-08-20 19:37:40','2026-09-02 05:02:51');
INSERT INTO "outsource_articles" VALUES('log-transform-data','Log Transform Data','data-analysis',10,'27','796247','published','outsource-content/raw/log-transform-data.json','src/content/articles/log-transform-data.mdx',1,1,0,8,'','2026-08-20 19:37:40','2026-09-02 04:58:22');
INSERT INTO "outsource_articles" VALUES('scatter-plot-interpretation','Scatter Plot Interpretation','data-analysis',11,'28',NULL,'queued',NULL,NULL,0,0,0,NULL,'','2026-08-20 19:37:40','2026-08-20 19:37:40');
INSERT INTO "outsource_articles" VALUES('propensity-score-matching','Propensity Score Matching','experiments-causality',12,'29','796250','published','outsource-content/raw/propensity-score-matching.json','src/content/articles/propensity-score-matching.mdx',1,1,0,8,'','2026-08-20 19:37:40','2026-09-02 05:02:51');
INSERT INTO "outsource_articles" VALUES('confidence-level-vs-significance-level','Confidence Level vs Significance Level','data-analysis',13,'30','796252','published','outsource-content/raw/confidence-level-vs-significance-level.json','src/content/articles/confidence-level-vs-significance-level.mdx',2,1,0,8,'','2026-08-20 19:37:40','2026-09-02 19:43:12');
INSERT INTO "outsource_articles" VALUES('sequential-testing','Sequential Testing','experiments-causality',14,'31','795760','in_review','outsource-content/raw/sequential-testing.json','src/content/articles/sequential-testing.mdx',1,0,0,7,'','2026-08-20 19:37:40','2026-09-02 19:37:08');
INSERT INTO "outsource_articles" VALUES('heteroscedasticity-test','Heteroscedasticity Test','data-analysis',15,'1','799503','in_review','outsource-content/raw/heteroscedasticity-test.json','src/content/articles/heteroscedasticity-test.mdx',1,1,0,8,'','2026-08-20 19:37:40','2026-09-02 19:38:34');
INSERT INTO "outsource_articles" VALUES('data-visualization-best-practices','Data Visualization Best Practices','data-analysis',16,'2','796513','queued',NULL,NULL,0,0,0,NULL,'','2026-08-20 19:37:40','2026-09-02 19:25:12');
INSERT INTO "outsource_articles" VALUES('confusion-matrix-explained','Confusion Matrix Explained','machine-learning-statistics',17,'3','800818','queued',NULL,NULL,0,0,0,NULL,'','2026-08-20 19:37:40','2026-09-02 19:25:12');
INSERT INTO "outsource_articles" VALUES('f1-score-explained','F1 Score Explained','machine-learning-statistics',18,'4','804171','queued',NULL,NULL,0,0,0,NULL,'','2026-08-20 19:37:40','2026-09-02 19:25:12');
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
INSERT INTO "outsource_reviews" VALUES(2,'propensity-score-matching',0,'check_sanitized 14/14 + build gate all clean, but 2/8 Sources 403 on curl -sL final destination (Austin 2011 doi.org/10.1002/pst.433, Austin 2009 doi.org/10.1002/sim.3697 -> onlinelibrary.wiley.com, Cloudflare bot-mitigation per cf-mitigated:challenge header; Wayback confirms both were live 200 as of 2025-07-15) -- treat as hard fail per reviewer bar (4xx is hard fail, only ''no response'' is WARN), swap for accessible mirrors or get manual verification; also processor wrongly stripped internal link to /correlation-vs-causation/ claiming the article doesn''t exist -- it does (src/content/articles/correlation-vs-causation.mdx), restore as <Link to={routes.article(''correlation-vs-causation'')}>. Not published, draft untouched.','2026-09-02 04:48:07');
INSERT INTO "outsource_reviews" VALUES(3,'propensity-score-matching',1,'check_sanitized 14/14; fabrication spot-check clean (ProcessFlow/table figures traced to raw text); no keyword-cannibalization collision; all 8 Sources verified 200 and citation text matches destination content (Rosenbaum 1983 CMU PDF, both Austin PMC papers, CBPS, Wager PDF all confirmed genuine); build gate clean.','2026-09-02 04:58:22');
INSERT INTO "outsource_reviews" VALUES(4,'log-transform-data',1,'check_sanitized 14/14; fabrication spot-check clean (DataTables/TaxonomyTree traced to raw text, no invented numbers); no keyword-cannibalization collision; all 8 Sources verified live (statmodeling 403 to curl is Cloudflare bot-mitigation, confirmed genuine via Wayback 200 + title match; biostathandbook 406 to curl is plain UA block, 200 with browser UA) and citation text matches destination content; build gate clean.','2026-09-02 04:58:22');
INSERT INTO "outsource_reviews" VALUES(5,'pearson-vs-spearman',0,'check_sanitized 14/14 and no fabrication/cannibalization issues, but citation-accuracy check failed: Sources entry (and body cite at ''tutorial on correlation methods'') label https://pmc.ncbi.nlm.nih.gov/articles/PMC7779167/ as ''Comparing the Pearson and Spearman correlation coefficients across distributions and sample sizes: A tutorial using simulations and empirical data'' -- but PMC7779167 is actually Rovetta A, ''Raiders of the Lost Correlation: A Guide on Using Pearson and Spearman Coefficients to Detect Hidden Correlations in Medical Sciences'' (Cureus 2020), a different paper by a different author. The correctly-titled paper is the arXiv preprint already cited separately (arxiv.org/pdf/2408.15979). Fix: either retitle the PMC7779167 Sources entry/body link to match Raiders of the Lost Correlation, or drop it and keep only the arXiv citation. Draft untouched, not published.','2026-09-02 04:58:22');
INSERT INTO "outsource_reviews" VALUES(6,'propensity-score-matching',0,'REVERTED prior PASS: npm run build throws at render time -- KeyTakeaways.astro defaults variant to ''table'' (requires non-empty ''rows''), but this article''s <KeyTakeaways bullets={[...]} /> passes ''bullets'' without variant="bullets", so it hits the table branch with rows=undefined and throws ''KeyTakeaways: rows must be a non-empty array when variant=table'' during /propensity-score-matching/ static generation. check_sanitized 14/14, citations, fidelity, and cannibalization all still clean -- this is purely a component-prop mismatch. Fix: add variant="bullets" to the KeyTakeaways call (matches the pattern already used correctly in pearson-vs-spearman.mdx). draft reverted to true, not published.','2026-09-02 04:59:31');
INSERT INTO "outsource_reviews" VALUES(7,'propensity-score-matching',1,'Orchestrator gate: sanitizer 14/14 pre-flip; citation-accuracy audit fixed (Rosenbaum/Rubin URL, Austin PMC swaps, PMC7779167 retitled to Rovetta 2020); KeyTakeaways variant fixed; astro check 0, 121 tests, build 127 pages 0 violations.','2026-09-02 05:02:51');
INSERT INTO "outsource_reviews" VALUES(8,'pearson-vs-spearman',1,'Orchestrator gate: sanitizer 14/14 pre-flip; citation-accuracy audit fixed (Rosenbaum/Rubin URL, Austin PMC swaps, PMC7779167 retitled to Rovetta 2020); KeyTakeaways variant fixed; astro check 0, 121 tests, build 127 pages 0 violations.','2026-09-02 05:02:51');
INSERT INTO "outsource_reviews" VALUES(9,'confidence-level-vs-significance-level',1,'check_sanitized 14/0, all 8 sources verified live (200s, titles match citations), DataTable/AnnotatedChart match raw JSON, no cannibalization, astro check/tests/build all clean with page live in check-links (129 pages, 4880 links, 0 violations)','2026-09-02 19:43:12');
CREATE INDEX idx_outsource_status ON outsource_articles(status);
CREATE INDEX idx_outsource_queue ON outsource_articles(queue_position);
DELETE FROM "sqlite_sequence";
INSERT INTO "sqlite_sequence" VALUES('outsource_reviews',9);
COMMIT;
