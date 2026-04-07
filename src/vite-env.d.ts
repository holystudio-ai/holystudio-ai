/// <reference types="vite/client" />

interface WayforpayResponse {
    orderReference: string;
    transactionStatus: string;
    reasonCode: string;
    [key: string]: unknown;
}

declare class Wayforpay {
    run(
        params: Record<string, unknown>,
        onApproved?: (response: WayforpayResponse) => void,
        onDeclined?: (response: WayforpayResponse) => void,
        onPending?: (response: WayforpayResponse) => void,
    ): void;
}

interface Window {
    Wayforpay?: typeof Wayforpay;
}

