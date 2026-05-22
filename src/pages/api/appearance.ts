/**
 * API endpoint: POST /api/appearance
 * Handles appearance request form submissions and sends email via Resend.
 */
import type { APIRoute } from "astro";
import { sendEmail, escapeHtml } from "../../lib/email";
import { checkRateLimit, getIp } from "../../lib/rate-limit";

export const prerender = false;

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  const secret = import.meta.env.TURNSTILE_SECRET_KEY;
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ secret, response: token, remoteip: ip }),
  });
  const data = (await res.json()) as { success: boolean };
  return data.success === true;
}

function row(label: string, value: string | undefined): string {
  if (!value || !value.trim()) return "";
  const e = escapeHtml;
  return `<p><strong>${e(label)}:</strong> ${e(value)}</p>`;
}

export const POST: APIRoute = async ({ request, site }) => {
  // 1. Origin check
  const origin = request.headers.get("origin");
  const siteOrigin = site ? new URL(site).origin : null;
  if (siteOrigin && origin && origin !== siteOrigin) {
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
  if (!contactName.trim()) failedFields.push("contactName");
  if (!contactEmail.trim() || !isValidEmail(contactEmail)) failedFields.push("contactEmail");
  if (!eventName.trim()) failedFields.push("eventName");
  if (!eventType.trim()) failedFields.push("eventType");
  if (!isScheduled.trim()) failedFields.push("isScheduled");
  if (!addressLine1.trim()) failedFields.push("addressLine1");
  if (!city.trim()) failedFields.push("city");
  if (!state.trim()) failedFields.push("state");
  if (!charitableDonationsAllowed.trim()) failedFields.push("charitableDonationsAllowed");
  if (!needsLogistics.trim()) failedFields.push("needsLogistics");

  if (failedFields.length > 0) {
    return new Response(
      JSON.stringify({ ok: false, error: "validation_failed", fields: failedFields }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  // 6. Rate limit
  const ip = getIp(request);
  const { limited } = await checkRateLimit(`appearance:${ip}:${contactEmail.toLowerCase()}`);
  if (limited) {
    console.log({ event: "appearance_rejected", reason: "rate_limited", ip });
    return new Response(JSON.stringify({ ok: false, error: "rate_limited" }), {
      status: 429,
      headers: { "Content-Type": "application/json" },
    });
  }

  // 7. Optional Turnstile check
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

  // 8. Build email
  const eventTypeOther = str(body.eventTypeOther);
  const resolvedEventType =
    eventType === "Other" && eventTypeOther ? `Other: ${eventTypeOther}` : eventType;

  const unscheduledNote = str(body.unscheduledNote);
  const eventStartDate = str(body.eventStartDate);
  const eventEndDate = str(body.eventEndDate);
  const eventStartTime = str(body.eventStartTime);
  const eventEndTime = str(body.eventEndTime);
  const earliestSetupTime = str(body.earliestSetupTime);
  const requiredLeaveTime = str(body.requiredLeaveTime);

  const locationDescription = str(body.locationDescription);
  const addressLine2 = str(body.addressLine2);
  const zipCode = str(body.zipCode);

  const requestEctoVehicle = str(body.requestEctoVehicle);
  const ectoVehicleParkingInfo = str(body.ectoVehicleParkingInfo);
  const maxEctoVehicles = str(body.maxEctoVehicles);
  const memberParkingInfo = str(body.memberParkingInfo);
  const tablesProvided = str(body.tablesProvided);
  const numberOfTables = str(body.numberOfTables);
  const chairsProvided = str(body.chairsProvided);
  const numberOfChairs = str(body.numberOfChairs);

  const collectDonationsForHost = str(body.collectDonationsForHost);
  const charityInfo = str(body.charityInfo);

  const contactPhone = str(body.contactPhone);
  const companyName = str(body.companyName);
  const companyWebsite = str(body.companyWebsite);
  const additionalInfo = str(body.additionalInfo);

  const e = escapeHtml;

  const html = `
<h2>Appearance Request</h2>

<h3>Event Details</h3>
${row("Event Name", eventName)}
${row("Event Type", resolvedEventType)}
<p><strong>Is Scheduled:</strong> ${e(isScheduled === "yes" ? "Yes" : "No")}</p>
${isScheduled === "yes" ? `
  ${row("Event Start Date", eventStartDate)}
  ${row("Event End Date", eventEndDate)}
  ${row("Event Start Time", eventStartTime)}
  ${row("Event End Time", eventEndTime)}
  ${row("Earliest Setup / Arrival Time", earliestSetupTime)}
  ${row("Required Leave Time", requiredLeaveTime)}
` : row("Timing Notes", unscheduledNote)}

<h3>Location</h3>
${row("Location Description", locationDescription)}
${row("Street Address", addressLine1)}
${row("Address Line 2", addressLine2)}
${row("City", city)}
${row("State", state)}
${row("ZIP Code", zipCode)}

<h3>Event Needs</h3>
${row("Charitable Donations Allowed", charitableDonationsAllowed)}
${collectDonationsForHost ? row("Donations For", collectDonationsForHost) : ""}
${charityInfo ? row("Charity", charityInfo) : ""}
${row("Needs Logistics", needsLogistics)}

<h3>Logistics</h3>
${row("Requesting Ecto Vehicle", requestEctoVehicle === "yes" ? "Yes" : requestEctoVehicle === "no" ? "No" : requestEctoVehicle)}
${requestEctoVehicle === "yes" ? `
  ${row("Ecto Vehicle Parking Info", ectoVehicleParkingInfo)}
  ${row("Max Ecto Vehicles", maxEctoVehicles)}
` : ""}
${row("Member Parking Info", memberParkingInfo)}
${row("Tables", tablesProvided)}
${numberOfTables ? row("Number of Tables", numberOfTables) : ""}
${row("Chairs", chairsProvided)}
${numberOfChairs ? row("Number of Chairs", numberOfChairs) : ""}

<h3>Contact</h3>
${row("Contact Name", contactName)}
${row("Contact Email", contactEmail)}
${row("Contact Phone", contactPhone)}
${row("Company Name", companyName)}
${row("Company / Event Website", companyWebsite)}

${additionalInfo ? `<h3>Additional Notes</h3><p>${e(additionalInfo)}</p>` : ""}
`.trim();

  const result = await sendEmail({
    replyTo: contactEmail,
    subject: `Appearance Request: ${eventName} — ${contactName}`,
    html,
  });

  if (!result.ok) {
    console.log({ event: "appearance_send_failed", ip });
    return new Response(JSON.stringify({ ok: false, error: "send_failed" }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  }

  console.log({ event: "appearance_sent", ip });
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

