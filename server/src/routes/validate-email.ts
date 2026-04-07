import { Router, Request, Response } from 'express';
import dns from 'dns';
import { promisify } from 'util';

const resolveMx = promisify(dns.resolveMx);

const DISPOSABLE_DOMAINS = new Set([
    'tempmail.com', 'throwaway.email', 'guerrillamail.com', 'mailinator.com',
    'yopmail.com', 'trashmail.com', 'sharklasers.com', 'guerrillamailblock.com',
    'grr.la', 'dispostable.com', 'maildrop.cc', 'temp-mail.org', 'fakeinbox.com',
    'tempail.com', 'mohmal.com', 'getnada.com', 'emailondeck.com', 'burnermail.io',
    'tempr.email', 'discard.email', '10minutemail.com', 'minutemail.com',
    'temp-mail.io', 'tempmailo.com', 'emailfake.com', 'crazymailing.com',
]);

const router = Router();

/**
 * POST /api/validate-email
 */
router.post('/', async (req: Request, res: Response) => {
    try {
        const { email } = req.body || {};

        if (!email || typeof email !== 'string') {
            res.status(400).json({ valid: false, reason: 'missing' });
            return;
        }

        const trimmed = email.trim().toLowerCase();

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmed)) {
            res.json({ valid: false, reason: 'format' });
            return;
        }

        const domain = trimmed.split('@')[1];

        if (DISPOSABLE_DOMAINS.has(domain)) {
            res.json({ valid: false, reason: 'disposable' });
            return;
        }

        try {
            const records = await resolveMx(domain);
            if (!records || records.length === 0) {
                res.json({ valid: false, reason: 'no_mx' });
                return;
            }
        } catch {
            res.json({ valid: false, reason: 'no_mx' });
            return;
        }

        res.json({ valid: true });
    } catch (err) {
        console.error('[validate-email] Error:', err);
        res.status(500).json({ valid: false, reason: 'server_error' });
    }
});

export default router;

