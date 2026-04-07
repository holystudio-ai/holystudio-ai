import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb } from './_lib/db';

/**
 * Extract the client IP from Vercel / proxy headers.
 */
function getClientIp(req: VercelRequest): string | null {
    // Vercel sets this automatically
    const forwarded = req.headers['x-forwarded-for'];
    if (forwarded) {
        const first = Array.isArray(forwarded) ? forwarded[0] : forwarded.split(',')[0];
        return first.trim();
    }
    const realIp = req.headers['x-real-ip'];
    if (realIp) {
        return Array.isArray(realIp) ? realIp[0] : realIp;
    }
    return req.socket?.remoteAddress || null;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { email, clientMeta } = req.body ?? {};

        if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ error: 'Invalid email' });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const ip = getClientIp(req);
        const db = await getDb();
        const users = db.collection('users');

        // Upsert: if email exists with "pending", update timestamp + meta; if "paid", leave as is
        const existing = await users.findOne({ email: normalizedEmail });

        if (existing && existing.status === 'paid') {
            return res.status(200).json({ ok: true, status: 'already_paid' });
        }

        // Device / browser metadata sent from the client
        const meta = clientMeta && typeof clientMeta === 'object' ? clientMeta : {};

        if (existing) {
            await users.updateOne(
                { email: normalizedEmail },
                {
                    $set: {
                        updatedAt: new Date(),
                        ip,
                        ...meta,
                    },
                }
            );
        } else {
            await users.insertOne({
                email: normalizedEmail,
                status: 'pending',
                ip,
                // Client-collected metadata
                userAgent: meta.userAgent || null,
                language: meta.language || null,
                languages: meta.languages || null,
                platform: meta.platform || null,
                vendor: meta.vendor || null,
                cookiesEnabled: meta.cookiesEnabled ?? null,
                doNotTrack: meta.doNotTrack || null,
                screenWidth: meta.screenWidth || null,
                screenHeight: meta.screenHeight || null,
                viewportWidth: meta.viewportWidth || null,
                viewportHeight: meta.viewportHeight || null,
                devicePixelRatio: meta.devicePixelRatio || null,
                colorDepth: meta.colorDepth || null,
                timezone: meta.timezone || null,
                timezoneOffset: meta.timezoneOffset ?? null,
                referrer: meta.referrer || null,
                currentUrl: meta.currentUrl || null,
                deviceMemory: meta.deviceMemory || null,
                hardwareConcurrency: meta.hardwareConcurrency || null,
                maxTouchPoints: meta.maxTouchPoints ?? null,
                connectionType: meta.connectionType || null,
                connectionDownlink: meta.connectionDownlink || null,
                // Timestamps
                createdAt: new Date(),
                updatedAt: new Date(),
                paidAt: null,
                reminderSentAt: null,
            });
        }

        return res.status(200).json({ ok: true, status: 'pending' });
    } catch (err) {
        console.error('[/api/users] Error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

