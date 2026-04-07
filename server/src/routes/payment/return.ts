import { Router, Request, Response } from 'express';
import { config } from '../../config.js';

const router = Router();

/**
 * ALL /api/payment/return — WayForPay redirects here, we redirect to SPA.
 */
router.all('/', (req: Request, res: Response) => {
    const SITE_URL = config.SITE_URL;

    const token = ((req.query.token as string) || '').trim();
    const ref = ((req.query.ref as string) || '').trim();

    const params = new URLSearchParams();
    if (token) params.set('token', token);
    if (ref) params.set('ref', ref);

    const redirectUrl = `${SITE_URL}/return-page${params.toString() ? '?' + params.toString() : ''}`;
    res.redirect(302, redirectUrl);
});

export default router;

