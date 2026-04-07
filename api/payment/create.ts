import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';
import { getDb } from '../_lib/db';

const MERCHANT_LOGIN = process.env.WFP_MERCHANT_LOGIN!;
const MERCHANT_SECRET = process.env.WFP_MERCHANT_SECRET!;
const SITE_URL = process.env.SITE_URL || 'https://holystudio.ai';
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

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { email } = req.body ?? {};

        if (!email || typeof email !== 'string') {
            return res.status(400).json({ error: 'Email is required' });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const orderReference = generateOrderReference();
        const orderDate = Math.floor(Date.now() / 1000);

        // Generate a secure token to identify the user on return
        const token = crypto.randomBytes(32).toString('hex');

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

        return res.status(200).json({ ok: true, formFields });
    } catch (err) {
        console.error('[payment/create] Error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

