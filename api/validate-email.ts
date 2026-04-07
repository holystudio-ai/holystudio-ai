import type { VercelRequest, VercelResponse } from '@vercel/node';
import dns from 'dns';
import { promisify } from 'util';

const resolveMx = promisify(dns.resolveMx);

// Common disposable / temp email domains
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
        const records = await resolveMx(domain);
        return Array.isArray(records) && records.length > 0;
    } catch {
        return false;
    }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { email } = req.body ?? {};

        if (!email || typeof email !== 'string') {
            return res.status(400).json({ valid: false, reason: 'missing' });
        }

        const trimmed = email.trim().toLowerCase();

        // Basic format check
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmed)) {
            return res.status(200).json({ valid: false, reason: 'format' });
        }

        const domain = trimmed.split('@')[1];

        // Block disposable emails
        if (DISPOSABLE_DOMAINS.has(domain)) {
            return res.status(200).json({ valid: false, reason: 'disposable' });
        }

        // Check MX records — does this domain actually receive email?
        const hasMx = await hasMxRecords(domain);
        if (!hasMx) {
            return res.status(200).json({ valid: false, reason: 'no_mx' });
        }

        return res.status(200).json({ valid: true });
    } catch (err) {
        console.error('[validate-email] Error:', err);
        return res.status(500).json({ valid: false, reason: 'server_error' });
    }
}

