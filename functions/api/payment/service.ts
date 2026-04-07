import { Env, jsonResponse } from '../_lib/types';
import { hmacMd5 } from '../_lib/crypto';
import { getDb } from '../_lib/db';
import { sendAccessEmail } from '../_lib/email';

export const onRequestPost: PagesFunction<Env> = async (context) => {
    const { request, env } = context;
    const MERCHANT_SECRET = env.WFP_MERCHANT_SECRET;

    let body: Record<string, any>;
    try {
        const contentType = request.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
            body = await request.json();
        } else {
            const formData = await request.formData();
            body = Object.fromEntries(formData.entries());
        }
    } catch {
        body = {};
    }

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
            return jsonResponse({ error: 'Invalid signature' }, 400);
        }

        const db = await getDb(env.MONGODB_URI);
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
                    await sendAccessEmail(emailTarget, orderReference || '', env);
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

        return jsonResponse({
            orderReference, status: 'accept',
            time: responseTime, signature: responseSignature,
        });
    } catch (err) {
        console.error('[Service URL] Error:', err);
        return jsonResponse({ error: 'Internal server error' }, 500);
    }
};

