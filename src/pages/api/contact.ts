import type { APIRoute } from "astro";
import { sendEmail, escapeHtml } from "../../lib/email";
import { checkRateLimit, getIp } from "../../lib/rate-limit";
import { inquiryTypeOptions } from "../../lib/contact-form";

export const prerender = false;

const VALID_INQUIRY_TYPES = new Set<string>(inquiryTypeOptions);

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function getExpectedOrigin(): string {
  const site = import.meta.env.SITE ?? "";
  if (!site) return "";
  try {
    return new URL(site).origin;
  } catch {
    return "";
  }
}

function jsonRes(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function handleContactRequest(request: Request): Promise<Response> {
  if (request.method !== "POST") {
    return jsonRes({ ok: false, error: "method_not_allowed" }, 405);
  }

  const origin = request.headers.get("origin") ?? "";
  const expectedOrigin = getExpectedOrigin();
  const isLocalhost =
    origin.startsWith("http://localhost") || origin.startsWith("http://127.0.0.1");
  const isVercel = origin.startsWith("https://gbva-site-git") && origin.endsWith(".vercel.app");

  if (expectedOrigin && !isVercel && !isLocalhost && origin !== expectedOrigin) {
    return jsonRes({ ok: false, error: "invalid_origin" }, 400);
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return jsonRes({ ok: false, error: "invalid_request" }, 400);
  }

  const hp = body._hp;
  if (hp !== "" && hp !== undefined && hp !== null) {
    return jsonRes({ ok: true });
  }

  const t = Number(body._t);
  if (!Number.isNaN(t) && Date.now() - t < 3000) {
    return jsonRes({ ok: true });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const telephone = typeof body.telephone === "string" ? body.telephone.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const inquiryType = typeof body.inquiryType === "string" ? body.inquiryType.trim() : "";
  const briefDescription =
    typeof body.briefDescription === "string" ? body.briefDescription.trim() : "";

  const failedFields: string[] = [];
  if (!name) failedFields.push("name");
  if (!telephone) failedFields.push("telephone");
  if (!email || !isValidEmail(email)) failedFields.push("email");
  if (!briefDescription) failedFields.push("briefDescription");

  if (failedFields.length > 0) {
    return jsonRes({ ok: false, error: "validation_failed", fields: failedFields }, 400);
  }

  if (!inquiryType || !VALID_INQUIRY_TYPES.has(inquiryType)) {
    return jsonRes({ ok: false, error: "validation_failed", fields: ["inquiryType"] }, 400);
  }

  const ip = getIp(request);
  const { limited } = await checkRateLimit(`contact:${ip}`);
  if (limited) {
    console.log(JSON.stringify({ event: "contact_rejected", reason: "rate_limited", ip }));
    return jsonRes({ ok: false, error: "rate_limited" }, 429);
  }

  const turnstileSiteKey = import.meta.env.PUBLIC_TURNSTILE_SITE_KEY;
  const turnstileSecret = import.meta.env.TURNSTILE_SECRET_KEY;
  const token =
    typeof body["cf-turnstile-response"] === "string" ? body["cf-turnstile-response"].trim() : "";
  if (turnstileSiteKey && turnstileSecret && token) {
    const tsForm = new FormData();
    tsForm.append("secret", turnstileSecret);
    tsForm.append("response", token);
    const tsRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: tsForm,
    });
    const tsData = (await tsRes.json().catch(() => ({ success: false }))) as { success: boolean };
    if (!tsData.success) {
      return jsonRes({ ok: false, error: "turnstile_failed" }, 400);
    }
  }

  const location = typeof body.location === "string" ? body.location.trim() : "";
  const eventDate = typeof body.eventDate === "string" ? body.eventDate.trim() : "";
  const eventEndDate = typeof body.eventEndDate === "string" ? body.eventEndDate.trim() : "";

  const htmlParts = [
    "<h2>Contact Form Submission</h2>",
    `<p><strong>Name:</strong> ${escapeHtml(name)}</p>`,
    `<p><strong>Email:</strong> ${escapeHtml(email)}</p>`,
    `<p><strong>Telephone:</strong> ${escapeHtml(telephone)}</p>`,
    `<p><strong>Inquiry Type:</strong> ${escapeHtml(inquiryType)}</p>`,
  ];
  if (location) htmlParts.push(`<p><strong>Location:</strong> ${escapeHtml(location)}</p>`);
  if (eventDate) htmlParts.push(`<p><strong>Event Date:</strong> ${escapeHtml(eventDate)}</p>`);
  if (eventEndDate)
    htmlParts.push(`<p><strong>Event End Date:</strong> ${escapeHtml(eventEndDate)}</p>`);
  htmlParts.push(`<p><strong>Message:</strong></p><p>${escapeHtml(briefDescription)}</p>`);

  const result = await sendEmail({
    replyTo: email,
    subject: `Contact Form: ${inquiryType} from ${name}`,
    html: htmlParts.join("\n"),
  });

  if (!result.ok) {
    console.error(JSON.stringify({ event: "contact_send_failed" }));
    return jsonRes({ ok: false, error: "send_failed" }, 502);
  }

  console.log(JSON.stringify({ event: "contact_sent" }));
  return jsonRes({ ok: true });
}

export const POST: APIRoute = ({ request }) => handleContactRequest(request);
