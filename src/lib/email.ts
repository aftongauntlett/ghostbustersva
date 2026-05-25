/**
 * Shared email sending utility using Resend.
 */
import { Resend } from "resend";

export interface SendEmailOptions {
  replyTo: string;
  subject: string;
  html: string;
}

/** Escape user-supplied content for safe HTML interpolation. */
export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function sendEmail(
  options: SendEmailOptions,
): Promise<{ ok: boolean; error?: string }> {
  const apiKey = import.meta.env.RESEND_API_KEY;
  const from = import.meta.env.CONTACT_FROM_EMAIL;
  const to = import.meta.env.CONTACT_TO_EMAIL;

  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    from,
    to: [to],
    replyTo: options.replyTo,
    subject: options.subject,
    html: options.html,
  });

  if (error) {
    console.error({ event: "email_send_error", error });
    return { ok: false, error: error.name };
  }

  return { ok: true };
}
