import { Router, Request, Response } from 'express';

const router = Router();

const BOT_URL = 'https://t.me/HOLYSTUDIO_AI_bot?start=ZGw6MzI1OTA2';

router.all('/', (_req: Request, res: Response) => {
    res.redirect(302, BOT_URL);
});

export default router;
