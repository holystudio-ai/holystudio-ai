import { Env, jsonResponse } from '../_lib/types';
import { getDb } from '../_lib/db';
import { randomBytes } from '../_lib/crypto';

const DEV_TEST_TOKEN = 'dev-test-holy';
const DEV_TEST_EMAIL = 'dev@holystudio.ai';
const DEV_TEST_ORDER = 'HOLY-DEV-TEST-000';

/**
 * GET /api/bot/verify-token?token=abc123
 * Verifies a one-time bot access token (SmartSender compatible).
 */
export const onRequestGet: PagesFunction<Env> = async (context) => {
    const { request, env } = context;

    try {
        const url = new URL(request.url);
        const tokenValue = url.searchParams.get('token') || '';
        return await verify(tokenValue.trim(), env);
    } catch (err) {
        console.error('[bot/verify-token] Error:', err);
        return jsonResponse({ valid: false, reason: 'server_error' }, 500);
    }
};

/**
 * POST /api/bot/verify-token  { "token": "abc123" }
 */
export const onRequestPost: PagesFunction<Env> = async (context) => {
    const { request, env } = context;

    try {
        const body = await request.json().catch(() => ({})) as Record<string, any>;
        const tokenValue = body.token || '';
        return await verify(String(tokenValue).trim(), env);
    } catch (err) {
        console.error('[bot/verify-token] Error:', err);
        return jsonResponse({ valid: false, reason: 'server_error' }, 500);
    }
};

async function verify(trimmedToken: string, env: Env): Promise<Response> {
    if (!trimmedToken) {
        return jsonResponse({ valid: false, reason: 'missing_token' }, 400);
    }

    // ── Dev test token (reusable) ──
    if (trimmedToken === DEV_TEST_TOKEN) {
        console.log('[bot/verify-token] DEV TEST TOKEN used (reusable)');
        return jsonResponse({
            valid: true,
            email: DEV_TEST_EMAIL,
            orderReference: DEV_TEST_ORDER,
            _dev: true,
        });
    }

    const db = await getDb(env.MONGODB_URI);
    const orders = db.collection('orders');

    const order = await orders.findOne({ botAccessToken: trimmedToken });

    if (!order) {
        return jsonResponse({ valid: false, reason: 'not_found' });
    }

    if (order.botAccessTokenUsedAt) {
        return jsonResponse({ valid: false, reason: 'already_used' });
    }

    if (order.status !== 'paid') {
        return jsonResponse({ valid: false, reason: 'not_paid' });
    }

    // Mark token as used — one-time only
    await orders.updateOne(
        { _id: order._id },
        {
            $set: {
                botAccessTokenUsedAt: new Date(),
                updatedAt: new Date(),
            },
        }
    );

    console.log(`[bot/verify-token] Token used for order ${order.orderReference}, email: ${order.email}`);

    return jsonResponse({
        valid: true,
        email: order.email || null,
        orderReference: order.orderReference,
    });
}

