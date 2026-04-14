import {coursePriceUah} from '@/src/lib/pricing.ts';
import {trackInitiateCheckout, trackLead} from '@/src/lib/analytics.ts';

const WAYFORPAY_URL = 'https://secure.wayforpay.com/pay';
const API_URL = process.env.VITE_API_URL ? process.env.VITE_API_URL.replace(/\/+$/, '') : '';

// ── Pre-prepared payment cache ──────────────────────────────────

interface PreparedPayment {
    formFields: Record<string, string>;
    token: string;
    orderReference: string;
    expiresAt: number;
}

let preparedPayment: PreparedPayment | null = null;
let preparePromise: Promise<PreparedPayment | null> | null = null;

/**
 * TTL buffer: re-prepare if less than 2 minutes remain.
 */
const TTL_BUFFER_MS = 2 * 60 * 1000;

function isPreparedValid(): boolean {
    return !!preparedPayment && Date.now() < preparedPayment.expiresAt - TTL_BUFFER_MS;
}

/**
 * Pre-generate WayForPay payment form fields.
 * Called automatically on page load. Can also be called manually.
 * The result is cached and reused until it expires (~14 min).
 */
export async function preparePayment(): Promise<PreparedPayment | null> {
    // Return existing if still valid
    if (isPreparedValid()) return preparedPayment;

    // Dedupe concurrent calls
    if (preparePromise) return preparePromise;

    preparePromise = (async () => {
        try {
            const resp = await fetch(`${API_URL}/api/payment/prepare`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
            });

            if (!resp.ok) {
                console.warn('[Payment] Prepare failed:', resp.status);
                return null;
            }

            const json = await resp.json();

            if (!json.ok || !json.formFields) {
                console.warn('[Payment] Invalid prepare response:', json);
                return null;
            }

            preparedPayment = {
                formFields: json.formFields,
                token: json.token,
                orderReference: json.orderReference,
                expiresAt: json.expiresAt || Date.now() + 14 * 60 * 1000,
            };

            console.log('[Payment] Pre-prepared order:', json.orderReference);
            return preparedPayment;
        } catch (err) {
            console.warn('[Payment] Prepare error:', err);
            return null;
        } finally {
            preparePromise = null;
        }
    })();

    return preparePromise;
}

/**
 * Schedule background re-preparation before expiry.
 */
function scheduleReprepare() {
    if (!preparedPayment) return;
    const ttl = preparedPayment.expiresAt - TTL_BUFFER_MS - Date.now();
    if (ttl > 0) {
        setTimeout(() => {
            preparedPayment = null;
            preparePayment();
        }, ttl);
    }
}

// ── Auto-prepare on page load ───────────────────────────────────

if (typeof window !== 'undefined') {
    // Small delay so it doesn't compete with critical page resources
    setTimeout(() => {
        preparePayment().then(scheduleReprepare);
    }, 1500);
}

// ── Client metadata ─────────────────────────────────────────────

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

// ── Public API ──────────────────────────────────────────────────

/**
 * Opens the email collection modal.
 * Called by all "Отримати доступ" buttons across the site.
 */
export function redirectToPayment() {
    // Ensure we have a prepared form (prepare in background if not)
    if (!isPreparedValid()) {
        preparePayment();
    }
    window.dispatchEvent(new CustomEvent('open-payment-modal'));
}

/**
 * Called after the user submits their email in the modal.
 *
 * FAST PATH (pre-prepared):
 *   1. Add clientEmail to cached formFields
 *   2. Fire-and-forget: save user + update order email
 *   3. Immediately submit form to WayForPay → instant redirect
 *
 * FALLBACK PATH (if prepare failed):
 *   Uses the old /api/payment/create flow (slower but reliable)
 */
export async function proceedToPayment(email: string) {
    const analyticsPayload = {
        value: coursePriceUah,
        currency: 'UAH',
        contentName: 'AI Інтенсив HOLYSTUDIO',
        contentId: 'holy-ai-intensive',
    };

    // Fire analytics events
    trackLead(email, analyticsPayload);
    trackInitiateCheckout(analyticsPayload);

    // Collect metadata for user record
    const clientMeta = collectClientMeta();

    // Try to use pre-prepared form (fast path)
    let formFields: Record<string, string> | null = null;
    let orderReference: string | null = null;

    if (isPreparedValid() && preparedPayment) {
        formFields = {...preparedPayment.formFields, clientEmail: email};
        orderReference = preparedPayment.orderReference;

        // Fire-and-forget: save user + update order with email
        fetch(`${API_URL}/api/users`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email, clientMeta, orderReference}),
        }).catch(() => {});

        // Update order with email (fire-and-forget)
        fetch(`${API_URL}/api/payment/create`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email, orderReference, updateOnly: true}),
        }).catch(() => {});

        // Invalidate cache so next payment gets a fresh form
        preparedPayment = null;
    } else {
        // Fallback: old flow — save user + create order synchronously
        try {
            await fetch(`${API_URL}/api/users`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({email, clientMeta}),
            });
        } catch (e) {
            console.warn('[Payment] Failed to save email:', e);
        }

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

        formFields = json.formFields;
    }

    // Submit form to WayForPay → immediate redirect
    submitWayForPayForm(formFields!);
}

/**
 * Creates and auto-submits a hidden form that redirects to WayForPay.
 */
function submitWayForPayForm(formFields: Record<string, string>) {
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
