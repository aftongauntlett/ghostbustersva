# Resend Setup and Handoff Guide

This is the non-technical checklist for managing contact and appearance form delivery.

Goal: keep forms reliable, protect the free Resend plan from spam, and make ongoing maintenance simple.

## What is already handled by code

- Both forms now send through site API routes, not Formspree.
- Emails are sent through Resend.
- Basic abuse protection is built in:
  - Hidden bot field (honeypot)
  - Time-based bot check
  - Origin check
  - Rate limiting
- Form failures return friendly messages to users.

## One-time setup checklist

Complete these items before announcing forms are live.

1. Confirm Resend domain is verified

- Log in to Resend.
- Open Domains.
- Verify the sending domain shows as Verified.
- If not verified, add the DNS records Resend gives you and wait for verification.

2. Add environment variables in Vercel

- Go to Vercel Project Settings -> Environment Variables.
- Add values to both Production and Preview environments.
- Redeploy after saving.

Required variables:

| Variable           | What to put here                                                       |
| ------------------ | ---------------------------------------------------------------------- |
| RESEND_API_KEY     | Your Resend API key                                                    |
| CONTACT_FROM_EMAIL | Sending address on the verified domain (example: hello@yourdomain.com) |
| CONTACT_TO_EMAIL   | Inbox where form messages should arrive                                |

Recommended variables (spam protection):

| Variable                 | What to put here         |
| ------------------------ | ------------------------ |
| UPSTASH_REDIS_REST_URL   | Upstash Redis REST URL   |
| UPSTASH_REDIS_REST_TOKEN | Upstash Redis REST token |

Optional variables (extra anti-spam):

| Variable                  | What to put here                |
| ------------------------- | ------------------------------- |
| PUBLIC_TURNSTILE_SITE_KEY | Cloudflare Turnstile site key   |
| TURNSTILE_SECRET_KEY      | Cloudflare Turnstile secret key |

Important Turnstile note:

- If Turnstile keys are empty, forms still work normally.
- Turnstile verification only runs when a Turnstile token is actually submitted.
- This prevents accidental lockouts if someone adds keys before widget rollout is complete.

3. Copy local env template for maintainers

- Keep .env.example in repo as the source of truth.
- When a developer needs local testing, copy it to .env and fill real values.
- Never commit real secrets.

## Quick smoke test after deploy

Run this every time form config is changed.

1. Submit contact form with valid info.
2. Confirm success message appears and page does not reload.
3. Confirm message arrives in CONTACT_TO_EMAIL inbox.
4. Submit appearance form with valid info.
5. Confirm success message appears.
6. Confirm appearance email arrives in same inbox.

## Recommended monthly maintenance (10 minutes)

1. Send one contact form test.
2. Confirm email delivery is still working.
3. Check Resend dashboard usage for unexpected spikes.
4. Check Vercel logs for repeated rate-limit or send-failure events.
5. Confirm inbox routing still points to the right team member.

## If something breaks

Use this table first before escalating.

| Symptom                                | Most likely cause                              | First fix to try                                                     |
| -------------------------------------- | ---------------------------------------------- | -------------------------------------------------------------------- |
| No email arrives but form says success | CONTACT_TO_EMAIL missing or incorrect          | Check and correct CONTACT_TO_EMAIL in Vercel, redeploy               |
| Form returns send_failed               | CONTACT_FROM_EMAIL/domain mismatch in Resend   | Verify domain in Resend and use a sender on that domain              |
| Too many blocked submissions           | Rate limit too strict for traffic              | Review logs and adjust limits in code if needed                      |
| Turnstile errors                       | Keys added but Turnstile token flow incomplete | Remove Turnstile vars temporarily or finish Turnstile widget rollout |

## Security level for this nonprofit setup

This setup is intentionally lightweight and maintainable.

- Good baseline protection is active by default.
- Strong enough for low-volume traffic and free Resend usage.
- If spam increases, add Upstash first, then Turnstile.

## Ownership handoff notes

- Non-developer owner can safely manage:
  - Vercel environment variables
  - Resend domain status
  - Inbox destination changes
- Developer help is only needed for:
  - Changing validation rules
  - Changing rate-limit thresholds
  - Full Turnstile widget rollout/UX changes
