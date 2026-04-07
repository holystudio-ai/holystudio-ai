import { Router, Request, Response } from 'express';
import { getDb } from '../lib/db.js';

const router = Router();

/**
 * POST /api/users — save user email + metadata.
 */
router.post('/', async (req: Request, res: Response) => {
    try {
        const { email, clientMeta } = req.body || {};

        if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            res.status(400).json({ error: 'Invalid email' });
            return;
        }

        const normalizedEmail = email.trim().toLowerCase();
        const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim()
            || (req.headers['x-real-ip'] as string)
            || req.ip
            || null;

        const db = await getDb();
        const users = db.collection('users');
        const existing = await users.findOne({ email: normalizedEmail });

        if (existing && existing.status === 'paid') {
            res.json({ ok: true, status: 'already_paid' });
            return;
        }

        const meta = clientMeta && typeof clientMeta === 'object' ? clientMeta : {};

        if (existing) {
            await users.updateOne(
                { email: normalizedEmail },
                { $set: { updatedAt: new Date(), ip, ...meta } }
            );
        } else {
            await users.insertOne({
                email: normalizedEmail,
                status: 'pending',
                ip,
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
                createdAt: new Date(),
                updatedAt: new Date(),
                paidAt: null,
                reminderSentAt: null,
            });
        }

        res.json({ ok: true, status: 'pending' });
    } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error('[/api/users] Error:', msg, err);
        res.status(500).json({ error: 'Internal server error', debug: msg });
    }
});

export default router;

