export const buildCourseSchema = (price: string) => ({
    "@context": "https://schema.org",
    "@type": "Course",
    name: "AI Creative Intensive від HOLYSTUDIO",
    description:
        "Інтенсив зі створення AI фото та відео кінематографічної якості з нуля за 5 днів.",
    provider: {
        "@type": "Organization",
        name: "HOLYSTUDIO",
    },
    offers: {
        "@type": "Offer",
        price,
        priceCurrency: "UAH",
        availability: "https://schema.org/InStock",
        category: "online course",
    },
    inLanguage: "uk",
    educationalLevel: "Beginner",
});
