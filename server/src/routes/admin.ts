import { Router, Request, Response, NextFunction } from 'express';
import { getDb } from '../lib/db.js';
import { ObjectId } from 'mongodb';
import { sendAccessEmail, sendReminderEmail } from '../lib/email.js';

const router = Router();

const ADMIN_EMAIL = 'holystudio.ai@gmail.com';
const ADMIN_PASSWORD = 'HolyStudioWebdev666!*';

// Simple auth middleware
function adminAuth(req: Request, res: Response, next: NextFunction) {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Basic ')) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const decoded = Buffer.from(auth.slice(6), 'base64').toString();
    const [email, password] = decoded.split(':');
    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    next();
}

// POST /api/admin/login
router.post('/login', (req: Request, res: Response) => {
    const { email, password } = req.body || {};
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        const token = Buffer.from(`${email}:${password}`).toString('base64');
        return res.json({ ok: true, token });
    }
    return res.status(401).json({ error: 'Invalid credentials' });
});

// GET /api/admin/users
router.get('/users', adminAuth, async (_req: Request, res: Response) => {
    try {
        const db = await getDb();
        const users = await db.collection('users').find({}).sort({ createdAt: -1 }).toArray();
        res.json({ users });
    } catch (err) {
        res.status(500).json({ error: String(err) });
    }
});

// POST /api/admin/users — create free user
router.post('/users', adminAuth, async (req: Request, res: Response) => {
    try {
        const { email } = req.body || {};
        if (!email) return res.status(400).json({ error: 'Email required' });

        const normalizedEmail = email.trim().toLowerCase();
        const db = await getDb();
        const existing = await db.collection('users').findOne({ email: normalizedEmail });
        if (existing) return res.status(400).json({ error: 'User already exists' });

        await db.collection('users').insertOne({
            email: normalizedEmail,
            status: 'paid',
            accessType: 'free',          // free access
            emailCheckType: 'multi',     // multi-use email check by default
            ip: null,
            userAgent: null,
            language: null,
            languages: null,
            platform: null,
            vendor: null,
            cookiesEnabled: null,
            doNotTrack: null,
            screenWidth: null,
            screenHeight: null,
            viewportWidth: null,
            viewportHeight: null,
            devicePixelRatio: null,
            colorDepth: null,
            timezone: null,
            timezoneOffset: null,
            referrer: null,
            currentUrl: null,
            deviceMemory: null,
            hardwareConcurrency: null,
            maxTouchPoints: null,
            connectionType: null,
            connectionDownlink: null,
            createdAt: new Date(),
            updatedAt: new Date(),
            paidAt: new Date(),
            reminderSentAt: null,
            orderReference: null,
            accessEmailSentAt: null,
            emailVerifiedAt: null,
        });

        res.json({ ok: true });
    } catch (err) {
        res.status(500).json({ error: String(err) });
    }
});

// PUT /api/admin/users/:id
router.put('/users/:id', adminAuth, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updates = req.body || {};
        const db = await getDb();

        const setFields: Record<string, any> = { updatedAt: new Date() };

        if (updates.email !== undefined) setFields.email = updates.email.trim().toLowerCase();
        if (updates.emailCheckType !== undefined) setFields.emailCheckType = updates.emailCheckType; // 'single' | 'multi'
        if (updates.accessType !== undefined) setFields.accessType = updates.accessType; // 'paid' | 'free'
        if (updates.status !== undefined) setFields.status = updates.status;

        // Reset emailVerifiedAt if switching to single and want to allow re-check
        if (updates.resetEmailVerification) {
            setFields.emailVerifiedAt = null;
        }

        await db.collection('users').updateOne(
            { _id: new ObjectId(String(id)) },
            { $set: setFields }
        );

        res.json({ ok: true });
    } catch (err) {
        res.status(500).json({ error: String(err) });
    }
});

// DELETE /api/admin/users/:id
router.delete('/users/:id', adminAuth, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const db = await getDb();
        await db.collection('users').deleteOne({ _id: new ObjectId(String(id)) });
        res.json({ ok: true });
    } catch (err) {
        res.status(500).json({ error: String(err) });
    }
});

// POST /api/admin/broadcast — send email to selected users
router.post('/broadcast', adminAuth, async (req: Request, res: Response) => {
    try {
        const { emails, type } = req.body || {};
        // type: 'reminder' | 'access'
        if (!emails || !Array.isArray(emails) || !type) {
            return res.status(400).json({ error: 'emails array and type required' });
        }

        const results: { email: string; ok: boolean }[] = [];
        for (const email of emails) {
            let ok = false;
            if (type === 'reminder') {
                ok = await sendReminderEmail(email);
            } else if (type === 'access') {
                ok = await sendAccessEmail(email, 'ADMIN-MANUAL');
            }
            results.push({ email, ok });
        }

        res.json({ ok: true, results });
    } catch (err) {
        res.status(500).json({ error: String(err) });
    }
});

// GET /api/admin/stats
router.get('/stats', adminAuth, async (_req: Request, res: Response) => {
    try {
        const db = await getDb();
        const totalUsers = await db.collection('users').countDocuments();
        const paidUsers = await db.collection('users').countDocuments({ status: 'paid' });
        const pendingUsers = await db.collection('users').countDocuments({ status: 'pending' });
        const freeUsers = await db.collection('users').countDocuments({ accessType: 'free' });
        const totalOrders = await db.collection('orders').countDocuments();
        const paidOrders = await db.collection('orders').countDocuments({ status: 'paid' });

        res.json({ totalUsers, paidUsers, pendingUsers, freeUsers, totalOrders, paidOrders });
    } catch (err) {
        res.status(500).json({ error: String(err) });
    }
});

export default router;

