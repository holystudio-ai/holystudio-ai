import { Router, Request, Response } from 'express';
import { config } from '../../config.js';
import { hmacMd5, randomBytes, generateBotToken } from '../../lib/crypto.js';
import { getDb } from '../../lib/db.js';

const MERCHANT_DOMAIN = 'holystudio.ai';
const PRODUCT_NAME = 'AI Інтенсив HOLYSTUDIO';
const CURRENCY = 'UAH';

function generateOrderReference(): string {
    const ts = Date.now();
    const rand = randomBytes(4);
    return `HOLY-${ts}-${rand}`;
}

const router = Router();

/**
 * POST /api/payment/create
 *
 * If { updateOnly: true, email, orderReference } — updates an existing prepared order with the email.
 * Otherwise creates a full new order with form fields.
 */
router.post('/', async (req: Request, res: Response) => {
    try {
        const { email, orderReference, updateOnly } = req.body || {};

        if (!email || typeof email !== 'string') {
            res.status(400).json({ error: 'Email is required' });
            return;
        }

        const normalizedEmail = email.trim().toLowerCase();
        const db = await getDb();

        // Fast path: just update the prepared order with the email + generate bot token
        if (updateOnly && orderReference) {
            const existingOrder = await db.collection('orders').findOne({ orderReference });
            const botAccessToken = existingOrder?.botAccessToken || generateBotToken();

            await db.collection('orders').updateOne(
                { orderReference },
                { $set: { email: normalizedEmail, botAccessToken, updatedAt: new Date() } }
            );

            await db.collection('users').updateOne(
                { email: normalizedEmail },
                { $set: { botAccessToken, updatedAt: new Date() } },
            );

            res.json({ ok: true });
            return;
        }

        const MERCHANT_LOGIN = config.WFP_MERCHANT_LOGIN;
        const MERCHANT_SECRET = config.WFP_MERCHANT_SECRET;
        const SITE_URL = config.SITE_URL;
        const API_URL = config.API_URL;
        const PRODUCT_PRICE = config.COURSE_PRICE_UAH;

        const newOrderReference = generateOrderReference();
        const orderDate = Math.floor(Date.now() / 1000);

        const token = randomBytes(32);

        // returnUrl points to THIS server — it will redirect to the frontend SPA
        const returnUrl = `${API_URL}/api/payment/return?token=${token}&ref=${encodeURIComponent(newOrderReference)}`;

        const signatureData = [
            MERCHANT_LOGIN, MERCHANT_DOMAIN, newOrderReference, orderDate,
            PRODUCT_PRICE, CURRENCY, PRODUCT_NAME, 1, PRODUCT_PRICE,
        ].join(';');

        const merchantSignature = hmacMd5(signatureData, MERCHANT_SECRET);

        const formFields: Record<string, string> = {
            merchantAccount: MERCHANT_LOGIN,
            merchantDomainName: MERCHANT_DOMAIN,
            merchantSignature,
            orderReference: newOrderReference,
            orderDate: String(orderDate),
            amount: String(PRODUCT_PRICE),
            currency: CURRENCY,
            productName: PRODUCT_NAME,
            productCount: '1',
            productPrice: String(PRODUCT_PRICE),
            clientEmail: normalizedEmail,
            returnUrl,
            serviceUrl: `${API_URL}/api/payment/service`,
            defaultPaymentSystem: 'card',
            orderTimeout: '900',
        };

        const botAccessToken = generateBotToken();

        await db.collection('orders').insertOne({
            orderReference: newOrderReference,
            token,
            email: normalizedEmail,
            amount: PRODUCT_PRICE,
            currency: CURRENCY,
            status: 'created',
            botAccessToken,
            botAccessTokenUsedAt: null,
            createdAt: new Date(),
        });

        await db.collection('users').updateOne(
            { email: normalizedEmail },
            { $set: { botAccessToken, updatedAt: new Date() } },
        );

        res.json({ ok: true, formFields });
    } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error('[payment/create] Error:', msg, err);
        res.status(500).json({ error: 'Internal server error', debug: msg });
    }
});

export default router;

