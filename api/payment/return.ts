import type { VercelRequest, VercelResponse } from '@vercel/node';

const SITE_URL = process.env.SITE_URL || 'https://holystudio.ai';

/**
 * WayForPay POSTs here after payment.
 * We simply redirect to the SPA return page (GET) with token + ref from query params.
 * All payment verification happens via /api/payment/status called by the SPA.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Token and ref are in the query string (set during order creation)
    const token = String(req.query.token || '').trim();
    const ref = String(req.query.ref || '').trim();

    const params = new URLSearchParams();
    if (token) params.set('token', token);
    if (ref) params.set('ref', ref);

    const redirectUrl = `${SITE_URL}/return-page${params.toString() ? '?' + params.toString() : ''}`;

    return res.redirect(302, redirectUrl);
}

