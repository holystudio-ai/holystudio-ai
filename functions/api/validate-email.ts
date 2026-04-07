import { Env, jsonResponse } from './_lib/types';

const DISPOSABLE_DOMAINS = new Set([
    'tempmail.com', 'throwaway.email', 'guerrillamail.com', 'mailinator.com',
    'yopmail.com', 'trashmail.com', 'sharklasers.com', 'guerrillamailblock.com',
    'grr.la', 'dispostable.com', 'maildrop.cc', 'temp-mail.org', 'fakeinbox.com',
    'tempail.com', 'mohmal.com', 'getnada.com', 'emailondeck.com', 'burnermail.io',
    'tempr.email', 'discard.email', '10minutemail.com', 'minutemail.com',
    'temp-mail.io', 'tempmailo.com', 'emailfake.com', 'crazymailing.com',
]);

async function hasMxRecords(domain: string): Promise<boolean> {
    try {
        // Use Cloudflare DNS-over-HTTPS instead of Node.js dns module
        const resp = await fetch(
            `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}&type=MX`,
            { headers: { Accept: 'application/dns-json' } }
        );
        const data: any = await resp.json();
        return Array.isArray(data.Answer) && data.Answer.length > 0;
    } catch {
        return false;
    }
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
    const { request } = context;

    try {
        const body = await request.json().catch(() => ({})) as Record<string, any>;
        const { email } = body;

        if (!email || typeof email !== 'string') {
            return jsonResponse({ valid: false, reason: 'missing' }, 400);
        }

        const trimmed = email.trim().toLowerCase();

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmed)) {
            return jsonResponse({ valid: false, reason: 'format' });
        }

        const domain = trimmed.split('@')[1];

        if (DISPOSABLE_DOMAINS.has(domain)) {
            return jsonResponse({ valid: false, reason: 'disposable' });
        }

        const hasMx = await hasMxRecords(domain);
        if (!hasMx) {
            return jsonResponse({ valid: false, reason: 'no_mx' });
        }

        return jsonResponse({ valid: true });
    } catch (err) {
        console.error('[validate-email] Error:', err);
        return jsonResponse({ valid: false, reason: 'server_error' }, 500);
    }
};

