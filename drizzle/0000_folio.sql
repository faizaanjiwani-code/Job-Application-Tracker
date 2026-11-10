CREATE TABLE jobs (id TEXT PRIMARY KEY, url TEXT NOT NULL DEFAULT '', company TEXT NOT NULL, title TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'Saved', kind TEXT NOT NULL DEFAULT 'application', data TEXT NOT NULL DEFAULT '{}', created_at TEXT NOT NULL, updated_at TEXT NOT NULL);
--> statement-breakpoint
CREATE UNIQUE INDEX jobs_url_unique ON jobs(url) WHERE url <> '';
--> statement-breakpoint
CREATE TABLE settings (key TEXT PRIMARY KEY, value TEXT NOT NULL);
--> statement-breakpoint
CREATE TABLE activity (id TEXT PRIMARY KEY, job_id TEXT, type TEXT NOT NULL, data TEXT NOT NULL DEFAULT '{}', created_at TEXT NOT NULL);
--> statement-breakpoint
CREATE TABLE mail_events (id TEXT PRIMARY KEY, job_id TEXT, data TEXT NOT NULL, reviewed INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL);
