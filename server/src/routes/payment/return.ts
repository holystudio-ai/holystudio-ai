import { Router, Request, Response } from 'express';
import { config } from '../../config.js';

const router = Router();

router.all('/', (_req: Request, res: Response) => {
    res.redirect(302, config.BOT_URL);
});

export default router;
