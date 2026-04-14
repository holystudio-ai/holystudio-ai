import { Router, Request, Response } from 'express';
import { getDb } from '../../lib/db.js';

const router = Router();

/**
 * GET  /api/bot/verify-email?email=user@example.com
 * POST /api/bot/verify-email  { "email": "user@example.com" }
 *
 * Returns { paid: true/false } based on user payment status.
 * One-time verification: after the first successful check the email
 * is marked as verified and subsequent attempts return already_verified.
 */
router.get('/', async (req: Request, res: Response) => {
    const email = typeof req.query.email === 'string' ? req.query.email : '';
    return verify(email, res);
});

router.post('/', async (req: Request, res: Response) => {
    const email = req.body?.email ?? req.query?.email ?? '';
    return verify(typeof email === 'string' ? email : '', res);
});

async function verify(rawEmail: string, res: Response) {
    try {
        const email = rawEmail.trim().toLowerCase();

        if (!email) {
            return res.status(400).json({ paid: false, reason: 'missing_email' });
        }

        const db = await getDb();
        const user = await db.collection('users').findOne({ email });

        if (!user) {
            return res.status(200).json({ paid: false });
        }

        // If this email was already verified once — reject
        if (user.emailVerifiedAt) {
            return res.status(200).json({ paid: false, reason: 'already_verified' });
        }

        const isPaid = user.status === 'paid';

        // Mark email as verified (one-time) — only if user has paid
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

        return res.status(200).json({ paid: isPaid });
    } catch (err) {
        console.error('[bot/verify-email] Error:', err);
        return res.status(500).json({ paid: false, reason: 'server_error' });
    }
}

export default router;

