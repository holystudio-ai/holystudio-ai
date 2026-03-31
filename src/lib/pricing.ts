export const coursePriceUah = 490;

export function formatPriceUah(value: number) {
    return new Intl.NumberFormat('uk-UA', {
        maximumFractionDigits: Number.isInteger(value) ? 0 : 2,
        minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    }).format(value);
}