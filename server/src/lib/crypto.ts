import crypto from 'crypto';

/**
 * Generate random hex string.
 */
export function randomBytes(size: number): string {
    return crypto.randomBytes(size).toString('hex');
}

/**
 * HMAC-MD5 — required by WayForPay.
 */
export function hmacMd5(data: string, secret: string): string {
    return crypto.createHmac('md5', secret).update(data, 'utf8').digest('hex');
}

