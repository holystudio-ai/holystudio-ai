import { Router, Request, Response } from 'express';
import { getDb } from '../../lib/db.js';

const router = Router();

/**
 * POST /api/bot/verify-email
 * Body: { "email": "user@example.com" }
 *
 * Response: { "paid": 1 } or { "paid": 0 }
 */
router.post('/', async (req: Request, res: Response) => {
    try {
        const rawEmail = req.body?.email;

        if (!rawEmail || typeof rawEmail !== 'string' || !rawEmail.trim()) {
            return res.json({ paid: 0 });
        }

        const email = rawEmail.trim().toLowerCase();
        const db = await getDb();
        const user = await db.collection('users').findOne({ email });

        if (!user || user.emailVerifiedAt || user.status !== 'paid') {
            return res.json({ paid: 0 });
        }

        // Mark as verified (one-time)
        await db.collection('users').updateOne(
            { _id: user._id },
            { $set: { emailVerifiedAt: new Date(), updatedAt: new Date() } }
        );

        console.log(`[bot/verify-email] Verified: ${email}`);
        return res.json({ paid: 1 });
    } catch (err) {
        console.error('[bot/verify-email] Error:', err);
        return res.json({ paid: 0 });
    }
});

export default router;

