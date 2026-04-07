declare global {
    interface Window {
        fbq?: (...args: any[]) => void;
        ttq?: {
            page?: (...args: any[]) => void;
            track?: (...args: any[]) => void;
            identify?: (...args: any[]) => void;
        };
        SPH?: Record<string, any>;
    }
}

type EventPayload = {
    value: number;
    currency?: string;
    contentName?: string;
    contentId?: string;
};

/* ─── helpers ─── */

function getCookie(name: string): string | null {
    const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
    return match ? decodeURIComponent(match[1]) : null;
}

/* ─── SmartSender helpers ─── */

const SS_IDENTIFIER = 'SPH-MV0PGWP';
const SS_BASE_URL = 'https://customer.smartsender.eu/pixel';

/**
 * Identify the current visitor in SmartSender by email.
 * Uses the pixel endpoint with ssId cookie so SmartSender links the email
 * to the anonymous visitor session.
 */
export function identifySmartSender(email: string) {
    try {
        const ssId = getCookie('ssId');

        // Method 1: use SPH object methods if available (ph.min.js loaded)
        if (window.SPH?.setEmail) {
            window.SPH.setEmail(email);
        }

        // Method 2: direct pixel GET request (works even before ph.min.js loads)
        const img = new Image();
        const params = new URLSearchParams({
            identifier: SS_IDENTIFIER,
            email,
            ...(ssId ? { ssId } : {}),
        });
        img.src = `${SS_BASE_URL}/img.gif?${params.toString()}`;
    } catch {
        // non-critical, ignore
    }
}

/**
 * Track a custom event in SmartSender.
 */
export function trackSmartSenderEvent(eventName: string, data?: Record<string, any>) {
    try {
        if (window.SPH?.track) {
            window.SPH.track(eventName, data);
        }
    } catch {
        // non-critical
    }
}

/* ─── page view ─── */

export function trackPageView() {
    window.fbq?.('track', 'PageView');
    window.ttq?.page?.();
}

/* ─── lead / email collected ─── */

/**
 * Fires when user submits their email.
 * FB Pixel "Lead" + TikTok "SubmitForm" + SmartSender identify.
 */
export function trackLead(email: string, {
    value,
    currency = 'UAH',
    contentName = 'AI Інтенсив HOLYSTUDIO',
    contentId = 'holy-ai-intensive',
}: EventPayload) {
    // Facebook Pixel — Lead
    window.fbq?.('track', 'Lead', {
        value,
        currency,
        content_name: contentName,
        content_category: 'intensive',
    });

    // TikTok — SubmitForm
    window.ttq?.track?.('SubmitForm', {
        value,
        currency,
        content_name: contentName,
        content_id: contentId,
    });

    // TikTok — identify user by email for Advanced Matching
    window.ttq?.identify?.({ email });

    // SmartSender — link email to visitor
    identifySmartSender(email);
}

/* ─── initiate checkout ─── */

export function trackInitiateCheckout({
                                          value,
                                          currency = 'UAH',
                                          contentName = 'AI Інтенсив HOLYSTUDIO',
                                          contentId = 'holy-ai-intensive',
                                      }: EventPayload) {
    window.fbq?.('track', 'InitiateCheckout', {
        value,
        currency,
        content_name: contentName,
        content_ids: [contentId],
        content_type: 'product',
    });

    window.ttq?.track?.('InitiateCheckout', {
        value,
        currency,
        content_name: contentName,
        content_id: contentId,
        content_type: 'product',
    });

    trackSmartSenderEvent('InitiateCheckout', { value, currency });
}

/* ─── purchase ─── */

/**
 * Fires Facebook Pixel "Purchase" + TikTok "CompletePayment" + SmartSender "Purchase".
 * Should be called ONCE after successful payment.
 * Uses sessionStorage flag to prevent duplicate events on page refresh.
 */
export function trackPurchase({
                                  value,
                                  currency = 'UAH',
                                  contentName = 'AI Інтенсив HOLYSTUDIO',
                                  contentId = 'holy-ai-intensive',
                              }: EventPayload): boolean {
    const key = 'hs_purchase_tracked';
    if (sessionStorage.getItem(key)) return false;

    // Facebook Pixel — Purchase
    window.fbq?.('track', 'Purchase', {
        value,
        currency,
        content_name: contentName,
        content_ids: [contentId],
        content_type: 'product',
    });

    // TikTok — CompletePayment
    window.ttq?.track?.('CompletePayment', {
        value,
        currency,
        content_name: contentName,
        content_id: contentId,
        content_type: 'product',
    });

    // SmartSender — Purchase
    trackSmartSenderEvent('Purchase', { value, currency });

    sessionStorage.setItem(key, '1');
    return true;
}
