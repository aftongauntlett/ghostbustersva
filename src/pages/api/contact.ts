/**
 * API endpoint: POST /api/contact
 * Handles contact form submissions and sends email via Resend.
 */
import type { APIRoute } from "astro";
import { sendEmail, escapeHtml } from "../../lib/email";
import { checkRateLimit, getIp } from "../../lib/rate-limit";
import { inquiryTypeOptions } from "../../lib/contact-form";

export const prerender = false;

const INQUIRY_ALLOWLIST = new Set<string>(inquiryTypeOptions);

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

async function verifyTurnstile(token: string, siteUrl: string): Promise<boolean> {
  const secret = import.meta.env.TURNSTILE_SECRET_KEY;
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ secret, response: token, remoteip: siteUrl }),
  });
  const data = (await res.json()) as { success: boolean };
  return data.success === true;
}

export const POST: APIRoute = async ({ request, site }) => {
  // 1. Origin check
  const origin = request.headers.get("origin");
  const isVercel = origin?.startsWith('https://gbva-site')
                   && origin?.endsWith('vercel.app');
  const siteOrigin = site ? new URL(site).origin : null;
  if (!isVercel && siteOrigin && origin && origin !== siteOrigin) {
    return new Response(JSON.stringify({ ok: false, error: "invalid_request" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // 2. Parse JSON body
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return new Response(JSON.stringify({ ok: false, error: "invalid_request" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const str = (v: unknown): string => (typeof v === "string" ? v : "");

  // 3. Honeypot — silent pass
  if (str(body._hp) !== "") {
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  // 4. Timing check — silent pass
  const loadTime = Number(body._t);
  if (!Number.isFinite(loadTime) || Date.now() - loadTime < 3000) {
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  // 5. Validate required fields
  const name = str(body.name);
  const telephone = str(body.telephone);
  const email = str(body.email);
  const inquiryType = str(body.inquiryType);
  const briefDescription = str(body.briefDescription);

  const failedFields: string[] = [];
  if (!name.trim()) failedFields.push("name");
  if (!telephone.trim()) failedFields.push("telephone");
  if (!email.trim() || !isValidEmail(email)) failedFields.push("email");
  if (!briefDescription.trim()) failedFields.push("briefDescription");

  // 6. Validate inquiryType allowlist
  if (!inquiryType || !INQUIRY_ALLOWLIST.has(inquiryType)) {
    failedFields.push("inquiryType");
  }

  if (failedFields.length > 0) {
    return new Response(
      JSON.stringify({ ok: false, error: "validation_failed", fields: failedFields }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  // 7. Rate limit
  const ip = getIp(request);
  const { limited } = await checkRateLimit(`contact:${ip}`);
  if (limited) {
    console.log({ event: "contact_rejected", reason: "rate_limited", ip });
    return new Response(JSON.stringify({ ok: false, error: "rate_limited" }), {
      status: 429,
      headers: { "Content-Type": "application/json" },
    });
  }

  // 8. Optional Turnstile check
  const turnstileSiteKey = import.meta.env.PUBLIC_TURNSTILE_SITE_KEY;
  const turnstileSecret = import.meta.env.TURNSTILE_SECRET_KEY;
  if (turnstileSiteKey && turnstileSecret) {
    const token = str(body["cf-turnstile-response"]);
    const passed = await verifyTurnstile(token, ip);
    if (!passed) {
      return new Response(JSON.stringify({ ok: false, error: "turnstile_failed" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  // 9. Build and send email
  const location = str(body.location);
  const eventDate = str(body.eventDate);
  const eventEndDate = str(body.eventEndDate);

  const e = escapeHtml;
  const html = `
<h2>Contact Form Submission</h2>
<p><strong>Name:</strong> ${e(name)}</p>
<p><strong>Email:</strong> ${e(email)}</p>
<p><strong>Telephone:</strong> ${e(telephone)}</p>
<p><strong>Inquiry Type:</strong> ${e(inquiryType)}</p>
${location ? `<p><strong>Location:</strong> ${e(location)}</p>` : ""}
${eventDate ? `<p><strong>Event Date:</strong> ${e(eventDate)}</p>` : ""}
${eventEndDate ? `<p><strong>Event End Date:</strong> ${e(eventEndDate)}</p>` : ""}
<p><strong>Message:</strong></p>
<p>${e(briefDescription)}</p>
`.trim();

  const result = await sendEmail({
    replyTo: email,
    subject: `Contact Form: ${inquiryType} from ${name}`,
    html,
  });

  if (!result.ok) {
    console.log({ event: "contact_send_failed", ip });
    return new Response(JSON.stringify({ ok: false, error: "send_failed" }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  }

  console.log({ event: "contact_sent", ip });
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

