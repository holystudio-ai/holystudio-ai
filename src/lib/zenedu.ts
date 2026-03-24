import {coursePriceUah} from '@/src/lib/pricing.ts';
import {trackInitiateCheckout} from '@/src/lib/analytics.ts';

export const HOLYSTUDIO_SITE_URL = 'https://holystudio.ai/';
export const ZENEDU_DIRECT_PAYMENT_URL = 'https://app.zenedu.io/l/p/rVhvTyQQqq4GlVmU';
export const ZENEDU_LANDING_URL = 'https://app.zenedu.io/l/qyKGb15vAtWAzUWr';
export const ZENEDU_BOT_URL = 'https://t.me/HOLYSTUDIO_AI_bot?start=qyKGb15vAtWAzUWr';

export function redirectToZeneduPayment() {
    trackInitiateCheckout({
        value: coursePriceUah,
        currency: 'UAH',
        contentName: 'Інтенсив по створенню AI креативів',
        contentId: 'holy-ai-intensive',
    });

    window.setTimeout(() => {
        window.location.href = ZENEDU_DIRECT_PAYMENT_URL;
    }, 150);
}