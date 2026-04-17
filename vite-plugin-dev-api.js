/**
 * Vite plugin that handles /api/* routes locally during development.
 * Mimics the Vercel serverless functions so `npm run dev` works without `vercel dev`.
 */
import crypto from 'crypto';
import dns from 'dns';
import { promisify } from 'util';
import { MongoClient } from 'mongodb';

import { ObjectId } from 'mongodb';

const resolveMx = promisify(dns.resolveMx);

// Read env lazily (at request time) because vite.config.ts injects them after this module loads
function getEnv(key, fallback) {
    return process.env[key] || fallback;
}

/** Strip trailing slashes from URLs */
function trimUrl(url) {
    return url.replace(/\/+$/, '');
}

const MERCHANT_DOMAIN = 'holystudio.ai';
const PRODUCT_NAME = 'AI Інтенсив HOLYSTUDIO';
const CURRENCY = 'UAH';

let _dbClient = null;
async function getDb() {
    if (!_dbClient) {
        const uri = getEnv('MONGODB_URI', '');
        if (!uri) throw new Error('MONGODB_URI is not set');
        _dbClient = new MongoClient(uri);
        await _dbClient.connect();
    }
    return _dbClient.db();
}

function hmacMd5(data, secret) {
    return crypto.createHmac('md5', secret).update(data, 'utf8').digest('hex');
}

const DISPOSABLE_DOMAINS = new Set([
    'tempmail.com', 'throwaway.email', 'guerrillamail.com', 'mailinator.com',
    'yopmail.com', 'trashmail.com', 'sharklasers.com', 'maildrop.cc',
]);

function parseBody(req) {
    return new Promise((resolve) => {
        let body = '';
        req.on('data', (chunk) => { body += chunk; });
        req.on('end', () => {
            try { resolve(JSON.parse(body)); }
            catch { resolve({}); }
        });
    });
}

function sendJson(res, status, data) {
    res.statusCode = status;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(data));
}

