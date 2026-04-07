import { Env, jsonResponse } from '../_lib/types';
import { getDb } from '../_lib/db';
import { sendReminderEmail } from '../_lib/email';

const REMINDER_DELAY_MS = 30 * 60 * 1000; // 30 minutes

export const onRequestGet: PagesFunction<Env> = async (context) => {
    const { request, env } = context;

    const url = new URL(request.url);
    const secret = url.searchParams.get('secret') || request.headers.get('x-cron-secret');

    if (env.CRON_SECRET && secret !== env.CRON_SECRET) {
        return jsonResponse({ error: 'Unauthorized' }, 401);
    }

    try {
        const db = await getDb(env.MONGODB_URI);
        const users = db.collection('users');

        const cutoff = new Date(Date.now() - REMINDER_DELAY_MS);

        const unpaidUsers = await users
            .find({
                status: 'pending',
                reminderSentAt: null,
                createdAt: { $lte: cutoff },
            })
            .limit(50)
            .toArray();

        console.log(`[Cron] Found ${unpaidUsers.length} unpaid users to remind`);

        let sent = 0;
        let failed = 0;

        for (const user of unpaidUsers) {
            const ok = await sendReminderEmail(user.email, env);
            if (ok) {
                await users.updateOne(
                    { _id: user._id },
                    { $set: { reminderSentAt: new Date(), updatedAt: new Date() } }
                );
                sent++;
            } else {
                failed++;
            }
        }

        console.log(`[Cron] Done. Sent: ${sent}, Failed: ${failed}`);

        return jsonResponse({ ok: true, found: unpaidUsers.length, sent, failed });
    } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error('[Cron] Error:', msg, err);
        return jsonResponse({ error: 'Internal server error', debug: msg }, 500);
    }
};

