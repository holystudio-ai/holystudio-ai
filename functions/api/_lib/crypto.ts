import crypto from 'node:crypto';

export function hmacMd5(data: string, secret: string): string {
    return crypto.createHmac('md5', secret).update(data, 'utf8').digest('hex');
}

export function randomBytes(size: number): string {
    return crypto.randomBytes(size).toString('hex');
}

