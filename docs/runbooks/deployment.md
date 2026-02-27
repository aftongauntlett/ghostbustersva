# Deployment Runbook

This site is statically built. Event status (`upcoming` vs `past`) is date-derived in build-time code, so stale builds can show outdated sections.

## Required Rebuild Cadence

- Run a production rebuild **at least once every 24 hours**.
- Trigger an additional rebuild **on-demand before major event days** (same-day morning is recommended).
- Trigger a rebuild immediately after content changes in `src/content/events/`.

## Operations Checklist

1. Pull latest `main`.
2. Run `npm ci`.
3. Run `npm run check`.
4. Run `npm run build`.
5. Deploy generated output.
6. Verify `/` and `/events` reflect expected upcoming/past partitions.

## Hosting Platform Scheduling

Configure at least one scheduled production build every 24 hours.

- Vercel:
  - Add a Scheduled Function or cron-triggered deploy hook that calls your production deploy endpoint daily.
  - Keep an additional manual Deploy Hook URL for urgent event-date transitions.
- Netlify:
  - Configure a Scheduled Build in site settings (daily cadence).
  - Keep a Build Hook URL available for manual rebuilds.
- Cloudflare Pages:
  - Use a scheduled trigger (Workers Cron + Deploy Hook/API) to rebuild daily.
  - Keep the direct deploy hook/API command for manual rebuilds.
- GitHub Actions (any host):
  - Add a `schedule` cron workflow (daily) that runs `npm ci`, `npm run check`, `npm run build`, then deploys.
  - Add `workflow_dispatch` for manual trigger support.

## On-Demand Trigger Steps

Run an immediate production rebuild when any of the following occur:

- New or updated event content merged.
- Multi-day event boundary (start/end) is within 24 hours.
- Operator notices stale event categorization in production.

Operational sequence:

1. Trigger platform build hook (or manual workflow dispatch).
2. Confirm latest commit hash is deployed.
3. Verify homepage upcoming cards and `/events` upcoming/past sections.
4. If stale data persists, clear deployment cache and redeploy.

## Why This Is Required

Event partitions are computed with date logic in `src/lib/events.ts`. Without scheduled rebuilds, yesterday's classification can remain visible in production even though event dates have passed.
