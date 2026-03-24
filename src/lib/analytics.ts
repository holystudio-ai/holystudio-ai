declare global {
    interface Window {
        fbq?: (...args: any[]) => void;
        ttq?: {
            page?: (...args: any[]) => void;
            track?: (...args: any[]) => void;
        };
    }
}

type CheckoutPayload = {
    value: number;
    currency?: string;
    contentName?: string;
    contentId?: string;
};

export function trackPageView() {
    window.fbq?.('track', 'PageView');
    window.ttq?.page?.();
}

export function trackInitiateCheckout({
                                          value,
                                          currency = 'UAH',
                                          contentName = 'Інтенсив по створенню AI креативів',
                                          contentId = 'holy-ai-intensive',
                                      }: CheckoutPayload) {
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
}