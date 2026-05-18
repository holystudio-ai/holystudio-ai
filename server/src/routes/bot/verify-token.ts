import { Router, Request, Response } from 'express';
import { config } from '../../config.js';
import { getDb } from '../../lib/db.js';

const router = Router();

const DEV_TEST_TOKEN = config.DEV_TEST_TOKEN;
const DEV_TEST_EMAIL = config.DEV_TEST_EMAIL;
const DEV_TEST_ORDER = config.DEV_TEST_ORDER;

router.get('/', async (req: Request, res: Response) => {
    try {
        const tokenValue = typeof req.query.token === 'string' ? req.query.token : undefined;
        return await verify(tokenValue, res);
    } catch (err) {
        console.error('[bot/verify-token] Error:', err);
        return res.status(500).json({ paid_status: 0, valid: false, reason: 'server_error' });
    }
});

router.post('/', async (req: Request, res: Response) => {
    try {
        const tokenValue = req.body?.token;
        return await verify(tokenValue, res);
    } catch (err) {
        console.error('[bot/verify-token] Error:', err);
        return res.status(500).json({ paid_status: 0, valid: false, reason: 'server_error' });
    }
});

async function verify(tokenValue: string | undefined, res: Response) {
    if (!tokenValue || typeof tokenValue !== 'string') {
        return res.status(400).json({ paid_status: 0, valid: false, reason: 'missing_token' });
    }

    const trimmedToken = tokenValue.trim();

    if (trimmedToken === DEV_TEST_TOKEN) {
        console.log('[bot/verify-token] DEV TEST TOKEN used (reusable)');
        return res.status(200).json({
            paid_status: 1,
            valid: true,
            email: DEV_TEST_EMAIL,
            orderReference: DEV_TEST_ORDER,
            _dev: true,
        });
    }

    const db = await getDb();

    // Check orders collection first (paid users)
    const order = await db.collection('orders').findOne({ botAccessToken: trimmedToken });

    if (order) {
        if (order.botAccessTokenUsedAt) {
            return res.status(200).json({ paid_status: 0, valid: false, reason: 'already_used' });
        }
        if (order.status !== 'paid') {
            return res.status(200).json({ paid_status: 0, valid: false, reason: 'not_paid' });
        }

        // Check if the user has multi-use token
        const user = order.email ? await db.collection('users').findOne({ email: order.email }) : null;
        const isMultiUse = user?.emailCheckType === 'multi';

        if (!isMultiUse) {
            await db.collection('orders').updateOne(
                { _id: order._id },
                { $set: { botAccessTokenUsedAt: new Date(), updatedAt: new Date() } }
            );
        }

        console.log(`[bot/verify-token] Token used for order ${order.orderReference}, email: ${order.email}, multiUse: ${isMultiUse}`);

        return res.status(200).json({
            paid_status: 1,
            valid: true,
            email: order.email || null,
            orderReference: order.orderReference,
        });
    }

    // Check users collection (admin-created users with direct tokens)
    const user = await db.collection('users').findOne({ botAccessToken: trimmedToken });

    if (!user) {
        return res.status(200).json({ paid_status: 0, valid: false, reason: 'not_found' });
    }

    if (user.status !== 'paid') {
        return res.status(200).json({ paid_status: 0, valid: false, reason: 'not_paid' });
    }

    if (user.botAccessTokenUsedAt && user.emailCheckType !== 'multi') {
        return res.status(200).json({ paid_status: 0, valid: false, reason: 'already_used' });
    }

    const isMultiUse = user.emailCheckType === 'multi';

    if (!isMultiUse) {
        await db.collection('users').updateOne(
            { _id: user._id },
            { $set: { botAccessTokenUsedAt: new Date(), updatedAt: new Date() } }
        );
    }

    console.log(`[bot/verify-token] Token used for user ${user.email}, multiUse: ${isMultiUse}`);

    return res.status(200).json({
        paid_status: 1,
        valid: true,
        email: user.email || null,
        orderReference: user.orderReference || null,
    });
}

export default router;
