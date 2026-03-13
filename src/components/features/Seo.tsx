import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
    DEFAULT_OG_IMAGE,
    DEFAULT_OG_IMAGE_HEIGHT,
    DEFAULT_OG_IMAGE_WIDTH,
    SITE_NAME,
    SITE_URL,
} from "@/src/lib/seo.ts";

interface SeoProps {
    title: string;
    description: string;
    noindex?: boolean;
    type?: "website" | "article";
    structuredData?: Record<string, unknown> | Array<Record<string, unknown>>;
}

const upsertMeta = (selector: string, attributes: Record<string, string>) => {
    let element = document.head.querySelector(selector) as HTMLMetaElement | null;

    if (!element) {
        element = document.createElement("meta");
        document.head.appendChild(element);
    }

    Object.entries(attributes).forEach(([key, value]) => {
        element!.setAttribute(key, value);
    });
};

const upsertLink = (selector: string, attributes: Record<string, string>) => {
    let element = document.head.querySelector(selector) as HTMLLinkElement | null;

    if (!element) {
        element = document.createElement("link");
        document.head.appendChild(element);
    }

    Object.entries(attributes).forEach(([key, value]) => {
        element!.setAttribute(key, value);
    });
};

const Seo: React.FC<SeoProps> = ({
    title,
    description,
    noindex = false,
    type = "website",
    structuredData,
}) => {
    const location = useLocation();

    useEffect(() => {
        const canonicalUrl = new URL(location.pathname || "/", SITE_URL).toString();
        const fullTitle = `${title} | ${SITE_NAME}`;

        document.title = fullTitle;
        document.documentElement.lang = "uk";

        upsertMeta('meta[name="description"]', {
            name: "description",
            content: description,
        });
        upsertMeta('meta[name="robots"]', {
            name: "robots",
            content: noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large",
        });
        upsertMeta('meta[property="og:title"]', {
            property: "og:title",
            content: fullTitle,
        });
        upsertMeta('meta[property="og:description"]', {
            property: "og:description",
            content: description,
        });
        upsertMeta('meta[property="og:type"]', {
            property: "og:type",
            content: type,
        });
        upsertMeta('meta[property="og:site_name"]', {
            property: "og:site_name",
            content: SITE_NAME,
        });
        upsertMeta('meta[property="og:locale"]', {
            property: "og:locale",
            content: "uk_UA",
        });
        upsertMeta('meta[property="og:url"]', {
            property: "og:url",
            content: canonicalUrl,
        });
        upsertMeta('meta[property="og:image"]', {
            property: "og:image",
            content: DEFAULT_OG_IMAGE,
        });
        upsertMeta('meta[property="og:image:width"]', {
            property: "og:image:width",
            content: DEFAULT_OG_IMAGE_WIDTH,
        });
        upsertMeta('meta[property="og:image:height"]', {
            property: "og:image:height",
            content: DEFAULT_OG_IMAGE_HEIGHT,
        });
        upsertMeta('meta[name="twitter:card"]', {
            name: "twitter:card",
            content: "summary_large_image",
        });
        upsertMeta('meta[name="twitter:title"]', {
            name: "twitter:title",
            content: fullTitle,
        });
        upsertMeta('meta[name="twitter:description"]', {
            name: "twitter:description",
            content: description,
        });
        upsertMeta('meta[name="twitter:image"]', {
            name: "twitter:image",
            content: DEFAULT_OG_IMAGE,
        });
        upsertMeta('meta[name="author"]', {
            name: "author",
            content: SITE_NAME,
        });
        upsertLink('link[rel="canonical"]', {
            rel: "canonical",
            href: canonicalUrl,
        });

        const scriptId = "seo-structured-data";
        const existingScript = document.getElementById(scriptId);
        if (existingScript) {
            existingScript.remove();
        }

        if (structuredData) {
            const script = document.createElement("script");
            script.id = scriptId;
            script.type = "application/ld+json";
            script.textContent = JSON.stringify(structuredData);
            document.head.appendChild(script);
        }

        return () => {
            const staleScript = document.getElementById(scriptId);
            if (staleScript) {
                staleScript.remove();
            }
        };
    }, [description, location.pathname, noindex, structuredData, title, type]);

    return null;
};

export default Seo;
