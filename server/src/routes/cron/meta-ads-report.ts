import { Router, Request, Response } from 'express';
import { config } from '../../config.js';
import { getDb } from '../../lib/db.js';
import { fetchCampaignInsights } from '../../lib/meta-ads.js';
import { writeToSheet } from '../../lib/google-sheets.js';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
    const secret = req.query.secret || req.headers['x-cron-secret'];
    if (config.CRON_SECRET && secret !== config.CRON_SECRET) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }

    try {
        if (!config.META_ACCESS_TOKEN || !config.META_AD_ACCOUNT_ID) {
            res.status(400).json({ error: 'Meta Ads credentials not configured' });
            return;
        }
        if (!config.GOOGLE_CLIENT_ID || !config.GOOGLE_CLIENT_SECRET || !config.GOOGLE_REFRESH_TOKEN || !config.GOOGLE_SHEET_ID) {
            res.status(400).json({ error: 'Google Sheets credentials not configured' });
            return;
        }

        const insights = await fetchCampaignInsights('today');

        const db = await getDb();
        const paidOrders = await db.collection('orders').countDocuments({ status: 'paid' });
        const salesRevenue = paidOrders * config.COURSE_PRICE_UAH;

        const leads = insights.leads || 0;
        const conversionRate = leads > 0 ? ((paidOrders / leads) * 100) : 0;
        const roas = insights.spend > 0 ? (salesRevenue / insights.spend) : 0;

        const headerRow = [
            'Budget (Spend)', 'Reach', 'CPM', 'Clicks', 'CPC', 'CTR (%)',
            'Leads', 'CPL', 'Purchases (Qty)', 'Conversion to Purchase (%)',
            'Sales Revenue (UAH)', 'ROI (ROAS)',
        ];

        const dataRow = [
            round(insights.spend),
            insights.reach,
            round(insights.cpm),
            insights.clicks,
            round(insights.cpc),
            round(insights.ctr),
            leads,
            round(insights.costPerLead),
            paidOrders,
            round(conversionRate),
            salesRevenue,
            round(roas, 2),
        ];

        await writeToSheet([headerRow, dataRow]);

        console.log('[meta-ads-report] Report written to Google Sheet');

        res.json({
            ok: true,
            data: {
                spend: insights.spend,
                reach: insights.reach,
                cpm: insights.cpm,
                clicks: insights.clicks,
                cpc: insights.cpc,
                ctr: insights.ctr,
                leads,
                cpl: insights.costPerLead,
                purchases: paidOrders,
                conversionRate: round(conversionRate),
                salesRevenue,
                roas: round(roas, 2),
            },
        });
    } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error('[meta-ads-report] Error:', msg, err);
        res.status(500).json({ error: msg });
    }
});

function round(n: number, decimals = 2): number {
    return Number(n.toFixed(decimals));
}

export default router;
