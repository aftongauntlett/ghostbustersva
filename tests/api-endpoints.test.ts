/**
 * Tests for /api/contact and /api/appearance endpoints.
 *
 * These tests exercise the handler logic by constructing a minimal Request object
 * and calling the exported POST handler directly, with Resend mocked.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

// ---------------------------------------------------------------------------
// Mock import.meta.env before importing the handlers
// ---------------------------------------------------------------------------
vi.stubEnv("RESEND_API_KEY", "re_test_key");
vi.stubEnv("CONTACT_FROM_EMAIL", "hello@test.example");
vi.stubEnv("CONTACT_TO_EMAIL", "inbox@test.example");

// Mock the shared email utility so no real Resend/HTTP calls are made
const mockSendEmail = vi.fn().mockResolvedValue({ ok: true });
vi.mock("../src/lib/email", () => ({
  sendEmail: (...args: unknown[]) => mockSendEmail(...args),
  escapeHtml: (str: string) => str,
}));

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeRequest(body: unknown, origin = "https://gbva-site.vercel.app"): Request {
  return new Request("https://gbva-site.vercel.app/api/contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      origin,
      "x-forwarded-for": "1.2.3.4",
    },
    body: JSON.stringify(body),
  });
}

function makeAppearanceRequest(
  body: unknown,
  origin = "https://gbva-site.vercel.app",
): Request {
  return new Request("https://gbva-site.vercel.app/api/appearance", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      origin,
      "x-forwarded-for": "5.6.7.8",
    },
    body: JSON.stringify(body),
  });
}

const SITE = new URL("https://gbva-site.vercel.app");

const validContactPayload = () => ({
  name: "Ray Stantz",
  telephone: "555-1234",
  email: "ray@ghostbusters.com",
  inquiryType: "General Inquiry",
  briefDescription: "We got one!",
  _hp: "",
  _t: Date.now() - 4000,
});

const validAppearancePayload = () => ({
  contactName: "Peter Venkman",
  contactEmail: "peter@ghostbusters.com",
  eventName: "Slimer Birthday",
  eventType: "Birthday",
  isScheduled: "yes",
  addressLine1: "55 Central Park West",
  city: "New York",
  state: "NY",
  charitableDonationsAllowed: "no",
  needsLogistics: "no",
  _hp: "",
  _t: Date.now() - 4000,
});

// ---------------------------------------------------------------------------
// /api/contact tests
// ---------------------------------------------------------------------------

describe("POST /api/contact", () => {
  // Re-import after mocks are set up
  let POST: (ctx: { request: Request; site: URL }) => Promise<Response>;

  beforeEach(async () => {
    vi.resetModules();
    mockSendEmail.mockResolvedValue({ ok: true });
    const mod = await import("../src/pages/api/contact");
    POST = mod.POST as typeof POST;
  });

  it("happy path: valid payload → 200 { ok: true }", async () => {
    const res = await POST({ request: makeRequest(validContactPayload()), site: SITE });
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.ok).toBe(true);
  });

  it("honeypot filled → 200 { ok: true } (silent reject, no email sent)", async () => {
    const res = await POST({
      request: makeRequest({ ...validContactPayload(), _hp: "filled" }),
      site: SITE,
    });
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.ok).toBe(true);
  });

  it("timing too fast → 200 { ok: true } (silent reject)", async () => {
    const res = await POST({
      request: makeRequest({ ...validContactPayload(), _t: Date.now() }),
      site: SITE,
    });
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.ok).toBe(true);
  });

  it("missing required field → 400 validation_failed", async () => {
    const { name: _omit, ...payload } = validContactPayload();
    const res = await POST({ request: makeRequest(payload), site: SITE });
    const json = await res.json();
    expect(res.status).toBe(400);
    expect(json.error).toBe("validation_failed");
    expect(json.fields).toContain("name");
  });

  it("invalid email format → 400 validation_failed", async () => {
    const res = await POST({
      request: makeRequest({ ...validContactPayload(), email: "not-an-email" }),
      site: SITE,
    });
    const json = await res.json();
    expect(res.status).toBe(400);
    expect(json.error).toBe("validation_failed");
    expect(json.fields).toContain("email");
  });

  it("invalid inquiryType → 400 validation_failed", async () => {
    const res = await POST({
      request: makeRequest({ ...validContactPayload(), inquiryType: "Hack the Pentagon" }),
      site: SITE,
    });
    const json = await res.json();
    expect(res.status).toBe(400);
    expect(json.error).toBe("validation_failed");
    expect(json.fields).toContain("inquiryType");
  });

  it("Resend failure → 502 send_failed", async () => {
    mockSendEmail.mockResolvedValueOnce({ ok: false, error: "send_failed" });

    const res = await POST({ request: makeRequest(validContactPayload()), site: SITE });
    const json = await res.json();
    expect(res.status).toBe(502);
    expect(json.error).toBe("send_failed");
  });

  it("invalid JSON body → 400 invalid_request", async () => {
    const req = new Request("https://gbva-site.vercel.app/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json", origin: "https://gbva-site.vercel.app" },
      body: "not-json",
    });
    const res = await POST({ request: req, site: SITE });
    const json = await res.json();
    expect(res.status).toBe(400);
    expect(json.error).toBe("invalid_request");
  });
});

// ---------------------------------------------------------------------------
// /api/appearance tests
// ---------------------------------------------------------------------------

describe("POST /api/appearance", () => {
  let POST: (ctx: { request: Request; site: URL }) => Promise<Response>;

  beforeEach(async () => {
    vi.resetModules();
    mockSendEmail.mockResolvedValue({ ok: true });
    const mod = await import("../src/pages/api/appearance");
    POST = mod.POST as typeof POST;
  });

  it("happy path: valid payload → 200 { ok: true }", async () => {
    const res = await POST({
      request: makeAppearanceRequest(validAppearancePayload()),
      site: SITE,
    });
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.ok).toBe(true);
  });

  it("honeypot filled → 200 { ok: true } (silent reject)", async () => {
    const res = await POST({
      request: makeAppearanceRequest({ ...validAppearancePayload(), _hp: "bot" }),
      site: SITE,
    });
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.ok).toBe(true);
  });

  it("timing too fast → 200 { ok: true } (silent reject)", async () => {
    const res = await POST({
      request: makeAppearanceRequest({ ...validAppearancePayload(), _t: Date.now() }),
      site: SITE,
    });
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.ok).toBe(true);
  });

  it("missing required field → 400 validation_failed", async () => {
    const { contactName: _omit, ...payload } = validAppearancePayload();
    const res = await POST({ request: makeAppearanceRequest(payload), site: SITE });
    const json = await res.json();
    expect(res.status).toBe(400);
    expect(json.error).toBe("validation_failed");
    expect(json.fields).toContain("contactName");
  });

  it("invalid email format → 400 validation_failed", async () => {
    const res = await POST({
      request: makeAppearanceRequest({ ...validAppearancePayload(), contactEmail: "bad-email" }),
      site: SITE,
    });
    const json = await res.json();
    expect(res.status).toBe(400);
    expect(json.error).toBe("validation_failed");
    expect(json.fields).toContain("contactEmail");
  });

  it("Resend failure → 502 send_failed", async () => {
    mockSendEmail.mockResolvedValueOnce({ ok: false, error: "send_failed" });

    const res = await POST({
      request: makeAppearanceRequest(validAppearancePayload()),
      site: SITE,
    });
    const json = await res.json();
    expect(res.status).toBe(502);
    expect(json.error).toBe("send_failed");
  });

  it("invalid JSON body → 400 invalid_request", async () => {
    const req = new Request("https://gbva-site.vercel.app/api/appearance", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        origin: "https://gbva-site.vercel.app",
      },
      body: "not-json",
    });
    const res = await POST({ request: req, site: SITE });
    const json = await res.json();
    expect(res.status).toBe(400);
    expect(json.error).toBe("invalid_request");
  });
});

