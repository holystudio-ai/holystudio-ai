import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';
import { getDb } from '../_lib/db';
import { sendAccessEmail } from '../_lib/email';

const MERCHANT_LOGIN = process.env.WFP_MERCHANT_LOGIN!;
const MERCHANT_PASSWORD = process.env.WFP_MERCHANT_PASSWORD!;
const MERCHANT_SECRET = process.env.WFP_MERCHANT_SECRET!;

function hmacMd5(data: string, secret: string): string {
    return crypto.createHmac('md5', secret).update(data, 'utf8').digest('hex');
}

/**
 * GET /api/payment/status?token=XXX&ref=HOLY-xxx
 *
 * 1. Finds order by orderReference + validates token
 * 2. If order is already 'paid' in DB (set by serviceUrl webhook) → done
 * 3. Otherwise, queries WayForPay API to check transaction status
 * 4. Updates order + user status, sends access email
 * 5. Returns { status, orderReference, email }
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const token = String(req.query.token || '').trim();
    const orderReference = String(req.query.ref || '').trim();

    if (!token || !orderReference) {
        return res.status(400).json({ error: 'Missing token or ref' });
    }

    try {
        const db = await getDb();

        // Find order by reference and validate token
        const order = await db.collection('orders').findOne({ orderReference });

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        if (order.token !== token) {
            return res.status(403).json({ error: 'Invalid token' });
        }

        const userEmail = order.email;

        // If already paid (set by serviceUrl webhook), just return
        if (order.status === 'paid') {
            // Ensure user status is also updated + email sent
            await markUserPaid(db, userEmail, orderReference);
            return res.status(200).json({
                status: 'paid',
                orderReference,
                email: userEmail,
                botAccessToken: order.botAccessToken || null,
            });
        }

        // Query WayForPay API to check payment status
        const wfpStatus = await checkWayForPayStatus(orderReference);
        console.log('[payment/status] WayForPay status for', orderReference, ':', wfpStatus);

        if (wfpStatus === 'Approved') {
            // Update order
            await db.collection('orders').updateOne(
                { orderReference },
                {
                    $set: {
                        status: 'paid',
                        updatedAt: new Date(),
                    },
                }
            );

            // Mark user as paid + send email
            await markUserPaid(db, userEmail, orderReference);

            // Re-read order to get botAccessToken (may have been set by service webhook)
            const updatedOrder = await db.collection('orders').findOne({ orderReference });

            return res.status(200).json({
                status: 'paid',
                orderReference,
                email: userEmail,
                botAccessToken: updatedOrder?.botAccessToken || null,
            });
        }

        // Not yet paid — return current status
        const mappedStatus = wfpStatus === 'InProcessing' ? 'pending' : 'failed';

        // Update order with latest WFP status if changed
        if (wfpStatus && order.status !== wfpStatus) {
            await db.collection('orders').updateOne(
                { orderReference },
                { $set: { status: wfpStatus, updatedAt: new Date() } }
            );
        }

        return res.status(200).json({
            status: mappedStatus,
            orderReference,
            wfpStatus,
        });
    } catch (err) {
        console.error('[payment/status] Error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

/**
 * Mark user as paid in DB and send access email (idempotent).
 */
async function markUserPaid(db: any, email: string, orderReference: string) {
    if (!email) return;

    const userFields = {
        status: 'paid',
        paidAt: new Date(),
        updatedAt: new Date(),
        orderReference,
    };

    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
        await db.collection('users').updateOne({ email }, { $set: userFields });
    } else {
        await db.collection('users').insertOne({
            email, ...userFields,
            accessType: 'paid', emailCheckType: 'single',
            ip: null, userAgent: null, language: null, languages: null,
            platform: null, vendor: null, cookiesEnabled: null, doNotTrack: null,
            screenWidth: null, screenHeight: null, viewportWidth: null, viewportHeight: null,
            devicePixelRatio: null, colorDepth: null, timezone: null, timezoneOffset: null,
            referrer: null, currentUrl: null, deviceMemory: null, hardwareConcurrency: null,
            maxTouchPoints: null, connectionType: null, connectionDownlink: null,
            createdAt: new Date(),
            reminderSentAt: null, accessEmailSentAt: null, emailVerifiedAt: null,
        });
    }

    // Send access email only once
    const user = existingUser || await db.collection('users').findOne({ email });
    if (user && !user.accessEmailSentAt) {
        await sendAccessEmail(email, orderReference);
        await db.collection('users').updateOne(
            { email },
            { $set: { accessEmailSentAt: new Date() } }
        );
        console.log('[payment/status] Access email sent to', email);
    }
}

/**
 * Check payment status via WayForPay "Check Status" API.
 * https://wiki.wayforpay.com/view/852091
 */
async function checkWayForPayStatus(orderReference: string): Promise<string> {
    try {
        // Signature: merchantAccount;orderReference
        const signatureData = `${MERCHANT_LOGIN};${orderReference}`;
        const merchantSignature = hmacMd5(signatureData, MERCHANT_SECRET);

        const response = await fetch('https://api.wayforpay.com/api', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                transactionType: 'CHECK_STATUS',
                merchantAccount: MERCHANT_LOGIN,
                orderReference,
                merchantSignature,
                apiVersion: 1,
            }),
        });

        const data = await response.json();
        console.log('[WayForPay Check Status] Response:', JSON.stringify(data));

        // transactionStatus: Approved, Declined, InProcessing, Expired, etc.
        return data.transactionStatus || 'Unknown';
    } catch (err) {
        console.error('[WayForPay Check Status] Error:', err);
        return 'Unknown';
    }
}

