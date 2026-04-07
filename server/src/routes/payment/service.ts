import { Router, Request, Response } from 'express';
import { config } from '../../config.js';
import { hmacMd5 } from '../../lib/crypto.js';
import { getDb } from '../../lib/db.js';
import { sendAccessEmail } from '../../lib/email.js';

const router = Router();

/**
 * POST /api/payment/service — WayForPay webhook callback.
 */
router.post('/', async (req: Request, res: Response) => {
    const MERCHANT_SECRET = config.WFP_MERCHANT_SECRET;

    const body = req.body || {};
    console.log('[Service URL] Received:', JSON.stringify(body));

    try {
        const {
            merchantAccount, orderReference, amount, currency,
            authCode, cardPan, transactionStatus, reasonCode,
            merchantSignature: receivedSignature,
            email, clientEmail, phone,
        } = body;

        const signatureData = [
            merchantAccount, orderReference, amount, currency,
            authCode, cardPan, transactionStatus, reasonCode,
        ].join(';');

        const expectedSignature = hmacMd5(signatureData, MERCHANT_SECRET);

        if (expectedSignature !== receivedSignature) {
            console.error('[Service URL] Signature mismatch!');
            res.status(400).json({ error: 'Invalid signature' });
            return;
        }

        const db = await getDb();
        const wfpEmail = (clientEmail || email || '').toString().trim().toLowerCase();

        const order = await db.collection('orders').findOne({ orderReference });
        const orderEmail = order?.email ? String(order.email).trim().toLowerCase() : '';
        const userEmail = wfpEmail || orderEmail;

        await db.collection('payments').insertOne({
            raw: body, orderReference, email: userEmail,
            transactionStatus, receivedAt: new Date(),
        });

        await db.collection('orders').updateOne(
            { orderReference },
            {
                $set: {
                    status: transactionStatus === 'Approved' ? 'paid' : transactionStatus,
                    transactionData: body, updatedAt: new Date(),
                },
            }
        );

        if (transactionStatus === 'Approved' && userEmail) {
            await db.collection('users').updateOne(
                { email: userEmail },
                {
                    $set: {
                        status: 'paid', paidAt: new Date(), updatedAt: new Date(),
                        orderReference: orderReference || null, phone: phone || null,
                    },
                }
            );

            if (orderEmail && orderEmail !== userEmail) {
                await db.collection('users').updateOne(
                    { email: orderEmail },
                    {
                        $set: {
                            status: 'paid', paidAt: new Date(), updatedAt: new Date(),
                            orderReference: orderReference || null, phone: phone || null,
                        },
                    }
                );
            }

            const emailTarget = userEmail || orderEmail;
            if (emailTarget) {
                const user = await db.collection('users').findOne({ email: emailTarget });
                if (!user?.accessEmailSentAt) {
                    await sendAccessEmail(emailTarget, orderReference || '');
                    await db.collection('users').updateOne(
                        { email: emailTarget },
                        { $set: { accessEmailSentAt: new Date() } }
                    );
                }
            }
        }

        const responseTime = Math.floor(Date.now() / 1000);
        const responseSignatureData = `${orderReference};accept;${responseTime}`;
        const responseSignature = hmacMd5(responseSignatureData, MERCHANT_SECRET);

        res.json({
            orderReference, status: 'accept',
            time: responseTime, signature: responseSignature,
        });
    } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error('[Service URL] Error:', msg, err);
        res.status(500).json({ error: 'Internal server error', debug: msg });
    }
});

export default router;

