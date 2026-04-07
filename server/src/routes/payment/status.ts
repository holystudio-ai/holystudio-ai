import { Router, Request, Response } from "express";
import { config } from "../../config.js";
import { hmacMd5 } from "../../lib/crypto.js";
import { getDb } from "../../lib/db.js";
import { sendAccessEmail } from "../../lib/email.js";

const router = Router();

async function markUserPaid(db: any, email: string, orderReference: string) {
    if (!email) return;
    await db.collection("users").updateOne(
        { email },
        { $set: { status: "paid", paidAt: new Date(), updatedAt: new Date(), orderReference } }
    );
    const user = await db.collection("users").findOne({ email });
    if (user && !user.accessEmailSentAt) {
        await sendAccessEmail(email, orderReference);
        await db.collection("users").updateOne({ email }, { $set: { accessEmailSentAt: new Date() } });
        console.log("[payment/status] Access email sent to", email);
    }
}

async function checkWfpStatus(orderRef: string, login: string, secret: string): Promise<string> {
    try {
        const sig = hmacMd5(login + ";" + orderRef, secret);
        const resp = await fetch("https://api.wayforpay.com/api", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                transactionType: "CHECK_STATUS",
                merchantAccount: login,
                orderReference: orderRef,
                merchantSignature: sig,
                apiVersion: 1,
            }),
        });
        const data: any = await resp.json();
        console.log("[WayForPay Check Status]", JSON.stringify(data));
        return data.transactionStatus || "Unknown";
    } catch (err) {
        console.error("[WayForPay Check Status] Error:", err);
        return "Unknown";
    }
}

router.get("/", async (req: Request, res: Response) => {
    const token = ((req.query.token as string) || "").trim();
    const orderReference = ((req.query.ref as string) || "").trim();
    if (!token || !orderReference) {
        res.status(400).json({ error: "Missing token or ref" });
        return;
    }

    try {
        const db = await getDb();
        const order = await db.collection("orders").findOne({ orderReference });
        if (!order) { res.status(404).json({ error: "Order not found" }); return; }
        if (order.token !== token) { res.status(403).json({ error: "Invalid token" }); return; }

        const userEmail = order.email;

        if (order.status === "paid") {
            await markUserPaid(db, userEmail, orderReference);
            res.json({ status: "paid", orderReference, email: userEmail });
            return;
        }

        const wfpStatus = await checkWfpStatus(
            orderReference, config.WFP_MERCHANT_LOGIN, config.WFP_MERCHANT_SECRET
        );
        console.log("[payment/status] WFP status for", orderReference, ":", wfpStatus);

        if (wfpStatus === "Approved") {
            await db.collection("orders").updateOne(
                { orderReference },
                { $set: { status: "paid", updatedAt: new Date() } }
            );
            await markUserPaid(db, userEmail, orderReference);
            res.json({ status: "paid", orderReference, email: userEmail });
            return;
        }

        const mappedStatus = wfpStatus === "InProcessing" ? "pending" : "failed";
        if (wfpStatus && order.status !== wfpStatus) {
            await db.collection("orders").updateOne(
                { orderReference },
                { $set: { status: wfpStatus, updatedAt: new Date() } }
            );
        }
        res.json({ status: mappedStatus, orderReference, wfpStatus });
    } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error("[payment/status] Error:", msg, err);
        res.status(500).json({ error: "Internal server error", debug: msg });
    }
});

export default router;
