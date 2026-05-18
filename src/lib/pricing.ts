/**
 * Single source of truth for the course price on the frontend.
 * Reads from COURSE_PRICE_UAH env variable (injected by Vite at build time).
 * Change the price in .env (and Vercel env vars) — it updates everywhere.
 */
export const coursePriceUah = Number(process.env.COURSE_PRICE_UAH) || 490;
export const productName = process.env.PRODUCT_NAME || 'AI Інтенсив HOLYSTUDIO';

export function formatPriceUah(value: number) {
    return new Intl.NumberFormat('uk-UA', {
        maximumFractionDigits: Number.isInteger(value) ? 0 : 2,
        minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    }).format(value);
}