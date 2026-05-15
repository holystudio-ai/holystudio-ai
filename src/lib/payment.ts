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

const TTL_BUFFER_MS = 2 * 60 * 1000;

function isPreparedValid(): boolean {
    return !!preparedPayment && Date.now() < preparedPayment.expiresAt - TTL_BUFFER_MS;
}

export async function preparePayment(): Promise<PreparedPayment | null> {
    if (isPreparedValid()) return preparedPayment;
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
    setTimeout(() => {
        preparePayment().then(scheduleReprepare);
    }, 1500);
}

// ── Public API ──────────────────────────────────────────────────

/**
 * Redirects the user directly to WayForPay.
 * Email is collected by WayForPay on their payment page.
 * User profile is created when the webhook comes back with the email.
 */
export function redirectToPayment() {
    const analyticsPayload = {
        value: coursePriceUah,
        currency: 'UAH',
        contentName: 'AI Інтенсив HOLYSTUDIO',
        contentId: 'holy-ai-intensive',
    };

    trackLead('', analyticsPayload);
    trackInitiateCheckout(analyticsPayload);

    if (isPreparedValid() && preparedPayment) {
        const formFields = {...preparedPayment.formFields};
        preparedPayment = null;
        submitWayForPayForm(formFields);
    } else {
        // Fallback: prepare now and redirect
        preparePayment().then((prepared) => {
            if (prepared) {
                const formFields = {...prepared.formFields};
                preparedPayment = null;
                submitWayForPayForm(formFields);
            } else {
                console.error('[Payment] Failed to prepare payment');
                alert('Помилка створення платежу. Спробуйте ще раз.');
            }
        });
    }
}

function submitWayForPayForm(formFields: Record<string, string>) {
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = WAYFORPAY_URL;
    form.style.display = 'none';

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
