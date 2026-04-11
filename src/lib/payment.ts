import {coursePriceUah} from '@/src/lib/pricing.ts';
import {trackInitiateCheckout, trackLead} from '@/src/lib/analytics.ts';

const WAYFORPAY_URL = 'https://secure.wayforpay.com/pay';
const API_URL = 'https://holystudio-ai.onrender.com';

/**
 * Collects browser / device / environment metadata for the user record.
 */
function collectClientMeta(): Record<string, unknown> {
    const nav = navigator as any;
    const conn = nav.connection || nav.mozConnection || nav.webkitConnection;

    return {
        userAgent: navigator.userAgent,
        language: navigator.language,
        languages: navigator.languages ? [...navigator.languages] : [navigator.language],
        platform: nav.userAgentData?.platform || navigator.platform || null,
        vendor: navigator.vendor || null,
        cookiesEnabled: navigator.cookieEnabled,
        doNotTrack: navigator.doNotTrack || null,
        screenWidth: screen.width,
        screenHeight: screen.height,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
        devicePixelRatio: window.devicePixelRatio || 1,
        colorDepth: screen.colorDepth,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        timezoneOffset: new Date().getTimezoneOffset(),
        referrer: document.referrer || null,
        currentUrl: window.location.href,
        deviceMemory: nav.deviceMemory || null,
        hardwareConcurrency: navigator.hardwareConcurrency || null,
        maxTouchPoints: navigator.maxTouchPoints ?? null,
        connectionType: conn?.effectiveType || null,
        connectionDownlink: conn?.downlink || null,
    };
}

/**
 * Opens the email collection modal.
 * Called by all "Отримати доступ" buttons across the site.
 */
export function redirectToPayment() {
    window.dispatchEvent(new CustomEvent('open-payment-modal'));
}

/**
 * Called after the user submits their email in the modal.
 * 1. Fires Lead + InitiateCheckout analytics
 * 2. Saves email + device info to DB
 * 3. Creates WayForPay order on the server (with HMAC signature)
 * 4. Auto-submits a hidden form → redirects to WayForPay payment page
 */
export async function proceedToPayment(email: string) {
    const analyticsPayload = {
        value: coursePriceUah,
        currency: 'UAH',
        contentName: 'AI Інтенсив HOLYSTUDIO',
        contentId: 'holy-ai-intensive',
    };

    // Fire Lead event (FB Lead + TikTok SubmitForm + SmartSender identify)
    trackLead(email, analyticsPayload);

    // Fire InitiateCheckout (FB + TikTok)
    trackInitiateCheckout(analyticsPayload);

    // Save email + client metadata to users collection
    const clientMeta = collectClientMeta();
    try {
        await fetch(`${API_URL}/api/users`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email, clientMeta}),
        });
    } catch (e) {
        console.warn('[Payment] Failed to save email:', e);
    }

    // Create WayForPay order
    const resp = await fetch(`${API_URL}/api/payment/create`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email}),
    });

    if (!resp.ok) {
        const text = await resp.text().catch(() => 'Unknown error');
        console.error('[Payment] Create order failed:', resp.status, text);
        throw new Error(`Payment creation failed (${resp.status})`);
    }

    const json = await resp.json();

    if (!json.formFields) {
        console.error('[Payment] No formFields in response:', json);
        throw new Error('Invalid payment response');
    }

    const {formFields} = json;


    // Create and auto-submit hidden form → redirect to WayForPay payment page
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = WAYFORPAY_URL;
    form.style.display = 'none';

    // WayForPay expects array fields with [] suffix for product data
    const arrayFields = ['productName', 'productCount', 'productPrice'];

    for (const [key, value] of Object.entries(formFields)) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = arrayFields.includes(key) ? `${key}[]` : key;
        input.value = String(value);
        form.appendChild(input);
    }

    document.body.appendChild(form);
    form.submit();
}
