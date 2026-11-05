import "server-only";
import { Resend } from "resend";

const from = process.env.EMAIL_FROM ?? "Restaurant Sankadiokro <onboarding@resend.dev>";

function client(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  return key ? new Resend(key) : null;
}

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

export async function sendEmail(opts: { to: string | string[]; subject: string; html: string; replyTo?: string }) {
  const resend = client();
  if (!resend) {
    console.info(`[email non envoyé — RESEND_API_KEY manquant] ${opts.subject} → ${opts.to}`);
    return { sent: false as const };
  }
  try {
    const { error } = await resend.emails.send({
      from,
      to: Array.isArray(opts.to) ? opts.to : [opts.to],
      subject: opts.subject,
      html: opts.html,
      replyTo: opts.replyTo,
    });
    if (error) {
      console.error("Erreur envoi e-mail", error);
      return { sent: false as const };
    }
    return { sent: true as const };
  } catch (e) {
    console.error("Erreur envoi e-mail", e);
    return { sent: false as const };
  }
}

export function adminEmail(): string | null {
  return process.env.ADMIN_NOTIFICATION_EMAIL || null;
}

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function layout(title: string, bodyHtml: string): string {
  return `<!doctype html><html lang="fr"><body style="margin:0;background:#FFF8EB;font-family:Arial,Helvetica,sans-serif;color:#242424">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:32px 16px">
  <table role="presentation" width="100%" style="max-width:600px;background:#fff;border-radius:16px;overflow:hidden">
    <tr><td style="background:#174A35;padding:24px;text-align:center;color:#fff">
      <div style="font-size:22px;font-weight:bold;letter-spacing:.5px">Restaurant Sankadiokro</div>
      <div style="font-size:13px;color:#D5A547;margin-top:4px">Le goût authentique de chez nous</div>
    </td></tr>
    <tr><td style="padding:28px 24px;font-size:15px;line-height:1.6">
      <h1 style="font-size:20px;margin:0 0 16px;color:#174A35">${esc(title)}</h1>
      ${bodyHtml}
    </td></tr>
    <tr><td style="padding:16px 24px;font-size:12px;color:#777;text-align:center;background:#FFF8EB">
      Cet e-mail a été envoyé automatiquement par le site de Restaurant Sankadiokro, Abidjan.
    </td></tr>
  </table></td></tr></table></body></html>`;
}

export function kv(rows: [string, string | number | null | undefined][]): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;margin:12px 0">${rows
    .filter(([, v]) => v !== null && v !== undefined && v !== "")
    .map(
      ([k, v]) =>
        `<tr><td style="padding:8px 0;border-bottom:1px solid #eee;color:#777;width:40%">${esc(k)}</td><td style="padding:8px 0;border-bottom:1px solid #eee;font-weight:bold">${esc(String(v))}</td></tr>`,
    )
    .join("")}</table>`;
}

export { esc as escapeHtml };
