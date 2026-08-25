import { Env, jsonResponse } from './_lib/types';
import { sendLeadToMeta } from './_lib/meta-capi';
import { Resend } from 'resend';

/** Kept in sync with APPLY_CONTENT_NAME in src/lib/analytics.ts. */
const APPLY_CONTENT_NAME = 'Анкета передзапису';

interface LeadBody {
    name: string;
    phone: string;
    telegram: string;
    source: string;
    role: string;
    income: string;
    interest: string;
    motivation: string;
    readiness: string;
    /** Full page URL at submit, including UTM query params. Optional. */
    sourcePage: string;
}

const REQUIRED_FIELDS: (keyof LeadBody)[] = ['name', 'phone', 'telegram'];

/**
 * Asked by some form variants only (see src/pages/applyVariants.ts). Always
 * forwarded, empty when the variant didn't ask, so the spreadsheet columns
 * keep their positions.
 */
const OPTIONAL_FIELDS: (keyof LeadBody)[] = [
    'source', 'role', 'income', 'interest', 'motivation', 'readiness',
];

/** Order of rows in the notification email; empty values are skipped. */
const EMAIL_FIELD_ORDER: (keyof LeadBody)[] = [
    'name', 'phone', 'telegram', 'source', 'role', 'income',
    'interest', 'motivation', 'readiness', 'sourcePage',
];

const FIELD_LABELS: Record<keyof LeadBody, string> = {
    name: "Ім'я",
    phone: 'Телефон',
    telegram: 'Telegram',
    source: 'Звідки дізнались',
    role: 'Роль',
    income: 'Середній дохід/міс',
    interest: 'Напрямок в AI',
    motivation: 'Чому менторство',
    readiness: 'Готовність до покупки',
    sourcePage: 'Source page',
};

function escapeHtml(value: string): string {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function readSourcePage(raw: unknown): string {
    if (typeof raw !== 'string') return '';
    const value = raw.trim().slice(0, 2000);
    if (!/^https?:\/\//i.test(value)) return '';
    return value;
}

function buildLeadNotificationHtml(lead: LeadBody): string {
    const rows = EMAIL_FIELD_ORDER.filter((key) => lead[key]).map((key) => {
        const raw = lead[key];
        const cell = key === 'sourcePage'
            ? `<a href="${escapeHtml(raw)}" style="color:#a855f7;word-break:break-all;">${escapeHtml(raw)}</a>`
            : escapeHtml(raw);
        return `
<tr>
  <td style="padding:10px 14px;border-bottom:1px solid #333333;font-family:'Helvetica Neue',Arial,sans-serif;font-size:12px;font-weight:700;text-transform:uppercase;color:#a855f7;white-space:nowrap;vertical-align:top;">
    ${FIELD_LABELS[key]}
  </td>
  <td style="padding:10px 14px;border-bottom:1px solid #333333;font-family:'Helvetica Neue',Arial,sans-serif;font-size:14px;color:#ffffff;line-height:1.5;">
    ${cell}
  </td>
</tr>`;
    }).join('');

    return `
<!DOCTYPE html>
<html lang="uk">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background-color:#000000;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#000000;padding:40px 16px;">
<tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;border:3px solid #ffffff;background-color:#000000;">

<tr><td style="padding:28px 28px 0 28px;">
  <img src="https://holystudio.ai/logo.png" alt="HOLYSTUDIO" height="32" style="height:32px;display:block;" />
</td></tr>

<tr><td style="padding:24px 28px 20px 28px;">
  <h1 style="margin:0;font-family:'Helvetica Neue',Arial,sans-serif;font-size:22px;font-weight:900;text-transform:uppercase;letter-spacing:-0.5px;color:#ffffff;line-height:1.2;">
    Нова заявка на навчання 🔥
  </h1>
</td></tr>

<tr><td style="padding:0 28px 28px 28px;">
  <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #333333;">
    ${rows}
  </table>
</td></tr>

</table>
</td></tr>
</table>
</body>
</html>`.trim();
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
    const { request, env } = context;

    let body: Record<string, unknown>;
    try {
        body = await request.json() as Record<string, unknown>;
    } catch {
        return jsonResponse({ ok: false, error: 'invalid_json' }, 400);
    }

    const lead = {} as LeadBody;
    for (const key of REQUIRED_FIELDS) {
        const value = body[key];
        if (typeof value !== 'string' || !value.trim()) {
            return jsonResponse({ ok: false, error: 'missing_field', field: key }, 400);
        }
        lead[key] = value.trim().slice(0, 2000);
    }
    for (const key of OPTIONAL_FIELDS) {
        const value = body[key];
        lead[key] = typeof value === 'string' ? value.trim().slice(0, 2000) : '';
    }
    lead.sourcePage = readSourcePage(body.sourcePage);

    const submittedAt = new Date().toISOString();

    // Google Sheets via the Apps Script web-app webhook (the sheet stays on the
    // client's account; no service accounts involved).
    const sheetPromise = (async () => {
        if (!env.LEADS_SHEETS_WEBHOOK_URL) return false;
        try {
            const resp = await fetch(env.LEADS_SHEETS_WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...lead, submittedAt }),
            });
            if (!resp.ok) console.error('[Leads] Sheets webhook HTTP', resp.status);
            return resp.ok;
        } catch (err) {
            console.error('[Leads] Sheets webhook failed', err);
            return false;
        }
    })();

    const emailPromise = (async () => {
        const to = env.LEADS_NOTIFY_EMAIL;
        if (!to || !env.RESEND_API_KEY) return false;
        try {
            const resend = new Resend(env.RESEND_API_KEY);
            const { error } = await resend.emails.send({
                from: env.RESEND_FROM,
                to: to.split(',').map((v) => v.trim()).filter(Boolean),
                subject: lead.readiness
                    ? `Нова заявка: ${lead.name} (${lead.readiness})`
                    : `Нова заявка: ${lead.name}`,
                html: buildLeadNotificationHtml(lead),
            });
            if (error) console.error('[Leads] Resend error', error);
            return !error;
        } catch (err) {
            console.error('[Leads] Resend exception', err);
            return false;
        }
    })();

    const [sheetOk, emailOk] = await Promise.all([sheetPromise, emailPromise]);

    // The lead is "accepted" if at least one delivery channel worked — losing a
    // lead entirely is worse than a duplicate follow-up.
    if (!sheetOk && !emailOk) {
        return jsonResponse({ ok: false, error: 'delivery_failed' }, 502);
    }

    // Reported only on success, matching the browser pixel, which fires from
    // the same branch. Runs past the response so it adds no latency.
    const clientEventId = body.eventId;
    context.waitUntil(sendLeadToMeta(request, env, {
        eventId: typeof clientEventId === 'string' && clientEventId
            ? clientEventId
            : crypto.randomUUID(),
        phone: lead.phone,
        contentName: APPLY_CONTENT_NAME,
    }));

    return jsonResponse({
        ok: true,
        channelUrl: env.TELEGRAM_CHANNEL_INVITE_URL || null,
    });
};
