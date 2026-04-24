import { Router, Request, Response } from 'express';
import { sendZoomNotificationEmail } from '../../lib/email.js';

const ADMIN_EMAIL = 'holystudio.ai@gmail.com';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
    const { user } = req.body;

    if (!user || typeof user !== 'string') {
        res.status(400).json({ ok: false, error: 'Missing "user" field' });
        return;
    }

    const email = user.trim().toLowerCase();

    const sent = await sendZoomNotificationEmail(ADMIN_EMAIL, email);

    if (!sent) {
        res.status(500).json({ ok: false, error: 'Failed to send notification' });
        return;
    }

    res.json({ ok: true });
});

export default router;
