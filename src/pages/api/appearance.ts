import type { APIRoute } from "astro";
import { sendEmail, escapeHtml } from "../../lib/email";
import { checkRateLimit, getIp } from "../../lib/rate-limit";

export const prerender = false;

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

function field(label: string, value: string): string {
  if (!value) return "";
  return `<p><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value)}</p>`;
}

function buildAppearanceHtml(b: Record<string, unknown>): string {
  const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

  const eventType =
    str(b.eventType) === "Other" ? `Other: ${str(b.eventTypeOther)}` : str(b.eventType);
  const isScheduled = str(b.isScheduled) === "yes" ? "Yes" : "No";

  const parts: string[] = ["<h2>Appearance Request</h2>"];

  parts.push("<h3>Event Details</h3>");
  parts.push(field("Event Name", str(b.eventName)));
  parts.push(field("Event Type", eventType));
  parts.push(field("Is Scheduled", isScheduled));

  if (str(b.isScheduled) === "yes") {
    parts.push(field("Event Start Date", str(b.eventStartDate)));
    parts.push(field("Event End Date", str(b.eventEndDate)));
    parts.push(field("Event Start Time", str(b.eventStartTime)));
    parts.push(field("Event End Time", str(b.eventEndTime)));
    parts.push(field("Earliest Setup / Arrival Time", str(b.earliestSetupTime)));
    parts.push(field("Required Leave Time", str(b.requiredLeaveTime)));
  } else if (str(b.unscheduledNote)) {
    parts.push(field("Timing Notes", str(b.unscheduledNote)));
  }

  parts.push("<h3>Location</h3>");
  parts.push(field("Street Address", str(b.addressLine1)));
  parts.push(field("Address Line 2", str(b.addressLine2)));
  parts.push(field("City", str(b.city)));
  parts.push(field("State", str(b.state)));
  parts.push(field("ZIP Code", str(b.zipCode)));
  parts.push(field("Location Description", str(b.locationDescription)));

  parts.push("<h3>Event Needs</h3>");
  parts.push(
    field(
      "Charitable Donations Allowed",
      str(b.charitableDonationsAllowed) === "yes" ? "Yes" : "No",
    ),
  );
  parts.push(field("Needs Logistics", str(b.needsLogistics) === "yes" ? "Yes" : "No"));

  if (str(b.needsLogistics) === "yes") {
    parts.push("<h3>Logistics</h3>");
    parts.push(
      field("Requesting Ecto Vehicle", str(b.requestEctoVehicle) === "yes" ? "Yes" : "No"),
    );
    if (str(b.requestEctoVehicle) === "yes") {
      parts.push(field("Ecto Vehicle Parking", str(b.ectoVehicleParkingInfo)));
      parts.push(field("Max Ecto Vehicles", str(b.maxEctoVehicles)));
    }
    parts.push(field("Member Parking", str(b.memberParkingInfo)));
    parts.push(field("Tables", str(b.tablesProvided)));
    parts.push(field("Number of Tables", str(b.numberOfTables)));
    parts.push(field("Chairs", str(b.chairsProvided)));
    parts.push(field("Number of Chairs", str(b.numberOfChairs)));
  }

  if (str(b.charitableDonationsAllowed) === "yes" && str(b.collectDonationsForHost)) {
    parts.push("<h3>Charitable Donations</h3>");
    parts.push(field("Donations For", str(b.collectDonationsForHost)));
    parts.push(field("Charity", str(b.charityInfo)));
  }

  parts.push("<h3>Contact</h3>");
  parts.push(field("Name", str(b.contactName)));
  parts.push(field("Email", str(b.contactEmail)));
  parts.push(field("Phone", str(b.contactPhone)));
  parts.push(field("Company", str(b.companyName)));
  parts.push(field("Website", str(b.companyWebsite)));

  if (str(b.additionalInfo)) {
    parts.push("<h3>Additional Notes</h3>");
    parts.push(`<p>${escapeHtml(str(b.additionalInfo))}</p>`);
  }

  return parts.filter(Boolean).join("\n");
}

export async function handleAppearanceRequest(request: Request): Promise<Response> {
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

  const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

  const contactName = str(body.contactName);
  const contactEmail = str(body.contactEmail);
  const eventName = str(body.eventName);
  const eventType = str(body.eventType);
  const isScheduled = str(body.isScheduled);
  const addressLine1 = str(body.addressLine1);
  const city = str(body.city);
  const state = str(body.state);
  const charitableDonationsAllowed = str(body.charitableDonationsAllowed);
  const needsLogistics = str(body.needsLogistics);

  const failedFields: string[] = [];
  if (!contactName) failedFields.push("contactName");
  if (!contactEmail || !isValidEmail(contactEmail)) failedFields.push("contactEmail");
  if (!eventName) failedFields.push("eventName");
  if (!eventType) failedFields.push("eventType");
  if (!isScheduled) failedFields.push("isScheduled");
  if (!addressLine1) failedFields.push("addressLine1");
  if (!city) failedFields.push("city");
  if (!state) failedFields.push("state");
  if (!charitableDonationsAllowed) failedFields.push("charitableDonationsAllowed");
  if (!needsLogistics) failedFields.push("needsLogistics");

  if (failedFields.length > 0) {
    return jsonRes({ ok: false, error: "validation_failed", fields: failedFields }, 400);
  }

  const ip = getIp(request);
  const { limited } = await checkRateLimit(`appearance:${ip}:${contactEmail}`);
  if (limited) {
    console.log(JSON.stringify({ event: "appearance_rejected", reason: "rate_limited", ip }));
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

  const result = await sendEmail({
    replyTo: contactEmail,
    subject: `Appearance Request: ${eventName} — ${contactName}`,
    html: buildAppearanceHtml(body),
  });

  if (!result.ok) {
    console.error(JSON.stringify({ event: "appearance_send_failed" }));
    return jsonRes({ ok: false, error: "send_failed" }, 502);
  }

  console.log(JSON.stringify({ event: "appearance_sent" }));
  return jsonRes({ ok: true });
}

export const POST: APIRoute = ({ request }) => handleAppearanceRequest(request);
