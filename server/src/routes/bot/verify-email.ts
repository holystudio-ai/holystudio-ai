import { Router, Request, Response } from 'express';
import { getDb } from '../../lib/db.js';

const router = Router();

/**
 * POST /api/bot/verify-email
 * Body: { "email": "user@example.com" }
 *
 * Response:
 *   { "paid": 2 } — free access
 *   { "paid": 1 } — paid & verified (or multi-use)
 *   { "paid": 0 } — not paid or already used (single-use)
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

        if (!user || user.status !== 'paid') {
            return res.json({ paid: 0 });
        }

        // Free access → always return 2
        if (user.accessType === 'free') {
            console.log(`[bot/verify-email] Free access: ${email}`);
            return res.json({ paid: 2 });
        }

        // Multi-use email check → always return 1
        if (user.emailCheckType === 'multi') {
            console.log(`[bot/verify-email] Multi-use verified: ${email}`);
            return res.json({ paid: 1 });
        }

        // Single-use (default): check if already verified
        if (user.emailVerifiedAt) {
            console.log(`[bot/verify-email] Already used (single): ${email}`);
            return res.json({ paid: 0 });
        }

        // Mark as verified (one-time)
        await db.collection('users').updateOne(
            { _id: user._id },
            { $set: { emailVerifiedAt: new Date(), updatedAt: new Date() } }
        );

        console.log(`[bot/verify-email] Verified (single): ${email}`);
        return res.json({ paid: 1 });
    } catch (err) {
        console.error('[bot/verify-email] Error:', err);
        return res.json({ paid: 0 });
    }
});

export default router;
