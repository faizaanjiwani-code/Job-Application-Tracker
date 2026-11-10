# Folio

A private job-search workspace with a responsive, understated interface. Applications live in a hosted database and sync across devices after signing in; GitHub stores the application code.

## Features

- Job URL import using JobPosting structured data, editable details, and manual fallback for blocked pages.
- Applications, colored stages, daily activity, sorting, filters, follow-ups, interviews, notes and CSV export.
- Discovery searches public LinkedIn and Indeed listings, employer Greenhouse and Ashby boards, Remotive, Jobicy, Remote OK and Himalayas. On-demand searches add up to 25 new matches; the daily task targets 10. Role, company type and source filters, independent source diagnostics and cross-board deduplication are included.
- Referrals, contact details, outreach stages and résumé-based cover-letter/recruiter drafting without a paid API.
- Gmail evidence events, exact-match updates, ambiguity queue, terminal-status protection, source-email links and seven-day weekly review.
- Site MCP tools and a daily cloud-task update path. No email is sent or modified.

## Run locally

Requires Node.js 24 or newer. No npm dependencies are needed.

```sh
npm run dev
```

Open the printed URL. Local SQLite data is ignored under `.sites-runtime/`. `npm test` verifies import validation, persistence, conflict handling, mail matching and drafts. `npm run build` creates a Cloudflare Worker at `dist/server/index.js`, a hosting manifest and database migrations.

The development server is for local development only. It simulates one local owner and must not be exposed as a public deployment. Hosted access is controlled by Sites; preserve owner-only access. This app relies on that private platform boundary for the single-owner data model and service updates. Moving to another host requires implementing authentication before exposing API routes.

## Hosting

The public source includes an unprovisioned `.openai/hosting.json` template. Set your own provisioned Sites project ID when deploying. Sites owns sign-in, D1 and private deployment. SQL migrations are under `drizzle/`. No API keys or résumé documents belong in source. The deployed database is independent of local development data.

## Daily updates

The linked cloud task runs at 07:00 America/Chicago (DST aware). It reads the profile and known applications, searches connected Gmail for job updates, records source-backed events, discovers up to 10 new jobs and reads back saved results. Its first Gmail run uses a 90-day window; later runs overlap seven days and deduplicate by message ID. The task must use supported Site service access or the Site MCP plugin; no token is saved in source or prompts.

An immediate Gmail connection could not be declared because the Sites connector eligibility tool was unavailable in the authoring session. Consequently the app's **Request Gmail review** button truthfully queues work for the daily task. It does not claim to perform a live scan. A future connector integration can replace this queue after eligibility and hosted consent are verified.

Job discovery itself runs directly when requested. Daily task discovery also researches other public career boards when these feeds yield too few suitable jobs. Ten is a maximum/target, never a reason to invent listings or add unrelated ones.

## Known limits

- Drafting selects truthful résumé achievements and produces a structured tailored draft. It is not an LLM-based writing service.
- Public LinkedIn and Indeed search access can change or require browser verification. Failed or partial sources are reported with an Open search link; no challenge or sign-in restrictions are bypassed. Search summaries are marked as summaries, and unknown salaries stay empty. Some posting pages block fetching or omit structured data; paste descriptions and edit fields in those cases.
- Fit scores are simple relevance scores, not employer assessments. Verify location, U.S. work eligibility, salary and current job availability.
- Startup labels are curated per employer and include private scaleups. Other sources default to unclassified/other; verify employer stage.
- No offline sync. Refresh retrieves changes made on another device; concurrent edits are rejected rather than overwritten.
- CSV export contains applications; discovery and mail evidence remain in the hosted database.
