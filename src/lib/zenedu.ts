import {coursePriceUah} from '@/src/lib/pricing.ts';
import {trackInitiateCheckout} from '@/src/lib/analytics.ts';

export const HOLYSTUDIO_SITE_URL = import.meta.env.VITE_HOLYSTUDIO_SITE_URL;
export const ZENEDU_DIRECT_PAYMENT_URL = import.meta.env.VITE_ZENEDU_DIRECT_PAYMENT_URL;
export const ZENEDU_LANDING_URL = import.meta.env.VITE_ZENEDU_LANDING_URL;
export const ZENEDU_BOT_URL = import.meta.env.VITE_ZENEDU_BOT_URL;

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