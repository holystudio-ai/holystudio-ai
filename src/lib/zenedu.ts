export const HOLYSTUDIO_SITE_URL = 'https://holystudio.ai/';
export const ZENEDU_DIRECT_PAYMENT_URL = 'https://app.zenedu.io/l/p/rVhvTyQQqq4GlVmU';
export const ZENEDU_LANDING_URL = 'https://app.zenedu.io/l/qyKGb15vAtWAzUWr';
export const ZENEDU_BOT_URL = 'https://t.me/HOLYSTUDIO_AI_bot?start=qyKGb15vAtWAzUWr';

export function redirectToZeneduPayment() {
    window.location.href = ZENEDU_DIRECT_PAYMENT_URL;
}
