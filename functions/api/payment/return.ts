import { Env } from '../_lib/types';

/**
 * WayForPay POSTs here after payment.
 * We simply redirect to the SPA return page (GET) with token + ref from query params.
 * All payment verification happens via /api/payment/status called by the SPA.
 */
export const onRequest: PagesFunction<Env> = async (context) => {
    const { request, env } = context;
    const SITE_URL = (env.SITE_URL || 'https://holystudio.ai').replace(/\/+$/, '');

    const url = new URL(request.url);
    const token = (url.searchParams.get('token') || '').trim();
    const ref = (url.searchParams.get('ref') || '').trim();

    const params = new URLSearchParams();
    if (token) params.set('token', token);
    if (ref) params.set('ref', ref);

    const redirectUrl = `${SITE_URL}/return-page${params.toString() ? '?' + params.toString() : ''}`;

    return Response.redirect(redirectUrl, 302);
};

