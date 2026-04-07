import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb } from '../_lib/db';
import { sendReminderEmail } from '../_lib/email';

const REMINDER_DELAY_MS = 30 * 60 * 1000; // 30 minutes after signup

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Secure with CRON_SECRET
    const secret = req.query.secret || req.headers['x-cron-secret'];
    if (process.env.CRON_SECRET && secret !== process.env.CRON_SECRET) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const db = await getDb();
        const users = db.collection('users');

        const cutoff = new Date(Date.now() - REMINDER_DELAY_MS);

        // Find pending users created >30 min ago who haven't received a reminder
        const unpaidUsers = await users
            .find({
                status: 'pending',
                reminderSentAt: null,
                createdAt: { $lte: cutoff },
            })
            .limit(50) // batch limit per run
            .toArray();

        console.log(`[Cron] Found ${unpaidUsers.length} unpaid users to remind`);

        let sent = 0;
        let failed = 0;

        for (const user of unpaidUsers) {
            const ok = await sendReminderEmail(user.email);

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

        return res.status(200).json({
            ok: true,
            found: unpaidUsers.length,
            sent,
            failed,
        });
    } catch (err) {
        console.error('[Cron] Error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

