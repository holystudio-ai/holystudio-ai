import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';
import { getDb } from '../_lib/db';

const MERCHANT_LOGIN = process.env.WFP_MERCHANT_LOGIN!;
const MERCHANT_SECRET = process.env.WFP_MERCHANT_SECRET!;
const SITE_URL = (process.env.SITE_URL || 'https://holystudio.ai').replace(/\/+$/, '');
const MERCHANT_DOMAIN = 'holystudio.ai';

const PRODUCT_NAME = 'AI Інтенсив HOLYSTUDIO';
const PRODUCT_PRICE = Number(process.env.COURSE_PRICE_UAH) || 490;
const CURRENCY = 'UAH';

function hmacMd5(data: string, secret: string): string {
    return crypto.createHmac('md5', secret).update(data, 'utf8').digest('hex');
}

function generateOrderReference(): string {
    const ts = Date.now();
    const rand = crypto.randomBytes(4).toString('hex');
    return `HOLY-${ts}-${rand}`;
}

/**
 * POST /api/payment/prepare
 *
 * Pre-generates WayForPay payment form fields WITHOUT requiring the user's email.
 * Email (clientEmail) is NOT part of the WayForPay HMAC signature, so we can
 * safely generate the signed form fields ahead of time.
 *
 * The frontend calls this on page load and caches the result. When the user
 * enters their email and clicks "pay", the email is added to the cached
 * form fields and the form is submitted instantly — zero wait time.
 *
 * Returns: { ok, formFields, token, orderReference, expiresAt }
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const orderReference = generateOrderReference();
        const orderDate = Math.floor(Date.now() / 1000);

        // Secure token to identify the user on return
        const token = crypto.randomBytes(32).toString('hex');

        // returnUrl — WayForPay will POST here after payment
        const returnUrl = `${SITE_URL}/api/payment/return?token=${token}&ref=${encodeURIComponent(orderReference)}`;

        // Build HMAC signature (clientEmail is NOT included in the signature)
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

        // Form fields — clientEmail will be added by the frontend
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
            serviceUrl: `${SITE_URL}/api/payment/service`,
            defaultPaymentSystem: 'card',
            orderTimeout: '900',
        };

        // Save order to MongoDB (without email — will be updated later)
        const db = await getDb();
        await db.collection('orders').insertOne({
            orderReference,
            token,
            email: null, // will be set when user enters email
            amount: PRODUCT_PRICE,
            currency: CURRENCY,
            status: 'prepared',
            createdAt: new Date(),
        });

        // Form is valid for ~14 minutes (WayForPay orderTimeout is 900s = 15min)
        const expiresAt = Date.now() + 14 * 60 * 1000;

        return res.status(200).json({
            ok: true,
            formFields,
            token,
            orderReference,
            expiresAt,
        });
    } catch (err) {
        console.error('[payment/prepare] Error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

