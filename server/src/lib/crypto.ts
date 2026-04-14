import crypto from 'crypto';

/**
 * Generate random hex string.
 */
export function randomBytes(size: number): string {
    return crypto.randomBytes(size).toString('hex');
}

/**
 * Generate a bot access token: tk_ + 24 alphanumeric chars.
 */
export function generateBotToken(): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const bytes = crypto.randomBytes(24);
    for (let i = 0; i < 24; i++) {
        result += chars[bytes[i] % chars.length];
    }
    return `tk_${result}`;
}

/**
 * HMAC-MD5 — required by WayForPay.
 */
export function hmacMd5(data: string, secret: string): string {
    return crypto.createHmac('md5', secret).update(data, 'utf8').digest('hex');
}

