import { Router, Request, Response } from 'express';
import dns from 'dns';
import { promisify } from 'util';

const resolveMx = promisify(dns.resolveMx);

/** Well-known domains that definitely have MX — skip DNS lookup */
const KNOWN_GOOD_DOMAINS = new Set([
    'gmail.com', 'googlemail.com', 'yahoo.com', 'yahoo.co.uk',
    'outlook.com', 'hotmail.com', 'live.com', 'msn.com',
    'icloud.com', 'me.com', 'mac.com',
    'ukr.net', 'i.ua', 'meta.ua', 'bigmir.net',
    'mail.ru', 'yandex.ru', 'yandex.ua', 'rambler.ru', 'list.ru', 'bk.ru', 'inbox.ru',
    'proton.me', 'protonmail.com', 'pm.me',
    'zoho.com', 'aol.com', 'gmx.com', 'gmx.de',
    'fastmail.com', 'tutanota.com', 'tuta.io',
]);

const DISPOSABLE_DOMAINS = new Set([
    'tempmail.com', 'throwaway.email', 'guerrillamail.com', 'mailinator.com',
    'yopmail.com', 'trashmail.com', 'sharklasers.com', 'guerrillamailblock.com',
    'grr.la', 'dispostable.com', 'maildrop.cc', 'temp-mail.org', 'fakeinbox.com',
    'tempail.com', 'mohmal.com', 'getnada.com', 'emailondeck.com', 'burnermail.io',
    'tempr.email', 'discard.email', '10minutemail.com', 'minutemail.com',
    'temp-mail.io', 'tempmailo.com', 'emailfake.com', 'crazymailing.com',
]);

/** MX lookup with timeout — if too slow, assume OK */
function mxCheckWithTimeout(domain: string, timeoutMs = 2000): Promise<boolean> {
    return new Promise((resolve) => {
        const timer = setTimeout(() => resolve(true), timeoutMs);
        resolveMx(domain)
            .then((records) => {
                clearTimeout(timer);
                resolve(records && records.length > 0);
            })
            .catch(() => {
                clearTimeout(timer);
                resolve(false);
            });
    });
}

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

        // Format check
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmed)) {
            res.json({ valid: false, reason: 'format' });
            return;
        }

        const domain = trimmed.split('@')[1];

        // Disposable check
        if (DISPOSABLE_DOMAINS.has(domain)) {
            res.json({ valid: false, reason: 'disposable' });
            return;
        }

        // Known good domain → instant response, no DNS lookup
        if (KNOWN_GOOD_DOMAINS.has(domain)) {
            res.json({ valid: true });
            return;
        }

        // Unknown domain → MX check with 2s timeout
        const hasMx = await mxCheckWithTimeout(domain, 2000);
        if (!hasMx) {
            res.json({ valid: false, reason: 'no_mx' });
            return;
        }

        res.json({ valid: true });
    } catch (err) {
        console.error('[validate-email] Error:', err);
        // On any error, let the user through — don't block payment
        res.json({ valid: true });
    }
});

export default router;