export default function devApiPlugin() {
    return {
        name: 'dev-api',
        configureServer(server) {
            // POST /api/validate-email
            server.middlewares.use('/api/validate-email', async (req, res, next) => {
                if (req.method !== 'POST') return next();
                const body = await parseBody(req);
                const email = (body.email || '').trim().toLowerCase();

                if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
                    return sendJson(res, 200, { valid: false, reason: 'format' });
                }

                const domain = email.split('@')[1];
                if (DISPOSABLE_DOMAINS.has(domain)) {
                    return sendJson(res, 200, { valid: false, reason: 'disposable' });
                }

                try {
                    const records = await resolveMx(domain);
                    if (!records || records.length === 0) {
                        return sendJson(res, 200, { valid: false, reason: 'no_mx' });
                    }
                } catch {
                    return sendJson(res, 200, { valid: false, reason: 'no_mx' });
                }

                return sendJson(res, 200, { valid: true });
            });

            // POST /api/users
            server.middlewares.use('/api/users', async (req, res, next) => {
                if (req.method !== 'POST') return next();
                const body = await parseBody(req);
                const email = (body.email || '').trim().toLowerCase();
                const meta = body.clientMeta && typeof body.clientMeta === 'object' ? body.clientMeta : {};

                if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                    return sendJson(res, 400, { error: 'Invalid email' });
                }

                console.log('[dev-api] User email:', email);

                try {
                    const db = await getDb();
                    const users = db.collection('users');
                    const existing = await users.findOne({ email });

                    if (existing && existing.status === 'paid') {
                        return sendJson(res, 200, { ok: true, status: 'already_paid' });
                    }

                    if (existing) {
                        await users.updateOne(
                            { email },
                            { $set: { updatedAt: new Date(), ...meta } },
                        );
                    } else {
                        await users.insertOne({
                            email,
                            status: 'pending',
                            userAgent: meta.userAgent || null,
                            language: meta.language || null,
                            languages: meta.languages || null,
                            platform: meta.platform || null,
                            vendor: meta.vendor || null,
                            cookiesEnabled: meta.cookiesEnabled ?? null,
                            doNotTrack: meta.doNotTrack || null,
                            screenWidth: meta.screenWidth || null,
                            screenHeight: meta.screenHeight || null,
                            viewportWidth: meta.viewportWidth || null,
                            viewportHeight: meta.viewportHeight || null,
                            devicePixelRatio: meta.devicePixelRatio || null,
                            colorDepth: meta.colorDepth || null,
                            timezone: meta.timezone || null,
                            timezoneOffset: meta.timezoneOffset ?? null,
                            referrer: meta.referrer || null,
                            currentUrl: meta.currentUrl || null,
                            deviceMemory: meta.deviceMemory || null,
                            hardwareConcurrency: meta.hardwareConcurrency || null,
                            maxTouchPoints: meta.maxTouchPoints ?? null,
                            connectionType: meta.connectionType || null,
                            connectionDownlink: meta.connectionDownlink || null,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                            paidAt: null,
                            reminderSentAt: null,
                        });
                    }

                    console.log('[dev-api] User saved to DB:', email);
                    return sendJson(res, 200, { ok: true, status: 'pending' });
                } catch (err) {
                    console.error('[dev-api] Failed to save user:', err);
                    return sendJson(res, 200, { ok: true, status: 'pending' });
                }
            });

            // POST /api/payment/prepare — pre-generate payment form fields (no email needed)
            server.middlewares.use('/api/payment/prepare', async (req, res, next) => {
                if (req.method !== 'POST') return next();

                const MERCHANT_LOGIN = getEnv('WFP_MERCHANT_LOGIN', 'holystudio_ai');
                const MERCHANT_SECRET = getEnv('WFP_MERCHANT_SECRET', '');
                const SITE_URL = trimUrl(getEnv('SITE_URL', 'http://localhost:5555'));
                const PRODUCT_PRICE = Number(getEnv('COURSE_PRICE_UAH', '490'));

                const ts = Date.now();
                const rand = crypto.randomBytes(4).toString('hex');
                const orderReference = `HOLY-${ts}-${rand}`;
                const orderDate = Math.floor(Date.now() / 1000);

                const token = crypto.randomBytes(32).toString('hex');
                const returnUrl = `${SITE_URL}/api/payment/return?token=${token}&ref=${encodeURIComponent(orderReference)}`;

                const signatureData = [
                    MERCHANT_LOGIN, MERCHANT_DOMAIN, orderReference, orderDate,
                    PRODUCT_PRICE, CURRENCY, PRODUCT_NAME, 1, PRODUCT_PRICE,
                ].join(';');
                const merchantSignature = hmacMd5(signatureData, MERCHANT_SECRET);

                const formFields = {
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

                try {
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
                } catch (err) {
                    console.error('[dev-api] Failed to save prepared order:', err);
                }

                const expiresAt = Date.now() + 14 * 60 * 1000;
                console.log('[dev-api] Payment prepared:', orderReference, '| price:', PRODUCT_PRICE, 'UAH');
                return sendJson(res, 200, { ok: true, formFields, token, orderReference, expiresAt });
            });

            // GET|POST /api/bot/verify-token — one-time bot access token verification
            server.middlewares.use('/api/bot/verify-token', async (req, res, next) => {
                let botToken = '';
                if (req.method === 'GET') {
                    const url = new URL(req.url, 'http://localhost');
                    botToken = (url.searchParams.get('token') || '').trim();
                } else if (req.method === 'POST') {
                    const body = await parseBody(req);
                    botToken = (body.token || '').trim();
                } else {
                    return next();
                }

                if (!botToken) {
                    return sendJson(res, 400, { valid: false, reason: 'missing_token' });
                }

                // Dev test token — reusable, never expires, no DB lookup
                if (botToken === 'dev-test-holy') {
                    console.log('[dev-api] DEV TEST TOKEN used (reusable)');
                    return sendJson(res, 200, {
                        valid: true,
                        email: 'dev@holystudio.ai',
                        orderReference: 'HOLY-DEV-TEST-000',
                        _dev: true,
                    });
                }

                try {
                    const db = await getDb();
                    const order = await db.collection('orders').findOne({ botAccessToken: botToken });

                    if (!order) {
                        return sendJson(res, 200, { valid: false, reason: 'not_found' });
                    }
                    if (order.botAccessTokenUsedAt) {
                        return sendJson(res, 200, { valid: false, reason: 'already_used' });
                    }
                    if (order.status !== 'paid') {
                        return sendJson(res, 200, { valid: false, reason: 'not_paid' });
                    }

                    await db.collection('orders').updateOne(
                        { _id: order._id },
                        { $set: { botAccessTokenUsedAt: new Date(), updatedAt: new Date() } }
                    );

                    console.log('[dev-api] Bot token verified for order:', order.orderReference);
                    return sendJson(res, 200, { valid: true, email: order.email || null, orderReference: order.orderReference });
                } catch (err) {
                    console.error('[dev-api] Bot verify error:', err);
                    return sendJson(res, 500, { valid: false, reason: 'server_error' });
                }
            });

            // POST /api/payment/create
            server.middlewares.use('/api/payment/create', async (req, res, next) => {
                if (req.method !== 'POST') return next();
                const body = await parseBody(req);
                const email = (body.email || '').trim().toLowerCase();

                if (!email) {
                    return sendJson(res, 400, { error: 'Email is required' });
                }

                const MERCHANT_LOGIN = getEnv('WFP_MERCHANT_LOGIN', 'holystudio_ai');
                const MERCHANT_SECRET = getEnv('WFP_MERCHANT_SECRET', '');
                const SITE_URL = trimUrl(getEnv('SITE_URL', 'http://localhost:5555'));
                const PRODUCT_PRICE = Number(getEnv('COURSE_PRICE_UAH', '490'));

                // updateOnly mode — just attach email to existing prepared order
                if (body.updateOnly && body.orderReference) {
                    try {
                        const db = await getDb();
                        await db.collection('orders').updateOne(
                            { orderReference: body.orderReference },
                            { $set: { email, status: 'created', updatedAt: new Date() } }
                        );
                        console.log('[dev-api] Order updated with email:', body.orderReference, email);
                    } catch (err) {
                        console.error('[dev-api] Failed to update order:', err);
                    }
                    return sendJson(res, 200, { ok: true, updated: true });
                }

                const ts = Date.now();
                const rand = crypto.randomBytes(4).toString('hex');
                const orderReference = `HOLY-${ts}-${rand}`;
                const orderDate = Math.floor(Date.now() / 1000);

                // Secure token to identify user on return
                const token = crypto.randomBytes(32).toString('hex');
                const returnUrl = `${SITE_URL}/api/payment/return?token=${token}&ref=${encodeURIComponent(orderReference)}`;

                const signatureData = [
                    MERCHANT_LOGIN, MERCHANT_DOMAIN, orderReference, orderDate,
                    PRODUCT_PRICE, CURRENCY, PRODUCT_NAME, 1, PRODUCT_PRICE,
                ].join(';');

                const merchantSignature = hmacMd5(signatureData, MERCHANT_SECRET);

                const formFields = {
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
                    clientEmail: email,
                    returnUrl,
                    serviceUrl: `${SITE_URL}/api/payment/service`,
                    defaultPaymentSystem: 'card',
                    orderTimeout: '900',
                };

                // Save order to DB with token
                try {
                    const db = await getDb();
                    await db.collection('orders').insertOne({
                        orderReference,
                        token,
                        email,
                        amount: PRODUCT_PRICE,
                        currency: CURRENCY,
                        status: 'created',
                        createdAt: new Date(),
                    });
                } catch (err) {
                    console.error('[dev-api] Failed to save order:', err);
                }

                console.log('[dev-api] Payment created:', orderReference, 'for', email, '| price:', PRODUCT_PRICE, 'UAH');
                return sendJson(res, 200, { ok: true, formFields });
            });

            // POST|GET /api/payment/return — WayForPay redirects user here, we redirect to SPA
            server.middlewares.use('/api/payment/return', async (req, res, next) => {
                const SITE_URL = trimUrl(getEnv('SITE_URL', 'http://localhost:5555'));
                const url = new URL(req.url, 'http://localhost');
                const token = url.searchParams.get('token') || '';
                const ref = url.searchParams.get('ref') || '';

                const params = new URLSearchParams();
                if (token) params.set('token', token);
                if (ref) params.set('ref', ref);

                const redirectUrl = `${SITE_URL}/return-page${params.toString() ? '?' + params.toString() : ''}`;
                console.log('[dev-api] Payment return → redirecting to', redirectUrl);
                res.writeHead(302, { Location: redirectUrl });
                return res.end();
            });

            // GET /api/payment/status?token=XXX&ref=HOLY-xxx
            server.middlewares.use('/api/payment/status', async (req, res, next) => {
                if (req.method !== 'GET') return next();

                const url = new URL(req.url, 'http://localhost');
                const token = url.searchParams.get('token') || '';
                const orderReference = url.searchParams.get('ref') || '';

                if (!token || !orderReference) {
                    return sendJson(res, 400, { error: 'Missing token or ref' });
                }

                try {
                    const db = await getDb();
                    const order = await db.collection('orders').findOne({ orderReference });

                    if (!order) {
                        return sendJson(res, 404, { error: 'Order not found' });
                    }

                    if (order.token !== token) {
                        return sendJson(res, 403, { error: 'Invalid token' });
                    }

                    const email = order.email;

                    if (order.status === 'paid') {
                        // Already paid — ensure user is marked + email sent
                        if (email) {
                            await db.collection('users').updateOne(
                                { email },
                                {
                                    $set: {
                                        status: 'paid',
                                        paidAt: new Date(),
                                        updatedAt: new Date(),
                                        orderReference,
                                    },
                                }
                            );
                            const user = await db.collection('users').findOne({ email });
                            if (user && !user.accessEmailSentAt) {
                                console.log('[dev-api] Would send access email to:', email);
                                await db.collection('users').updateOne(
                                    { email },
                                    { $set: { accessEmailSentAt: new Date() } }
                                );
                            }
                        }
                        return sendJson(res, 200, { status: 'paid', orderReference, email, botAccessToken: order.botAccessToken || null });
                    }

                    // Check WayForPay API for payment status
                    const MERCHANT_LOGIN = getEnv('WFP_MERCHANT_LOGIN', 'holystudio_ai');
                    const MERCHANT_SECRET = getEnv('WFP_MERCHANT_SECRET', '');
                    const sigData = `${MERCHANT_LOGIN};${orderReference}`;
                    const sig = hmacMd5(sigData, MERCHANT_SECRET);

                    let wfpStatus = 'Unknown';
                    try {
                        const resp = await fetch('https://api.wayforpay.com/api', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                transactionType: 'CHECK_STATUS',
                                merchantAccount: MERCHANT_LOGIN,
                                orderReference,
                                merchantSignature: sig,
                                apiVersion: 1,
                            }),
                        });
                        const data = await resp.json();
                        console.log('[dev-api] WayForPay CHECK_STATUS:', JSON.stringify(data));
                        wfpStatus = data.transactionStatus || 'Unknown';
                    } catch (err) {
                        console.error('[dev-api] WayForPay check error:', err);
                    }

                    if (wfpStatus === 'Approved') {
                        await db.collection('orders').updateOne(
                            { orderReference },
                            { $set: { status: 'paid', updatedAt: new Date() } }
                        );
                        if (email) {
                            await db.collection('users').updateOne(
                                { email },
                                {
                                    $set: {
                                        status: 'paid',
                                        paidAt: new Date(),
                                        updatedAt: new Date(),
                                        orderReference,
                                    },
                                }
                            );
                            const user = await db.collection('users').findOne({ email });
                            if (user && !user.accessEmailSentAt) {
                                console.log('[dev-api] Would send access email to:', email);
                                await db.collection('users').updateOne(
                                    { email },
                                    { $set: { accessEmailSentAt: new Date() } }
                                );
                            }
                        }
                        const updatedOrder = await db.collection('orders').findOne({ orderReference });
                        return sendJson(res, 200, { status: 'paid', orderReference, email, botAccessToken: updatedOrder?.botAccessToken || null });
                    }

                    const mappedStatus = wfpStatus === 'InProcessing' ? 'pending' : 'failed';
                    return sendJson(res, 200, { status: mappedStatus, orderReference, wfpStatus });
                } catch (err) {
                    console.error('[dev-api] Payment status error:', err);
                    return sendJson(res, 500, { error: 'Internal server error' });
                }
            });

            // ── Admin routes ──
            const ADMIN_EMAIL = 'holystudio.ai@gmail.com';
            const ADMIN_PASSWORD = 'HolyStudioWebdev666!*';

            function checkAdminAuth(req) {
                const auth = req.headers.authorization;
                if (!auth || !auth.startsWith('Basic ')) return false;
                const decoded = Buffer.from(auth.slice(6), 'base64').toString();
                const [e, p] = decoded.split(':');
                return e === ADMIN_EMAIL && p === ADMIN_PASSWORD;
            }

            server.middlewares.use('/api/admin/login', async (req, res, next) => {
                if (req.method !== 'POST') return next();
                const body = await parseBody(req);
                if (body.email === ADMIN_EMAIL && body.password === ADMIN_PASSWORD) {
                    const token = Buffer.from(`${body.email}:${body.password}`).toString('base64');
                    return sendJson(res, 200, { ok: true, token });
                }
                return sendJson(res, 401, { error: 'Invalid credentials' });
            });

            server.middlewares.use('/api/admin/users', async (req, res, next) => {
                if (!checkAdminAuth(req)) return sendJson(res, 401, { error: 'Unauthorized' });
                const db = await getDb();
                if (req.method === 'GET') {
                    const users = await db.collection('users').find({}).sort({ createdAt: -1 }).toArray();
                    return sendJson(res, 200, { users });
                }
                if (req.method === 'POST') {
                    const body = await parseBody(req);
                    if (!body.email) return sendJson(res, 400, { error: 'Email required' });
                    const email = body.email.trim().toLowerCase();
                    const existing = await db.collection('users').findOne({ email });
                    if (existing) return sendJson(res, 400, { error: 'User already exists' });
                    await db.collection('users').insertOne({
                        email, status: 'paid', accessType: 'free', emailCheckType: 'multi',
                        ip: null, userAgent: null, language: null, languages: null, platform: null,
                        vendor: null, cookiesEnabled: null, doNotTrack: null, screenWidth: null,
                        screenHeight: null, viewportWidth: null, viewportHeight: null,
                        devicePixelRatio: null, colorDepth: null, timezone: null, timezoneOffset: null,
                        referrer: null, currentUrl: null, deviceMemory: null, hardwareConcurrency: null,
                        maxTouchPoints: null, connectionType: null, connectionDownlink: null,
                        createdAt: new Date(), updatedAt: new Date(), paidAt: new Date(),
                        reminderSentAt: null, orderReference: null, accessEmailSentAt: null, emailVerifiedAt: null,
                    });
                    return sendJson(res, 200, { ok: true });
                }
                if (req.method === 'DELETE') {
                    const id = req.url.split('/').pop();
                    await db.collection('users').deleteOne({ _id: new ObjectId(id) });
                    return sendJson(res, 200, { ok: true });
                }
                if (req.method === 'PUT') {
                    const id = req.url.split('/').pop();
                    const body = await parseBody(req);
                    const setFields = { updatedAt: new Date() };
                    if (body.email !== undefined) setFields.email = body.email.trim().toLowerCase();
                    if (body.emailCheckType !== undefined) setFields.emailCheckType = body.emailCheckType;
                    if (body.accessType !== undefined) setFields.accessType = body.accessType;
                    if (body.resetEmailVerification) setFields.emailVerifiedAt = null;
                    await db.collection('users').updateOne({ _id: new ObjectId(id) }, { $set: setFields });
                    return sendJson(res, 200, { ok: true });
                }
                return next();
            });

            server.middlewares.use('/api/admin/stats', async (req, res, next) => {
                if (req.method !== 'GET' || !checkAdminAuth(req)) return sendJson(res, 401, { error: 'Unauthorized' });
                const db = await getDb();
                const totalUsers = await db.collection('users').countDocuments();
                const paidUsers = await db.collection('users').countDocuments({ status: 'paid' });
                const pendingUsers = await db.collection('users').countDocuments({ status: 'pending' });
                const freeUsers = await db.collection('users').countDocuments({ accessType: 'free' });
                const totalOrders = await db.collection('orders').countDocuments();
                const paidOrders = await db.collection('orders').countDocuments({ status: 'paid' });
                return sendJson(res, 200, { totalUsers, paidUsers, pendingUsers, freeUsers, totalOrders, paidOrders });
            });

            server.middlewares.use('/api/admin/broadcast', async (req, res, next) => {
                if (req.method !== 'POST' || !checkAdminAuth(req)) return sendJson(res, 401, { error: 'Unauthorized' });
                const body = await parseBody(req);
                console.log('[dev-api] Broadcast request:', body.type, 'to', body.emails?.length, 'emails');
                return sendJson(res, 200, { ok: true, results: (body.emails || []).map(e => ({ email: e, ok: true })) });
            });

            server.middlewares.use('/api/admin/analytics', async (req, res, next) => {
                if (req.method !== 'GET' || !checkAdminAuth(req)) return sendJson(res, 401, { error: 'Unauthorized' });
                const db = await getDb();
                const users = await db.collection('users').find({}).toArray();
                const timezones = {}, platforms = {}, languages = {}, connectionTypes = {}, screenSizes = {}, referrers = {};
                let mobile = 0, desktop = 0, totalMem = 0, memCnt = 0;
                const regsByDay = {}, paidByDay = {};
                for (const u of users) {
                    if (u.timezone) timezones[u.timezone] = (timezones[u.timezone] || 0) + 1;
                    if (u.platform) platforms[u.platform] = (platforms[u.platform] || 0) + 1;
                    if (u.language) { const l = String(u.language).split('-')[0]; languages[l] = (languages[l] || 0) + 1; }
                    if (u.connectionType) connectionTypes[u.connectionType] = (connectionTypes[u.connectionType] || 0) + 1;
                    if (u.maxTouchPoints > 0) mobile++; else desktop++;
                    if (u.screenWidth && u.screenHeight) { const b = `${u.screenWidth}x${u.screenHeight}`; screenSizes[b] = (screenSizes[b] || 0) + 1; }
                    if (u.referrer) { try { const h = new URL(u.referrer).hostname; referrers[h] = (referrers[h] || 0) + 1; } catch { referrers[u.referrer] = (referrers[u.referrer] || 0) + 1; } }
                    if (u.deviceMemory) { totalMem += Number(u.deviceMemory); memCnt++; }
                    if (u.createdAt) { const d = new Date(u.createdAt).toISOString().slice(0,10); regsByDay[d] = (regsByDay[d] || 0) + 1; }
                    if (u.paidAt) { const d = new Date(u.paidAt).toISOString().slice(0,10); paidByDay[d] = (paidByDay[d] || 0) + 1; }
                }
                const sort = o => Object.entries(o).sort((a,b) => b[1] - a[1]);
                return sendJson(res, 200, {
                    timezones: sort(timezones), platforms: sort(platforms), languages: sort(languages),
                    connectionTypes: sort(connectionTypes), screenSizes: sort(screenSizes).slice(0,15), referrers: sort(referrers),
                    devices: { mobile, desktop }, avgMemoryGB: memCnt ? +(totalMem/memCnt).toFixed(1) : null,
                    regsByDay: Object.entries(regsByDay).sort(), paidByDay: Object.entries(paidByDay).sort(),
                    conversionRate: users.length ? +((users.filter(u => u.status === 'paid').length / users.length)*100).toFixed(1) : 0,
                });
            });

            // POST /api/payment/service (webhook)
            server.middlewares.use('/api/payment/service', async (req, res, next) => {
                if (req.method !== 'POST') return next();
                const body = await parseBody(req);
                console.log('[dev-api] Payment service webhook:', JSON.stringify(body));

                const MERCHANT_SECRET = getEnv('WFP_MERCHANT_SECRET', '');
                const {
                    merchantAccount, orderReference, amount, currency,
                    authCode, cardPan, transactionStatus, reasonCode,
                    merchantSignature: receivedSignature,
                    email: bodyEmail, clientEmail, phone,
                } = body;

                // Verify signature
                const signatureData = [
                    merchantAccount, orderReference, amount, currency,
                    authCode, cardPan, transactionStatus, reasonCode,
                ].join(';');
                const expectedSignature = hmacMd5(signatureData, MERCHANT_SECRET);

                if (expectedSignature !== receivedSignature) {
                    console.error('[dev-api] Signature mismatch! Expected:', expectedSignature, 'Got:', receivedSignature);
                    return sendJson(res, 400, { error: 'Invalid signature' });
                }

                // Update DB
                try {
                    const db = await getDb();
                    const wfpEmail = (clientEmail || bodyEmail || '').toString().trim().toLowerCase();

                    // Look up original order email
                    const order = await db.collection('orders').findOne({ orderReference });
                    const orderEmail = order?.email ? String(order.email).trim().toLowerCase() : '';
                    const userEmail = wfpEmail || orderEmail;

                    // Log payment callback
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
                        await db.collection('orders').updateOne(
                            { orderReference },
                            { $set: { botAccessToken, botAccessTokenUsedAt: null } }
                        );
                        console.log('[dev-api] Generated botAccessToken for order:', orderReference);

                        // Mark user as paid
                        await db.collection('users').updateOne(
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
                        console.log('[dev-api] Marked user as paid:', userEmail);

                        // If order email differs, mark both
                        if (orderEmail && orderEmail !== userEmail) {
                            await db.collection('users').updateOne(
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
                            console.log('[dev-api] Also marked order email as paid:', orderEmail);
                        }
                    }
                } catch (err) {
                    console.error('[dev-api] Webhook DB error:', err);
                }

                const responseTime = Math.floor(Date.now() / 1000);
                const responseSignatureData = `${orderReference};accept;${responseTime}`;
                const responseSignature = hmacMd5(responseSignatureData, MERCHANT_SECRET);

                return sendJson(res, 200, {
                    orderReference,
                    status: 'accept',
                    time: responseTime,
                    signature: responseSignature,
                });
            });
        },
    };
}

