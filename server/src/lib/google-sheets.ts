import crypto from 'crypto';
import { config } from '../config.js';

function base64url(input: string | Buffer): string {
    const buf = typeof input === 'string' ? Buffer.from(input) : input;
    return buf.toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

async function getAccessToken(): Promise<string> {
    const { GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY } = config;

    if (!GOOGLE_SERVICE_ACCOUNT_EMAIL || !GOOGLE_PRIVATE_KEY) {
        throw new Error('GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_PRIVATE_KEY are required');
    }

    const now = Math.floor(Date.now() / 1000);
    const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
    const claimSet = base64url(JSON.stringify({
        iss: GOOGLE_SERVICE_ACCOUNT_EMAIL,
        scope: 'https://www.googleapis.com/auth/spreadsheets',
        aud: 'https://oauth2.googleapis.com/token',
        iat: now,
        exp: now + 3600,
    }));

    const signInput = `${header}.${claimSet}`;
    const sign = crypto.createSign('RSA-SHA256');
    sign.update(signInput);
    const signature = base64url(sign.sign(GOOGLE_PRIVATE_KEY));

    const jwt = `${signInput}.${signature}`;

    const resp = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`,
    });

    if (!resp.ok) {
        const err = await resp.text();
        throw new Error(`Google OAuth error (${resp.status}): ${err}`);
    }

    const data: any = await resp.json();
    return data.access_token;
}

export async function writeToSheet(values: (string | number)[][]): Promise<void> {
    const { GOOGLE_SHEET_ID } = config;

    if (!GOOGLE_SHEET_ID) {
        throw new Error('GOOGLE_SHEET_ID is required');
    }

    const accessToken = await getAccessToken();
    const range = 'Sheet1!A1';

    const resp = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEET_ID}/values/${range}?valueInputOption=RAW`,
        {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ range, majorDimension: 'ROWS', values }),
        }
    );

    if (!resp.ok) {
        const err = await resp.text();
        throw new Error(`Google Sheets API error (${resp.status}): ${err}`);
    }
}
