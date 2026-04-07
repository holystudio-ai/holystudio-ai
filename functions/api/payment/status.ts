import { Env, jsonResponse } from '../_lib/types';
import { hmacMd5 } from '../_lib/crypto';
import { getDb } from '../_lib/db';
import { sendAccessEmail } from '../_lib/email';

async function markUserPaid(db: any, email: string, orderReference: string, env: Env) {
    if (!email) return;

    await db.collection('users').updateOne(
        { email },
        {
            $set: {
                status: 'paid', paidAt: new Date(),
                updatedAt: new Date(), orderReference,
            },
        }
    );

    const user = await db.collection('users').findOne({ email });
    if (user && !user.accessEmailSentAt) {
        await sendAccessEmail(email, orderReference, env);
        await db.collection('users').updateOne(
            { email },
            { $set: { accessEmailSentAt: new Date() } }
        );
        console.log('[payment/status] Access email sent to', email);
    }
}

async function checkWayForPayStatus(
    orderReference: string, merchantLogin: string, merchantSecret: string
): Promise<string> {
    try {
        const signatureData = `${merchantLogin};${orderReference}`;
        const merchantSignature = hmacMd5(signatureData, merchantSecret);

        const response = await fetch('https://api.wayforpay.com/api', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                transactionType: 'CHECK_STATUS',
                merchantAccount: merchantLogin,
                orderReference,
                merchantSignature,
                apiVersion: 1,
            }),
        });

        const data: any = await response.json();
        console.log('[WayForPay Check Status] Response:', JSON.stringify(data));
        return data.transactionStatus || 'Unknown';
    } catch (err) {
        console.error('[WayForPay Check Status] Error:', err);
        return 'Unknown';
    }
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
    const { request, env } = context;

    const url = new URL(request.url);
    const token = (url.searchParams.get('token') || '').trim();
    const orderReference = (url.searchParams.get('ref') || '').trim();

    if (!token || !orderReference) {
        return jsonResponse({ error: 'Missing token or ref' }, 400);
    }

    try {
        const db = await getDb(env.MONGODB_URI);
        const order = await db.collection('orders').findOne({ orderReference });

        if (!order) {
            return jsonResponse({ error: 'Order not found' }, 404);
        }

        if (order.token !== token) {
            return jsonResponse({ error: 'Invalid token' }, 403);
        }

        const userEmail = order.email;

        if (order.status === 'paid') {
            await markUserPaid(db, userEmail, orderReference, env);
            return jsonResponse({ status: 'paid', orderReference, email: userEmail });
        }

        const wfpStatus = await checkWayForPayStatus(
            orderReference, env.WFP_MERCHANT_LOGIN, env.WFP_MERCHANT_SECRET
        );
        console.log('[payment/status] WayForPay status for', orderReference, ':', wfpStatus);

        if (wfpStatus === 'Approved') {
            await db.collection('orders').updateOne(
                { orderReference },
                { $set: { status: 'paid', updatedAt: new Date() } }
            );
            await markUserPaid(db, userEmail, orderReference, env);
            return jsonResponse({ status: 'paid', orderReference, email: userEmail });
        }

        const mappedStatus = wfpStatus === 'InProcessing' ? 'pending' : 'failed';

        if (wfpStatus && order.status !== wfpStatus) {
            await db.collection('orders').updateOne(
                { orderReference },
                { $set: { status: wfpStatus, updatedAt: new Date() } }
            );
        }

        return jsonResponse({ status: mappedStatus, orderReference, wfpStatus });
    } catch (err) {
        console.error('[payment/status] Error:', err);
        return jsonResponse({ error: 'Internal server error' }, 500);
    }
};

