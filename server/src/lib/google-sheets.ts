import { config } from '../config.js';

let cachedToken: { accessToken: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
    const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN } = config;

    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REFRESH_TOKEN) {
        throw new Error('GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_REFRESH_TOKEN are required');
    }

    if (cachedToken && Date.now() < cachedToken.expiresAt) {
        return cachedToken.accessToken;
    }

    const resp = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            client_id: GOOGLE_CLIENT_ID,
            client_secret: GOOGLE_CLIENT_SECRET,
            refresh_token: GOOGLE_REFRESH_TOKEN,
            grant_type: 'refresh_token',
        }),
    });

    if (!resp.ok) {
        const err = await resp.text();
        throw new Error(`Google OAuth error (${resp.status}): ${err}`);
    }

    const data: any = await resp.json();
    cachedToken = {
        accessToken: data.access_token,
        expiresAt: Date.now() + (data.expires_in - 60) * 1000,
    };

    return data.access_token;
}

export async function appendToSheet(values: (string | number)[][]): Promise<void> {
    const { GOOGLE_SHEET_ID } = config;

    if (!GOOGLE_SHEET_ID) {
        throw new Error('GOOGLE_SHEET_ID is required');
    }

    const accessToken = await getAccessToken();
    const range = 'Аркуш1!A1';

    const resp = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEET_ID}/values/${range}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`,
        {
            method: 'POST',
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

export async function writeToSheet(values: (string | number)[][]): Promise<void> {
    const { GOOGLE_SHEET_ID } = config;

    if (!GOOGLE_SHEET_ID) {
        throw new Error('GOOGLE_SHEET_ID is required');
    }

    const accessToken = await getAccessToken();
    const range = 'Аркуш1!A1';

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
