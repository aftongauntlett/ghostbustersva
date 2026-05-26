import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../src/lib/email", () => ({
  sendEmail: vi.fn().mockResolvedValue({ ok: true }),
  escapeHtml: (str: string) =>
    str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;"),
}));

vi.mock("../src/lib/rate-limit", () => ({
  checkRateLimit: vi.fn().mockResolvedValue({ limited: false }),
  getIp: vi.fn().mockReturnValue("127.0.0.1"),
}));

import { handleContactRequest } from "../src/pages/api/contact";
import { handleAppearanceRequest } from "../src/pages/api/appearance";
import { sendEmail } from "../src/lib/email";
import { checkRateLimit } from "../src/lib/rate-limit";
import { buildPayload } from "../src/components/AppearanceRequestForm/helpers";
import { DEFAULT_FORM_DATA } from "../src/components/AppearanceRequestForm/constants";

// ------------------------------------------------------------------ //
// Helpers                                                              //
// ------------------------------------------------------------------ //

function contactRequest(body: Record<string, unknown>): Request {
  return new Request("http://localhost/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

function appearanceRequest(body: Record<string, unknown>): Request {
  return new Request("http://localhost/api/appearance", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

const pastTimestamp = String(Date.now() - 5000);

const validContact = {
  name: "Test User",
  telephone: "555-1234",
  email: "test@example.com",
  inquiryType: "General Inquiry",
  briefDescription: "Hello there",
  _hp: "",
  _t: pastTimestamp,
};

const validAppearanceFormData = {
  ...DEFAULT_FORM_DATA,
  contactName: "Test User",
  contactEmail: "test@example.com",
  eventName: "Charity Gala",
  eventType: "Birthday",
  isScheduled: "yes",
  addressLine1: "123 Main St",
  city: "Richmond",
  state: "VA",
  charitableDonationsAllowed: "yes",
  needsLogistics: "no",
};

const validAppearance = {
  ...buildPayload(validAppearanceFormData),
  _t: pastTimestamp,
};

// ------------------------------------------------------------------ //
// Contact endpoint                                                     //
// ------------------------------------------------------------------ //

describe("contact endpoint", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(sendEmail).mockResolvedValue({ ok: true });
    vi.mocked(checkRateLimit).mockResolvedValue({ limited: false });
  });

  it("returns 200 ok for valid payload", async () => {
    const res = await handleContactRequest(contactRequest(validContact));
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.ok).toBe(true);
    expect(sendEmail).toHaveBeenCalledOnce();
  });

  it("silently passes honeypot-filled requests without sending email", async () => {
    const res = await handleContactRequest(contactRequest({ ...validContact, _hp: "bot" }));
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.ok).toBe(true);
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("silently passes timing-too-fast requests without sending email", async () => {
    const res = await handleContactRequest(
      contactRequest({ ...validContact, _t: String(Date.now()) }),
    );
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.ok).toBe(true);
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("returns 400 with validation_failed for missing required field", async () => {
    const { name: _n, ...noName } = validContact;
    const res = await handleContactRequest(contactRequest(noName));
    const data = await res.json();
    expect(res.status).toBe(400);
    expect(data.error).toBe("validation_failed");
    expect(data.fields).toContain("name");
  });

  it("returns 400 for invalid email format", async () => {
    const res = await handleContactRequest(
      contactRequest({ ...validContact, email: "not-an-email" }),
    );
    const data = await res.json();
    expect(res.status).toBe(400);
    expect(data.error).toBe("validation_failed");
    expect(data.fields).toContain("email");
  });

  it("returns 400 for invalid inquiryType", async () => {
    const res = await handleContactRequest(
      contactRequest({ ...validContact, inquiryType: "Definitely Not Valid" }),
    );
    const data = await res.json();
    expect(res.status).toBe(400);
    expect(data.fields).toContain("inquiryType");
  });

  it("returns 429 when rate limited", async () => {
    vi.mocked(checkRateLimit).mockResolvedValue({ limited: true });
    const res = await handleContactRequest(contactRequest(validContact));
    const data = await res.json();
    expect(res.status).toBe(429);
    expect(data.error).toBe("rate_limited");
  });

  it("returns 502 when Resend fails", async () => {
    vi.mocked(sendEmail).mockResolvedValue({ ok: false, error: "send_failed" });
    const res = await handleContactRequest(contactRequest(validContact));
    const data = await res.json();
    expect(res.status).toBe(502);
    expect(data.error).toBe("send_failed");
  });
});

// ------------------------------------------------------------------ //
// Appearance endpoint                                                  //
// ------------------------------------------------------------------ //

describe("appearance endpoint", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(sendEmail).mockResolvedValue({ ok: true });
    vi.mocked(checkRateLimit).mockResolvedValue({ limited: false });
  });

  it("returns 200 ok for valid payload", async () => {
    const res = await handleAppearanceRequest(appearanceRequest(validAppearance));
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.ok).toBe(true);
    expect(sendEmail).toHaveBeenCalledOnce();
  });

  it("silently passes honeypot-filled requests without sending email", async () => {
    const res = await handleAppearanceRequest(
      appearanceRequest({ ...validAppearance, _hp: "bot" }),
    );
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.ok).toBe(true);
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("silently passes timing-too-fast requests without sending email", async () => {
    const res = await handleAppearanceRequest(
      appearanceRequest({ ...validAppearance, _t: String(Date.now()) }),
    );
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.ok).toBe(true);
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("returns 400 with validation_failed for missing required field", async () => {
    const noName: Record<string, unknown> = { ...validAppearance };
    delete noName.contactName;
    const res = await handleAppearanceRequest(appearanceRequest(noName));
    const data = await res.json();
    expect(res.status).toBe(400);
    expect(data.error).toBe("validation_failed");
    expect(data.fields).toContain("contactName");
  });

  it("returns 400 for invalid contactEmail format", async () => {
    const res = await handleAppearanceRequest(
      appearanceRequest({ ...validAppearance, contactEmail: "bad-email" }),
    );
    const data = await res.json();
    expect(res.status).toBe(400);
    expect(data.error).toBe("validation_failed");
    expect(data.fields).toContain("contactEmail");
  });

  it("returns 429 when rate limited", async () => {
    vi.mocked(checkRateLimit).mockResolvedValue({ limited: true });
    const res = await handleAppearanceRequest(appearanceRequest(validAppearance));
    const data = await res.json();
    expect(res.status).toBe(429);
    expect(data.error).toBe("rate_limited");
  });

  it("returns 502 when Resend fails", async () => {
    vi.mocked(sendEmail).mockResolvedValue({ ok: false, error: "send_failed" });
    const res = await handleAppearanceRequest(appearanceRequest(validAppearance));
    const data = await res.json();
    expect(res.status).toBe(502);
    expect(data.error).toBe("send_failed");
  });
});
