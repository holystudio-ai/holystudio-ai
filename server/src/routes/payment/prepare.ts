import { Router, Request, Response } from 'express';
import { config } from '../../config.js';
import { hmacMd5, randomBytes } from '../../lib/crypto.js';
import { getDb } from '../../lib/db.js';

const MERCHANT_DOMAIN = config.MERCHANT_DOMAIN;
const PRODUCT_NAME = config.PRODUCT_NAME;
const CURRENCY = config.CURRENCY;

function generateOrderReference(): string {
    const ts = Date.now();
    const rand = randomBytes(4);
    return `HOLY-${ts}-${rand}`;
}

const router = Router();

/**
 * POST /api/payment/prepare
 *
 * Pre-generates WayForPay form fields WITHOUT email.
 * Frontend caches this on page load, then adds clientEmail on submit → instant redirect.
 */
router.post('/', async (req: Request, res: Response) => {
    try {
        const MERCHANT_LOGIN = config.WFP_MERCHANT_LOGIN;
        const MERCHANT_SECRET = config.WFP_MERCHANT_SECRET;
        const API_URL = config.API_URL;
        const PRODUCT_PRICE = config.COURSE_PRICE_UAH;

        const orderReference = generateOrderReference();
        const orderDate = Math.floor(Date.now() / 1000);
        const token = randomBytes(32);

        const returnUrl = config.WFP_RETURN_URL;

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
            returnUrl,
            serviceUrl: `${API_URL}/api/payment/service`,
            defaultPaymentSystem: 'card',
            orderTimeout: '900',
        };

        const db = await getDb();
        await db.collection('orders').insertOne({
            orderReference,
            token,
            email: null,
            amount: PRODUCT_PRICE,
            currency: CURRENCY,
            status: 'prepared',
            createdAt: new Date(),
        });

        const expiresAt = Date.now() + 14 * 60 * 1000;

        res.json({ ok: true, formFields, token, orderReference, expiresAt });
    } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error('[payment/prepare] Error:', msg, err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;

