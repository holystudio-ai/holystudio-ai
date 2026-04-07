import { Env, jsonResponse } from '../_lib/types';
import { hmacMd5, randomBytes } from '../_lib/crypto';
import { getDb } from '../_lib/db';

const MERCHANT_DOMAIN = 'holystudio.ai';
const PRODUCT_NAME = 'AI Інтенсив HOLYSTUDIO';
const CURRENCY = 'UAH';

function generateOrderReference(): string {
    const ts = Date.now();
    const rand = randomBytes(4);
    return `HOLY-${ts}-${rand}`;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
    const { request, env } = context;

    try {
        const body = await request.json().catch(() => ({})) as Record<string, unknown>;
        const email = body.email;

        if (!email || typeof email !== 'string') {
            return jsonResponse({ error: 'Email is required' }, 400);
        }

        const MERCHANT_LOGIN = env.WFP_MERCHANT_LOGIN;
        const MERCHANT_SECRET = env.WFP_MERCHANT_SECRET;
        const SITE_URL = (env.SITE_URL || 'https://holystudio.ai').replace(/\/+$/, '');
        const PRODUCT_PRICE = Number(env.COURSE_PRICE_UAH) || 490;

        const normalizedEmail = email.trim().toLowerCase();
        const orderReference = generateOrderReference();
        const orderDate = Math.floor(Date.now() / 1000);

        // Generate a secure token to identify the user on return
        const token = randomBytes(32);

        // Build returnUrl → API endpoint that accepts WayForPay POST and redirects to SPA
        const returnUrl = `${SITE_URL}/api/payment/return?token=${token}&ref=${encodeURIComponent(orderReference)}`;

        // Build signature string
        const signatureData = [
            MERCHANT_LOGIN,
            MERCHANT_DOMAIN,
            orderReference,
            orderDate,
            PRODUCT_PRICE,
            CURRENCY,
            PRODUCT_NAME,
            1,
            PRODUCT_PRICE,
        ].join(';');

        const merchantSignature = hmacMd5(signatureData, MERCHANT_SECRET);

        // WayForPay form fields
        const formFields: Record<string, string> = {
            merchantAccount: MERCHANT_LOGIN,
            merchantDomainName: MERCHANT_DOMAIN,
            merchantSignature: merchantSignature,
            orderReference: orderReference,
            orderDate: String(orderDate),
            amount: String(PRODUCT_PRICE),
            currency: CURRENCY,
            productName: PRODUCT_NAME,
            productCount: '1',
            productPrice: String(PRODUCT_PRICE),
            clientEmail: normalizedEmail,
            returnUrl,
            serviceUrl: `${SITE_URL}/api/payment/service`,
            defaultPaymentSystem: 'card',
            orderTimeout: '900',
        };

        // Save order to MongoDB with token
        const db = await getDb(env.MONGODB_URI);
        await db.collection('orders').insertOne({
            orderReference,
            token,
            email: normalizedEmail,
            amount: PRODUCT_PRICE,
            currency: CURRENCY,
            status: 'created',
            createdAt: new Date(),
        });

        return jsonResponse({ ok: true, formFields });
    } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error('[payment/create] Error:', msg, err);
        return jsonResponse({ error: 'Internal server error', debug: msg }, 500);
    }
};

