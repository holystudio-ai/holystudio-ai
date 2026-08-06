export const SITE_URL = "https://holystudio.ai";
export const SITE_NAME = "HOLYSTUDIO";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.JPG`;
export const DEFAULT_OG_IMAGE_WIDTH = "2552";
export const DEFAULT_OG_IMAGE_HEIGHT = "1424";

export const buildCourseSchema = (price: string) => ({
    "@context": "https://schema.org",
    "@type": "Course",
    name: "AI Creative Intensive від HOLYSTUDIO",
    description:
        "Інтенсив зі створення AI фото та відео кінематографічної якості з нуля за 5 днів.",
    provider: {
        "@type": "Organization",
        name: SITE_NAME,
        url: SITE_URL,
    },
    offers: {
        "@type": "Offer",
        url: SITE_URL,
        price,
        priceCurrency: "UAH",
        availability: "https://schema.org/InStock",
        category: "online course",
    },
    inLanguage: "uk",
    educationalLevel: "Beginner",
});
