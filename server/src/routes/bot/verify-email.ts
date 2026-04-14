import { Router, Request, Response } from 'express';
import { getDb } from '../../lib/db.js';

const router = Router();

/**
 * POST /api/bot/verify-email
 * Body: { "email": "user@example.com" }
 *
 * Response:
 *   { "success": true,  "paid": true,  "email": "user@example.com" }
 *   { "success": true,  "paid": false, "email": "user@example.com", "reason": "not_paid" }
 *   { "success": false, "paid": false, "email": "user@example.com", "reason": "already_verified" }
 *   { "success": false, "paid": false, "reason": "missing_email" }
 *   { "success": false, "paid": false, "reason": "user_not_found" }
 */
router.post('/', async (req: Request, res: Response) => {
    try {
        const rawEmail = req.body?.email;

        if (!rawEmail || typeof rawEmail !== 'string' || !rawEmail.trim()) {
            return res.status(400).json({
                success: false,
                paid: false,
                reason: 'missing_email',
            });
        }

        const email = rawEmail.trim().toLowerCase();
        const db = await getDb();
        const user = await db.collection('users').findOne({ email });

        if (!user) {
            return res.status(200).json({
                success: false,
                paid: false,
                email,
                reason: 'user_not_found',
            });
        }

        // One-time check: if already verified — reject
        if (user.emailVerifiedAt) {
            return res.status(200).json({
                success: false,
                paid: false,
                email,
                reason: 'already_verified',
            });
        }

        const isPaid = user.status === 'paid';

        // Mark as verified only if paid
        if (isPaid) {
            await db.collection('users').updateOne(
                { _id: user._id },
                {
                    $set: {
                        emailVerifiedAt: new Date(),
                        updatedAt: new Date(),
                    },
                }
            );
            console.log(`[bot/verify-email] Email verified (one-time) for: ${email}`);
        }

        return res.status(200).json({
            success: isPaid,
            paid: isPaid,
            email,
            ...(!isPaid && { reason: 'not_paid' }),
        });
    } catch (err) {
        console.error('[bot/verify-email] Error:', err);
        return res.status(500).json({
            success: false,
            paid: false,
            reason: 'server_error',
        });
    }
});

export default router;

