import { Router, Request, Response } from "express";
import { config } from "../../config.js";
import { getDb } from "../../lib/db.js";
import { sendReminderEmail } from "../../lib/email.js";

const REMINDER_DELAY_MS = 30 * 60 * 1000; // 30 minutes

const router = Router();

router.get("/", async (req: Request, res: Response) => {
    const secret = (req.query.secret as string) || req.headers["x-cron-secret"] as string;

    if (config.CRON_SECRET && secret !== config.CRON_SECRET) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }

    try {
        const db = await getDb();
        const users = db.collection("users");

        const cutoff = new Date(Date.now() - REMINDER_DELAY_MS);

        const unpaidUsers = await users
            .find({
                status: "pending",
                reminderSentAt: null,
                createdAt: { $lte: cutoff },
            })
            .limit(50)
            .toArray();

        console.log(`[Cron] Found ${unpaidUsers.length} unpaid users to remind`);

        let sent = 0;
        let failed = 0;

        for (const user of unpaidUsers) {
            const ok = await sendReminderEmail(user.email);
            if (ok) {
                await users.updateOne(
                    { _id: user._id },
                    { $set: { reminderSentAt: new Date(), updatedAt: new Date() } }
                );
                sent++;
            } else {
                failed++;
            }
        }

        console.log(`[Cron] Done. Sent: ${sent}, Failed: ${failed}`);
        res.json({ ok: true, found: unpaidUsers.length, sent, failed });
    } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error("[Cron] Error:", msg, err);
        res.status(500).json({ error: "Internal server error", debug: msg });
    }
});

export default router;
