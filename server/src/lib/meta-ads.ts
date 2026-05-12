import { config } from '../config.js';

const API_VERSION = 'v21.0';
const BASE_URL = `https://graph.facebook.com/${API_VERSION}`;

export interface MetaCampaignInsights {
    spend: number;
    reach: number;
    impressions: number;
    cpm: number;
    clicks: number;
    cpc: number;
    ctr: number;
    leads: number;
    costPerLead: number;
}

export async function fetchCampaignInsights(datePreset: string = 'today'): Promise<MetaCampaignInsights> {
    const { META_ACCESS_TOKEN, META_AD_ACCOUNT_ID } = config;

    if (!META_ACCESS_TOKEN || !META_AD_ACCOUNT_ID) {
        throw new Error('META_ACCESS_TOKEN and META_AD_ACCOUNT_ID are required');
    }

    const accountId = META_AD_ACCOUNT_ID.startsWith('act_') ? META_AD_ACCOUNT_ID : `act_${META_AD_ACCOUNT_ID}`;

    const fields = [
        'spend', 'reach', 'impressions', 'cpm',
        'clicks', 'cpc', 'ctr',
        'actions', 'cost_per_action_type',
    ].join(',');

    const url = `${BASE_URL}/${accountId}/insights?fields=${fields}&date_preset=${datePreset}&access_token=${META_ACCESS_TOKEN}`;

    const resp = await fetch(url);
    if (!resp.ok) {
        const err = await resp.text();
        throw new Error(`Meta Ads API error (${resp.status}): ${err}`);
    }

    const json: any = await resp.json();
    const data = json.data?.[0];

    if (!data) {
        return {
            spend: 0, reach: 0, impressions: 0, cpm: 0,
            clicks: 0, cpc: 0, ctr: 0, leads: 0, costPerLead: 0,
        };
    }

    const actions: any[] = data.actions || [];
    const costPerAction: any[] = data.cost_per_action_type || [];

    const leadsAction = actions.find((a: any) =>
        a.action_type === 'offsite_conversion.fb_pixel_lead' ||
        a.action_type === 'lead' ||
        a.action_type === 'onsite_conversion.lead_grouped'
    );
    const leads = leadsAction ? Number(leadsAction.value) : 0;

    const cplAction = costPerAction.find((a: any) =>
        a.action_type === 'offsite_conversion.fb_pixel_lead' ||
        a.action_type === 'lead' ||
        a.action_type === 'onsite_conversion.lead_grouped'
    );
    const costPerLead = cplAction ? Number(cplAction.value) : (leads > 0 ? Number(data.spend) / leads : 0);

    return {
        spend: Number(data.spend) || 0,
        reach: Number(data.reach) || 0,
        impressions: Number(data.impressions) || 0,
        cpm: Number(data.cpm) || 0,
        clicks: Number(data.clicks) || 0,
        cpc: Number(data.cpc) || 0,
        ctr: Number(data.ctr) || 0,
        leads,
        costPerLead,
    };
}
