import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';
import { getDb } from '../_lib/db';
import { sendAccessEmail } from '../_lib/email';

const TELEGRAM_BOT = 'HOLYSTUDIO_AI_bot';

const MERCHANT_SECRET = process.env.WFP_MERCHANT_SECRET!;

function hmacMd5(data: string, secret: string): string {
    return crypto.createHmac('md5', secret).update(data, 'utf8').digest('hex');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const body = req.body ?? {};
    console.log('[Service URL] Received:', JSON.stringify(body));

    try {
        const {
            merchantAccount,
            orderReference,
            amount,
            currency,
            authCode,
            cardPan,
            transactionStatus,
            reasonCode,
            merchantSignature: receivedSignature,
            email,
            clientEmail,
            phone,
        } = body;

        // Verify WayForPay signature
        // Signature string: merchantAccount;orderReference;amount;currency;authCode;cardPan;transactionStatus;reasonCode
        const signatureData = [
            merchantAccount,
            orderReference,
            amount,
            currency,
            authCode,
            cardPan,
            transactionStatus,
            reasonCode,
        ].join(';');

        const expectedSignature = hmacMd5(signatureData, MERCHANT_SECRET);

        if (expectedSignature !== receivedSignature) {
            console.error('[Service URL] Signature mismatch!');
            console.error('  Expected:', expectedSignature);
            console.error('  Received:', receivedSignature);
            return res.status(400).json({ error: 'Invalid signature' });
        }

        const db = await getDb();
        const wfpEmail = (clientEmail || email || '').toString().trim().toLowerCase();

        // Look up the original order to get the email we stored at creation time
        const order = await db.collection('orders').findOne({ orderReference });
        const orderEmail = order?.email ? String(order.email).trim().toLowerCase() : '';

        // Prefer the email from WayForPay callback; fall back to order email
        const userEmail = wfpEmail || orderEmail;

        // Log full payment callback
        await db.collection('payments').insertOne({
            raw: body,
            orderReference,
            email: userEmail,
            transactionStatus,
            receivedAt: new Date(),
        });

        // Update order status
        await db.collection('orders').updateOne(
            { orderReference },
            {
                $set: {
                    status: transactionStatus === 'Approved' ? 'paid' : transactionStatus,
                    transactionData: body,
                    updatedAt: new Date(),
                },
            }
        );

        if (transactionStatus === 'Approved' && userEmail) {
            // Generate one-time bot access token
            const botAccessToken = crypto.randomBytes(16).toString('hex');

            // Save botAccessToken to the order
            await db.collection('orders').updateOne(
                { orderReference },
                {
                    $set: {
                        botAccessToken,
                        botAccessTokenUsedAt: null,
                    },
                }
            );
            console.log(`[Service URL] Generated botAccessToken for order ${orderReference}`);

            // Mark user as paid
            const result = await db.collection('users').updateOne(
                { email: userEmail },
                {
                    $set: {
                        status: 'paid',
                        paidAt: new Date(),
                        updatedAt: new Date(),
                        orderReference: orderReference || null,
                        phone: phone || null,
                    },
                }
            );
            console.log(`[Service URL] Marked "${userEmail}" as paid. Matched: ${result.matchedCount}`);

            // If the order email differs from WayForPay email, mark both as paid
            if (orderEmail && orderEmail !== userEmail) {
                const result2 = await db.collection('users').updateOne(
                    { email: orderEmail },
                    {
                        $set: {
                            status: 'paid',
                            paidAt: new Date(),
                            updatedAt: new Date(),
                            orderReference: orderReference || null,
                            phone: phone || null,
                        },
                    }
                );
                console.log(`[Service URL] Also marked order email "${orderEmail}" as paid. Matched: ${result2.matchedCount}`);
            }

            // Send access email with one-time bot token (only if not already sent)
            const emailTarget = userEmail || orderEmail;
            if (emailTarget) {
                const user = await db.collection('users').findOne({ email: emailTarget });
                if (!user?.accessEmailSentAt) {
                    const botLink = `https://t.me/${TELEGRAM_BOT}?start=${botAccessToken}`;
                    await sendAccessEmail(emailTarget, orderReference || '', botLink);
                    await db.collection('users').updateOne(
                        { email: emailTarget },
                        { $set: { accessEmailSentAt: new Date() } }
                    );
                }
            }
        }

        // WayForPay requires this exact response format, otherwise it retries
        const responseTime = Math.floor(Date.now() / 1000);
        const responseSignatureData = `${orderReference};accept;${responseTime}`;
        const responseSignature = hmacMd5(responseSignatureData, MERCHANT_SECRET);

        return res.status(200).json({
            orderReference,
            status: 'accept',
            time: responseTime,
            signature: responseSignature,
        });
    } catch (err) {
        console.error('[Service URL] Error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
