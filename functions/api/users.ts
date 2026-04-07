import { Env, jsonResponse } from './_lib/types';
import { getDb } from './_lib/db';

function getClientIp(request: Request): string | null {
    const forwarded = request.headers.get('x-forwarded-for');
    if (forwarded) return forwarded.split(',')[0].trim();
    const realIp = request.headers.get('x-real-ip');
    if (realIp) return realIp;
    return request.headers.get('cf-connecting-ip') || null;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
    const { request, env } = context;

    try {
        const body = await request.json().catch(() => ({})) as Record<string, any>;
        const { email, clientMeta } = body;

        if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return jsonResponse({ error: 'Invalid email' }, 400);
        }

        const normalizedEmail = email.trim().toLowerCase();
        const ip = getClientIp(request);
        const db = await getDb(env.MONGODB_URI);
        const users = db.collection('users');

        const existing = await users.findOne({ email: normalizedEmail });

        if (existing && existing.status === 'paid') {
            return jsonResponse({ ok: true, status: 'already_paid' });
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

        return jsonResponse({ ok: true, status: 'pending' });
    } catch (err) {
        console.error('[/api/users] Error:', err);
        return jsonResponse({ error: 'Internal server error' }, 500);
    }
};

