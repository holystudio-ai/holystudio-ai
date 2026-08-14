/**
 * Meta Conversions API — the server-side copy of the browser pixel events.
 *
 * Ad blockers and iOS tracking prevention swallow a noticeable share of the
 * browser `fbq` calls, so every conversion is reported twice: once from the
 * page and once from here. Both copies carry the same `event_id`, which is how
 * Meta collapses them into a single conversion instead of counting two.
 */

import { Env } from './types';

const GRAPH_API_VERSION = 'v21.0';

/** Same dataset the pixel in index.html initialises with. */
const DEFAULT_DATASET_ID = '1743358290241901';

export interface MetaLeadEvent {
    /** Must match the `eventID` the browser passed to fbq. */
    eventId: string;
    phone: string;
    contentName: string;
}

export async function sendLeadToMeta(
    request: Request,
    env: Env,
    event: MetaLeadEvent,
): Promise<void> {
    const accessToken = env.META_CAPI_ACCESS_TOKEN;
    if (!accessToken) return;

    const datasetId = env.META_DATASET_ID || DEFAULT_DATASET_ID;
    const cookies = request.headers.get('cookie');

    // Meta only accepts personal data hashed; everything else goes as-is.
    const userData: Record<string, unknown> = {
        ph: [await sha256(normalisePhone(event.phone))],
    };

    // The two pixel cookies are what actually ties the lead back to the ad
    // click, so they matter more than any hashed field here.
    const fbp = readCookie(cookies, '_fbp');
    const fbc = readCookie(cookies, '_fbc');
    if (fbp) userData.fbp = fbp;
    if (fbc) userData.fbc = fbc;

    const ip = request.headers.get('cf-connecting-ip');
    const userAgent = request.headers.get('user-agent');
    if (ip) userData.client_ip_address = ip;
    if (userAgent) userData.client_user_agent = userAgent;

    const payload: Record<string, unknown> = {
        data: [{
            event_name: 'Lead',
            event_time: Math.floor(Date.now() / 1000),
            event_id: event.eventId,
            event_source_url: request.headers.get('referer') || env.SITE_URL,
            action_source: 'website',
            user_data: userData,
            custom_data: {
                content_name: event.contentName,
                content_category: 'apply',
            },
        }],
    };

    if (env.META_TEST_EVENT_CODE) {
        payload.test_event_code = env.META_TEST_EVENT_CODE;
    }

    try {
        const resp = await fetch(
            `https://graph.facebook.com/${GRAPH_API_VERSION}/${datasetId}/events?access_token=${encodeURIComponent(accessToken)}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            },
        );
        if (!resp.ok) {
            console.error('[MetaCAPI] HTTP', resp.status, await resp.text());
        }
    } catch (err) {
        console.error('[MetaCAPI] request failed', err);
    }
}

async function sha256(value: string): Promise<string> {
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
    return Array.from(new Uint8Array(digest))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
}

/**
 * Meta wants digits only, country code included — anything else simply fails to
 * match. The form is Ukraine-facing and its placeholder asks for +380…, so a
 * locally written number is widened to the Ukrainian country code.
 */
function normalisePhone(raw: string): string {
    const digits = raw.replace(/\D/g, '');
    if (digits.length === 10 && digits.startsWith('0')) return `38${digits}`;
    if (digits.length === 9) return `380${digits}`;
    return digits;
}

function readCookie(header: string | null, name: string): string | undefined {
    if (!header) return undefined;
    for (const part of header.split(';')) {
        const eq = part.indexOf('=');
        if (eq === -1) continue;
        if (part.slice(0, eq).trim() === name) {
            return decodeURIComponent(part.slice(eq + 1).trim());
        }
    }
    return undefined;
}
