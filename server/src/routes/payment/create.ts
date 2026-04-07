import { Router, Request, Response } from 'express';
import { config } from '../../config.js';
import { hmacMd5, randomBytes } from '../../lib/crypto.js';
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
 */
router.post('/', async (req: Request, res: Response) => {
    try {
        const { email } = req.body || {};

        if (!email || typeof email !== 'string') {
            res.status(400).json({ error: 'Email is required' });
            return;
        }

        const MERCHANT_LOGIN = config.WFP_MERCHANT_LOGIN;
        const MERCHANT_SECRET = config.WFP_MERCHANT_SECRET;
        const SITE_URL = config.SITE_URL;
        const API_URL = config.API_URL;
        const PRODUCT_PRICE = config.COURSE_PRICE_UAH;

        const normalizedEmail = email.trim().toLowerCase();
        const orderReference = generateOrderReference();
        const orderDate = Math.floor(Date.now() / 1000);

        const token = randomBytes(32);

        // returnUrl points to THIS server — it will redirect to the frontend SPA
        const returnUrl = `${API_URL}/api/payment/return?token=${token}&ref=${encodeURIComponent(orderReference)}`;

        const signatureData = [
            MERCHANT_LOGIN, MERCHANT_DOMAIN, orderReference, orderDate,
            PRODUCT_PRICE, CURRENCY, PRODUCT_NAME, 1, PRODUCT_PRICE,
        ].join(';');

        const merchantSignature = hmacMd5(signatureData, MERCHANT_SECRET);

        const formFields: Record<string, string> = {
            merchantAccount: MERCHANT_LOGIN,
            merchantDomainName: MERCHANT_DOMAIN,
            merchantSignature,
            orderReference,
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

        const db = await getDb();
        await db.collection('orders').insertOne({
            orderReference,
            token,
            email: normalizedEmail,
            amount: PRODUCT_PRICE,
            currency: CURRENCY,
            status: 'created',
            createdAt: new Date(),
        });

        res.json({ ok: true, formFields });
    } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error('[payment/create] Error:', msg, err);
        res.status(500).json({ error: 'Internal server error', debug: msg });
    }
});

export default router;

